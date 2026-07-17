// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { BlockInfo, TransactionDetail } from './types';
import { createHash } from 'crypto';

/**
 * Block Indexer
 * Responsible for indexing, storing, and querying blockchain data.
 */
export class BlockIndexer {
  private blocks: Map<number, BlockInfo> = new Map();
  private blockHashes: Map<string, number> = new Map();
  private transactions: Map<string, TransactionDetail> = new Map();
  private blockTxMap: Map<number, string[]> = new Map();

  /**
   * Add Block
   */
  addBlock(block: BlockInfo, transactions: TransactionDetail[]): void {
    this.blocks.set(block.height, block);
    this.blockHashes.set(block.hash, block.height);

    const txids: string[] = [];
    for (const tx of transactions) {
      this.transactions.set(tx.txid, tx);
      txids.push(tx.txid);
    }
    this.blockTxMap.set(block.height, txids);
  }

  /**
   * Fetch block
   */
  getBlock(height: number): BlockInfo | null {
    return this.blocks.get(height) || null;
  }

  /**
   * Retrieve block by hash
   */
  getBlockByHash(hash: string): BlockInfo | null {
    const height = this.blockHashes.get(hash);
    if (height === undefined) return null;
    return this.getBlock(height);
  }

  /**
   * Fetch the latest block
   */
  getLatestBlock(): BlockInfo | null {
    const heights = Array.from(this.blocks.keys());
    if (heights.length === 0) return null;
    const maxHeight = Math.max(...heights);
    return this.getBlock(maxHeight);
  }

  /**
   * Retrieve block transaction list
   */
  getBlockTransactions(height: number): TransactionDetail[] {
    const txids = this.blockTxMap.get(height) || [];
    return txids
      .map(txid => this.transactions.get(txid))
      .filter((tx): tx is TransactionDetail => tx !== undefined);
  }

  /**
   * Retrieve transaction
   */
  getTransaction(txid: string): TransactionDetail | null {
    return this.transactions.get(txid) || null;
  }

  /**
   *Retrieve the block height of the transaction
   */
  getTransactionBlockHeight(txid: string): number | null {
    const tx = this.transactions.get(txid);
    return tx ? tx.blockHeight : null;
  }

  /**
   * Retrieve block range
   */
  getBlockRange(fromHeight: number, toHeight: number): BlockInfo[] {
    const result: BlockInfo[] = [];
    for (let h = fromHeight; h <= toHeight; h++) {
      const block = this.getBlock(h);
      if (block) result.push(block);
    }
    return result;
  }

  /**
   * Get total block count
   */
  getBlockCount(): number {
    return this.blocks.size;
  }

  /**
   * Generate Block Hash (Simulated)
   */
  static generateBlockHash(height: number): string {
    return '0x' + createHash('sha256')
      .update(`block_${height}_${Date.now()}`)
      .digest('hex');
  }

  /**
   * Generate Merkle Root (Simulated)
   */
  static generateMerkleRoot(txids: string[]): string {
    let hashes = txids.map(txid => createHash('sha256').update(txid).digest('hex'));
    while (hashes.length > 1) {
      const next: string[] = [];
      for (let i = 0; i < hashes.length; i += 2) {
        if (i + 1 < hashes.length) {
          next.push(createHash('sha256').update(hashes[i] + hashes[i + 1]).digest('hex'));
        } else {
          next.push(hashes[i]);
        }
      }
      hashes = next;
    }
    return hashes[0] || '0x' + '0'.repeat(64);
  }
}
