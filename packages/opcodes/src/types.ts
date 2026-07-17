// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXO, AddressBook } from '@utxodns/core';
import { EVMAccount, EVMUTXO } from '@utxodns/evm';

/**
 * UTXO Operation Code Enumeration
 */
export enum UTXOOpCode {
  // UTXO Query
  UTXO_BALANCE = 0xF0,
  UTXO_GET = 0xF1,
  UTXO_EXISTS = 0xF2,

  // UTXO Operation
  UTXO_CREATE = 0xF3,
  UTXO_SPEND = 0xF4,
  UTXO_TRANSFER = 0xF5,

  // UTXO-EVM Interoperability
  UTXO_TO_EVM = 0xF6,
  EVM_TO_UTXO = 0xF7,

  // Atomic Swap
  UTXO_HTLC_LOCK = 0xF8,
  UTXO_HTLC_UNLOCK = 0xF9,
  UTXO_HTLC_REFUND = 0xFA,

  // Query and Metadata
  UTXO_INFO = 0xFB,
  UTXO_HISTORY = 0xFC,
  UTXO_PROOF = 0xFD,

  // Extended Operations
  UTXO_SWAP = 0xFE,
  UTXO_DELEGATE = 0xFF
}

/**
 * Opcode execution context
 */
export interface OpCodeContext {
  // Current contract address being executed
  contractAddress: string;
  // Caller address
  caller: string;
  // Transaction Initiator
  origin: string;
  // Current block information
  block: {
    number: number;
    timestamp: number;
    coinbase: string;
    difficulty: bigint;
    gasLimit: bigint;
  };
  // UTXO Manager
  utxoManager: any;
  // EVM Adapter
  evmAdapter: any;
  // Opcode log
  log: (message: string) => void;
}

/**
 * Opcode execution result
 */
export interface OpCodeResult {
  success: boolean;
  gasUsed: bigint;
  returnData?: any;
  error?: string;
  events?: OpCodeEvent[];
}

/**
 *Opcode event
 */
export interface OpCodeEvent {
  type: string;
  data: any;
}

/**
 * UTXO Operational Parameters
 */
export interface UTXOCreateParams {
  amount: bigint;
  recipient: string;
  scriptPubKey?: string;
  extensionData?: string;
}

export interface UTXOSpendParams {
  txid: string;
  vout: number;
  recipient: string;
  amount?: bigint;
}

export interface UTXOTransferParams {
  fromAddress: string;
  toAddress: string;
  amount: bigint;
  memo?: string;
}

export interface HTLCLockParams {
  amount: bigint;
  recipient: string;
  hashLock: string;
  timeLock: number;
}

export interface HTLCUnlockParams {
  contractId: string;
  secret: string;
}
