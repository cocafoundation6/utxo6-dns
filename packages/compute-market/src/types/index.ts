
```typescript
// packages/compute-market/src/types/index.ts
// Author: J. Tian (uw2icg-core)

/**
 * Compute Power RWA Asset Type
 */
export interface ComputeRWA {
  id: string;
  type: 'GPU' | 'CPU' | 'TPU' | 'FPGA';
  spec: {
    model: string;        // A100, H100, RTX4090
    vRAM: number;         // GB
    cores: number;
    bandwidth: number;    // GB/s
    tflops: number;       // Compute power in TFLOPS
  };
  provider: string;       // provider.utxo
  totalUnits: number;     // Divisible total quantity (hours)
  availableUnits: number;
  pricePerUnit: number;   // JMS/hour
  utilizationRate: number;
  proofOfCompute: string;
  status: 'active' | 'leased' | 'maintenance' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data UTXO Asset Type
 */
export interface DataUTXO {
  id: string;
  owner: string;           // Owner .utxo
  type: 'conversation' | 'training' | 'fine_tune' | 'embedding';
  qualityScore: number;    // 0-100
  volume: number;          // Token count
  domain: string;          // Domain tag
  privacyLevel: 'public' | 'anonymized' | 'private';
  hash: string;            // Content hash
  pricePerToken: number;   // JMS per 1K tokens
  totalEarned: number;     // Accumulated income
  status: 'available' | 'licensed' | 'expired';
  createdAt: Date;
}

/**
 * Compute Power Lease Order
 */
export interface ComputeLease {
  id: string;
  assetId: string;
  renter: string;          // Lessee .utxo
  units: number;
  duration: number;        // Hours
  totalPrice: number;      // JMS
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime: Date;
  endTime: Date;
  containerId?: string;
  proofOfExecution?: string;
}

/**
 * Data License Contract
 */
export interface DataLicense {
  id: string;
  dataId: string;
  licensor: string;        // Licensor .utxo
  licensee: string;        // Licensee .utxo
  purpose: 'training' | 'fine_tune' | 'embedding' | 'research';
  price: number;           // JMS
  duration: number;        // Days
  status: 'pending' | 'active' | 'expired' | 'revoked';
  accessKey?: string;
  createdAt: Date;
}

/**
 * AI Service Provider Registration
 */
export interface AIProvider {
  id: string;
  name: string;
  endpoint: string;
  models: ModelInfo[];
  pricing: {
    input: number;         // JMS per 1K tokens (input)
    output: number;        // JMS per 1K tokens (output)
  };
  utxoDomain: string;      // provider.utxo
  vlei: string;            // vLEI certificate
  reputation: number;      // 0-100
  status: 'active' | 'degraded' | 'maintenance' | 'suspended';
}

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  contextWindow: number;
  capabilities: string[];
}

/**
 * Fair Value Price
 */
export interface FairValue {
  assetId: string;
  assetType: 'compute' | 'data' | 'model';
  price: number;           // JMS
  source: string;          // Price source
  confidence: number;      // 0-1
  timestamp: Date;
}
```

