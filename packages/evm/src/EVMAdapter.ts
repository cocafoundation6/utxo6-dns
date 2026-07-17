// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '@utxodns/state';
import { AAL } from './AAL';
import { UTXOSmartContract } from './UTXOSmartContract';
import { EVMAccount, EVMUTXO } from './types';

/**
 * EVM Adapter 
 * Provides a unified EVM-compatible interface
 */
export class EVMAdapter {
  private utxoManager: UTXOSetManager;
  private aal: AAL;
  private contractBridge: UTXOSmartContract;
  private accountCache: Map<string, EVMAccount> = new Map();

  constructor(utxoManager: UTXOSetManager) {
    this.utxoManager = utxoManager;
    this.aal = new AAL(utxoManager);
    this.contractBridge = new UTXOSmartContract(utxoManager);
  }

  /**
   * Retrieve account information
   */
  async getAccount(address: string): Promise<EVMAccount> {
    if (this.accountCache.has(address)) {
      return this.accountCache.get(address)!;
    }

    this.aal.syncUTXOsToAccount(address);
    const account = this.aal.getAccount(address);
    this.accountCache.set(address, account);
    return account;
  }

  /**
   * Retrieve account balance
   */
  async getBalance(address: string): Promise<bigint> {
    const account = await this.getAccount(address);
    return account.balance;
  }

  /**
   * Retrieve non-CE account details
   */
  async getNonce(address: string): Promise<number> {
    const account = await this.getAccount(address);
    return account.nonce;
  }

  /**
   * Retrieve the account's UTXOs
   */
  async getUTXOs(address: string): Promise<EVMUTXO[]> {
    return this.aal.getUTXOsForAccount(address);
  }

  /**
   * Execute EVM transaction
   */
  async executeTransaction(from: string, to: string, data: string, amount: bigint): Promise<string> {
    const balance = await this.getBalance(from);
    if (balance < amount) {
      throw new Error(`Insufficient balance: ${balance} < ${amount}`);
    }

    const { utxos, total, change } = this.utxoManager.selectUTXOs(from, amount);

    const txid = this.generateTxid(from, to, amount);

    const inputs = utxos.map(u => ({ txid: u.txid, vout: u.vout, sequence: 0 }));
    this.utxoManager.spendUTXOs(inputs, txid);

    const account = await this.getAccount(from);
    account.nonce++;
    this.accountCache.set(from, account);

    return txid;
  }

  private generateTxid(from: string, to: string, amount: bigint): string {
    return '0x' + Buffer.from(`${from}${to}${amount}${Date.now()}`).toString('hex').slice(0, 64);
  }
}
