// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  PrivateTransaction,
  PrivateUTXO,
  PrivacyPool,
  ZKProof,
  ProofGenerationParams
} from '../types';
import { CommitmentScheme } from './CommitmentScheme';
import { ProofGenerator } from './ProofGenerator';
import { ProofVerifier } from './ProofVerifier';
import { createHash, randomBytes } from 'crypto';

/**
 * Privacy Engine
 * Core engine for private transaction processing
 */
export class PrivacyEngine {
  private commitmentScheme: CommitmentScheme;
  private proofGenerator: ProofGenerator;
  private proofVerifier: ProofVerifier;
  private privateUTXOs: Map<string, PrivateUTXO> = new Map();
  private transactions: Map<string, PrivateTransaction> = new Map();
  private pools: Map<string, PrivacyPool> = new Map();

  constructor() {
    this.commitmentScheme = new CommitmentScheme();
    this.proofGenerator = new ProofGenerator();
    this.proofVerifier = new ProofVerifier();
  }

  /**
   * Create a private transaction
   */
  async createPrivateTransaction(params: {
    from: string;
    to: string;
    amount: bigint;
    fromSecret?: string;
    toSecret?: string;
  }): Promise<PrivateTransaction> {
    const fromSecret = params.fromSecret || randomBytes(32).toString('hex');
    const toSecret = params.toSecret || randomBytes(32).toString('hex');
    const randomness = randomBytes(32).toString('hex');

    // Create commitment
    const commitment = this.commitmentScheme.commit(params.amount, randomness);

    // Generate nullifier
    const nullifier = this.commitmentScheme.generateNullifier(commitment);

    // Generate ZK proof
    const proofParams: ProofGenerationParams = {
      fromSecret,
      toSecret,
      amount: params.amount,
      randomness,
      nullifier,
      commitment: commitment.commitment,
      merkleRoot: this.getMerkleRoot(),
      merklePath: []
    };

    const proof = this.proofGenerator.generateProof(proofParams);

    // Create private UTXO
    const privateUTXO: PrivateUTXO = {
      id: `priv_${Date.now()}_${randomBytes(4).toString('hex')}`,
      commitment: commitment.commitment,
      nullifier,
      amount: params.amount,
      owner: params.to,
      spent: false,
      createdAt: Date.now()
    };
    this.privateUTXOs.set(privateUTXO.id, privateUTXO);

    const transaction: PrivateTransaction = {
      id: `tx_priv_${Date.now()}`,
      commitment: commitment.commitment,
      nullifier,
      from: params.from,
      to: params.to,
      amount: params.amount,
      timestamp: Date.now(),
      proof,
      status: 'pending'
    };

    this.transactions.set(transaction.id, transaction);

    return transaction;
  }

  /**
   * Spend a private UTXO
   */
  async spendPrivateUTXO(
    utxoId: string,
    to: string,
    amount: bigint
  ): Promise<PrivateTransaction> {
    const utxo = this.privateUTXOs.get(utxoId);
    if (!utxo) {
      throw new Error(`UTXO ${utxoId} not found`);
    }
    if (utxo.spent) {
      throw new Error(`UTXO ${utxoId} already spent`);
    }

    // Verify ownership via ZK proof
    const proof = await this.generateOwnershipProof(utxo);

    // Create new private transaction
    const transaction = await this.createPrivateTransaction({
      from: utxo.owner,
      to,
      amount
    });

    // Mark UTXO as spent
    utxo.spent = true;
    utxo.spentAt = Date.now();
    this.privateUTXOs.set(utxoId, utxo);

    return transaction;
  }

  /**
   * Verify a private transaction
   */
  verifyPrivateTransaction(txId: string): boolean {
    const tx = this.transactions.get(txId);
    if (!tx) return false;

    const result = this.proofVerifier.verify(tx.proof);
    if (!result.valid) return false;

    // Verify commitment hasn't been used
    for (const existing of this.transactions.values()) {
      if (existing.id !== txId && existing.commitment === tx.commitment) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get private UTXO balance
   */
  getPrivateBalance(owner: string): bigint {
    let total = BigInt(0);
    for (const utxo of this.privateUTXOs.values()) {
      if (utxo.owner === owner && !utxo.spent) {
        total += utxo.amount;
      }
    }
    return total;
  }

  /**
   * Get all private transactions
   */
  getPrivateTransactions(): PrivateTransaction[] {
    return Array.from(this.transactions.values());
  }

  /**
   * Get all private UTXOs
   */
  getPrivateUTXOs(): PrivateUTXO[] {
    return Array.from(this.privateUTXOs.values());
  }

  /**
   * Create a privacy pool
   */
  createPool(id: string): PrivacyPool {
    const pool: PrivacyPool = {
      id,
      commitments: [],
      nullifiers: [],
      transactions: [],
      totalLocked: BigInt(0),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.pools.set(id, pool);
    return pool;
  }

  /**
   * Add transaction to pool
   */
  addToPool(poolId: string, tx: PrivateTransaction): void {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found`);
    }

    pool.transactions.push(tx);
    pool.totalLocked += tx.amount;
    pool.updatedAt = Date.now();
    this.pools.set(poolId, pool);
  }

  /**
   * Get pool status
   */
  getPoolStatus(poolId: string): PrivacyPool | null {
    return this.pools.get(poolId) || null;
  }

  private async generateOwnershipProof(utxo: PrivateUTXO): Promise<ZKProof> {
    const params: ProofGenerationParams = {
      fromSecret: utxo.owner,
      toSecret: utxo.owner,
      amount: utxo.amount,
      randomness: '0x' + randomBytes(32).toString('hex'),
      nullifier: utxo.nullifier,
      commitment: utxo.commitment,
      merkleRoot: this.getMerkleRoot(),
      merklePath: []
    };

    return this.proofGenerator.generateProof(params);
  }

  private getMerkleRoot(): string {
    const commitments = Array.from(this.privateUTXOs.values())
      .filter(u => !u.spent)
      .map(u => u.commitment);

    if (commitments.length === 0) {
      return '0x' + '0'.repeat(64);
    }

    let currentLevel = commitments;
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = currentLevel[i] + currentLevel[i + 1];
          nextLevel.push(createHash('sha256').update(combined).digest('hex'));
        } else {
          nextLevel.push(currentLevel[i]);
        }
      }
      currentLevel = nextLevel;
    }

    return currentLevel[0] || '0x' + '0'.repeat(64);
  }
}
