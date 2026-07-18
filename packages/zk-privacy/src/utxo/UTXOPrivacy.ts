// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { PrivateUTXO, Commitment, PrivateTransaction } from '../types';
import { PrivacyEngine } from '../core/PrivacyEngine';
import { UTXOSetManager } from '@utxodns/state';

/**
 * UTXO Privacy Layer
 * Integrates private UTXOs with the UTXO set manager
 */
export class UTXOPrivacy {
  private privacyEngine: PrivacyEngine;
  private utxoManager: UTXOSetManager;
  private privateUTXOMap: Map<string, PrivateUTXO> = new Map();

  constructor(privacyEngine: PrivacyEngine, utxoManager: UTXOSetManager) {
    this.privacyEngine = privacyEngine;
    this.utxoManager = utxoManager;
  }

  /**
   * Create a private UTXO from a regular UTXO
   */
  async createPrivateUTXO(
    txid: string,
    vout: number,
    owner: string
  ): Promise<PrivateUTXO> {
    const utxo = this.utxoManager.getUTXO(txid, vout);
    if (!utxo) {
      throw new Error(`UTXO ${txid}:${vout} not found`);
    }
    if (utxo.spent) {
      throw new Error(`UTXO ${txid}:${vout} already spent`);
    }

    // Create private transaction
    const privateTx = await this.privacyEngine.createPrivateTransaction({
      from: owner,
      to: owner,
      amount: utxo.amount
    });

    // Create private UTXO
    const privateUTXO: PrivateUTXO = {
      id: `priv_utxo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      commitment: privateTx.commitment,
      nullifier: privateTx.nullifier,
      amount: utxo.amount,
      owner,
      spent: false,
      createdAt: Date.now()
    };

    this.privateUTXOMap.set(privateUTXO.id, privateUTXO);

    // Spend the original UTXO (shield it)
    this.utxoManager.spendUTXO(txid, vout, privateUTXO.id, 0);

    return privateUTXO;
  }

  /**
   * Reveal a private UTXO (convert back to regular UTXO)
   */
  revealPrivateUTXO(
    privateUTXOId: string,
    address: string
  ): { txid: string; vout: number } {
    const privateUTXO = this.privateUTXOMap.get(privateUTXOId);
    if (!privateUTXO) {
      throw new Error(`Private UTXO ${privateUTXOId} not found`);
    }
    if (privateUTXO.spent) {
      throw new Error(`Private UTXO ${privateUTXOId} already spent`);
    }

    // Create regular UTXO
    const txid = `reveal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const utxo = {
      txid,
      vout: 0,
      amount: privateUTXO.amount,
      scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
      height: 0,
      confirmations: 0,
      spent: false,
      address
    };

    this.utxoManager.addUTXO(utxo);

    // Mark private UTXO as spent
    privateUTXO.spent = true;
    privateUTXO.spentAt = Date.now();
    this.privateUTXOMap.set(privateUTXOId, privateUTXO);

    return { txid, vout: 0 };
  }

  /**
   * Get all private UTXOs for an owner
   */
  getPrivateUTXOsByOwner(owner: string): PrivateUTXO[] {
    const result: PrivateUTXO[] = [];
    for (const utxo of this.privateUTXOMap.values()) {
      if (utxo.owner === owner && !utxo.spent) {
        result.push(utxo);
      }
    }
    return result;
  }

  /**
   * Get private UTXO balance
   */
  getPrivateBalance(owner: string): bigint {
    const utxos = this.getPrivateUTXOsByOwner(owner);
    return utxos.reduce((sum, u) => sum + u.amount, BigInt(0));
  }

  /**
   * Spend a private UTXO to a regular address
   */
  async spendToRegular(
    privateUTXOId: string,
    toAddress: string,
    amount: bigint
  ): Promise<{ txid: string; changeUTXO?: PrivateUTXO }> {
    const privateUTXO = this.privateUTXOMap.get(privateUTXOId);
    if (!privateUTXO) {
      throw new Error(`Private UTXO ${privateUTXOId} not found`);
    }
    if (privateUTXO.spent) {
      throw new Error(`Private UTXO ${privateUTXOId} already spent`);
    }
    if (privateUTXO.amount < amount) {
      throw new Error(`Insufficient private balance`);
    }

    // Create regular UTXO
    const txid = `spend_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const utxo = {
      txid,
      vout: 0,
      amount,
      scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
      height: 0,
      confirmations: 0,
      spent: false,
      address: toAddress
    };
    this.utxoManager.addUTXO(utxo);

    // Handle change
    let changeUTXO: PrivateUTXO | undefined;
    const change = privateUTXO.amount - amount;
    if (change > 0) {
      // Create change private UTXO
      changeUTXO = {
        id: `change_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        commitment: `0x${Math.random().toString(16).slice(2, 34)}`,
        nullifier: `0x${Math.random().toString(16).slice(2, 34)}`,
        amount: change,
        owner: privateUTXO.owner,
        spent: false,
        createdAt: Date.now()
      };
      this.privateUTXOMap.set(changeUTXO.id, changeUTXO);
    }

    // Mark original private UTXO as spent
    privateUTXO.spent = true;
    privateUTXO.spentAt = Date.now();
    this.privateUTXOMap.set(privateUTXOId, privateUTXO);

    return { txid, changeUTXO };
  }
}
