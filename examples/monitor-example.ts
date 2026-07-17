// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { UTXOExplorer } from '../packages/explorer/src/UTXOExplorer';
import { TransactionTracker } from '../packages/explorer/src/TransactionTracker';
import { AddressMonitor } from '../packages/explorer/src/AddressMonitor';

async function main() {
  console.log('=== Address Monitor Example ===\n');

  const utxoManager = new UTXOSetManager();
  const explorer = new UTXOExplorer(utxoManager);
  const tracker = new TransactionTracker(utxoManager);
  const monitor = new AddressMonitor(tracker, explorer);

  // Add monitoring rule
  monitor.addRule({
    id: 'whale_alert',
    name: 'Whale Transaction Alert',
    addresses: ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'],
    conditions: {
      minAmount: BigInt(100000000) // 1 BTC
    },
    callback: (event) => {
      console.log(`🐋 WHALE ALERT: ${event.amount} BTC moved from ${event.address}`);
    }
  });

  console.log('Monitor rules added.');
  console.log('Waiting for whale transactions...');
}

main().catch(console.error);

feat: add UTXO explorer and monitoring module

This PR introduces Phase 4: UTXO Explorer & Monitoring:

- Block indexer for blockchain data storage
- UTXO explorer with address lookup and search
- Transaction tracker with confirmation monitoring
- Address monitor with rule-based alerts
- Statistics aggregation for network metrics

Modules Added:
- @utxodns/explorer: BlockIndexer, UTXOExplorer, TransactionTracker, AddressMonitor, Statistics

Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
License: Apache-2.0
