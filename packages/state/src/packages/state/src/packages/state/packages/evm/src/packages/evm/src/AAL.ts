// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { AALConfig, EVMAccount, EVMUTXO } from './types';
import { UTXOSetManager } from '@utxodns/state';

/**
 * Account Abstraction Layer 
 * Maps the UTXO model to the EVM account model
 */
export class AAL {
  private utxoManager: UTXOSetManager;
  private config: AALConfig;

  constructor(utxoManager: UTXOSetManager) {
    this.utxoManager = utxoManager;
    this.config = {
      utxoToAccount: new Map(),
      accountToUTXO: new Map()
    };
  }

  /**
   * 将 UTXO 映射到 EVM 账户
   */
  mapUTXOToAccount(utxoId: string, accountAddress: string): void {
    this.config.utxoToAccount.set(utxoId, accountAddress);
    if (!this.config.accountToUTXO.has(accountAddress)) {
      this.config.accountToUTXO.set(accountAddress, []);
    }
    this.config.accountToUTXO.get(accountAddress)!.push(utxoId);
  }

  /*** Retrieve EVM account information (derived from UTXO)
   */
  getAccount(address: string): EVMAccount {
    const utxoIds = this.config.accountToUTXO.get(address) || [];
    const totalBalance = utxoIds.reduce((sum, id) => {
      const utxo = this.utxoManager.getUTXO(id, 0);
      if (utxo) {
        return sum + utxo.amount;
      }
      return sum;
    }, BigInt(0));

    return {
      address,
      nonce: 0,
      balance: totalBalance,
      codeHash: '0x' + '0'.repeat(64),
      storageRoot: '0x' + '0'.repeat(64)
    };
  }

  /**
   * Retrieve the account's UTXO list.
   */
  getUTXOsForAccount(address: string): EVMUTXO[] {
    const utxoIds = this.config.accountToUTXO.get(address) || [];
    const result: EVMUTXO[] = [];

    for (const id of utxoIds) {
      const utxo = this.utxoManager.getUTXO(id, 0);
      if (utxo && !utxo.spent) {
        result.push({
          id,
          amount: utxo.amount,
          owner: address,
          extension: {
            contractAddress: utxo.address,
            data: utxo.scriptPubKey
          },
          height: utxo.height
        });
      }
    }

    return result;
  }

  /**
   * Batch Sync UTXOs to Accounts
   */
  syncUTXOsToAccount(address: string): void {
    const utxos = this.utxoManager.getUTXOsByAddress(address);
    for (const utxo of utxos) {
      const id = `${utxo.txid}:${utxo.vout}`;
      if (!this.config.utxoToAccount.has(id)) {
        this.mapUTXOToAccount(id, address);
      }
    }
  }

  /**
   * Retrieve AAL Status Summary
   */
  getAALState(): {
    totalAccounts: number;
    totalMappings: number;
    totalUTXOs: number;
    accounts: Map<string, string[]>;
  } {
    return {
      totalAccounts: this.config.accountToUTXO.size,
      totalMappings: this.config.utxoToAccount.size,
      totalUTXOs: Object.keys(this.utxoManager).length,
      accounts: this.config.accountToUTXO
    };
  }
}
