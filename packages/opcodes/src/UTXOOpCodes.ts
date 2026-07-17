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
import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';
import { HTLCContractManager } from '@utxodns/htlc';

/**
 * UTXO Opcode implementation
 * Include all UTXO-related EVM extension opcodes.
 */
export class UTXOOpCodes {
  private utxoManager: UTXOSetManager;
  private evmAdapter: EVMAdapter;
  private htlcManager: HTLCContractManager;
  private context: OpCodeContext;

  constructor(context: OpCodeContext) {
    this.context = context;
    this.utxoManager = context.utxoManager;
    this.evmAdapter = context.evmAdapter;
    this.htlcManager = new HTLCContractManager();
  }

  /**
   * UTXO_BALANCE: Retrieve the UTXO balance of the address.
   */
  async balance(address: string): Promise<OpCodeResult> {
    try {
      const balance = this.utxoManager.getBalance(address);
      return {
        success: true,
        gasUsed: BigInt(100),
        returnData: balance
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(100),
        error: error.message
      };
    }
  }

  /**
   * UTXO_GET: Retrieve specifiedUTXO
   */
  async getUTXO(txid: string, vout: number): Promise<OpCodeResult> {
    try {
      const utxo = this.utxoManager.getUTXO(txid, vout);
      return {
        success: true,
        gasUsed: BigInt(150),
        returnData: utxo
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(150),
        error: error.message
      };
    }
  }

  /**
   * UTXO_EXISTS: Check if the UTXO exists and is unspent.
   */
  async exists(txid: string, vout: number): Promise<OpCodeResult> {
    try {
      const utxo = this.utxoManager.getUTXO(txid, vout);
      const exists = utxo !== null && !utxo.spent;
      return {
        success: true,
        gasUsed: BigInt(50),
        returnData: exists
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(50),
        error: error.message
      };
    }
  }

