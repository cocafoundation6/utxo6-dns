// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';
import { BISLedgerClient, BISParticipantType } from '@utxodns/bis-integration';
import { UTXOExplorer } from '@utxodns/explorer';
import { JMBCISO20022Adapter, BankUtxoEndpoint } from '../src';

async function main() {
  console.log('=== Bank.utxo Endpoint Example ===\n');

  // 1. Initialize
  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const explorer = new UTXOExplorer(utxoManager);
  const ledgerClient = new BISLedgerClient(utxoManager, evmAdapter, explorer);

  // 2. Register participants
  await ledgerClient.registerParticipant(
    'hsbc.utxo',
    'HSBC Bank',
    BISParticipantType.COMMERCIAL_BANK,
    'HK'
  );
  await ledgerClient.registerParticipant(
    'boe.utxo',
    'Bank of England',
    BISParticipantType.CENTRAL_BANK,
    'UK'
  );
  await ledgerClient.registerParticipant(
    'fed.utxo',
    'US Federal Reserve',
    BISParticipantType.CENTRAL_BANK,
    'US'
  );

  // 3. Create endpoint
  const adapter = new JMBCISO20022Adapter(ledgerClient, utxoManager);
  const endpoint = new BankUtxoEndpoint(adapter);

  // 4. Resolve a .utxo domain
  console.log('1. Resolving hsbc.utxo...');
  const resolution = await endpoint.resolveDomain('hsbc.utxo');
  if (resolution) {
    console.log(`   Domain: ${resolution.domain}`);
    console.log(`   JMS Address: ${resolution.jmsAddress}`);
    console.log(`   vLEI DID: ${resolution.vleiDID}`);
    console.log(`   Jurisdiction: ${resolution.jurisdiction}`);
    console.log(`   Status: ${resolution.status}`);
  }

  // 5. Initiate a payment
  console.log('\n2. Initiating payment...');
  const payment = await endpoint.initiatePayment({
    fromDomain: 'hsbc.utxo',
    toDomain: 'boe.utxo',
    amount: 1000000,
    currency: 'JMS',
    remittance: 'Invoice #INV-2026-003'
  });
  console.log(`   Message ID: ${payment.messageId}`);
  console.log(`   XML generated: ${payment.xml.length} bytes`);

  // 6. Execute settlement
  console.log('\n3. Executing settlement...');
  const settlement = await endpoint.executeSettlement({
    fromDomain: 'hsbc.utxo',
    toDomain: 'fed.utxo',
    amount: 5000000,
    assetId: 'jms_asset_001',
    currency: 'JMS'
  });
  console.log(`   Settlement: ${settlement.data.txHash}`);

  // 7. Get endpoint documentation
  console.log('\n4. Endpoint Documentation:');
  const docs = endpoint.getDocumentation();
  console.log(`   Name: ${docs.name}`);
  console.log(`   Version: ${docs.version}`);
  console.log(`   Endpoints: ${docs.endpoints.length}`);

  console.log('\n✅ Bank.utxo endpoint completed successfully!');
}

main().catch(console.error);

feat: add ISO 20022 banking message extension module

This PR introduces a complete ISO 20022 banking message extension
for the UTXO-DNS ecosystem, enabling:

- ISO 20022 message parsing and generation (PACS.008, PAIN.001, CAMT.053)
- UTF-8 character set validation per ISO 20022 standards
- JMBC blockchain extension fields for atomic settlement
- .utxo domain resolution to banking identifiers
- PRN compliance attestation integration
- bank.utxo API endpoint for ISO 20022 banking functions

The module bridges traditional banking messaging standards with
blockchain-based settlement infrastructure, aligning with:
- BIS Project Agorá architecture
- IETF draft-guorong-utxo-dns-01
- W3C UW2ICG wallet interoperability

Modules Added:
- @utxodns/iso20022: Complete ISO 20022 banking extension

Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
License: Apache-2.0
