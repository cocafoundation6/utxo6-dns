// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOOpCode, OpCodeContext, OpCodeResult } from './types';
import { OpCodeInterpreter } from './OpCodeInterpreter';
import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';
import { HTLCContractManager } from '@utxodns/htlc';

/**
 * Opcode Execution Engine 
 * Manages opcode registration, execution, and logging
 */
export class OpCodeEngine {
  private interpreters: Map<string, OpCodeInterpreter> = new Map();
  private context: OpCodeContext;
  private gasLimit: bigint;

  constructor(
    utxoManager: UTXOSetManager,
    evmAdapter: EVMAdapter,
    gasLimit: bigint = BigInt(10000000)
  ) {
    this.gasLimit = gasLimit;
    this.context = {
      contractAddress: '',
      caller: '',
      origin: '',
      block: {
        number: 0,
        timestamp: Date.now(),
        coinbase: '',
        difficulty: BigInt(1),
        gasLimit: this.gasLimit
      },
      utxoManager,
      evmAdapter,
      log: (message: string) => console.log(`[OpCode] ${message}`)
    };
  }

  /**
   * Create a new execution context
   */
  createContext(
    contractAddress: string,
    caller: string,
    origin: string,
    blockNumber: number
  ): OpCodeContext {
    return {
      ...this.context,
      contractAddress,
      caller,
      origin,
      block: {
        ...this.context.block,
        number: blockNumber
      }
    };
  }

  /**
   * Execute opcode
   */
  async execute(
    opCode: UTXOOpCode,
    args: any[],
    context?: OpCodeContext
  ): Promise<OpCodeResult> {
    const execContext = context || this.context;
    const interpreter = new OpCodeInterpreter(execContext);

    let gasUsed = interpreter.estimateGas(opCode, args);
    if (gasUsed > this.gasLimit) {
      return {
        success: false,
        gasUsed: BigInt(0),
        error: 'Gas limit exceeded'
      };
    }

    const result = await interpreter.execute(opCode, args);
    this.context.log(`Executed ${UTXOOpCode[opCode]} with gas: ${gasUsed}`);

    return {
      ...result,
      gasUsed: gasUsed
    };
  }

  /**
   * Batch execution
   */
  async executeBatch(
    operations: Array<{ opCode: UTXOOpCode; args: any[] }>,
    context?: OpCodeContext
  ): Promise<OpCodeResult[]> {
    const results: OpCodeResult[] = [];
    let totalGas = BigInt(0);

    for (const op of operations) {
      const result = await this.execute(op.opCode, op.args, context);
      results.push(result);
      totalGas += result.gasUsed;

      if (!result.success) {
        break;
      }

      if (totalGas > this.gasLimit) {
        break;
      }
    }

    return results;
  }

  /**
   *Get Gas Limit
   */
  getGasLimit(): bigint {
    return this.gasLimit;
  }

  /**
   * Set Gas Limit
   */
  setGasLimit(limit: bigint): void {
    this.gasLimit = limit;
  }

  /**
   * Reset context
   */
  resetContext(): void {
    this.context = {
      ...this.context,
      contractAddress: '',
      caller: '',
      origin: ''
    };
  }

  /**
   * Retrieve context
   */
  getContext(): OpCodeContext {
    return this.context;
  }

  /**
   * Set log callback
   */
  setLogCallback(callback: (message: string) => void): void {
    this.context.log = callback;
  }
}
