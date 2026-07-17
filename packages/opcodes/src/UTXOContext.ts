// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { OpCodeContext, OpCodeResult, UTXOOpCode } from './types';
import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';
import { OpCodeEngine } from './OpCodeEngine';

/**
 *UTXO Execution Context Builder 
 * Simplifies the process of creating opcode execution contexts
 */
export class UTXOContextBuilder {
  private utxoManager: UTXOSetManager;
  private evmAdapter: EVMAdapter;
  private gasLimit: bigint;

  constructor(utxoManager: UTXOSetManager, evmAdapter: EVMAdapter) {
    this.utxoManager = utxoManager;
    this.evmAdapter = evmAdapter;
    this.gasLimit = BigInt(10000000);
  }

  /**
   * Set Gas Limit
   */
  setGasLimit(limit: bigint): this {
    this.gasLimit = limit;
    return this;
  }

  /**
   * Build the execution engine
   */
  build(): OpCodeEngine {
    return new OpCodeEngine(this.utxoManager, this.evmAdapter, this.gasLimit);
  }

  /**
   * Build the transaction execution context
   */
  buildTransactionContext(
    contractAddress: string,
    caller: string,
    origin: string,
    blockNumber: number
  ): OpCodeContext {
    return {
      contractAddress,
      caller,
      origin,
      block: {
        number: blockNumber,
        timestamp: Date.now(),
        coinbase: '',
        difficulty: BigInt(1),
        gasLimit: this.gasLimit
      },
      utxoManager: this.utxoManager,
      evmAdapter: this.evmAdapter,
      log: (message: string) => console.log(`[TxContext] ${message}`)
    };
  }

  /**
   * Directly execute a single opcode (simplified interface)
   */
  async executeOpCode(
    opCode: UTXOOpCode,
    args: any[],
    contractAddress: string = '',
    caller: string = '',
    blockNumber: number = 0
  ): Promise<OpCodeResult> {
    const context = this.buildTransactionContext(
      contractAddress,
      caller,
      caller,
      blockNumber
    );
    const engine = this.build();
    return engine.execute(opCode, args, context);
  }
}
