// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  UTXOInfo,
  AddressInfo,
  ExplorerStats,
  ExplorerFilter,
  TransactionDetail,
  BlockInfo
} from './types';
import { UTXOSetManager } from '@utxodns/state';
import { BlockIndexer } from './BlockIndexer';
import { Statistics } from './Statistics';

/**
 * UTXO Explorer Core 
 – Enables querying, browsing, and statistical analysis of UTXO data.
 */
export class UTXOExplorer {
  private utxoManager: UTXOSetManager;
  private blockIndexer: BlockIndexer;
  private statistics: Statistics;
  private addressCache: Map<string, AddressInfo> = new Map();

  constructor(utxoManager: UTXOSetManager) {
    this.utxoManager = utxoManager;
    this.blockIndexer = new BlockIndexer();
    this.statistics = new Statistics();
  }

  /**
   * Add block to browser
   */
  addBlock(block: BlockInfo, transactions: TransactionDetail[]): void {
    this.blockIndexer.addBlock(block, transactions);
    this.statistics.onNewBlock(block, transactions);

    // Update address cache
    for (const tx of transactions) {
      this.updateAddressCache(tx);
    }
  }

  /**
   * Retrieve UTXO information
   */
  getUTXO(txid: string, vout: number): UTXOInfo | null {
    const utxo = this.utxoManager.getUTXO(txid, vout);
    if (!utxo) return null;

    return {
      txid: utxo.txid,
      vout: utxo.vout,
      amount: utxo.amount,
      height: utxo.height,
      confirmations: utxo.confirmations,
      address: utxo.address || '',
      scriptPubKey: utxo.scriptPubKey,
      spent: utxo.spent
    };
  }

  /**
   * Retrieve address information
   */
  getAddressInfo(address: string): AddressInfo {
    if (this.addressCache.has(address)) {
      return this.addressCache.get(address)!;
    }

    const utxos = this.utxoManager.getUTXOsByAddress(address);
    const balance = utxos.reduce((sum, u) => sum + u.amount, BigInt(0));

    const info: AddressInfo = {
      address,
      balance,
      txCount: 0,
      totalReceived: BigInt(0),
      totalSent: BigInt(0),
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      utxos: utxos.map(u => ({
        txid: u.txid,
        vout: u.vout,
        amount: u.amount,
        height: u.height,
        confirmations: u.confirmations,
        address: u.address || '',
        scriptPubKey: u.scriptPubKey,
        spent: u.spent
      }))
    };

    this.addressCache.set(address, info);
    return info;
  }

  /**
   * Retrieve transaction details
   */
  getTransaction(txid: string): TransactionDetail | null {
    return this.blockIndexer.getTransaction(txid);
  }

  /**
   * Retrieve block details
   */
  getBlock(height: number): BlockInfo | null {
    return this.blockIndexer.getBlock(height);
  }

  /**
   *Fetch the latest block
   */
  getLatestBlock(): BlockInfo | null {
    return this.blockIndexer.getLatestBlock();
  }

  /**
   * Search
   */
  search(query: string): {
    blocks: BlockInfo[];
    transactions: TransactionDetail[];
    addresses: AddressInfo[];
  } {
    const blocks: BlockInfo[] = [];
    const transactions: TransactionDetail[] = [];
    const addresses: AddressInfo[] = [];

    // Check if it's the block height.
    const height = parseInt(query);
    if (!isNaN(height)) {
      const block = this.blockIndexer.getBlock(height);
      if (block) blocks.push(block);
    }

    // Check if it is the transaction ID.
    const tx = this.blockIndexer.getTransaction(query);
    if (tx) transactions.push(tx);

    // Check if it is an address.
    if (query.startsWith('0x') || query.startsWith('bc1') || query.startsWith('1')) {
      const addr = this.getAddressInfo(query);
      if (addr.utxos.length > 0 || addr.balance > BigInt(0)) {
        addresses.push(addr);
      }
    }

    return { blocks, transactions, addresses };
  }

  /**
   * Retrieve statistics
   */
  getStats(): ExplorerStats {
    const stats = this.statistics.getStats();
    const latestBlock = this.blockIndexer.getLatestBlock();

    return {
      blocks: this.blockIndexer.getBlockCount(),
      transactions: stats.transactions,
      utxos: stats.utxos,
      addresses: stats.addresses,
      totalSupply: stats.totalSupply,
      avgBlockTime: stats.avgBlockTime,
      avgTransactionSize: stats.avgTransactionSize,
      feeRate: stats.feeRate,
      activeAddresses24h: stats.activeAddresses24h
    };
  }

  /**
   * 获取区块范围内的交易
   */
  getTransactionsInRange(fromBlock: number, toBlock: number): TransactionDetail[] {
    const blocks = this.blockIndexer.getBlockRange(fromBlock, toBlock);
    const txs: TransactionDetail[] = [];
    for (const block of blocks) {
      const blockTxs = this.blockIndexer.getBlockTransactions(block.height);
      txs.push(...blockTxs);
    }
    return txs;
  }

  /**
   * 获取最新交易
   */
  getLatestTransactions(limit: number = 10): TransactionDetail[] {
    const latestBlock = this.blockIndexer.getLatestBlock();
    if (!latestBlock) return [];

    const txs = this.blockIndexer.getBlockTransactions(latestBlock.height);
    return txs.slice(0, limit);
  }

  /**
   * 获取未花费 UTXO 列表
   */
  getUnspentUTXOs(address?: string): UTXOInfo[] {
    let result: UTXOInfo[] = [];

    if (address) {
      const info = this.getAddressInfo(address);
      result = info.utxos.filter(u => !u.spent);
    } else {
      // Iterate through all UTXOs
      //In practice, this step requires iterating over the entire UTXO set.
    }

    return result;
  }

  private updateAddressCache(tx: TransactionDetail): void {
    for (const output of tx.outputs) {
      if (output.address) {
        this.addressCache.delete(output.address);
      }
    }
    for (const input of tx.inputs) {
      if (input.address) {
        this.addressCache.delete(input.address);
      }
    }
  }
}
