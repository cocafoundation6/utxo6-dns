// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { EVMAdapter } from '../packages/evm/src/EVMAdapter';
import { UTXOExplorer } from '../packages/explorer/src/UTXOExplorer';
import {
  BISLedgerClient,
  CrossJurisdictionSwap,
  ComplianceAnchorManager,
  BISParticipantType
} from '../packages/bis-integration/src';

async function main() {
  console.log('=== Cross-Jurisdiction Swap Example ===\n');

  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const explorer = new UTXOExplorer(utxoManager);

  const ledgerClient = new BISLedgerClient(utxoManager, evmAdapter, explorer);
  const swapEngine = new CrossJurisdictionSwap(ledgerClient);
  const complianceManager = new ComplianceAnchorManager();

  // 1. Register Participant
  console.log('1. Registering participants...');
  const hkBank = await ledgerClient.registerParticipant(
    'hkbank.utxo',
    'Hong Kong Bank',
    BISParticipantType.COMMERCIAL_BANK,
    'HK'
  );
  const ukBank = await ledgerClient.registerParticipant(
    'ukbank.utxo',
    'UK Bank',
    BISParticipantType.COMMERCIAL_BANK,
    'UK'
  );

  // 2. Create Compliance Anchor Point
  console.log('\n2. Creating compliance anchors...');
  const hkAnchor = await complianceManager.createAnchor(hkBank, 'HKMA');
  const ukAnchor = await complianceManager.createAnchor(ukBank, 'FCA');

  console.log('Anchors created:', hkAnchor.id, ukAnchor.id);

  // 3. Register Assets
  console.log('\n3. Registering assets...');
  const hkda = await ledgerClient.registerAsset(
    'hkda.issuer.utxo',
    'stablecoin',
    'HKDA',
    'Hong Kong Dollar Stablecoin',
    'HK'
  );
  const usdc = await ledgerClient.registerAsset(
    'circle.utxo',
    'stablecoin',
    'USDC',
    'USD Circle',
    'US'
  );

  // 4. Register Assets
  console.log('\n4. Initiating cross-jurisdiction swap...');
  const swap = await swapEngine.initiateSwap({
    fromJurisdiction: 'HK',
    toJurisdiction: 'UK',
    fromParticipant: 'hkbank.utxo',
    toParticipant: 'ukbank.utxo',
    fromAmount: BigInt(1000000),
    toAmount: BigInt(128000), // 按汇率计算
    fromAssetId: hkda.id,
    toAssetId: usdc.id,
    exchangeRate: 0.128
  });

  console.log('Swap initiated:', swap.id);

  // 5. Regulatory approval
  console.log('\n5. Regulatory approval...');
  const approved = await swapEngine.approveSwap(
    swap.id,
    '0xregulator_signature_12345'
  );
  console.log('Swap approved:', approved.status);

  // 6. Execute swap
  console.log('\n6. Executing swap...');
  const executed = await swapEngine.executeSwap(swap.id);
  console.log('Swap completed:', executed.status, executed.completedAt);

  // 7.View Statistics
  console.log('\n7. Jurisdiction stats:');
  const hkStats = swapEngine.getJurisdictionStats('HK');
  console.log(`   Hong Kong:`);
  console.log(`     Total Swaps: ${hkStats.totalSwaps}`);
  console.log(`     Total Volume: ${hkStats.totalVolume}`);
  console.log(`     Active Participants: ${hkStats.activeParticipants}`);

  console.log('\n✅ Cross-jurisdiction swap completed successfully!');
}

main().catch(console.error);

feat: add BIS Unified Ledger integration module

This PR introduces Phase 6: BIS Unified Ledger Integration:

- BIS ledger client with participant and asset management
- Multi-lateral settlement engine with netting
- Compliance anchor with vLEI integration
- Atomic settlement protocol (two-phase commit)
- Cross-jurisdiction swap engine

Modules Added:
- @utxodns/bis-integration: BISLedgerClient, MultiLateralSettlement, ComplianceAnchor, AtomicSettlement, CrossJurisdictionSwap

Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
License: Apache-2.0
References: BIS Project Agora, IETF draft-guorong-utxo-dns-01
