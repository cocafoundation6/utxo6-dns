import { TradeProfileManager } from '../src/core/TradeProfileManager';

async function main() {
  const manager = new TradeProfileManager();

  // Register a trade profile
  const profile = await manager.registerProfile({
    domain: 'example-corp.utxo',
    legalName: 'Example Corporation Ltd.',
    vlei: 'did:vlei:example-corp',
    tradeCredentials: {
      businessLicense: '0x1234...',
      taxId: 'TIN-123456',
      certifications: ['ISO9001', 'ISO27001']
    },
    complianceStatus: {
      kycVerified: true,
      amlScreened: true,
      sanctionListChecked: false
    }
  });

  console.log('Profile registered:', profile);

  // Verify counterparty
  const verification = await manager.verifyCounterparty('partner.utxo');
  console.log('Verification result:', verification);

  // Check recommendation
  if (verification.recommendation === 'APPROVE') {
    console.log('Proceed with transaction');
  } else if (verification.recommendation === 'REVIEW') {
    console.log('Flag for manual review');
  } else {
    console.log('Block transaction');
  }
}

main().catch(console.error);
