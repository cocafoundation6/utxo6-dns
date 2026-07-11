

```typescript
// packages/compute-market/src/core/DataMarketplace.ts
// Author: J. Tian (uw2icg-core)

import { DataUTXO, DataLicense } from '../types';
import { UTXOResolver } from '../utils/utxoResolver';
import { ZKProof } from '../utils/zkProof';

/**
 * Data Authorization Trading Market
 * Manages authorization and trading of user conversation data UTXOs
 */
export class DataMarketplace {
  private utxoResolver: UTXOResolver;
  private zkProof: ZKProof;
  private dataRegistry: Map<string, DataUTXO> = new Map();
  private licenseRegistry: Map<string, DataLicense> = new Map();

  constructor() {
    this.utxoResolver = new UTXOResolver();
    this.zkProof = new ZKProof();
  }

  /**
   * User creates a Data UTXO (automatically generated for each AI conversation)
   */
  async createDataUTXO(
    owner: string,                    // owner.utxo
    conversation: string,
    domain: string,
    privacyLevel: DataUTXO['privacyLevel']
  ): Promise<DataUTXO> {
    // 1. Compute content hash
    const hash = this.hashContent(conversation);

    // 2. AI quality score
    const qualityScore = await this.assessQuality(conversation);

    // 3. Generate Data UTXO
    const dataUTXO: DataUTXO = {
      id: `data_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      owner,
      type: 'conversation',
      qualityScore,
      volume: this.countTokens(conversation),
      domain,
      privacyLevel,
      hash,
      pricePerToken: this.calculatePrice(qualityScore, domain),
      totalEarned: 0,
      status: 'available',
      createdAt: new Date()
    };

    this.dataRegistry.set(dataUTXO.id, dataUTXO);
    await this.registerDataOnChain(dataUTXO);

    return dataUTXO;
  }

  /**
   * AI quality score assessment
   */
  private async assessQuality(content: string): Promise<number> {
    // Call multiple base models to evaluate quality
    // Returns a score of 0-100
    return Math.min(100, Math.max(0,
      content.length / 10 +
      Math.random() * 20
    ));
  }

  /**
   * Calculate token price
   */
  private calculatePrice(quality: number, domain: string): number {
    // Base price + quality premium + domain premium
    const basePrice = 0.001;           // JMS per 1K tokens
    const qualityPremium = quality / 100 * 0.002;
    const domainPremium = this.getDomainPremium(domain);
    return basePrice + qualityPremium + domainPremium;
  }

  private getDomainPremium(domain: string): number {
    const premiums: Record<string, number> = {
      'medical': 0.005,
      'legal': 0.004,
      'finance': 0.003,
      'technical': 0.002,
      'general': 0.001
    };
    return premiums[domain] || 0.001;
  }

  /**
   * User publishes a data license
   */
  async publishDataLicense(
    dataId: string,
    price: number,
    purpose: DataLicense['purpose']
  ): Promise<DataLicense> {
    const data = this.dataRegistry.get(dataId);
    if (!data) {
      throw new Error(`Data ${dataId} not found`);
    }
    if (data.owner !== data.owner) {
      throw new Error('Only the owner can publish a license');
    }

    const license: DataLicense = {
      id: `license_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      dataId,
      licensor: data.owner,
      licensee: '',           // To be filled upon activation
      purpose,
      price,
      duration: 30,           // Default 30 days
      status: 'pending',
      createdAt: new Date()
    };

    this.licenseRegistry.set(license.id, license);
    return license;
  }

  /**
   * Request a data license
   */
  async requestDataLicense(
    licensee: string,
    licenseId: string
  ): Promise<DataLicense> {
    const license = this.licenseRegistry.get(licenseId);
    if (!license) {
      throw new Error(`License ${licenseId} not found`);
    }

    // 1. Verify licensee identity (vLEI)
    const vleiValid = await this.validateLicensee(licensee);
    if (!vleiValid) {
      throw new Error(`Licensee ${licensee} verification failed`);
    }

    // 2. Lock payment
    await this.lockPayment(licensee, license.price);

    // 3. Generate access key (zero-knowledge proof)
    const accessKey = await this.zkProof.generateAccessKey(
      license.dataId,
      licensee
    );

    // 4. Activate license
    license.licensee = licensee;
    license.status = 'active';
    license.accessKey = accessKey;
    this.licenseRegistry.set(licenseId, license);

    return license;
  }

  /**
   * Get user data assets
   */
  async getUserDataAssets(owner: string): Promise<DataUTXO[]> {
    return Array.from(this.dataRegistry.values())
      .filter(d => d.owner === owner && d.status === 'available');
  }

  /**
   * Search available data
   */
  async searchData(params: {
    domain?: string;
    minQuality?: number;
    maxPrice?: number;
  }): Promise<DataUTXO[]> {
    let results = Array.from(this.dataRegistry.values())
      .filter(d => d.status === 'available');

    if (params.domain) {
      results = results.filter(d => d.domain === params.domain);
    }
    if (params.minQuality) {
      results = results.filter(d => d.qualityScore >= params.minQuality!);
    }
    if (params.maxPrice) {
      results = results.filter(d => d.pricePerToken <= params.maxPrice!);
    }

    return results;
  }

  /**
   * User revokes a license
   */
  async revokeLicense(licenseId: string): Promise<void> {
    const license = this.licenseRegistry.get(licenseId);
    if (!license) {
      throw new Error(`License ${licenseId} not found`);
    }

    license.status = 'revoked';
    this.licenseRegistry.set(licenseId, license);
  }

  private async registerDataOnChain(data: DataUTXO): Promise<void> {
    // Call data registration contract
    console.log(`[Chain] Registered data UTXO: ${data.id}`);
  }

  private async validateLicensee(licensee: string): Promise<boolean> {
    // Verify via vLEI
    return true;
  }

  private async lockPayment(licensee: string, amount: number): Promise<void> {
    console.log(`[Payment] Locked ${amount} JMS from ${licensee}`);
  }

  private hashContent(content: string): string {
    // Simplified hashing
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content.charCodeAt(i);
      hash = hash & hash;
    }
    return `0x${hash.toString(16).padStart(64, '0')}`;
  }

  private countTokens(content: string): number {
    // Rough estimate
    return Math.ceil(content.length / 4);
  }
}
```
