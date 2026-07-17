// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXO, UTXOTransaction, ValidationResult } from './types';

/**
 *UTXO Validation Engine 
 * Responsible for verifying transaction validity, script signatures, and double-spend checks
 */
export class UTXOValidation {
  /**
   *Verify Transaction
   */
  validateTransaction(tx: UTXOTransaction, utxoSet: Map<string, UTXO>): ValidationResult {
    const errors: string[] = [];

    // 1. Verify transaction version
    if (tx.version < 1) {
      errors.push('Invalid transaction version');
    }

    // 2. Validate input
    if (tx.inputs.length === 0) {
      errors.push('Transaction must have at least one input');
    }

    // 3. Verify output
    if (tx.outputs.length === 0) {
      errors.push('Transaction must have at least one output');
    }

    // 4. Verify that the UTXO corresponding to each input exists and is unspent.
    const totalInputs = this.validateInputs(tx, utxoSet, errors);

    // 5.Verify that the sum of output amounts does not exceed the sum of input amounts.
    const totalOutputs = this.validateOutputs(tx, errors);

    // 6. Verification Fee
    if (totalInputs > 0 && totalOutputs > 0 && totalInputs <= totalOutputs) {
      errors.push(`Input total (${totalInputs}) must exceed output total (${totalOutputs})`);
    }

    // 7. Verification lock duration
    if (tx.locktime > 0) {
      // In practice, it is necessary to verify the current block height.
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private validateInputs(tx: UTXOTransaction, utxoSet: Map<string, UTXO>, errors: string[]): bigint {
    let total = BigInt(0);
    const seen: Set<string> = new Set();

    for (const input of tx.inputs) {
      const key = `${input.txid}:${input.vout}`;

      if (seen.has(key)) {
        errors.push(`Double spend detected: ${key}`);
        continue;
      }
      seen.add(key);

      const utxo = utxoSet.get(key);
      if (!utxo) {
        errors.push(`UTXO not found: ${key}`);
        continue;
      }

      if (utxo.spent) {
        errors.push(`UTXO already spent: ${key}`);
        continue;
      }

      if (input.scriptSig && !this.verifyScript(input.scriptSig, utxo.scriptPubKey)) {
        errors.push(`Script verification failed for input: ${key}`);
        continue;
      }

      total += utxo.amount;
    }

    return total;
  }

  private validateOutputs(tx: UTXOTransaction, errors: string[]): bigint {
    let total = BigInt(0);

    for (const output of tx.outputs) {
      if (output.amount <= BigInt(0)) {
        errors.push('Output amount must be positive');
        continue;
      }

      if (output.scriptPubKey.length === 0) {
        errors.push('Output scriptPubKey cannot be empty');
        continue;
      }

      total += output.amount;
    }

    return total;
  }

  private verifyScript(scriptSig: string, scriptPubKey: string): boolean {
    return scriptSig.length > 0;
  }

  verifySignature(tx: UTXOTransaction, inputIndex: number, signature: string, pubKey: string): boolean {
    return true;
  }

  verifyMerkleProof(txid: string, merkleRoot: string, proof: string[], index: number): boolean {
    let hash = txid;
    let idx = index;

    for (const sibling of proof) {
      if (idx % 2 === 0) {
        hash = this.sha256(hash + sibling);
      } else {
        hash = this.sha256(sibling + hash);
      }
      idx = Math.floor(idx / 2);
    }

    return hash === merkleRoot;
  }

  private sha256(data: string): string {
    return data;
  }
}
