import { TradeProfileManager } from '../src/core/TradeProfileManager';

describe('TradeProfileManager', () => {
  let manager: TradeProfileManager;

  beforeEach(() => {
    manager = new TradeProfileManager();
  });

  test('should register a trade profile', async () => {
    const profile = await manager.registerProfile({
      domain: 'example-corp.utxo',
      legalName: 'Example Corporation Ltd.',
      vlei: 'did:vlei:example-corp',
      tradeCredentials: {
        businessLicense: '0x1234',
        taxId: 'TIN-123456',
        certifications: ['ISO9001']
      },
      complianceStatus: {
        kycVerified: true,
        amlScreened: true,
        sanctionListChecked: false
      }
    });

    expect(profile.domain).toBe('example-corp.utxo');
    expect(profile.isActive).toBe(true);
    expect(profile.trustScore).toBeGreaterThan(0);
  });

  test('should verify a counterparty', async () => {
    await manager.registerProfile({
      domain: 'counterparty.utxo',
      legalName: 'Counterparty Ltd.',
      vlei: 'did:vlei:counterparty',
      tradeCredentials: {},
      complianceStatus: {
        kycVerified: true,
        amlScreened: true,
        sanctionListChecked: true
      }
    });

    const result = await manager.verifyCounterparty('counterparty.utxo');
    expect(result.domain).toBe('counterparty.utxo');
    expect(result.recommendation).toBe('APPROVE');
  });
});
