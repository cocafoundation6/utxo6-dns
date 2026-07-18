# ISO 20022 Banking Message Extension for UTXO-DNS

## Overview

This module extends the UTXO-DNS ecosystem with **ISO 20022** banking message standards, enabling:

- **PACS.008** — FIToFICustomerCreditTransfer
- **PAIN.001** — Payment Initiation
- **CAMT.053** — BankToCustomerStatement
- **CAMT.054** — BankToCustomerDebitCreditNotification

## Features

- ISO 20022 XML message parsing and generation
- UTF-8 character set validation per ISO 20022 standards
- JMBC blockchain extension fields for settlement
- `.utxo` domain resolution to banking identifiers
- PRN compliance attestation integration

## Installation

```bash
npm install @utxodns/iso20022

Quick Start
import { JMBCISO20022Adapter } from '@utxodns/iso20022';
import { BISLedgerClient } from '@utxodns/bis-integration';

const adapter = new JMBCISO20022Adapter(ledgerClient, utxoManager);

// Process incoming PACS.008 message
const result = await adapter.processPACS008(xmlMessage);
console.log('Settlement:', result.settlementTxId);

// Generate outgoing PACS.008 message
const xml = await adapter.generatePACS008({
  fromDomain: 'hsbc.utxo',
  toDomain: 'boe.utxo',
  amount: 1000000,
  currency: 'JMS',
  remittance: 'Invoice #INV-2026-001'
});

ISO 20022 Character Set Compliance
This module enforces ISO 20022 UTF-8 encoding standards:

Character Category	Allowed Characters
Latin Letters	a-z A-Z
Digits	0-9
Special Characters	/ - ? : ( ) . , ' +
Extended Characters	Full UTF-8 (Latin-1, CJK, etc.)

JMBC Extensions

Additional fields for blockchain integration:

Field	Description
<JmbcTxId>	JMBC blockchain transaction hash
<UtxoDomain>	.utxo domain name
<JmbcChain>	JMBC chain identifier
<SettlementAsset>	Settlement asset type (JMS/USDC/HKDA)
<PrnAttestation>	PRN node compliance proof hash
<VleiDID>	vLEI legal entity identifier
License
Apache 2.0
