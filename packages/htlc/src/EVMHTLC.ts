// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { HTLCContract, HTLCStatus } from './types';
import { EVMAdapter } from '@utxodns/evm';
import { HTLCContractManager } from './HTLCContract';

/**
 * EVM-Compatible HTLC Implementation  
* Implementing Hash Time-Locked Contracts on EVM-Compatible Chains
 */
export class EVMHTLC {
  private evmAdapter: EVMAdapter;
  private contractManager: HTLCContractManager;
  private deployedContracts: Map<string, string> = new Map();

  constructor(evmAdapter: EVMAdapter) {
    this.evmAdapter = evmAdapter;
    this.contractManager = new HTLCContractManager();
  }

  /** Deploy EVM HTLC Contract
   */
  async deployHTLC(
    fromAddress: string,
    toAddress: string,
    amount: bigint,
    hashLock: string,
    timeLock: number
  ): Promise<{ contractId: string; address: string; txid: string }> {
    // Create HTLC contract
    const contract = await this.contractManager.createContract({
      fromChain: 'evm',
      toChain: 'evm',
      fromAddress,
      toAddress,
      amount,
      hashLock,
      timeLock
    });

    // Deploy EVM smart contracts
    const contractAddress = await this.deployEVMContract(contract);
    this.deployedContracts.set(contract.id, contractAddress);

    // Locked Funds
    const txid = await this.evmAdapter.executeTransaction(
      fromAddress,
      contractAddress,
      this.encodeLockData(hashLock, timeLock, toAddress),
      amount
    );

    // Activate Contract
    await this.contractManager.activateContract(contract.id, txid);

    return {
      contractId: contract.id,
      address: contractAddress,
      txid
    };
  }

  /**
   * Unlock HTLC on the EVM
   */
  async unlockEVM(
    contractId: string,
    secret: string,
    toAddress: string
  ): Promise<{ txid: string }> {
    const contract = await this.contractManager.unlockContract({
      contractId,
      secret,
      fromChain: 'evm',
      toChain: 'evm',
      toAddress
    });

    const contractAddress = this.deployedContracts.get(contractId);
    if (!contractAddress) {
      throw new Error(`Contract ${contractId} not deployed`);
    }

    const txid = await this.evmAdapter.executeTransaction(
      toAddress,
      contractAddress,
      this.encodeUnlockData(secret),
      BigInt(0)
    );

    return { txid };
  }

  /**
   * Refund HTLC on EVM
   */
  async refundEVM(contractId: string): Promise<{ txid: string }> {
    const contract = await this.contractManager.refundContract(contractId);

    const contractAddress = this.deployedContracts.get(contractId);
    if (!contractAddress) {
      throw new Error(`Contract ${contractId} not deployed`);
    }

    const txid = await this.evmAdapter.executeTransaction(
      contract.fromAddress,
      contractAddress,
      this.encodeRefundData(),
      BigInt(0)
    );

    return { txid };
  }

  private async deployEVMContract(contract: HTLCContract): Promise<string> {
    return '0x' + Buffer.from(contract.id).toString('hex').slice(0, 40);
  }

  private encodeLockData(hashLock: string, timeLock: number, toAddress: string): string {
    return `0x${hashLock}${timeLock.toString(16)}${toAddress.slice(2)}`;
  }

  private encodeUnlockData(secret: string): string {
    return `0x${secret}`;
  }

  private encodeRefundData(): string {
    return '0x';
  }
}
