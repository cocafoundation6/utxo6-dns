// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { HTLCContract, HTLCStatus, CreateHTLCParams, UnlockHTLCParams } from './types';
import { createHash, randomBytes } from 'crypto';

/**
 * HTLC Contract Manager 
 * Supports HTLC creation, unlocking, and refund functions
 */
export class HTLCContractManager {
  private contracts: Map<string, HTLCContract> = new Map();

  /**
   * Create HTLC Contract
   */
  async createContract(params: CreateHTLCParams): Promise<HTLCContract> {
    const id = this.generateContractId(params);
    const contract: HTLCContract = {
      id,
      fromChain: params.fromChain,
      toChain: params.toChain,
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      amount: params.amount,
      hashLock: params.hashLock,
      timeLock: params.timeLock,
      status: HTLCStatus.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiresAt: Date.now() + params.timeLock * 1000,
      fee: params.fee || BigInt(0)
    };

    this.contracts.set(id, contract);
    return contract;
  }

  /**
   * Activate HTLC Contract (Lock Funds)
   */
  async activateContract(contractId: string, lockTxid: string): Promise<HTLCContract> {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error(`Contract ${contractId} not found`);
    }
    if (contract.status !== HTLCStatus.PENDING) {
      throw new Error(`Contract ${contractId} is not pending`);
    }

    contract.status = HTLCStatus.ACTIVE;
    contract.updatedAt = Date.now();
    this.contracts.set(contractId, contract);

    return contract;
  }

  /**
   * Unlock HTLC contract (provide preimage)
   */
  async unlockContract(params: UnlockHTLCParams): Promise<HTLCContract> {
    const contract = this.contracts.get(params.contractId);
    if (!contract) {
      throw new Error(`Contract ${params.contractId} not found`);
    }
    if (contract.status !== HTLCStatus.ACTIVE) {
      throw new Error(`Contract ${params.contractId} is not active`);
    }

    // Verify whether the preimage matches the hash lock.
    const hash = createHash('sha256').update(params.secret).digest('hex');
    if (hash !== contract.hashLock) {
      throw new Error('Invalid secret: hash mismatch');
    }

    // Verify if the timelock has not expired.
    if (Date.now() > contract.expiresAt) {
      throw new Error('Contract has expired');
    }

    contract.secret = params.secret;
    contract.status = HTLCStatus.COMPLETED;
    contract.updatedAt = Date.now();
    contract.completedAt = Date.now();
    this.contracts.set(params.contractId, contract);

    return contract;
  }

  /**
   * Refund HTLC Contract (after timelock expires)
   */
  async refundContract(contractId: string): Promise<HTLCContract> {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error(`Contract ${contractId} not found`);
    }
    if (contract.status !== HTLCStatus.ACTIVE) {
      throw new Error(`Contract ${contractId} is not active`);
    }

    // Verify whether the timelock has expired.
    if (Date.now() < contract.expiresAt) {
      throw new Error(`Contract ${contractId} has not expired yet`);
    }

    contract.status = HTLCStatus.REFUNDED;
    contract.updatedAt = Date.now();
    contract.refundedAt = Date.now();
    this.contracts.set(contractId, contract);

    return contract;
  }

  /**
   * Retrieve contract status
   */
  async getContract(contractId: string): Promise<HTLCContract | null> {
    return this.contracts.get(contractId) || null;
  }

  /**
   *Verify if the contract is valid.
   */
  async isContractValid(contractId: string): Promise<boolean> {
    const contract = this.contracts.get(contractId);
    if (!contract) return false;
    return contract.status === HTLCStatus.ACTIVE && Date.now() < contract.expiresAt;
  }

  /**
   * Generate Contract ID
   */
  private generateContractId(params: CreateHTLCParams): string {
    const data = `${params.fromChain}${params.toChain}${params.fromAddress}${params.toAddress}${params.amount}${params.hashLock}${params.timeLock}${Date.now()}`;
    return createHash('sha256').update(data).digest('hex').slice(0, 16);
  }

  /**
   * Generate secret preimage
   */
  static generateSecret(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Calculate hash lock
   */
  static computeHashLock(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }

  /**
   * Generate random hashlock (no preimage)
   */
  static generateRandomHashLock(): string {
    return randomBytes(32).toString('hex');
  }
}
