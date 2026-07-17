// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * EVM Account Information
 */
export interface EVMAccount {
  address: string;
  nonce: number;
  balance: bigint;
  codeHash: string;
  storageRoot: string;
}

/**
 * Representation of UTXOs in the EVM
 */
export interface EVMUTXO {
  id: string;
  amount: bigint;
  owner: string;
  extension: {
    contractAddress?: string;
    tokenId?: string;
    data?: string;
  };
  height: number;
}

/**
 *Account Abstraction Layer (AAL) Configuration
 */
export interface AALConfig {
  utxoToAccount: Map<string, string>;
  accountToUTXO: Map<string, string[]>;
}

/**
 * EVM Opcode extension
 */
export interface EVMOpCode {
  code: number;
  name: string;
  gas: number;
  execute: (stack: any[], memory: any[], state: any) => void;
}

export interface OP_CREATE_Params {
  utxoId: string;
  contractCode: string;
  initialAmount: bigint;
  extensionData?: string;
}

export interface OP_CALL_Params {
  utxoId: string;
  contractAddress: string;
  method: string;
  params: any[];
  amount?: bigint;
}
