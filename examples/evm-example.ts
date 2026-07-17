// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { UTXOSetManager } from '../packages/state/src/UTXOSet';
import { EVMAdapter } from '../packages/evm/src/EVMAdapter';

async function main() {
  const manager = new UTXOSetManager();
  const evm = new EVMAdapter(manager);

  const address = '0x1234567890123456789012345678901234567890';
  const balance = await evm.getBalance(address);
  console.log(`Account balance: ${balance}`);

  const utxos = await evm.getUTXOs(address);
  console.log(`UTXOs: ${utxos.length}`);
}

main().catch(console.error);

feat: add UTXO state management and EVM compatibility layer

This PR introduces Phase 2 of the UTXO on EVM implementation:

- UTXO state management (UTXOSetManager, UTXOValidation)
- Account Abstraction Layer (AAL) for UTXO → EVM mapping
- UTXO smart contract bridge (OP_CREATE, OP_CALL)
- EVM adapter for unified interface
- Examples for state and EVM usage

Modules Added:
- @utxodns/state: UTXO set management, validation, coin selection
- @utxodns/evm: AAL, UTXO contract bridge, EVM adapter

Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
License: Apache-2.0
