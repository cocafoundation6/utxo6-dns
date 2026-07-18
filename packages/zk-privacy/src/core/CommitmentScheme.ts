// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { Commitment, PrivateUTXO } from '../types';
import { createHash, randomBytes } from 'crypto';

/**
 * Pedersen Commitment Scheme
 * Provides hiding and binding commitments for private transactions
 */
export class CommitmentScheme {
  private G: bigint;    // Generator point
  private H: bigint;    // Hiding generator

  constructor() {
    this.G = this.generateGenerator();
    this.H = this.generateGenerator();
  }

  /**
   * Create a Pedersen commitment: C = v*G + r*H
   */
  commit(value: bigint, randomness?: string): Commitment {
    const r = randomness || this.generateRandomness();
    const commitment = this.pedersenCommit(value, r);
    const txid = this.generateTxid(commitment);

    return {
      value,
      randomness: r,
      commitment,
      txid,
      vout: 0
    };
  }

  /**
   * Verify a commitment
   */
  verify(commitment: Commitment): boolean {
    const computed = this.pedersenCommit(commitment.value, commitment.randomness);
    return computed === commitment.commitment;
  }

  /**
   * Generate nullifier from commitment
   */
  generateNullifier(commitment: Commitment): string {
    const data = `${commitment.commitment}${commitment.randomness}`;
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate merkle tree from commitments
   */
  generateMerkleTree(commitments: Commitment[]): {
    root: string;
    paths: Map<string, string[]>;
  } {
    const leaves = commitments.map(c => c.commitment);
    const paths = new Map<string, string[]>();

    let currentLevel = leaves;
    const allLevels: string[][] = [currentLevel];

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = currentLevel[i] + currentLevel[i + 1];
          nextLevel.push(createHash('sha256').update(combined).digest('hex'));
        } else {
          nextLevel.push(currentLevel[i]);
        }
      }
      allLevels.push(nextLevel);
      currentLevel = nextLevel;
    }

    const root = currentLevel[0] || '';

    // Build paths for each leaf
    for (let i = 0; i < leaves.length; i++) {
      const path: string[] = [];
      let index = i;
      for (let level = 0; level < allLevels.length - 1; level++) {
        const siblingIndex = index % 2 === 0 ? index + 1 : index - 1;
        if (siblingIndex < allLevels[level].length) {
          path.push(allLevels[level][siblingIndex]);
        }
        index = Math.floor(index / 2);
      }
      paths.set(leaves[i], path);
    }

    return { root, paths };
  }

  /**
   * Verify merkle proof
   */
  verifyMerkleProof(
    leaf: string,
    root: string,
    path: string[]
  ): boolean {
    let current = leaf;
    for (const sibling of path) {
      const combined = current < sibling ? current + sibling : sibling + current;
      current = createHash('sha256').update(combined).digest('hex');
    }
    return current === root;
  }

  private pedersenCommit(value: bigint, randomness: string): string {
    const data = `${value.toString(16)}${randomness}`;
    return createHash('sha256').update(data).digest('hex');
  }

  private generateRandomness(): string {
    return randomBytes(32).toString('hex');
  }

  private generateTxid(commitment: string): string {
    return '0x' + createHash('sha256').update(commitment).digest('hex').slice(0, 64);
  }

  private generateGenerator(): bigint {
    return BigInt('0x' + randomBytes(32).toString('hex'));
  }
}
