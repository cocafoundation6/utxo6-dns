// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { CrossChainSwapRequest, SwapStatus } from './types';
import { HTLCContractManager } from './HTLCContract';
import { UTXOHTLC } from './UTXOHTLC';
import { EVMHTLC } from './EVMHTLC';
import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';

/**
 * Cross-Chain Swap Manager 
 * Coordinates atomic swaps between UTXO and EVM chains
 */
export class CrossChainSwapManager {
  private utxoHTLC: UTXOHTLC;
  private evmHTLC: EVMHTLC;
  private swaps: Map<string, CrossChainSwapRequest> = new Map();

  constructor(utxoManager: UTXOSetManager, evmAdapter: EVMAdapter) {
    this.utxoHTLC = new UTXOHTLC(utxoManager);
    this.evmHTLC = new EVMHTLC(evmAdapter);
  }

  /**
   * Initiate Cross-Chain Swap (UTXO → EVM)
   */
  async initiateSwapUTXOtoEVM(params: {
    initiator: string;
    counterparty: string;
    utxoAmount: bigint;
    evmAmount: bigint;
    timeLock: number;
    utxoAddress: string;
    evmAddress: string;
  }): Promise<{ requestId: string; contractId: string; secret: string }> {
    // Generate secrets and hash locks.
    const secret = HTLCContractManager.generateSecret();
    const hashLock = HTLCContractManager.computeHashLock(secret);

    // Create exchange request
    const request: CrossChainSwapRequest = {
      id: this.generateRequestId(),
      initiator: params.initiator,
      counterparty: params.counterparty,
      fromChain: 'utxo',
      toChain: 'evm',
      fromAmount: params.utxoAmount,
      toAmount: params.evmAmount,
      hashLock,
      timeLock: params.timeLock,
      status: 'pending'
    };
    this.swaps.set(request.id, request);

    // Lock funds on a UTXO
    const { contractId, txid } = await this.utxoHTLC.lockUTXO(
      params.utxoAddress,
      params.evmAddress,
      params.utxoAmount,
      hashLock,
      params.timeLock
    );

    request.initiatorLockTx = txid;
    request.status = 'locked';
    this.swaps.set(request.id, request);

    return {
      requestId: request.id,
      contractId,
      secret
    };
  }

  /**
   * Complete Cross-Chain Swap (Unlock EVM Side)
   */
  async completeSwapUTXOtoEVM(
    requestId: string,
    secret: string,
    evmAddress: string
  ): Promise<{ txid: string }> {
    const request = this.swaps.get(requestId);
    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }
    if (request.status !== 'locked') {
      throw new Error(`Request ${requestId} is not in locked state`);
    }

    // Unlock on EVM
    const result = await this.evmHTLC.unlockEVM(
      requestId,
      secret,
      evmAddress
    );

    request.counterpartyLockTx = result.txid;
    request.status = 'unlocked';
    this.swaps.set(requestId, request);

    return { txid: result.txid };
  }

  /**
   * Complete cross-chain swap (confirm both parties have completed)
   */
  async finalizeSwap(requestId: string): Promise<void> {
    const request = this.swaps.get(requestId);
    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    request.status = 'completed';
    request.completedAt = Date.now();
    this.swaps.set(requestId, request);
  }

  /**
   * Refund cross-chain swap (after timelock expiration)
   */
  async refundSwap(requestId: string): Promise<{ txid: string }> {
    const request = this.swaps.get(requestId);
    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    // Refund on UTXO
    const result = await this.utxoHTLC.refundUTXO(requestId);

    request.status = 'refunded';
    this.swaps.set(requestId, request);

    return { txid: result.txid };
  }

  /**
   * Retrieve exchange status
   */
  async getSwapStatus(requestId: string): Promise<SwapStatus | null> {
    const request = this.swaps.get(requestId);
    if (!request) return null;

    return {
      contractId: requestId,
      status: this.mapStatus(request.status),
      blockHeight: 0,
      confirmations: 0,
      timeRemaining: Math.max(0, request.timeLock * 1000 - (Date.now() - (request.completedAt || Date.now())))
    };
  }

  private generateRequestId(): string {
    return `swap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private mapStatus(status: CrossChainSwapRequest['status']): any {
    const map: Record<string, any> = {
      pending: 'PENDING',
      locked: 'ACTIVE',
      unlocked: 'ACTIVE',
      completed: 'COMPLETED',
      refunded: 'REFUNDED'
    };
    return map[status] || 'PENDING';
  }
}
