// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { UTXO } from '../packages/state/src/types';

async function main() {
  const manager = new UTXOSetManager();

  const utxo1: UTXO = {
    txid: '0x1234',
    vout: 0,
    amount: BigInt(100000),
    scriptPubKey: 'OP_DUP OP_HASH160 ...',
    height: 100,
    confirmations: 1000,
    spent: false,
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  };

  manager.addUTXO(utxo1);

  const balance = manager.getBalance('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
  console.log(`Balance: ${balance}`);

  const { utxos, total, change } = manager.selectUTXOs('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', BigInt(50000));
  console.log(`Selected ${utxos.length} UTXOs, total: ${total}, change: ${change}`);
}

main().catch(console.error);
