// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { ZKProof, ProofVerificationResult } from '../types';
import { ProofGenerator } from './ProofGenerator';

/**
 * ZK Proof Verifier
 * Verifies zero-knowledge proofs with on-chain/off-chain support
 */
export class ProofVerifier {
  private generator: ProofGenerator;
  private verifiedProofs: Map<string, boolean> = new Map();

  constructor() {
    this.generator = new ProofGenerator();
  }

  /**
   * Verify a proof
   */
  verify(proof: ZKProof): ProofVerificationResult {
    // Check cache
    const cacheKey = this.getCacheKey(proof);
    if (this.verifiedProofs.has(cacheKey)) {
      return {
        valid: this.verifiedProofs.get(cacheKey)!,
        publicSignals: {
          commitment: '0x' + Buffer.from(proof.publicSignals).toString('hex').slice(0, 32),
          nullifier: '0x' + Buffer.from(proof.publicSignals).toString('hex').slice(32, 64),
          merkleRoot: '0x' + Buffer.from(proof.publicSignals).toString('hex').slice(64, 96)
        }
      };
    }

    const result = this.generator.verifyProof(proof);
    this.verifiedProofs.set(cacheKey, result.valid);

    return result;
  }

  /**
   * Batch verify proofs
   */
  verifyBatch(proofs: ZKProof[]): {
    results: ProofVerificationResult[];
    allValid: boolean;
  } {
    const results = proofs.map(p => this.verify(p));
    const allValid = results.every(r => r.valid);

    return { results, allValid };
  }

  /**
   * Verify proof with on-chain data
   */
  verifyOnChain(
    proof: ZKProof,
    onChainData: {
      merkleRoot: string;
      nullifierSet: string[];
    }
  ): ProofVerificationResult {
    const result = this.verify(proof);

    if (!result.valid) return result;

    // Verify merkle root matches
    if (result.publicSignals && result.publicSignals.merkleRoot !== onChainData.merkleRoot) {
      return {
        valid: false,
        error: 'Merkle root mismatch'
      };
    }

    // Verify nullifier not used
    if (result.publicSignals) {
      const nullifier = result.publicSignals.nullifier;
      if (onChainData.nullifierSet.includes(nullifier)) {
        return {
          valid: false,
          error: 'Nullifier already used (double spend detected)'
        };
      }
    }

    return result;
  }

  /**
   * Clear verification cache
   */
  clearCache(): void {
    this.verifiedProofs.clear();
  }

  /**
   * Get verification statistics
   */
  getStats(): {
    totalVerifications: number;
    validVerifications: number;
    invalidVerifications: number;
  } {
    let valid = 0;
    let invalid = 0;

    for (const [_, value] of this.verifiedProofs) {
      if (value) valid++;
      else invalid++;
    }

    return {
      totalVerifications: this.verifiedProofs.size,
      validVerifications: valid,
      invalidVerifications: invalid
    };
  }

  private getCacheKey(proof: ZKProof): string {
    const data = JSON.stringify({
      proof: Buffer.from(proof.proof).toString('hex'),
      publicSignals: Buffer.from(proof.publicSignals).toString('hex'),
      verificationKey: proof.verificationKey
    });
    return createHash('sha256').update(data).digest('hex');
  }
}

import { createHash } from 'crypto';
