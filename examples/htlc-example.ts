// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { HTLCContractManager } from '../packages/htlc/src/HTLCContract';

async function main() {
  console.log('=== HTLC Atomic Swap Example ===\n');

  // 1. Generate secret and hashlock
  const secret = HTLCContractManager.generateSecret();
  const hashLock = HTLCContractManager.computeHashLock(secret);
  console.log('Secret:', secret);
  console.log('HashLock:', hashLock);

  // 2. Create HTLC Contract
  const manager = new HTLCContractManager();
  const contract = await manager.createContract({
    fromChain: 'bitcoin',
    toChain: 'ethereum',
    fromAddress: 'bc1q...',
    toAddress: '0x...',
    amount: BigInt(100000),
    hashLock,
    timeLock: 86400 // 24 hours
  });
  console.log('Contract created:', contract.id);

  // 3. Activate Contract
  await manager.activateContract(contract.id, '0xlocktxid...');
  console.log('Contract activated');

  // 4.Unlock Contract
  const unlocked = await manager.unlockContract({
    contractId: contract.id,
    secret,
    fromChain: 'bitcoin',
    toChain: 'ethereum',
    toAddress: '0x...'
  });
  console.log('Contract unlocked:', unlocked.status);
}

main().catch(console.error);
