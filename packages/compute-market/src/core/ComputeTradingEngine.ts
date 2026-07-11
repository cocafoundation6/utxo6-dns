
```typescript
// packages/compute-market/src/core/ComputeTradingEngine.ts
// Author: J. Tian (uw2icg-core)

import { ComputeRWA, ComputeLease, DataLicense, FairValue } from '../types';
import { ComputeAssetizationEngine } from './ComputeAssetizationEngine';
import { DataMarketplace } from './DataMarketplace';
import { FilterAndPricingEngine } from './FilterAndPricingEngine'

/**
 * CoCaDEX Trading Side Core Engine
 * Handles: users purchasing compute power, AI service providers leasing compute power, data license trading
 */
export class ComputeTradingEngine {
  private computeEngine: ComputeAssetizationEngine;
  private dataMarketplace: DataMarketplace;
  private pricingEngine: FilterAndPricingEngine;

  constructor() {
    this.computeEngine = new ComputeAssetizationEngine();
    this.dataMarketplace = new DataMarketplace();
    this.pricingEngine = new FilterAndPricingEngine();
  }

  /**
   * User purchases compute power
   */
  async buyCompute(params: {
    user: string;
    assetId: string;
    units: number;
    paymentMethod: 'JMS' | 'USDC' | 'BTC';
  }): Promise<{
    lease: ComputeLease;
    cost: number;
    receipt: string;
  }> {
    // 1. Get asset details
    const asset = await this.computeEngine.getComputeAsset(params.assetId);
    if (!asset) {
      throw new Error(`Asset ${params.assetId} not found`);
    }

    // 2. Get fair price
    const fairValue = await this.pricingEngine.getComputeFairValue(
      params.assetId,
      asset.spec
    );

    // 3. Execute lease
    const lease = await this.computeEngine.leaseCompute(
      params.user,
      params.assetId,
      params.units
    );

    // 4. Generate receipt
    const receipt = this.generateReceipt(lease, fairValue);

    return {
      lease,
      cost: lease.totalPrice,
      receipt
    };
  }

  /**
   * AI service provider bulk leases compute power
   */
  async bulkLeaseCompute(params: {
    provider: string;
    requirements: {
      type: 'GPU' | 'CPU' | 'TPU' | 'FPGA';
      minVRAM?: number;
      maxPrice?: number;
      totalHours: number;
    };
  }): Promise<{
    leases: ComputeLease[];
    totalCost: number;
    allocation: string;
  }> {
    // 1. Search available compute power
    const available = await this.computeEngine.getAvailableCompute({
      type: params.requirements.type,
      minVRAM: params.requirements.minVRAM,
      maxPrice: params.requirements.maxPrice
    });

    if (available.length === 0) {
      throw new Error('No matching compute resources available');
    }

    // 2. Optimal matching (price priority)
    const sorted = available.sort((a, b) => a.pricePerUnit - b.pricePerUnit);

    // 3. Allocate leases
    const leases: ComputeLease[] = [];
    let remainingHours = params.requirements.totalHours;
    let totalCost = 0;

    for (const asset of sorted) {
      if (remainingHours <= 0) break;

      const hours = Math.min(remainingHours, asset.availableUnits);
      const lease = await this.computeEngine.leaseCompute(
        params.provider,
        asset.id,
        hours
      );

      leases.push(lease);
      totalCost += lease.totalPrice;
      remainingHours -= hours;
    }

    if (remainingHours > 0) {
      throw new Error(`Only ${params.requirements.totalHours - remainingHours} hours matched`);
    }

    return {
      leases,
      totalCost,
      allocation: this.generateAllocation(leases)
    };
  }

  /**
   * Data license trading
   */
  async tradeDataLicense(params: {
    licensor: string;
    licensee: string;
    dataId: string;
    price: number;
    purpose: DataLicense['purpose'];
  }): Promise<{
    license: DataLicense;
    transactionId: string;
  }> {
    // 1. Validate data
    const data = (await this.dataMarketplace.getUserDataAssets(params.licensor))
      .find(d => d.id === params.dataId);

    if (!data) {
      throw new Error(`Data ${params.dataId} not found`);
    }

    // 2. Publish license
    const license = await this.dataMarketplace.publishDataLicense(
      params.dataId,
      params.price,
      params.purpose
    );

    // 3. Execute activation
    const activated = await this.dataMarketplace.requestDataLicense(
      params.licensee,
      license.id
    );

    // 4. Record transaction
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    return {
      license: activated,
      transactionId
    };
  }

  /**
   * Get market data
   */
  async getMarketData(): Promise<{
    compute: {
      averagePrice: number;
      totalSupply: number;
      utilizationRate: number;
      topProviders: Array<{ provider: string; supply: number; price: number }>;
    };
    data: {
      totalListings: number;
      averagePrice: number;
      topDomains: Array<{ domain: string; count: number; avgQuality: number }>;
    };
  }> {
    // Compute market statistics
    const computeAssets = await this.computeEngine.getAvailableCompute({});
    const totalSupply = computeAssets.reduce((sum, a) => sum + a.totalUnits, 0);
    const avgPrice = computeAssets.reduce((sum, a) => sum + a.pricePerUnit, 0) / (computeAssets.length || 1);

    // Aggregate by provider
    const providerMap = new Map<string, { supply: number; totalPrice: number; count: number }>();
    for (const asset of computeAssets) {
      const existing = providerMap.get(asset.provider) || { supply: 0, totalPrice: 0, count: 0 };
      existing.supply += asset.totalUnits;
      existing.totalPrice += asset.pricePerUnit;
      existing.count++;
      providerMap.set(asset.provider, existing);
    }

    const topProviders = Array.from(providerMap.entries())
      .map(([provider, data]) => ({
        provider,
        supply: data.supply,
        price: data.totalPrice / data.count
      }))
      .sort((a, b) => b.supply - a.supply)
      .slice(0, 5);

    // Data market statistics
    const allData = await this.dataMarketplace.searchData({});
    const domainStats = new Map<string, { count: number; totalQuality: number }>();
    for (const data of allData) {
      const existing = domainStats.get(data.domain) || { count: 0, totalQuality: 0 };
      existing.count++;
      existing.totalQuality += data.qualityScore;
      domainStats.set(data.domain, existing);
    }

    const topDomains = Array.from(domainStats.entries())
      .map(([domain, stats]) => ({
        domain,
        count: stats.count,
        avgQuality: stats.totalQuality / stats.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      compute: {
        averagePrice: avgPrice,
        totalSupply,
        utilizationRate: 0.65,
        topProviders
      },
      data: {
        totalListings: allData.length,
        averagePrice: allData.reduce((sum, d) => sum + d.pricePerToken, 0) / (allData.length || 1),
        topDomains
      }
    };
  }

  private generateReceipt(lease: ComputeLease, fairValue: FairValue): string {
    return `receipt_${lease.id}_${Date.now()}`;
  }

  private generateAllocation(leases: ComputeLease[]): string {
    return `allocation_${leases.map(l => l.id).join('_')}`;
  }
}
```

