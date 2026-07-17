// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * UTXO State data structure
 */
export interface UTXO {
  txid: string;
  vout: number;
  amount: bigint;
  scriptPubKey: string;
  height: number;
  confirmations: number;
  spent: boolean;
  spentTxid?: string;
  spentVout?: number;
  address?: string;
}

/**
 * UTXO Gather!
 */
export interface UTXOSet {
  [txid: string]: {
    [vout: number]: UTXO;
  };
}

/**
 * Transaction Input
 */
export interface TXInput {
  txid: string;
  vout: number;
  sequence: number;
  scriptSig?: string;
  witness?: string[];
}

/**
 * Transaction Output
 */
export interface TXOutput {
  amount: bigint;
  scriptPubKey: string;
  address?: string;
}

/**
 * UTXO Transaction
 */
export interface UTXOTransaction {
  txid: string;
  version: number;
  locktime: number;
  inputs: TXInput[];
  outputs: TXOutput[];
  fee?: bigint;
}

/**
 * Transaction Verification Result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * UTXO Query filter
 */
export interface UTXOFilter {
  address?: string;
  minAmount?: bigint;
  maxAmount?: bigint;
  minConfirmations?: number;
  maxConfirmations?: number;
  fromHeight?: number;
  toHeight?: number;
  spent?: boolean;
}
