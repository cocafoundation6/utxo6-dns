// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { EVMAdapter } from '../packages/evm/src/EVMAdapter';
import { UTXOOpCode, UTXOContextBuilder } from '../packages/opcodes/src';

/**
 * Simulate an example of a smart contract interacting with a UTXO.
 */
async function main() {
  console.log('=== Smart Contract UTXO Interaction Example ===\n');

  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const builder = new UTXOContextBuilder(utxoManager, evmAdapter);

  const contractAddress = '0xcontract';
  const userAddress = '0xuser';

  // Contract execution context
  const context = builder.buildTransactionContext(
    contractAddress,
    userAddress,
    userAddress,
    12345
  );
  const engine = builder.build();

  // 1. Contract balance inquiry for users
  console.log('1. Contract querying user balance...');
  const balanceResult = await engine.execute(
    UTXOOpCode.UTXO_BALANCE,
    [userAddress],
    context
  );
  console.log('Balance:', balanceResult.returnData);

  // 2. Contract creates UTXO
  console.log('\n2. Contract creating UTXO...');
  const createResult = await engine.execute(
    UTXOOpCode.UTXO_CREATE,
    [BigInt(2000), userAddress, 'OP_DUP OP_HASH160 ...', ''],
    context
  );
  console.log('Created UTXO:', createResult.returnData);

  // 3. Contract executes HTLC lock
  console.log('\n3. Contract locking HTLC...');
  const htlcResult = await engine.execute(
    UTXOOpCode.UTXO_HTLC_LOCK,
    [BigInt(1000), userAddress, '0x' + 'b'.repeat(64), 7200],
    context
  );
  console.log('HTLC locked:', htlcResult.returnData);

  // 4. View contract event logs
  console.log('\n4. Contract events:');
  if (createResult.events) {
    for (const event of createResult.events) {
      console.log(`   ${event.type}:`, event.data);
    }
  }
  if (htlcResult.events) {
    for (const event of htlcResult.events) {
      console.log(`   ${event.type}:`, event.data);
    }
  }

  console.log('\n✅ Smart contract UTXO interaction completed successfully!');
}

main().catch(console.error);

feat: add EVM opcode extensions for UTXO operations

This PR introduces Phase 5: EVM OpCode Extensions:

- UTXO opcode definitions (balance, get, exists, create, spend, transfer, htlc, etc.)
- OpCode interpreter for executing opcodes
- OpCode engine with gas management
- UTXO context builder for easy integration
- Full examples demonstrating opcode usage

Modules Added:
- @utxodns/opcodes: UTXOOpCodes, OpCodeInterpreter, OpCodeEngine, UTXOContextBuilder

Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
License: Apache-2.0
