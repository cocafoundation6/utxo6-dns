// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';
import { UTXOExplorer } from '@utxodns/explorer';
import {
  BISLedgerClient,
  BISParticipantType
} from '@utxodns/bis-integration';
import { NettingEngine, DailySettlement } from '../src';

async function main() {
  console.log('=== JMBC-BIS Daily Net Settlement Example ===\n');

  // 1. Initialize components
  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const explorer = new UTXOExplorer(utxoManager);
  const ledgerClient = new BISLedgerClient(utxoManager, evmAdapter, explorer);

  // 2. Register participants
  console.log('1. Registering participants...');
  const participants = ['fed.utxo', 'boe.utxo', 'hsbc.utxo', 'boa.utxo', 'mufg.utxo'];

  for (const domain of participants) {
    await ledgerClient.registerParticipant(
      domain,
      domain.replace('.utxo', '').toUpperCase(),
      domain.includes('fed') || domain.includes('boe')
        ? BISParticipantType.CENTRAL_BANK
        : BISParticipantType.COMMERCIAL_BANK,
      domain.includes('fed') ? 'US' :
      domain.includes('boe') ? 'UK' :
      domain.includes('hsbc') ? 'HK' :
      domain.includes('boa') ? 'US' : 'JP'
    );
    console.log(`   Registered: ${domain}`);
  }

  // 3. Create settlement engine
  console.log('\n2. Creating settlement engine...');
  const engine = new NettingEngine(ledgerClient);
  const settlement = new DailySettlement(engine, ledgerClient);

  // 4. Generate sample transactions
  console.log('\n3. Generating sample transactions...');
  const transactions = [
    { from: 'hsbc.utxo', to: 'fed.utxo', amount: BigInt(12500000000) },
    { from: 'boa.utxo', to: 'boe.utxo', amount: BigInt(8200000000) },
    { from: 'hsbc.utxo', to: 'boe.utxo', amount: BigInt(5300000000) },
    { from: 'mufg.utxo', to: 'fed.utxo', amount: BigInt(6800000000) },
    { from: 'boa.utxo', to: 'hsbc.utxo', amount: BigInt(4500000000) },
    { from: 'fed.utxo', to: 'mufg.utxo', amount: BigInt(3200000000) },
    { from: 'boe.utxo', to: 'boa.utxo', amount: BigInt(2100000000) },
    { from: 'mufg.utxo', to: 'hsbc.utxo', amount: BigInt(1500000000) },
  ];

  const sampleTxs = transactions.map((tx, i) => ({
    id: `tx_${i}`,
    from: tx.from,
    to: tx.to,
    amount: tx.amount,
    assetId: 'jms_asset',
    currency: 'JMS',
    timestamp: Date.now(),
    status: 'pending' as const
  }));

  console.log(`   ${sampleTxs.length} transactions generated`);

  // 5. Execute daily settlement
  console.log('\n4. Executing daily settlement...');
  const result = await settlement.executeDailySettlement({
    date: '2026-07-18',
    participants: participants,
    transactions: sampleTxs,
    settlementAsset: 'jms_asset',
    settlementCurrency: 'JMS'
  });

  // 6. Display results
  console.log('\n=== Settlement Results ===');
  console.log(`Date: ${result.date}`);
  console.log(`Total Transactions: ${result.totalTransactions}`);
  console.log(`Total Amount: ${result.totalAmount.toString()} JMS`);
  console.log(`Net Transactions: ${result.netTransactions}`);
  console.log(`Net Amount: ${result.netAmount.toString()} JMS`);
  console.log(`Efficiency: ${result.efficiency.toFixed(2)}%`);
  console.log(`Status: ${result.status}`);
  console.log(`Audit Hash: ${result.auditHash.slice(0, 40)}...`);
  console.log(`PRN Attestation: ${result.prnAttestation}`);

  // 7. Display net positions
  console.log('\n=== Net Positions ===');
  for (const pos of result.netPositions) {
    console.log(
      `${pos.participant}: Debit=${pos.grossDebit.toString()}, ` +
      `Credit=${pos.grossCredit.toString()}, ` +
      `Net=${pos.netPosition.toString()}`
    );
  }

  console.log('\n✅ Daily net settlement completed successfully!');
}

main().catch(console.error);
