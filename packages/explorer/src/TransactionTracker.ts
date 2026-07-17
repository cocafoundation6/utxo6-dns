// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { TransactionDetail, TransactionEvent, UTXOInfo } from './types';
import { UTXOSetManager } from '@utxodns/state';

/**
 * Transaction Tracker
 * Track transaction status changes and events.
 */
export class TransactionTracker {
  private utxoManager: UTXOSetManager;
  private pendingTransactions: Map<string, TransactionDetail> = new Map();
  private eventListeners: ((event: TransactionEvent) => void)[] = [];
  private confirmedCache: Set<string> = new Set();

  constructor(utxoManager: UTXOSetManager) {
    this.utxoManager = utxoManager;
  }

  /**
   * Add pending transaction
   */
  addPendingTransaction(tx: TransactionDetail): void {
    this.pendingTransactions.set(tx.txid, tx);
  }

  /**
   * Confirm transaction
   */
  confirmTransaction(txid: string, blockHeight: number): void {
    const tx = this.pendingTransactions.get(txid);
    if (!tx) return;

    tx.blockHeight = blockHeight;
    tx.confirmations = 1;
    this.confirmedCache.add(txid);
    this.pendingTransactions.delete(txid);

    // Trigger confirmation event
    this.emitEvent({
      type: 'CONFIRMED',
      txid: tx.txid,
      address: this.getMainAddress(tx),
      amount: this.getTotalAmount(tx),
      blockHeight,
      timestamp: Date.now(),
      confirmations: 1
    });
  }

  /**
   * Increase confirmation count
   */
  incrementConfirmations(txid: string): void {
    const tx = this.getTransaction(txid);
    if (!tx) return;

    tx.confirmations++;
  }

  /**
   * Retrieve transaction status
   */
  getTransactionStatus(txid: string): 'pending' | 'confirmed' | 'spent' | 'not_found' {
    if (this.pendingTransactions.has(txid)) return 'pending';
    if (this.confirmedCache.has(txid)) return 'confirmed';

    // Check if it is a spent UTXO.
    const utxo = this.utxoManager.getUTXO(txid, 0);
    if (utxo && utxo.spent) return 'spent';

    return 'not_found';
  }

  /**
   * Track address transactions
   */
  trackAddressTransactions(address: string, callback: (event: TransactionEvent) => void): () => void {
    const handler = (event: TransactionEvent) => {
      if (event.address === address) {
        callback(event);
      }
    };
    this.eventListeners.push(handler);

    //Return the unsubscribe function.
    return () => {
      const index = this.eventListeners.indexOf(handler);
      if (index !== -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  /**
   * Retrieve transaction history
   */
  getTransactionHistory(address: string, limit: number = 100): TransactionDetail[] {
    // In practice, this requires querying the index.
    return [];
  }

  /**
   * Get Transaction
   */
  getTransaction(txid: string): TransactionDetail | null {
    const pending = this.pendingTransactions.get(txid);
    if (pending) return pending;

    return null;
  }

  /**
   *Retrieve the list of pending transactions.
   */
  getPendingTransactions(): TransactionDetail[] {
    return Array.from(this.pendingTransactions.values());
  }

  /**
   * Retrieve the number of pending transactions
   */
  getPendingCount(): number {
    return this.pendingTransactions.size;
  }

  private emitEvent(event: TransactionEvent): void {
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    }
  }

  private getMainAddress(tx: TransactionDetail): string {
    if (tx.outputs.length > 0 && tx.outputs[0].address) {
      return tx.outputs[0].address;
    }
    return '';
  }

  private getTotalAmount(tx: TransactionDetail): bigint {
    return tx.outputs.reduce((sum, out) => sum + out.amount, BigInt(0));
  }
}
