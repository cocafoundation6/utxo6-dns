// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * Block Information
 */
export interface BlockInfo {
  height: number;
  hash: string;
  timestamp: number;
  transactions: number;
  size: number;
  previousBlockHash: string;
  nextBlockHash?: string;
  merkleRoot: string;
  version: number;
  bits: number;
  nonce: number;
}

/**
 * Transaction Details
 */
export interface TransactionDetail {
  txid: string;
  blockHeight: number;
  blockHash: string;
  timestamp: number;
  version: number;
  locktime: number;
  inputs: TxInputDetail[];
  outputs: TxOutputDetail[];
  fee: bigint;
  size: number;
  confirmations: number;
}

/**
 * Transaction Input Details
 */
export interface TxInputDetail {
  txid: string;
  vout: number;
  scriptSig: string;
  sequence: number;
  address?: string;
  amount?: bigint;
}

/**
 * Transaction Output Details
 */
export interface TxOutputDetail {
  vout: number;
  amount: bigint;
  scriptPubKey: string;
  address?: string;
  spent: boolean;
  spentTxid?: string;
  spentVout?: number;
}

/**
 * Address information
 */
export interface AddressInfo {
  address: string;
  balance: bigint;
  txCount: number;
  totalReceived: bigint;
  totalSent: bigint;
  firstSeen: number;
  lastSeen: number;
  utxos: UTXOInfo[];
}

/**
 * UTXO 信息
 */
export interface UTXOInfo {
  txid: string;
  vout: number;
  amount: bigint;
  height: number;
  confirmations: number;
  address: string;
  scriptPubKey: string;
  spent: boolean;
}

/**
 * Monitoring rules
 */
export interface MonitorRule {
  id: string;
  name: string;
  addresses: string[];
  conditions: {
    minAmount?: bigint;
    maxAmount?: bigint;
    maxConfirmations?: number;
    scriptType?: string;
  };
  callback: (event: TransactionEvent) => void;
}

/**
 * Transaction Events
 */
export interface TransactionEvent {
  type: 'INCOMING' | 'OUTGOING' | 'CONFIRMED' | 'SPENT';
  txid: string;
  address: string;
  amount: bigint;
  blockHeight: number;
  timestamp: number;
  confirmations: number;
}

/**
 * Browser Statistics
 */
export interface ExplorerStats {
  blocks: number;
  transactions: number;
  utxos: number;
  addresses: number;
  totalSupply: bigint;
  avgBlockTime: number;
  avgTransactionSize: number;
  feeRate: bigint;
  activeAddresses24h: number;
}

/**
 * Query filter
 */
export interface ExplorerFilter {
  address?: string;
  fromBlock?: number;
  toBlock?: number;
  fromDate?: number;
  toDate?: number;
  minAmount?: bigint;
  maxAmount?: bigint;
  confirmations?: number;
  status?: 'all' | 'confirmed' | 'unconfirmed';
}
