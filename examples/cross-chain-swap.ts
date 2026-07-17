// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { EVMAdapter } from '../packages/evm/src/EVMAdapter';
import { CrossChainSwapManager } from '../packages/htlc/src/CrossChainSwap';

async function main() {
  console.log('=== Cross-Chain Atomic Swap Example ===\n');

  // 1. Initialize
  const utxoManager = new UTXOSetManager();
  const evmAdapter = new EVMAdapter(utxoManager);
  const swapManager = new CrossChainSwapManager(utxoManager, evmAdapter);

  // 2. Initiate Swap (UTXO → EVM)
  console.log('Initiating UTXO → EVM swap...');
  const result = await swapManager.initiateSwapUTXOtoEVM({
    initiator: 'alice.utxo',
    counterparty: 'bob.utxo',
    utxoAmount: BigInt(100000),
    evmAmount: BigInt(100000),
    timeLock: 86400,
    utxoAddress: 'bc1qalice...',
    evmAddress: '0xbob...'
  });

  console.log('Request ID:', result.requestId);
  console.log('Contract ID:', result.contractId);
  console.log('Secret:', result.secret);

  // 3. Complete Swap (EVM Side)
  console.log('\nCompleting swap on EVM side...');
  const completeResult = await swapManager.completeSwapUTXOtoEVM(
    result.requestId,
    result.secret,
    '0xbob...'
  );
  console.log('Completed with tx:', completeResult.txid);

  // 4. Final confirmation
  await swapManager.finalizeSwap(result.requestId);
  console.log('\nSwap completed successfully!');
}

main().catch(console.error);
