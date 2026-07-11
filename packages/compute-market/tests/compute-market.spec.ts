
```typescript
// packages/compute-market/tests/compute-market.spec.ts
// Author: J. Tian (uw2icg-core)

import { ComputeAssetizationEngine } from '../src/core/ComputeAssetizationEngine';
import { DataMarketplace } from '../src/core/DataMarketplace';
import { AIServiceAggregator } from '../src/core/AIServiceAggregator';
import { ComputeTradingEngine } from '../src/core/ComputeTradingEngine';

describe('CoCaDEX-RWA Compute Power Configuration Center', () => {
  let computeEngine: ComputeAssetizationEngine;
  let dataMarket: DataMarketplace;
  let aggregator: AIServiceAggregator;
  let tradingEngine: ComputeTradingEngine;

  beforeEach(() => {
    computeEngine = new ComputeAssetizationEngine();
    dataMarket = new DataMarketplace();
    aggregator = new AIServiceAggregator();
    tradingEngine = new ComputeTradingEngine();
  });

  test('Compute assetization: GPU can be registered as RWA', async () => {
    const rwa = await computeEngine.tokenizeCompute(
      'provider.utxo',
      { type: 'GPU', model: 'A100', vRAM: 80, cores: 6912, bandwidth: 900, tflops: 312 },
      1000,
      0.05
    );

    expect(rwa.id).toBeDefined();
    expect(rwa.status).toBe('active');
    expect(rwa.availableUnits).toBe(1000);
  });

  test('Data UTXO: Conversations can create data assets', async () => {
    const utxo = await dataMarket.createDataUTXO(
      'alice.utxo',
      'What is the meaning of life?',
      'philosophy',
      'anonymized'
    );

    expect(utxo.id).toBeDefined();
    expect(utxo.owner).toBe('alice.utxo');
    expect(utxo.qualityScore).toBeGreaterThan(0);
  });

  test('AI aggregation: can select optimal service provider', async () => {
    const result = await aggregator.routeQuery({
      user: 'alice.utxo',
      query: 'Explain quantum computing',
      maxCost: 0.1
    });

    expect(result.provider).toBeDefined();
    expect(result.result).toBeDefined();
  });

  test('Compute trading: users can lease compute power', async () => {
    // First register compute power
    const rwa = await computeEngine.tokenizeCompute(
      'provider.utxo',
      { type: 'GPU', model: 'A100', vRAM: 80, cores: 6912, bandwidth: 900, tflops: 312 },
      1000,
      0.05
    );

    // Lease compute power
    const result = await tradingEngine.buyCompute({
      user: 'alice.utxo',
      assetId: rwa.id,
      units: 10,
      paymentMethod: 'JMS'
    });

    expect(result.lease.id).toBeDefined();
    expect(result.cost).toBeGreaterThan(0);
  });

  test('Data licensing: users can license data', async () => {
    // Create data
    const utxo = await dataMarket.createDataUTXO(
      'alice.utxo',
      'Training data for LLM',
      'technical',
      'anonymized'
    );

    // License transaction
    const result = await tradingEngine.tradeDataLicense({
      licensor: 'alice.utxo',
      licensee: 'trainer.utxo',
      dataId: utxo.id,
      price: 100,
      purpose: 'training'
    });

    expect(result.license.id).toBeDefined();
    expect(result.license.status).toBe('active');
  });
});
```
