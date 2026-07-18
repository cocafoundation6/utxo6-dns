// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { SettlementTransaction } from '../types';
import { UTXOSetManager } from '@utxodns/state';

/**
 * UTXO Settlement Utility
 * Anchors settlement transactions to UTXO outputs
 */
export class UTXOSettlement {
  private utxoManager: UTXOSetManager;

  constructor(utxoManager: UTXOSetManager) {
    this.utxoManager = utxoManager;
  }

  /**
   * Anchor a settlement to UTXO
   */
  anchorSettlement(tx: SettlementTransaction): string {
    const txid = this.generateSettlementTxid(tx);

    const utxo = {
      txid,
      vout: 0,
      amount: tx.amount,
      scriptPubKey: `OP_RETURN SETTLEMENT ${tx.id}`,
      height: 0,
      confirmations: 0,
      spent: false,
      address: tx.to
    };

    this.utxoManager.addUTXO(utxo);

    return txid;
  }

  /**
   * Generate settlement transaction ID
   */
  private generateSettlementTxid(tx: SettlementTransaction): string {
    const data = `${tx.id}${tx.from}${tx.to}${tx.amount}${tx.timestamp}`;
    return '0x' + Buffer.from(data).toString('hex').slice(0, 64);
  }

  /**
   * Verify settlement UTXO
   */
  verifySettlement(txid: string): boolean {
    const utxo = this.utxoManager.getUTXO(txid, 0);
    if (!utxo) return false;
    return !utxo.spent;
  }

  /**
   * Get settlement UTXOs
   */
  getSettlementUTXOs(txid: string): any[] {
    const result: any[] = [];
    const utxo = this.utxoManager.getUTXO(txid, 0);
    if (utxo) {
      result.push(utxo);
    }
    return result;
  }
}
