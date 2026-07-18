# JMBC-BIS Daily Net Settlement Module

## Overview

This module implements **daily net settlement (multilateral netting)** for the JMBC-BIS Unified Ledger, enabling financial institutions to settle their interbank obligations with a single net payment per participant per day.

## Core Features

- **Multilateral Netting** — Calculate net positions across all participants
- **Daily Settlement** — Execute end-of-day settlement with atomic transactions
- **Transaction Compression** — Reduce thousands of transactions to a single net payment per participant
- **Audit Trail** — Complete audit log with PRN attestation
- **ISO 20022 Integration** — Generate settlement reports in banking standard format
- **UTXO Anchoring** — All settlements anchored to UTXO transactions

## Architecture


<img width="847" height="788" alt="image" src="https://github.com/user-attachments/assets/76845bca-f9f9-49e3-a161-54394d8d83f2" />


## Quick Start

```typescript
import { DailySettlement, NettingEngine } from '@utxodns/net-settlement';

const engine = new NettingEngine(ledgerClient);
const settlement = new DailySettlement(engine);

// Execute daily net settlement
const result = await settlement.executeDailySettlement({
  date: '2026-07-18',
  participants: ['fed.utxo', 'boe.utxo', 'hsbc.utxo'],
  transactions: [...]
});

console.log('Settlement Efficiency:', result.efficiency);
console.log('Net Transactions:', result.netTransactions);

License
Apache 2.0








