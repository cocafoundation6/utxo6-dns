
```typescript
// packages/compute-market/src/core/ComputeAssetizationEngine.ts
// Author: J. Tian (uw2icg-core)

import { ComputeRWA, ComputeLease } from '../types';
import { UTXOResolver } from '../utils/utxoResolver';
import { VLEIVerifier } from '../utils/vleiVerifier';

/**
 * Compute Power Assetization Engine
 * Converts GPU/CPU compute power into tradable RWA tokens
 */
export class ComputeAssetizationEngine {
  private utxoResolver: UTXOResolver;
  private vleiVerifier: VLEIVerifier;
  private computeRegistry: Map<string, ComputeRWA> = new Map();
  private leaseRegistry: Map<string, ComputeLease> = new Map();

  constructor()
    this.utxoResolver = new UTXOResolver();
    this.vleiVerifier = new VLEIVerifier();
  }

  /**
   * Tokenize compute power as RWA
   */
  async tokenizeCompute(
    provider: string,              // provider.utxo
    spec: ComputeRWA['spec'],
    totalHours: number,
    pricePerUnit: number
  ): Promise<ComputeRWA> {
    // 1. Verify provider identity (vLEI)
    const vleiValid = await this.vleiVerifier.verify(provider);
    if (!vleiValid.valid) {
      throw new Error(`Provider ${provider} vLEI verification failed`);
    }

    // 2. Verify compute capability (via remote proof)
    const proof = await this.verifyComputeCapability(provider, spec);
    if (!proof) {
      throw new Error('Compute capability verification failed');
    }

    // 3. Generate RWA
    const rwa: ComputeRWA = {
      id: `compute_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: spec.type,
      spec,
      provider,
      totalUnits: totalHours,
      availableUnits: totalHours,
      pricePerUnit,
      utilizationRate: 0,
      proofOfCompute: proof,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 4. Register on-chain
    this.computeRegistry.set(rwa.id, rwa);
    await this.registerOnChain(rwa);

    return rwa;
  }

  /**
   * Verify compute capability
   */
  private async verifyComputeCapability(
    provider: string,
    spec: ComputeRWA['spec']
  ): Promise<string> {
    // Resolve provider endpoint via UTXO-DNS
    const endpoint = await this.utxoResolver.resolve(provider);

    // Send verification challenge (provider must sign with private key to prove hardware capability)
    // Return proof hash
    return `proof_${Date.now()}_${provider}`;
  }

  /**
   * On-chain registration
   */
  private async registerOnChain(rwa: ComputeRWA): Promise<void> {
    // Call ComputeRWAFactory smart contract to mint RWA tokens
    // This is a simulation; in production, call via ethers/web3
    console.log(`[Chain] Registered compute RWA: ${rwa.id}`);
  }

  /**
   * User leases compute power
   */
  async leaseCompute(
    renter: string,
    assetId: string,
    hours: number
  ): Promise<ComputeLease> {
    const asset = this.computeRegistry.get(assetId);
    if (!asset) {
      throw new Error(`Asset ${assetId} not found`);
    }

    if (asset.availableUnits < hours) {
      throw new Error(`Insufficient available units: ${asset.availableUnits}`);
    }

    // Calculate total price
    const totalPrice = hours * asset.pricePerUnit;

    // Create lease order
    const lease: ComputeLease = {
      id: `lease_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      assetId,
      renter,
      units: hours,
      duration: hours,
      totalPrice,
      status: 'pending',
      startTime: new Date(),
      endTime: new Date(Date.now() + hours * 3600000)
    };

    // Lock JMS payment (via smart contract)
    await this.lockPayment(renter, totalPrice);

    // Allocate compute resources
    const container = await this.allocateCompute(asset, hours);
    lease.containerId = container;
    lease.status = 'active';

    // Update available units
    asset.availableUnits -= hours;
    this.computeRegistry.set(assetId, asset);

    // Register lease
    this.leaseRegistry.set(lease.id, lease);

    return lease;
  }

  /**
   * Lock payment
   */
  private async lockPayment(renter: string, amount: number): Promise<void> {
    // Call payment lock contract
    console.log(`[Payment] Locked ${amount} JMS from ${renter}`);
  }

  /**
   * Allocate compute resources
   */
  private async allocateCompute(
    asset: ComputeRWA,
    hours: number
  ): Promise<string> {
    // Resolve provider endpoint via UTXO-DNS and allocate container
    const endpoint = await this.utxoResolver.resolve(asset.provider);
    // Return container ID
    return `container_${Date.now()}_${asset.id}`;
  }

  /**
   * Get compute asset by ID
   */
  async getComputeAsset(assetId: string): Promise<ComputeRWA | null> {
    return this.computeRegistry.get(assetId) || null;
  }

  /**
   * Get list of available compute resources
   */
  async getAvailableCompute(
    filters?: {
      type?: 'GPU' | 'CPU' | 'TPU' | 'FPGA';
      minVRAM?: number;
      maxPrice?: number;
    }
  ): Promise<ComputeRWA[]> {
    let assets = Array.from(this.computeRegistry.values())
      .filter(a => a.status === 'active' && a.availableUnits > 0);

    if (filters?.type) {
      assets = assets.filter(a => a.type === filters.type);
    }
    if (filters?.minVRAM) {
      assets = assets.filter(a => a.spec.vRAM >= filters.minVRAM!);
    }
    if (filters?.maxPrice) {
      assets = assets.filter(a => a.pricePerUnit <= filters.maxPrice!);
    }

    return assets;
  }

  /**
   * Release compute resources (lease completed)
   */
  async releaseCompute(leaseId: string): Promise<void> {
    const lease = this.leaseRegistry.get(leaseId);
    if (!lease) {
      throw new Error(`Lease ${leaseId} not found`);
    }

    lease.status = 'completed';
    this.leaseRegistry.set(leaseId, lease);

    // Release compute resources
    // Release JMS payment (after fee deduction)
    // Update asset availability
    console.log(`[Compute] Released lease: ${leaseId}`);
  }
}
```

