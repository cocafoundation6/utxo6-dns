// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { BlockInfo, TransactionDetail, ExplorerStats } from './types';

/**
 * Statistics Aggregator
 * Collect and calculate browser metrics
 */
export class Statistics {
  private blockCount: number = 0;
  private transactionCount: number = 0;
  private utxoCount: number = 0;
  private addressSet: Set<string> = new Set();
  private totalSupply: bigint = BigInt(0);
  private blockTimes: number[] = [];
  private txSizes: number[] = [];
  private feeRates: bigint[] = [];
  private lastBlockTime: number = 0;
  private activeAddresses: Set<string> = new Set();
  private activityWindow: number = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Process new block
   */
  onNewBlock(block: BlockInfo, transactions: TransactionDetail[]): void {
    this.blockCount++;

    // Calculate block time
    if (this.lastBlockTime > 0) {
      const diff = (block.timestamp - this.lastBlockTime) / 1000;
      this.blockTimes.push(diff);
    }
    this.lastBlockTime = block.timestamp;

    // Process transaction
    for (const tx of transactions) {
      this.transactionCount++;
      this.txSizes.push(tx.size);

      // Collect Address
      for (const output of tx.outputs) {
        if (output.address) {
          this.addressSet.add(output.address);
        }
      }
      for (const input of tx.inputs) {
        if (input.address) {
          this.addressSet.add(input.address);
        }
      }

      // Calculate Total Supply (Simplified)
      this.totalSupply += tx.outputs.reduce((sum, o) => sum + o.amount, BigInt(0));
    }
  }

  /**
   * Update active addresses
   */
  updateActiveAddress(address: string): void {
    this.activeAddresses.add(address);
    this.addressSet.add(address);
  }

  /**
   * Retrieve statistics
   */
  getStats(): ExplorerStats {
    const avgBlockTime = this.blockTimes.length > 0
      ? this.blockTimes.reduce((a, b) => a + b, 0) / this.blockTimes.length
      : 0;

    const avgTxSize = this.txSizes.length > 0
      ? this.txSizes.reduce((a, b) => a + b, 0) / this.txSizes.length
      : 0;

    const avgFeeRate = this.feeRates.length > 0
      ? this.feeRates.reduce((a, b) => a + b, BigInt(0)) / BigInt(this.feeRates.length)
      : BigInt(0);

    return {
      blocks: this.blockCount,
      transactions: this.transactionCount,
      utxos: this.utxoCount,
      addresses: this.addressSet.size,
      totalSupply: this.totalSupply,
      avgBlockTime,
      avgTransactionSize: avgTxSize,
      feeRate: avgFeeRate,
      activeAddresses24h: this.activeAddresses.size
    };
  }

  /**
   * Reset Statistics
   */
  reset(): void {
    this.blockCount = 0;
    this.transactionCount = 0;
    this.utxoCount = 0;
    this.addressSet = new Set();
    this.totalSupply = BigInt(0);
    this.blockTimes = [];
    this.txSizes = [];
    this.feeRates = [];
    this.lastBlockTime = 0;
    this.activeAddresses = new Set();
  }
}
