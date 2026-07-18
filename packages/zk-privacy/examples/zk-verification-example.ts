// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { ProofGenerator } from '../src/core/ProofGenerator';
import { ProofVerifier } from '../src/core/ProofVerifier';
import { randomBytes } from 'crypto';

async function main() {
  console.log('=== ZK Proof Verification Example ===\n');

  const generator = new ProofGenerator();
  const verifier = new ProofVerifier();

  // 1. Generate a proof
  console.log('1. Generating ZK proof...');
  const params = {
    fromSecret: randomBytes(32).toString('hex'),
    toSecret: randomBytes(32).toString('hex'),
    amount: BigInt(1000000),
    randomness: randomBytes(32).toString('hex'),
    nullifier: '0x' + randomBytes(32).toString('hex'),
    commitment: '0x' + randomBytes(32).toString('hex'),
    merkleRoot: '0x' + randomBytes(32).toString('hex'),
    merklePath: []
  };

  const proof = generator.generateProof(params);
  console.log('   Proof generated');
  console.log('   Verification key:', proof.verificationKey);

  // 2. Verify the proof
  console.log('\n2. Verifying proof...');
  const result = verifier.verify(proof);
  console.log('   Valid:', result.valid);
  if (result.valid) {
    console.log('   Commitment:', result.publicSignals?.commitment);
    console.log('   Nullifier:', result.publicSignals?.nullifier);
    console.log('   Merkle Root:', result.publicSignals?.merkleRoot);
  }

  // 3. Batch verification
  console.log('\n3. Batch verification...');
  const proofs = [
    generator.generateProof({ ...params, amount: BigInt(500000) }),
    generator.generateProof({ ...params, amount: BigInt(250000) })
  ];
  const batchResult = verifier.verifyBatch(proofs);
  console.log(`   All valid: ${batchResult.allValid}`);
  console.log(`   Results: ${batchResult.results.map(r => r.valid).join(', ')}`);

  // 4. Verification stats
  console.log('\n4. Verification stats:');
  const stats = verifier.getStats();
  console.log(`   Total verifications: ${stats.totalVerifications}`);
  console.log(`   Valid: ${stats.validVerifications}`);
  console.log(`   Invalid: ${stats.invalidVerifications}`);

  console.log('\n✅ ZK verification completed successfully!');
}

main().catch(console.error);
