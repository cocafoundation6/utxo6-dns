// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXO, UTXOSet as UTXOSetType, UTXOFilter, UTXOTransaction, TXInput, TXOutput } from './types';
import { UTXOValidation } from './UTXOValidation';

/**
 * UTXO Set Manager
 * Responsible for CRUD operations, queries and spending of UTXOs
 */
export class UTXOSetManager {
  private utxoSet: UTXOSetType = {};
  private validation: UTXOValidation;

  constructor() {
    this.validation = new UTXOValidation();
  }

  /**
   * 添加 UTXO 到集合
   */
  addUTXO(utxo: UTXO): void {
    if (!this.utxoSet[utxo.txid]) {
      this.utxoSet[utxo.txid] = {};
    }
    this.utxoSet[utxo.txid][utxo.vout] = utxo;
  }

  /**
   * Batch add UTXOs
   */
  addUTXOs(utxos: UTXO[]): void {
    for (const utxo of utxos) {
      this.addUTXO(utxo);
    }
  }

  /**
   *Retrieve UTXO
   */
  getUTXO(txid: string, vout: number): UTXO | null {
    if (this.utxoSet[txid] && this.utxoSet[txid][vout]) {
      return this.utxoSet[txid][vout];
    }
    return null;
  }

  /**
   * Retrieve all UTXOs for the address
   */
  getUTXOsByAddress(address: string): UTXO[] {
    const result: UTXO[] = [];
    for (const txid in this.utxoSet) {
      for (const vout in this.utxoSet[txid]) {
        const utxo = this.utxoSet[txid][vout];
        if (utxo.address === address && !utxo.spent) {
          result.push(utxo);
        }
      }
    }
    return result;
  }

  /**
   * Query UTXOs (with filtering support)
   */
  queryUTXOs(filter: UTXOFilter): UTXO[] {
    let result: UTXO[] = [];

    for (const txid in this.utxoSet) {
      for (const vout in this.utxoSet[txid]) {
        const utxo = this.utxoSet[txid][vout];
        if (utxo.spent) continue;

        if (filter.address && utxo.address !== filter.address) continue;
        if (filter.minAmount && utxo.amount < filter.minAmount) continue;
        if (filter.maxAmount && utxo.amount > filter.maxAmount) continue;
        if (filter.minConfirmations && utxo.confirmations < filter.minConfirmations) continue;
        if (filter.maxConfirmations && utxo.confirmations > filter.maxConfirmations) continue;
        if (filter.fromHeight && utxo.height < filter.fromHeight) continue;
        if (filter.toHeight && utxo.height > filter.toHeight) continue;

        result.push(utxo);
      }
    }

    return result;
  }

  /**
   * Retrieve total balance
   */
  getBalance(address: string): bigint {
    const utxos = this.getUTXOsByAddress(address);
    return utxos.reduce((sum, utxo) => sum + utxo.amount, BigInt(0));
  }

  /**
   * Select UTXOs to meet the transaction amount (similar to Bitcoin's coin selection).
   */
  selectUTXOs(address: string, amount: bigint): { utxos: UTXO[]; total: bigint; change: bigint } {
    const available = this.getUTXOsByAddress(address);
    const sorted = available.sort((a, b) => Number(a.amount - b.amount));

    let selected: UTXO[] = [];
    let total = BigInt(0);

    for (const utxo of sorted) {
      selected.push(utxo);
      total += utxo.amount;
      if (total >= amount) break;
    }

    if (total < amount) {
      throw new Error(`Insufficient balance: ${amount} required, ${total} available`);
    }

    const change = total - amount;
    return { utxos: selected, total, change };
  }

  /**
   * Spend UTXO (mark as spent)
   */
  spendUTXO(txid: string, vout: number, spentTxid: string, spentVout: number): boolean {
    const utxo = this.getUTXO(txid, vout);
    if (!utxo) return false;
    if (utxo.spent) return false;

    utxo.spent = true;
    utxo.spentTxid = spentTxid;
    utxo.spentVout = spentVout;

    return true;
  }

  /**
   * Batch spend UTXOs
   */
  spendUTXOs(inputs: TXInput[], spentTxid: string): boolean {
    let success = true;
    for (const input of inputs) {
      const result = this.spendUTXO(input.txid, input.vout, spentTxid, 0);
      if (!result) success = false;
    }
    return success;
  }

  /*** Calculate transaction fees
   */
  calculateFee(tx: UTXOTransaction, feeRate: bigint): bigint {
    const txSize = this.estimateTxSize(tx);
    return txSize * feeRate;
  }

  /**
   * Estimate transaction size (bytes)
   */
  private estimateTxSize(tx: UTXOTransaction): bigint {
    const inputSize = 148;
    const outputSize = 34;
    const overhead = 10;
    return BigInt(overhead + tx.inputs.length * inputSize + tx.outputs.length * outputSize);
  }
}
