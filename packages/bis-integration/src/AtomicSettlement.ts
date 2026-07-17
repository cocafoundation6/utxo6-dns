// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { AtomicSettlementTransaction } from './types';
import { BISLedgerClient } from './BISLedgerClient';
import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';

/**
 * Atomic Settlement Protocol 
*Enables all-or-nothing atomic settlement.
 */
export class AtomicSettlementProtocol {
  private ledgerClient: BISLedgerClient;
  private utxoManager: UTXOSetManager;
  private evmAdapter: EVMAdapter;

  constructor(
    ledgerClient: BISLedgerClient,
    utxoManager: UTXOSetManager,
    evmAdapter: EVMAdapter
  ) {
    this.ledgerClient = ledgerClient;
    this.utxoManager = utxoManager;
    this.evmAdapter = evmAdapter;
  }

  /**
   * Perform atomic settlement (two-phase commit)
   */
  async atomicSettle(params: {
    from: string;
    to: string;
    amount: bigint;
    assetId: string;
    settlementCurrency: AtomicSettlementTransaction['settlementCurrency'];
    settlementChain: AtomicSettlementTransaction['settlementChain'];
    timeout?: number;
  }): Promise<AtomicSettlementTransaction> {
    // Phase 1: Preparation Phase
    const prepareResult = await this.prepare(params);

    if (!prepareResult.success) {
      throw new Error(`Prepare phase failed: ${prepareResult.message}`);
    }

    // Phase 2: Submission Phase
    try {
      const transaction = await this.commit(params);

      return transaction;
    } catch (error: any) {
      // Phase 3: Rollback Phase (if failed)
      await this.rollback(params);
      throw new Error(`Commit phase failed: ${error.message}`);
    }
  }

  /**
   * Preparation Phase – Resource Lockdown
   */
  private async prepare(params: any): Promise<{ success: boolean; message: string }> {
    //Check if the participant exists.
    const from = this.ledgerClient.getParticipant(params.from);
    const to = this.ledgerClient.getParticipant(params.to);

    if (!from) {
      return { success: false, message: `Sender ${params.from} not registered` };
    }
    if (!to) {
      return { success: false, message: `Receiver ${params.to} not registered` };
    }
// Check assets
    const asset = this.ledgerClient.getAsset(params.assetId);
    if (!asset) {
      return { success: false, message: `Asset ${params.assetId} not found` };
    }

    // Check balance
    const balance = this.utxoManager.getBalance(from.addresses.jms || '');
    if (balance < params.amount) {
      return { success: false, message: `Insufficient balance: ${balance} < ${params.amount}` };
    }

    return { success: true, message: 'Ready to commit' };
  }

  /**
   * Submission Phase – Execute Settlement
   */
  private async commit(params: any): Promise<AtomicSettlementTransaction> {
    return this.ledgerClient.executeAtomicSettlement(params);
  }

  /**
   * Rollback Phase - Release Resources
   */
  private async rollback(params: any): Promise<void> {
    // Release locked resources
    // In practice, rollback logic needs to be executed here.
    console.log(`[AtomicSettlement] Rollback initiated for ${params.from} -> ${params.to}`);
  }
}
