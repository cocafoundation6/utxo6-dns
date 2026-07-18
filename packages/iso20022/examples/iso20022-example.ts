// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';
import { BISLedgerClient, BISParticipantType } from '@utxodns/bis-integration';
import { UTXOExplorer } from '@utxodns/explorer';
import { JMBCISO20022Adapter } from '../src';

async function main() {
  console.log('=== ISO 20022 Banking Message Extension Example ===\n');

  // 1. Initialize components
  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const explorer = new UTXOExplorer(utxoManager);
  const ledgerClient = new BISLedgerClient(utxoManager, evmAdapter, explorer);

  // 2. Register participants
  console.log('1. Registering banking participants...');
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

  // 3. Create ISO 20022 adapter
  const adapter = new JMBCISO20022Adapter(ledgerClient, utxoManager);

  // 4. Sample PACS.008 XML message
  const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>MSG20260718ABC123</MsgId>
      <CreDtTm>2026-07-18T10:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
        <ClrSys><Cd>JMBC</Cd></ClrSys>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId><EndToEndId>E2E20260718ABC</EndToEndId></PmtId>
      <Amt><InstdAmt Ccy="JMS">1000000</InstdAmt></Amt>
      <Dbtr>
        <Nm>HSBC Bank</Nm>
        <Id><LEI>HK-1234567890</LEI></Id>
      </Dbtr>
      <DbtrAcct><Id><Othr><Id>jms:hsbc.utxo</Id></Othr></Id></DbtrAcct>
      <Cdtr>
        <Nm>Bank of England</Nm>
        <Id><LEI>UK-9876543210</LEI></Id>
      </Cdtr>
      <CdtrAcct><Id><Othr><Id>jms:boe.utxo</Id></Othr></Id></CdtrAcct>
      <RmtInf><Ustrd>Cross-border settlement via JMBC</Ustrd></RmtInf>
      <JmbcExt>
        <AssetType>JMS</AssetType>
        <ChainId>jmbc-mainnet</ChainId>
        <RequirePrn>true</RequirePrn>
      </JmbcExt>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`;

  // 5. Process the PACS.008 message
  console.log('\n2. Processing PACS.008 message...');
  const result = await adapter.processPACS008(sampleXML);
  console.log('   Settlement Result:');
  console.log(`   Message ID: ${result.messageId}`);
  console.log(`   Transaction: ${result.settlementTxId}`);
  console.log(`   Status: ${result.status}`);
  console.log(`   Confirmations: ${result.confirmations}`);

  // 6. Generate a PACS.008 message
  console.log('\n3. Generating PACS.008 message...');
  const generatedXML = await adapter.generatePACS008({
    fromDomain: 'hsbc.utxo',
    toDomain: 'boe.utxo',
    amount: 500000,
    currency: 'JMS',
    remittance: 'Invoice #INV-2026-002 - Cross-border settlement via JMBC'
  });
  console.log('   Generated XML length:', generatedXML.length);
  console.log('   First 200 chars:', generatedXML.substring(0, 200) + '...');

  console.log('\n✅ ISO 20022 banking extension completed successfully!');
}

main().catch(console.error);
