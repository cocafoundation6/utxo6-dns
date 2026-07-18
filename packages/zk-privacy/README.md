# ZK-SNARKs Privacy Transaction Module

## Overview

This module integrates **zero-knowledge proofs (ZK-SNARKs)** into the UTXO-DNS ecosystem, enabling fully private transactions with:

- **Confidential Amounts** — Transaction amounts are hidden
- **Confidential Addresses** — Sender and receiver addresses are hidden
- **UTXO Ownership Proof** — Prove ownership without revealing the UTXO
- **Selective Disclosure** — Reveal only what is necessary for compliance

## Architecture

<img width="908" height="793" alt="image" src="https://github.com/user-attachments/assets/66a0448e-29dc-4f7b-b3cd-a96e2590a873" />


## Quick Start

```typescript
import { PrivacyEngine, ProofGenerator } from '@utxodns/zk-privacy';

const engine = new PrivacyEngine();
const generator = new ProofGenerator();

// Create a private transaction
const privateTx = await engine.createPrivateTransaction({
  from: '0x1234...',
  to: '0x5678...',
  amount: BigInt(1000000)
});

// Generate ZK proof
const proof = await generator.generateProof(privateTx);

// Verify the proof
const isValid = await generator.verifyProof(proof);

License
Apache 2.0
