// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  UTXOOpCode,
  OpCodeContext,
  OpCodeResult,
  UTXOCreateParams,
  UTXOSpendParams,
  UTXOTransferParams,
  HTLCLockParams,
  HTLCUnlockParams
} from './types';
import { UTXOOpCodes } from './UTXOOpCodes';

/**
 * Opcode Interpreter 
 * Parse and execute UTXO opcodes
 */
export class OpCodeInterpreter {
  private context: OpCodeContext;
  private opCodes: UTXOOpCodes;

  constructor(context: OpCodeContext) {
    this.context = context;
    this.opCodes = new UTXOOpCodes(context);
  }

  /**
   * Execute opcode
   */
  async execute(opCode: UTXOOpCode, args: any[]): Promise<OpCodeResult> {
    switch (opCode) {
      case UTXOOpCode.UTXO_BALANCE:
        return this.opCodes.balance(args[0]);

      case UTXOOpCode.UTXO_GET:
        return this.opCodes.getUTXO(args[0], args[1]);

      case UTXOOpCode.UTXO_EXISTS:
        return this.opCodes.exists(args[0], args[1]);

      case UTXOOpCode.UTXO_CREATE:
        const createParams: UTXOCreateParams = {
          amount: args[0],
          recipient: args[1],
          scriptPubKey: args[2],
          extensionData: args[3]
        };
        return this.opCodes.createUTXO(createParams);

      case UTXOOpCode.UTXO_SPEND:
        const spendParams: UTXOSpendParams = {
          txid: args[0],
          vout: args[1],
          recipient: args[2],
          amount: args[3]
        };
        return this.opCodes.spendUTXO(spendParams);

      case UTXOOpCode.UTXO_TRANSFER:
        const transferParams: UTXOTransferParams = {
          fromAddress: args[0],
          toAddress: args[1],
          amount: args[2],
          memo: args[3]
        };
        return this.opCodes.transferUTXO(transferParams);

      case UTXOOpCode.UTXO_HTLC_LOCK:
        const lockParams: HTLCLockParams = {
          amount: args[0],
          recipient: args[1],
          hashLock: args[2],
          timeLock: args[3]
        };
        return this.opCodes.lockHTLC(lockParams);

      case UTXOOpCode.UTXO_HTLC_UNLOCK:
        const unlockParams: HTLCUnlockParams = {
          contractId: args[0],
          secret: args[1]
        };
        return this.opCodes.unlockHTLC(unlockParams);

      case UTXOOpCode.UTXO_HTLC_REFUND:
        return this.opCodes.refundHTLC(args[0]);

      case UTXOOpCode.UTXO_INFO:
        return this.opCodes.getUTXOInfo(args[0], args[1]);

      default:
        return {
          success: false,
          gasUsed: BigInt(0),
          error: `Unknown opcode: ${opCode}`
        };
    }
  }

  /**
   * Batch execute operation codes
   */
  async executeBatch(operations: Array<{ opCode: UTXOOpCode; args: any[] }>): Promise<OpCodeResult[]> {
    const results: OpCodeResult[] = [];
    for (const op of operations) {
      const result = await this.execute(op.opCode, op.args);
      results.push(result);
      if (!result.success) {
        // If an operation fails, you can either halt execution or proceed.
        break;
      }
    }
    return results;
  }

  /**
   * Retrieve the list of supported opcodes
   */
  getSupportedOpCodes(): UTXOOpCode[] {
    return Object.values(UTXOOpCode).filter(v => typeof v === 'number') as UTXOOpCode[];
  }

  /**
   * Retrieve operation code name
   */
  getOpCodeName(opCode: UTXOOpCode): string {
    return UTXOOpCode[opCode] || 'UNKNOWN';
  }

  /**
   * Estimate gas consumption
   */
  estimateGas(opCode: UTXOOpCode, args: any[]): bigint {
    // Estimate gas based on opcode type.
    switch (opCode) {
      case UTXOOpCode.UTXO_BALANCE:
      case UTXOOpCode.UTXO_EXISTS:
        return BigInt(100);
      case UTXOOpCode.UTXO_GET:
      case UTXOOpCode.UTXO_INFO:
        return BigInt(150);
      case UTXOOpCode.UTXO_CREATE:
        return BigInt(500);
      case UTXOOpCode.UTXO_SPEND:
        return BigInt(600);
      case UTXOOpCode.UTXO_TRANSFER:
        return BigInt(800);
      case UTXOOpCode.UTXO_HTLC_LOCK:
        return BigInt(1000);
      case UTXOOpCode.UTXO_HTLC_UNLOCK:
        return BigInt(700);
      case UTXOOpCode.UTXO_HTLC_REFUND:
        return BigInt(600);
      default:
        return BigInt(200);
    }
  }
}