  /**
   * UTXO_CREATE:Create a new UTXO
   */
  async createUTXO(params: UTXOCreateParams): Promise<OpCodeResult> {
    try {
      //Deduct funds from the caller's address (EVM mode)
      //In actual implementation, it is necessary to transition from EVM accounts to the UTXO model.
      const utxo = {
        txid: `0x${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        vout: 0,
        amount: params.amount,
        scriptPubKey: params.scriptPubKey || 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
        height: this.context.block.number,
        confirmations: 1,
        spent: false,
        address: params.recipient
      };

      this.utxoManager.addUTXO(utxo);

      this.context.log(`Created UTXO: ${utxo.txid}:${utxo.vout} for ${params.recipient}`);

      return {
        success: true,
        gasUsed: BigInt(500),
        returnData: {
          txid: utxo.txid,
          vout: utxo.vout,
          amount: utxo.amount
        },
        events: [
          {
            type: 'UTXO_CREATED',
            data: { txid: utxo.txid, vout: utxo.vout, recipient: params.recipient, amount: params.amount }
          }
        ]
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(500),
        error: error.message
      };
    }
  }

  /**
   * UTXO_SPEND: Spend the specified amount UTXO
   */
  async spendUTXO(params: UTXOSpendParams): Promise<OpCodeResult> {
    try {
      const spent = this.utxoManager.spendUTXO(
        params.txid,
        params.vout,
        `spent_by_${this.context.contractAddress}`,
        0
      );

      if (!spent) {
        throw new Error(`Failed to spend UTXO ${params.txid}:${params.vout}`);
      }

      // Create change UTXO (if any remaining)
      if (params.amount && params.amount > 0) {
        const changeUtxo = {
          txid: `0x${Date.now()}_change_${Math.random().toString(36).slice(2, 8)}`,
          vout: 0,
          amount: params.amount,
          scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
          height: this.context.block.number,
          confirmations: 1,
          spent: false,
          address: params.recipient
        };
        this.utxoManager.addUTXO(changeUtxo);
      }

      this.context.log(`Spent UTXO: ${params.txid}:${params.vout}`);

      return {
        success: true,
        gasUsed: BigInt(600),
        returnData: { spent: true },
        events: [
          {
            type: 'UTXO_SPENT',
            data: { txid: params.txid, vout: params.vout, recipient: params.recipient }
          }
        ]
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(600),
        error: error.message
      };
    }
  }

  /**
   * UTXO_TRANSFER: Transfer UTXO
   */
  async transferUTXO(params: UTXOTransferParams): Promise<OpCodeResult> {
    try {
      //Select UTXO
      const { utxos, total, change } = this.utxoManager.selectUTXOs(params.fromAddress, params.amount);

      // Spend selected UTXOs
      const inputs = utxos.map(u => ({ txid: u.txid, vout: u.vout, sequence: 0 }));
      const txid = `0x${Date.now()}_transfer_${Math.random().toString(36).slice(2, 8)}`;
      this.utxoManager.spendUTXOs(inputs, txid);

      // Create output UTXO
      const outputUtxo = {
        txid: txid,
        vout: 0,
        amount: params.amount,
        scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
        height: this.context.block.number,
        confirmations: 1,
        spent: false,
        address: params.toAddress
      };
      this.utxoManager.addUTXO(outputUtxo);

      // Change
      if (change > 0) {
        const changeUtxo = {
          txid: txid,
          vout: 1,
          amount: change,
          scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
          height: this.context.block.number,
          confirmations: 1,
          spent: false,
          address: params.fromAddress
        };
        this.utxoManager.addUTXO(changeUtxo);
      }

      this.context.log(`Transferred ${params.amount} from ${params.fromAddress} to ${params.toAddress}`);

      return {
        success: true,
        gasUsed: BigInt(800),
        returnData: { txid },
        events: [
          {
            type: 'UTXO_TRANSFER',
            data: { from: params.fromAddress, to: params.toAddress, amount: params.amount, txid }
          }
        ]
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(800),
        error: error.message
      };
    }
  }

  /**
   * UTXO_HTLC_LOCK: Lock in HTLC
   */
  async lockHTLC(params: HTLCLockParams): Promise<OpCodeResult> {
    try {
      const secret = HTLCContractManager.generateSecret();
      const hashLock = HTLCContractManager.computeHashLock(secret);

      // Create HTLC Contract
      const contract = await this.htlcManager.createContract({
        fromChain: 'evm',
        toChain: 'evm',
        fromAddress: this.context.caller,
        toAddress: params.recipient,
        amount: params.amount,
        hashLock,
        timeLock: params.timeLock
      });

      // Locked Funds (EVM → UTXO)
      // Simplified: Directly create a UTXO to the contract address.
      const utxo = {
        txid: `0x${Date.now()}_htlc_${Math.random().toString(36).slice(2, 8)}`,
        vout: 0,
        amount: params.amount,
        scriptPubKey: `OP_IF OP_HASH160 ${hashLock} OP_EQUALVERIFY OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG OP_ELSE ${params.timeLock} OP_CHECKSEQUENCEVERIFY OP_DROP OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG OP_ENDIF`,
        height: this.context.block.number,
        confirmations: 1,
        spent: false,
        address: contract.id
      };
      this.utxoManager.addUTXO(utxo);

      // Activate Contract
      await this.htlcManager.activateContract(contract.id, utxo.txid);

      return {
        success: true,
        gasUsed: BigInt(1000),
        returnData: {
          contractId: contract.id,
          hashLock,
          secret,
          utxo: { txid: utxo.txid, vout: utxo.vout }
        },
        events: [
          {
            type: 'HTLC_LOCKED',
            data: { contractId: contract.id, amount: params.amount, recipient: params.recipient }
          }
        ]
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(1000),
        error: error.message
      };
    }
  }

  /**
   * UTXO_HTLC_UNLOCK: Unlock HTLC
   */
  async unlockHTLC(params: HTLCUnlockParams): Promise<OpCodeResult> {
    try {
      // Unlock Contract
      const contract = await this.htlcManager.unlockContract({
        contractId: params.contractId,
        secret: params.secret,
        fromChain: 'evm',
        toChain: 'evm',
        toAddress: this.context.caller
      });

      // Create Unlock UTXO
      const utxo = {
        txid: `0x${Date.now()}_htlc_unlock_${Math.random().toString(36).slice(2, 8)}`,
        vout: 0,
        amount: contract.amount,
        scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
        height: this.context.block.number,
        confirmations: 1,
        spent: false,
        address: this.context.caller
      };
      this.utxoManager.addUTXO(utxo);

      return {
        success: true,
        gasUsed: BigInt(700),
        returnData: {
          utxo: { txid: utxo.txid, vout: utxo.vout, amount: utxo.amount }
        },
        events: [
          {
            type: 'HTLC_UNLOCKED',
            data: { contractId: params.contractId, recipient: this.context.caller }
          }
        ]
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(700),
        error: error.message
      };
    }
  }

  /**
   * UTXO_HTLC_REFUND: Refund HTLC
   */
  async refundHTLC(contractId: string): Promise<OpCodeResult> {
    try {
      const contract = await this.htlcManager.refundContract(contractId);

      // Create Refund UTXO
      const utxo = {
        txid: `0x${Date.now()}_htlc_refund_${Math.random().toString(36).slice(2, 8)}`,
        vout: 0,
        amount: contract.amount,
        scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
        height: this.context.block.number,
        confirmations: 1,
        spent: false,
        address: contract.fromAddress
      };
      this.utxoManager.addUTXO(utxo);

      return {
        success: true,
        gasUsed: BigInt(600),
        returnData: {
          utxo: { txid: utxo.txid, vout: utxo.vout, amount: utxo.amount }
        },
        events: [
          {
            type: 'HTLC_REFUNDED',
            data: { contractId, refundAddress: contract.fromAddress }
          }
        ]
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(600),
        error: error.message
      };
    }
  }

  /**
   * UTXO_INFO: 获取 UTXO 详细信息
   */
  async getUTXOInfo(txid: string, vout: number): Promise<OpCodeResult> {
    try {
      const utxo = this.utxoManager.getUTXO(txid, vout);
      if (!utxo) {
        throw new Error(`UTXO ${txid}:${vout} not found`);
      }

      return {
        success: true,
        gasUsed: BigInt(100),
        returnData: {
          txid: utxo.txid,
          vout: utxo.vout,
          amount: utxo.amount,
          height: utxo.height,
          confirmations: utxo.confirmations,
          spent: utxo.spent,
          address: utxo.address
        }
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: BigInt(100),
        error: error.message
      };
    }
  }
}
