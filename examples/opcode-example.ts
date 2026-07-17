// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { EVMAdapter } from '../packages/evm/src/EVMAdapter';
import { UTXOOpCode, UTXOContextBuilder } from '../packages/opcodes/src';

async function main() {
  console.log('=== EVM OpCode Extensions Example ===\n');

  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const builder = new UTXOContextBuilder(utxoManager, evmAdapter);

  const address = '0x1234567890123456789012345678901234567890';

  // 1. Check balance
  console.log('1. Querying balance...');
  const balanceResult = await builder.executeOpCode(
    UTXOOpCode.UTXO_BALANCE,
    [address],
    '0xcontract',
    address
  );
  console.log('Balance:', balanceResult.returnData);

  // 2. Create UTXO
  console.log('\n2. Creating UTXO...');
  const createResult = await builder.executeOpCode(
    UTXOOpCode.UTXO_CREATE,
    [BigInt(1000), address, 'OP_DUP OP_HASH160 ...', ''],
    '0xcontract',
    address
  );
  console.log('Created UTXO:', createResult.returnData);

  // 3. Check if the UTXO exists
  console.log('\n3. Checking UTXO existence...');
  const existsResult = await builder.executeOpCode(
    UTXOOpCode.UTXO_EXISTS,
    [createResult.returnData.txid, createResult.returnData.vout],
    '0xcontract',
    address
  );
  console.log('UTXO exists?', existsResult.returnData);

  // 4. HTLC Lock in
  console.log('\n4. Locking HTLC...');
  const htlcResult = await builder.executeOpCode(
    UTXOOpCode.UTXO_HTLC_LOCK,
    [BigInt(500), address, '0x' + 'a'.repeat(64), 3600],
    '0xcontract',
    address
  );
  console.log('HTLC locked:', htlcResult.returnData);

  console.log('\n✅ All opcode operations completed successfully!');
}

main().catch(console.error);
