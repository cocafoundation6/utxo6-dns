// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * HTLC Contract Status
 */
export enum HTLCStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

/**
 * HTLC Contract
 */
export interface HTLCContract {
  id: string;
  fromChain: string;
  toChain: string;
  fromAddress: string;
  toAddress: string;
  amount: bigint;
  hashLock: string;           // Hashlock (SHA-256)
  timeLock: number;           // Timelock (block height or timestamp)
  status: HTLCStatus;
  secret?: string;            // Original image (recorded only upon completion)
  createdAt: number;
  updatedAt: number;
  refundedAt?: number;
  completedAt?: number;
  expiresAt: number;          // Expiration time
  fee: bigint;
}

/**
 * Parameters for creating an HTLC
 */
export interface CreateHTLCParams {
  fromChain: string;
  toChain: string;
  fromAddress: string;
  toAddress: string;
  amount: bigint;
  hashLock: string;
  timeLock: number;
  fee?: bigint;
}

/**
 *Parameters for unlocking HTLC
 */
export interface UnlockHTLCParams {
  contractId: string;
  secret: string;
  fromChain: string;
  toChain: string;
  toAddress: string;
}

/**
 * Cross-chain swap request
 */
export interface CrossChainSwapRequest {
  id: string;
  initiator: string;          //Initiator .utxo domain
  counterparty: string;       // Counterparty .utxo domain
  fromChain: string;
  toChain: string;
  fromAmount: bigint;
  toAmount: bigint;
  hashLock: string;
  timeLock: number;
  status: 'pending' | 'locked' | 'unlocked' | 'completed' | 'refunded';
  initiatorLockTx?: string;   // Initiating party locks the transaction
  counterpartyLockTx?: string; // Counterparty-locked transaction
  completedAt?: number;
}

/**
 * Swap status
 */
export interface SwapStatus {
  contractId: string;
  status: HTLCStatus;
  blockHeight: number;
  confirmations: number;
  timeRemaining: number;
}
