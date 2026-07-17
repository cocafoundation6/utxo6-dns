// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { UTXOExplorer } from '../packages/explorer/src/UTXOExplorer';
import { BlockInfo, TransactionDetail } from '../packages/explorer/src/types';

async function main() {
  console.log('=== UTXO Explorer Example ===\n');

  const utxoManager = new UTXOSetManager();
  const explorer = new UTXOExplorer(utxoManager);

  // Simulate adding block
  const block: BlockInfo = {
    height: 1,
    hash: '0x1234...',
    timestamp: Date.now(),
    transactions: 0,
    size: 1024,
    previousBlockHash: '0x0000...',
    merkleRoot: '0xabcd...',
    version: 1,
    bits: 0x1d00ffff,
    nonce: 0
  };

  const tx: TransactionDetail = {
    txid: '0x5678...',
    blockHeight: 1,
    blockHash: block.hash,
    timestamp: Date.now(),
    version: 1,
    locktime: 0,
    inputs: [],
    outputs: [],
    fee: BigInt(1000),
    size: 256,
    confirmations: 1
  };

  explorer.addBlock(block, [tx]);

  const stats = explorer.getStats();
  console.log('Explorer Stats:', stats);
}

main().catch(console.error);
