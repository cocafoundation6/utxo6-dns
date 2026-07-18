// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { PrivacyPool, PrivateTransaction, Commitment } from '../types';
import { PrivacyEngine } from '../core/PrivacyEngine';

/**
 * Privacy Pool Manager
 * Manages pooled private transactions
 */
export class PrivacyPoolManager {
  private privacyEngine: PrivacyEngine;
  private pools: Map<string, PrivacyPool> = new Map();

  constructor(privacyEngine: PrivacyEngine) {
    this.privacyEngine = privacyEngine;
  }

  /**
   * Create a privacy pool
   */
  createPool(id: string): PrivacyPool {
    const pool = this.privacyEngine.createPool(id);
    this.pools.set(id, pool);
    return pool;
  }

  /**
   * Deposit to pool
   */
  depositToPool(
    poolId: string,
    transaction: PrivateTransaction
  ): void {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found`);
    }

    // Verify transaction
    const isValid = this.privacyEngine.verifyPrivateTransaction(transaction.id);
    if (!isValid) {
      throw new Error(`Transaction ${transaction.id} is invalid`);
    }

    this.privacyEngine.addToPool(poolId, transaction);
  }

  /**
   * Get pool balance
   */
  getPoolBalance(poolId: string): bigint {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found`);
    }
    return pool.totalLocked;
  }

  /**
   * Get pool transactions
   */
  getPoolTransactions(poolId: string): PrivateTransaction[] {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found`);
    }
    return pool.transactions;
  }

  /**
   * Get all pools
   */
  getAllPools(): PrivacyPool[] {
    return Array.from(this.pools.values());
  }

  /**
   * Get pool statistics
   */
  getPoolStats(poolId: string): {
    transactionCount: number;
    totalAmount: bigint;
    activeTransactions: number;
    pendingTransactions: number;
  } {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found`);
    }

    const active = pool.transactions.filter(t => t.status === 'confirmed');
    const pending = pool.transactions.filter(t => t.status === 'pending');

    return {
      transactionCount: pool.transactions.length,
      totalAmount: pool.totalLocked,
      activeTransactions: active.length,
      pendingTransactions: pending.length
    };
  }

  /**
   * Remove pool
   */
  removePool(poolId: string): boolean {
    return this.pools.delete(poolId);
  }
}
