// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { EVMUTXO, OP_CREATE_Params, OP_CALL_Params } from './types';
import { UTXOSetManager } from '@utxodns/state';

/**
 * UTXO Smart Contract Bridge 
 * Extend UTXO to Support Smart Contract Functionality
 */
export class UTXOSmartContract {
  private utxoManager: UTXOSetManager;
  private contractRegistry: Map<string, { code: string; abi: any[] }> = new Map();

  constructor(utxoManager: UTXOSetManager) {
    this.utxoManager = utxoManager;
  }

  /**
   * OP_CREATE: Create a smart contract from a UTXO
   */
  async createContract(params: OP_CREATE_Params): Promise<string> {
    const contractAddress = this.generateContractAddress(params.utxoId);

    const utxo = this.utxoManager.getUTXO(params.utxoId, 0);
    if (!utxo) {
      throw new Error(`UTXO ${params.utxoId} not found`);
    }
    if (utxo.spent) {
      throw new Error(`UTXO ${params.utxoId} already spent`);
    }

    this.contractRegistry.set(contractAddress, {
      code: params.contractCode,
      abi: []
    });

    this.utxoManager.spendUTXO(params.utxoId, 0, `contract:${contractAddress}`, 0);

    const contractUTXO = {
      txid: `contract:${contractAddress}`,
      vout: 0,
      amount: params.initialAmount,
      scriptPubKey: params.contractCode,
      height: 0,
      confirmations: 0,
      spent: false,
      address: contractAddress
    };
    this.utxoManager.addUTXO(contractUTXO);

    return contractAddress;
  }

  /**
   * OP_CALL: Call a smart contract method
   */
  async callContract(params: OP_CALL_Params): Promise<any> {
    const contract = this.contractRegistry.get(params.contractAddress);
    if (!contract) {
      throw new Error(`Contract ${params.contractAddress} not found`);
    }

    const utxo = this.utxoManager.getUTXO(params.utxoId, 0);
    if (!utxo) {
      throw new Error(`UTXO ${params.utxoId} not found`);
    }
    if (utxo.spent) {
      throw new Error(`UTXO ${params.utxoId} already spent`);
    }

    const result = this.executeContractMethod(contract, params.method, params.params);

    if (params.amount && params.amount > 0) {
      if (utxo.amount < params.amount) {
        throw new Error(`Insufficient UTXO amount: ${utxo.amount} < ${params.amount}`);
      }
      const change = utxo.amount - params.amount;
      if (change > 0) {
        // Create change UTXO
      }
    }

    return result;
  }

  /**
   * Retrieve contract code
   */
  getContractCode(address: string): string | null {
    const contract = this.contractRegistry.get(address);
    return contract ? contract.code : null;
  }

  /**
   * Obtain Contract ABI
   */
  getContractABI(address: string): any[] | null {
    const contract = this.contractRegistry.get(address);
    return contract ? contract.abi : null;
  }

  private generateContractAddress(utxoId: string): string {
    return '0x' + Buffer.from(utxoId).toString('hex').slice(0, 40);
  }

  private executeContractMethod(contract: { code: string; abi: any[] }, method: string, params: any[]): any {
    return { result: `Executed ${method} with params: ${JSON.stringify(params)}` };
  }
}
