// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * Private Transaction
 */
export interface PrivateTransaction {
  id: string;
  commitment: string;          // Pedersen commitment
  nullifier: string;           // Nullifier to prevent double spending
  from: string;                // Encrypted sender
  to: string;                  // Encrypted receiver
  amount: bigint;              // Encrypted amount
  timestamp: number;
  proof: ZKProof;
  status: 'pending' | 'confirmed' | 'spent';
}

/**
 * ZK Proof
 */
export interface ZKProof {
  proof: Uint8Array;           // zk-SNARK proof
  publicSignals: Uint8Array;   // Public inputs
  verificationKey: string;     // Verification key hash
  timestamp: number;
}

/**
 * Commitment
 */
export interface Commitment {
  value: bigint;
  randomness: string;
  commitment: string;
  txid: string;
  vout: number;
}

/**
 * Private UTXO
 */
export interface PrivateUTXO {
  id: string;
  commitment: string;
  nullifier: string;
  amount: bigint;
  owner: string;               // Encrypted owner
  spent: boolean;
  createdAt: number;
  spentAt?: number;
}

/**
 * Privacy Pool
 */
export interface PrivacyPool {
  id: string;
  commitments: Commitment[];
  nullifiers: string[];
  transactions: PrivateTransaction[];
  totalLocked: bigint;
  createdAt: number;
  updatedAt: number;
}

/**
 * ZK Proof Generation Parameters
 */
export interface ProofGenerationParams {
  fromSecret: string;
  toSecret: string;
  amount: bigint;
  randomness: string;
  nullifier: string;
  commitment: string;
  merkleRoot: string;
  merklePath: string[];
}

/**
 * ZK Proof Verification Result
 */
export interface ProofVerificationResult {
  valid: boolean;
  publicSignals?: {
    commitment: string;
    nullifier: string;
    merkleRoot: string;
  };
  error?: string;
}

/**
 * Privacy Configuration
 */
export interface PrivacyConfig {
  curveType: 'bn128' | 'bls12_381';
  commitmentType: 'pedersen' | 'sha256';
  proofType: 'groth16' | 'plonk';
  merkleDepth: number;
  maxTransactionAmount: bigint;
  minConfirmation: number;
}
