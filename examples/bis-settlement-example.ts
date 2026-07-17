// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { EVMAdapter } from '../packages/evm/src/EVMAdapter';
import { UTXOExplorer } from '../packages/explorer/src/UTXOExplorer';
import { BISLedgerClient, BISParticipantType } from '../packages/bis-integration/src';

async function main() {
  console.log('=== BIS Unified Ledger Integration Example ===\n');

  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const explorer = new UTXOExplorer(utxoManager);

  const ledgerClient = new BISLedgerClient(utxoManager, evmAdapter, explorer);

  // 1.Register Participant
  console.log('1. Registering participants...');
  const fed = await ledgerClient.registerParticipant(
    'fed.utxo',
    'US Federal Reserve',
    BISParticipantType.CENTRAL_BANK,
    'US'
  );
  const boe = await ledgerClient.registerParticipant(
    'boe.utxo',
    'Bank of England',
    BISParticipantType.CENTRAL_BANK,
    'UK'
  );
  const hsbc = await ledgerClient.registerParticipant(
    'hsbc.utxo',
    'HSBC',
    BISParticipantType.COMMERCIAL_BANK,
    'UK'
  );

  console.log('Participants registered:', fed.utxoDomain, boe.utxoDomain, hsbc.utxoDomain);

  // 2.Registered Assets
  console.log('\n2. Registering assets...');
  const usdc = await ledgerClient.registerAsset(
    'circle.utxo',
    'stablecoin',
    'USDC',
    'USD Circle',
    'US'
  );
  const hkda = await ledgerClient.registerAsset(
    'hkda.utxo',
    'stablecoin',
    'HKDA',
    'Hong Kong Dollar Stablecoin',
    'HK'
  );

  console.log('Assets registered:', usdc.symbol, hkda.symbol);

  // 3. Perform atomic settlement
  console.log('\n3. Executing atomic settlement...');
  const settlement = await ledgerClient.executeAtomicSettlement({
    from: 'hsbc.utxo',
    to: 'boe.utxo',
    amount: BigInt(1000000),
    assetId: usdc.id,
    settlementCurrency: 'USDC',
    settlementChain: 'utxo'
  });

  console.log('Settlement completed:', settlement.id, settlement.txHash);

  // 4. Retrieve ledger status
  console.log('\n4. Ledger state:');
  const state = ledgerClient.getLedgerState();
  console.log(`   Participants: ${state.activeParticipants}`);
  console.log(`   Assets: ${state.assets.length}`);
  console.log(`   Total Settlement Volume: ${state.totalSettlementVolume}`);
  console.log(`   Avg Settlement Time: ${state.avgSettlementTime}s`);

  console.log('\n✅ BIS Unified Ledger integration completed successfully!');
}

main().catch(console.error);
