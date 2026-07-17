// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { HTLCContract, HTLCStatus } from './types';
import { UTXOSetManager } from '@utxodns/state';
import { HTLCContractManager } from './HTLCContract';

/**
 * UTXO-Based HTLC Implementation  
* Implementing Hash Time-Locked Contracts on the UTXO Model
 */
export class UTXOHTLC {
  private utxoManager: UTXOSetManager;
  private contractManager: HTLCContractManager;

  constructor(utxoManager: UTXOSetManager) {
    this.utxoManager = utxoManager;
    this.contractManager = new HTLCContractManager();
  }

  /**
   * Lock funds in a UTXO into an HTLC.
   */
  async lockUTXO(
    fromAddress: string,
    toAddress: string,
    amount: bigint,
    hashLock: string,
    timeLock: number
  ): Promise<{ contractId: string; txid: string }> {
    // Create HTLC Contract
    const contract = await this.contractManager.createContract({
      fromChain: 'utxo',
      toChain: 'utxo',
      fromAddress,
      toAddress,
      amount,
      hashLock,
      timeLock
    });

    // Select UTXO
    const { utxos, total, change } = this.utxoManager.selectUTXOs(fromAddress, amount);

    // Generate locked transaction
    const txid = this.buildLockTransaction(utxos, toAddress, amount, change, hashLock, timeLock);

    //Mark the UTXO as spent.
    const inputs = utxos.map(u => ({ txid: u.txid, vout: u.vout, sequence: 0 }));
    this.utxoManager.spendUTXOs(inputs, txid);

    // Activate Contract
    await this.contractManager.activateContract(contract.id, txid);

    return { contractId: contract.id, txid };
  }

  /**
   * Unlock HTLC on the UTXO
   */
  async unlockUTXO(
    contractId: string,
    secret: string,
    toAddress: string
  ): Promise<{ txid: string }> {
    // Unlock Contract
    const contract = await this.contractManager.unlockContract({
      contractId,
      secret,
      fromChain: 'utxo',
      toChain: 'utxo',
      toAddress
    });

    // Create Unlock UTXO
    const txid = this.buildUnlockTransaction(contract, toAddress);

    return { txid };
  }

  /**
   * Refund HTLC on UTXO
   */
  async refundUTXO(contractId: string): Promise<{ txid: string }> {
    const contract = await this.contractManager.refundContract(contractId);

    // Create Refund UTXO
    const txid = this.buildRefundTransaction(contract);

    return { txid };
  }

  private buildLockTransaction(
    utxos: any[],
    toAddress: string,
    amount: bigint,
    change: bigint,
    hashLock: string,
    timeLock: number
  ): string {
    const data = `${toAddress}${amount}${hashLock}${timeLock}${Date.now()}`;
    return createHash('sha256').update(data).digest('hex');
  }

  private buildUnlockTransaction(contract: HTLCContract, toAddress: string): string {
    const data = `${contract.id}${toAddress}${contract.secret}${Date.now()}`;
    return createHash('sha256').update(data).digest('hex');
  }

  private buildRefundTransaction(contract: HTLCContract): string {
    const data = `${contract.id}${contract.fromAddress}${Date.now()}`;
    return createHash('sha256').update(data).digest('hex');
  }
}
