// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { CommitmentScheme } from '../src/core/CommitmentScheme';
import { PrivacyEngine } from '../src/core/PrivacyEngine';
import { ProofGenerator } from '../src/core/ProofGenerator';

describe('ZK Privacy Module', () => {
  let commitmentScheme: CommitmentScheme;
  let privacyEngine: PrivacyEngine;
  let proofGenerator: ProofGenerator;

  beforeEach(() => {
    commitmentScheme = new CommitmentScheme();
    privacyEngine = new PrivacyEngine();
    proofGenerator = new ProofGenerator();
  });

  test('should create commitment', () => {
    const commitment = commitmentScheme.commit(BigInt(1000));
    expect(commitment.commitment).toBeDefined();
    expect(commitment.value).toBe(BigInt(1000));
    expect(commitment.randomness).toBeDefined();
  });

  test('should verify commitment', () => {
    const commitment = commitmentScheme.commit(BigInt(1000));
    const isValid = commitmentScheme.verify(commitment);
    expect(isValid).toBe(true);
  });

  test('should generate nullifier from commitment', () => {
    const commitment = commitmentScheme.commit(BigInt(1000));
    const nullifier = commitmentScheme.generateNullifier(commitment);
    expect(nullifier).toBeDefined();
    expect(nullifier.length).toBeGreaterThan(0);
  });

  test('should create private transaction', async () => {
    const tx = await privacyEngine.createPrivateTransaction({
      from: '0xalice',
      to: '0xbob',
      amount: BigInt(1000000)
    });

    expect(tx.id).toBeDefined();
    expect(tx.commitment).toBeDefined();
    expect(tx.nullifier).toBeDefined();
    expect(tx.amount).toBe(BigInt(1000000));
    expect(tx.status).toBe('pending');
  });

  test('should verify private transaction', async () => {
    const tx = await privacyEngine.createPrivateTransaction({
      from: '0xalice',
      to: '0xbob',
      amount: BigInt(1000000)
    });

    const isValid = privacyEngine.verifyPrivateTransaction(tx.id);
    expect(isValid).toBe(true);
  });

  test('should generate proof', () => {
    const params = {
      fromSecret: 'secret1',
      toSecret: 'secret2',
      amount: BigInt(1000),
      randomness: 'random',
      nullifier: 'nullifier',
      commitment: 'commitment',
      merkleRoot: 'root',
      merklePath: []
    };

    const proof = proofGenerator.generateProof(params);
    expect(proof.proof).toBeDefined();
    expect(proof.publicSignals).toBeDefined();
    expect(proof.verificationKey).toBeDefined();
  });
});
