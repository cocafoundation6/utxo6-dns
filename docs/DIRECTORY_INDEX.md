# 📁 UTXO6-DNS Repository Directory Index

## Complete File Path Index (Sorted by Module)

---

## I. Root Directory Files

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `README.md` | Project main documentation | Docs | ✅ |
| 2 | `CONTRIBUTING.md` | Contribution guidelines | Docs | ✅ |
| 3 | `LICENSE` | Apache 2.0 License | Docs | ✅ |
| 4 | `.gitignore` | Git ignore rules | Config | ✅ |
| 5 | `.github/dependabot.yml` | Automated dependency update config | Config | ✅ |
| 6 | `.github/workflows/ci.yml` | CI/CD workflow | Config | ✅ |
| 7 | `.github/workflows/codeql.yml` | Code security scanning | Config | ✅ |
| 8 | `.github/workflows/labeler.yml` | PR auto-labeling | Config | ✅ |
| 9 | `.github/workflows/stale.yml` | Stale Issue/PR management | Config | ✅ |

---

## II. `docs/` — Documentation Directory

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 10 | `docs/stablecoin-infrastructure.md` | Hong Kong Stablecoin Infrastructure White Paper | Docs | ✅ |
| 11 | `docs/merchant-acquiring-system.md` | Merchant Acquiring System & API Design | Docs | ✅ |
| 12 | `docs/utxo-whitepaper-v2.0.md` | UTXO-DNS White Paper v2.0 | Docs | ✅ |
| 13 | `docs/bis-integration-comparison.md` | BIS Unified Ledger Integration Comparison | Docs | ✅ |

---

## III. `packages/` — NPM Modules (Monorepo)

### 3.1 `core/` — Core Type Definitions

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 14 | `packages/core/src/types.ts` | Core types (AddressBook, UTXO, TEEDomainAssertion) | TypeScript | ✅ |
| 15 | `packages/core/src/index.ts` | Module entry | TypeScript | ✅ |
| 16 | `packages/core/package.json` | NPM config | JSON | ✅ |
| 17 | `packages/core/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/core`

---

### 3.2 `dns-resolver/` — DNS Resolution Module

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 18 | `packages/dns-resolver/src/resolver.ts` | IDNSResolver interface | TypeScript | ✅ |
| 19 | `packages/dns-resolver/src/utxo-dns.ts` | UTXO-DNS gateway implementation | TypeScript | ✅ |
| 20 | `packages/dns-resolver/src/ens-subdomain.ts` | ENS subdomain delegation (EIP-3668) | TypeScript | ✅ |
| 21 | `packages/dns-resolver/src/index.ts` | Module entry | TypeScript | ✅ |
| 22 | `packages/dns-resolver/package.json` | NPM config | JSON | ✅ |
| 23 | `packages/dns-resolver/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/dns-resolver`

---

### 3.3 `tee-verifier/` — TEE Verification Module

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 24 | `packages/tee-verifier/src/verifier.ts` | ITEEVerifier interface | TypeScript | ✅ |
| 25 | `packages/tee-verifier/src/sgx.ts` | Intel SGX implementation | TypeScript | ✅ |
| 26 | `packages/tee-verifier/src/mock.ts` | Mock TEE implementation (dev/testing) | TypeScript | ✅ |
| 27 | `packages/tee-verifier/src/index.ts` | Module entry | TypeScript | ✅ |
| 28 | `packages/tee-verifier/package.json` | NPM config | JSON | ✅ |
| 29 | `packages/tee-verifier/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/tee-verifier`

---

### 3.4 `multichain-tx/` — Multi-Chain Transaction Module

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 30 | `packages/multichain-tx/src/builder.ts` | IMultiChainTxBuilder interface | TypeScript | ✅ |
| 31 | `packages/multichain-tx/src/bitcoin.ts` | Bitcoin (UTXO model) implementation | TypeScript | ✅ |
| 32 | `packages/multichain-tx/src/ethereum.ts` | Ethereum (EIP-1559) implementation | TypeScript | ✅ |
| 33 | `packages/multichain-tx/src/solana.ts` | Solana implementation | TypeScript | ✅ |
| 34 | `packages/multichain-tx/src/index.ts` | Module entry | TypeScript | ✅ |
| 35 | `packages/multichain-tx/package.json` | NPM config | JSON | ✅ |
| 36 | `packages/multichain-tx/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/multichain-tx`

---

### 3.5 `compliance/` — Compliance Module

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 37 | `packages/compliance/src/validator.ts` | IVLEIValidator interface | TypeScript | ✅ |
| 38 | `packages/compliance/src/gleif.ts` | GLEIF vLEI verification implementation | TypeScript | ✅ |
| 39 | `packages/compliance/src/index.ts` | Module entry | TypeScript | ✅ |
| 40 | `packages/compliance/package.json` | NPM config | JSON | ✅ |
| 41 | `packages/compliance/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/compliance`

---

### 3.6 `visual-utils/` — IPv6 Visualization Module

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 42 | `packages/visual-utils/src/fingerprint.ts` | IPv6 color fingerprint calculation | TypeScript | ✅ |
| 43 | `packages/visual-utils/src/render.ts` | Color block rendering tools | TypeScript | ✅ |
| 44 | `packages/visual-utils/src/index.ts` | Module entry | TypeScript | ✅ |
| 45 | `packages/visual-utils/package.json` | NPM config | JSON | ✅ |
| 46 | `packages/visual-utils/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/visual-utils`

---

### 3.7 `storage/` — Storage Module

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 47 | `packages/storage/src/storage.ts` | IStorage interface | TypeScript | ✅ |
| 48 | `packages/storage/src/memory.ts` | Memory cache implementation | TypeScript | ✅ |
| 49 | `packages/storage/src/index.ts` | Module entry | TypeScript | ✅ |
| 50 | `packages/storage/package.json` | NPM config | JSON | ✅ |
| 51 | `packages/storage/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/storage`

---

### 3.8 `wallet-sdk/` — Unified Wallet SDK

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 52 | `packages/wallet-sdk/src/index.ts` | Unified entry (WalletManager, UTXODNSWallet) | TypeScript | ✅ |
| 53 | `packages/wallet-sdk/package.json` | NPM config | JSON | ✅ |
| 54 | `packages/wallet-sdk/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/wallet-sdk`

---

### 3.9 `state/` — UTXO State Management

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 55 | `packages/state/src/types.ts` | State-related type definitions | TypeScript | ✅ |
| 56 | `packages/state/src/UTXOSet.ts` | UTXO set manager | TypeScript | ✅ |
| 57 | `packages/state/src/UTXOValidation.ts` | UTXO validation engine | TypeScript | ✅ |
| 58 | `packages/state/src/index.ts` | Module entry | TypeScript | ✅ |
| 59 | `packages/state/package.json` | NPM config | JSON | ✅ |
| 60 | `packages/state/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/state`

---

### 3.10 `evm/` — EVM Compatibility Layer

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 61 | `packages/evm/src/types.ts` | EVM-related type definitions | TypeScript | ✅ |
| 62 | `packages/evm/src/AAL.ts` | Account Abstraction Layer | TypeScript | ✅ |
| 63 | `packages/evm/src/UTXOSmartContract.ts` | UTXO smart contract bridge | TypeScript | ✅ |
| 64 | `packages/evm/src/EVMAdapter.ts` | EVM adapter | TypeScript | ✅ |
| 65 | `packages/evm/src/index.ts` | Module entry | TypeScript | ✅ |
| 66 | `packages/evm/package.json` | NPM config | JSON | ✅ |
| 67 | `packages/evm/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/evm`

---

### 3.11 `htlc/` — Cross-Chain Atomic Swaps

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 68 | `packages/htlc/src/types.ts` | HTLC type definitions | TypeScript | ✅ |
| 69 | `packages/htlc/src/HTLCContract.ts` | Hash Time-Locked Contract core | TypeScript | ✅ |
| 70 | `packages/htlc/src/UTXOHTLC.ts` | UTXO-based HTLC implementation | TypeScript | ✅ |
| 71 | `packages/htlc/src/EVMHTLC.ts` | EVM-based HTLC implementation | TypeScript | ✅ |
| 72 | `packages/htlc/src/CrossChainSwap.ts` | Cross-chain swap manager | TypeScript | ✅ |
| 73 | `packages/htlc/src/index.ts` | Module entry | TypeScript | ✅ |
| 74 | `packages/htlc/package.json` | NPM config | JSON | ✅ |
| 75 | `packages/htlc/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/htlc`

---

### 3.12 `explorer/` — UTXO Explorer

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 76 | `packages/explorer/src/types.ts` | Explorer type definitions | TypeScript | ✅ |
| 77 | `packages/explorer/src/BlockIndexer.ts` | Block indexer | TypeScript | ✅ |
| 78 | `packages/explorer/src/UTXOExplorer.ts` | UTXO explorer core | TypeScript | ✅ |
| 79 | `packages/explorer/src/TransactionTracker.ts` | Transaction tracker | TypeScript | ✅ |
| 80 | `packages/explorer/src/AddressMonitor.ts` | Address monitor | TypeScript | ✅ |
| 81 | `packages/explorer/src/Statistics.ts` | Statistics aggregator | TypeScript | ✅ |
| 82 | `packages/explorer/src/index.ts` | Module entry | TypeScript | ✅ |
| 83 | `packages/explorer/package.json` | NPM config | JSON | ✅ |
| 84 | `packages/explorer/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/explorer`

---

### 3.13 `opcodes/` — EVM OpCode Extensions

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 85 | `packages/opcodes/src/types.ts` | OpCode type definitions | TypeScript | ✅ |
| 86 | `packages/opcodes/src/UTXOOpCodes.ts` | UTXO opcode implementation | TypeScript | ✅ |
| 87 | `packages/opcodes/src/OpCodeInterpreter.ts` | OpCode interpreter | TypeScript | ✅ |
| 88 | `packages/opcodes/src/OpCodeEngine.ts` | OpCode execution engine | TypeScript | ✅ |
| 89 | `packages/opcodes/src/UTXOContext.ts` | UTXO execution context | TypeScript | ✅ |
| 90 | `packages/opcodes/src/index.ts` | Module entry | TypeScript | ✅ |
| 91 | `packages/opcodes/package.json` | NPM config | JSON | ✅ |
| 92 | `packages/opcodes/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/opcodes`

---

### 3.14 `bis-integration/` — BIS Unified Ledger Integration

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 93 | `packages/bis-integration/src/types.ts` | BIS Unified Ledger type definitions | TypeScript | ✅ |
| 94 | `packages/bis-integration/src/BISLedgerClient.ts` | BIS ledger client | TypeScript | ✅ |
| 95 | `packages/bis-integration/src/MultiLateralSettlement.ts` | Multi-lateral settlement engine | TypeScript | ✅ |
| 96 | `packages/bis-integration/src/ComplianceAnchor.ts` | vLEI compliance anchor | TypeScript | ✅ |
| 97 | `packages/bis-integration/src/AtomicSettlement.ts` | Atomic settlement protocol | TypeScript | ✅ |
| 98 | `packages/bis-integration/src/CrossJurisdictionSwap.ts` | Cross-jurisdiction swap | TypeScript | ✅ |
| 99 | `packages/bis-integration/src/index.ts` | Module entry | TypeScript | ✅ |
| 100 | `packages/bis-integration/package.json` | NPM config | JSON | ✅ |
| 101 | `packages/bis-integration/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/bis-integration`

---

### 3.15 `iso20022/` — ISO 20022 Banking Message Extension

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 102 | `packages/iso20022/src/types/index.ts` | ISO 20022 type definitions | TypeScript | ✅ |
| 103 | `packages/iso20022/src/charset/ISO20022Charset.ts` | Charset validation & conversion | TypeScript | ✅ |
| 104 | `packages/iso20022/src/charset/index.ts` | Module entry | TypeScript | ✅ |
| 105 | `packages/iso20022/src/parser/ISO20022XMLParser.ts` | XML message parser | TypeScript | ✅ |
| 106 | `packages/iso20022/src/parser/index.ts` | Module entry | TypeScript | ✅ |
| 107 | `packages/iso20022/src/adapter/JMBCISO20022Adapter.ts` | JMBC adapter | TypeScript | ✅ |
| 108 | `packages/iso20022/src/adapter/index.ts` | Module entry | TypeScript | ✅ |
| 109 | `packages/iso20022/src/endpoints/BankUtxoEndpoint.ts` | bank.utxo API endpoint | TypeScript | ✅ |
| 110 | `packages/iso20022/src/endpoints/index.ts` | Module entry | TypeScript | ✅ |
| 111 | `packages/iso20022/src/index.ts` | Module entry | TypeScript | ✅ |
| 112 | `packages/iso20022/package.json` | NPM config | JSON | ✅ |
| 113 | `packages/iso20022/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/iso20022`

---

### 3.16 `net-settlement/` — JMBC-BIS Daily Net Settlement

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 114 | `packages/net-settlement/src/types/index.ts` | Net settlement type definitions | TypeScript | ✅ |
| 115 | `packages/net-settlement/src/core/NettingEngine.ts` | Netting engine | TypeScript | ✅ |
| 116 | `packages/net-settlement/src/core/DailySettlement.ts` | Daily settlement executor | TypeScript | ✅ |
| 117 | `packages/net-settlement/src/core/SettlementCalculator.ts` | Settlement calculator | TypeScript | ✅ |
| 118 | `packages/net-settlement/src/core/index.ts` | Module entry | TypeScript | ✅ |
| 119 | `packages/net-settlement/src/audit/AuditTrail.ts` | Audit trail | TypeScript | ✅ |
| 120 | `packages/net-settlement/src/audit/AuditSummary.ts` | Audit summary generator | TypeScript | ✅ |
| 121 | `packages/net-settlement/src/audit/index.ts` | Module entry | TypeScript | ✅ |
| 122 | `packages/net-settlement/src/utils/UTXOSettlement.ts` | UTXO settlement utility | TypeScript | ✅ |
| 123 | `packages/net-settlement/src/utils/index.ts` | Module entry | TypeScript | ✅ |
| 124 | `packages/net-settlement/src/index.ts` | Module entry | TypeScript | ✅ |
| 125 | `packages/net-settlement/package.json` | NPM config | JSON | ✅ |
| 126 | `packages/net-settlement/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/net-settlement`

---

### 3.17 `zk-privacy/` — ZK-SNARKs Privacy Transactions

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 127 | `packages/zk-privacy/src/types/index.ts` | Privacy transaction type definitions | TypeScript | ✅ |
| 128 | `packages/zk-privacy/src/core/PrivacyEngine.ts` | Privacy engine core | TypeScript | ✅ |
| 129 | `packages/zk-privacy/src/core/CommitmentScheme.ts` | Pedersen commitment scheme | TypeScript | ✅ |
| 130 | `packages/zk-privacy/src/core/ProofGenerator.ts` | ZK proof generator | TypeScript | ✅ |
| 131 | `packages/zk-privacy/src/core/ProofVerifier.ts` | ZK proof verifier | TypeScript | ✅ |
| 132 | `packages/zk-privacy/src/core/index.ts` | Module entry | TypeScript | ✅ |
| 133 | `packages/zk-privacy/src/utxo/UTXOPrivacy.ts` | UTXO privacy layer | TypeScript | ✅ |
| 134 | `packages/zk-privacy/src/utxo/index.ts` | Module entry | TypeScript | ✅ |
| 135 | `packages/zk-privacy/src/evm/EVMVerifier.sol` | On-chain verifier contract | Solidity | ✅ |
| 136 | `packages/zk-privacy/src/evm/index.ts` | Module entry | TypeScript | ✅ |
| 137 | `packages/zk-privacy/src/pool/PrivacyPool.ts` | Privacy pool management | TypeScript | ✅ |
| 138 | `packages/zk-privacy/src/pool/index.ts` | Module entry | TypeScript | ✅ |
| 139 | `packages/zk-privacy/src/index.ts` | Module entry | TypeScript | ✅ |
| 140 | `packages/zk-privacy/package.json` | NPM config | JSON | ✅ |
| 141 | `packages/zk-privacy/tsconfig.json` | TypeScript config | JSON | ✅ |

**Package:** `@utxodns/zk-privacy`

---

## IV. `integrations/` — Integration Modules

### 4.1 `tee-wallet-pluggable/` — Pluggable Wallet SDK (23 files)

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 142 | `integrations/tee-wallet-pluggable/README.md` | Project documentation | Docs | ✅ |
| 143 | `integrations/tee-wallet-pluggable/package.json` | NPM config | JSON | ✅ |
| 144 | `integrations/tee-wallet-pluggable/tsconfig.json` | TypeScript config | JSON | ✅ |
| 145 | `integrations/tee-wallet-pluggable/src/index.ts` | Module entry | TypeScript | ✅ |
| 146 | `integrations/tee-wallet-pluggable/src/types/index.ts` | Type definitions | TypeScript | ✅ |
| 147 | `integrations/tee-wallet-pluggable/src/interfaces/IDNSResolver.ts` | DNS resolver interface | TypeScript | ✅ |
| 148 | `integrations/tee-wallet-pluggable/src/interfaces/ITEEVerifier.ts` | TEE verifier interface | TypeScript | ✅ |
| 149 | `integrations/tee-wallet-pluggable/src/interfaces/IMultiChainTxBuilder.ts` | Multi-chain tx interface | TypeScript | ✅ |
| 150 | `integrations/tee-wallet-pluggable/src/interfaces/IVisualUtils.ts` | Visualization interface | TypeScript | ✅ |
| 151 | `integrations/tee-wallet-pluggable/src/interfaces/ICompliance.ts` | Compliance interface | TypeScript | ✅ |
| 152 | `integrations/tee-wallet-pluggable/src/interfaces/IStorage.ts` | Storage interface | TypeScript | ✅ |
| 153 | `integrations/tee-wallet-pluggable/src/resolvers/UTXODNSResolver.ts` | UTXO-DNS resolver | TypeScript | ✅ |
| 154 | `integrations/tee-wallet-pluggable/src/resolvers/ENSSubdomainResolver.ts` | ENS subdomain resolver | TypeScript | ✅ |
| 155 | `integrations/tee-wallet-pluggable/src/tee/SGXTEEVerifier.ts` | SGX TEE implementation | TypeScript | ✅ |
| 156 | `integrations/tee-wallet-pluggable/src/tee/TrustZoneTEEVerifier.ts` | TrustZone implementation | TypeScript | ✅ |
| 157 | `integrations/tee-wallet-pluggable/src/tee/SimulatedTEEVerifier.ts` | Simulated TEE implementation | TypeScript | ✅ |
| 158 | `integrations/tee-wallet-pluggable/src/tx/MultiChainTxBuilder.ts` | Multi-chain tx builder | TypeScript | ✅ |
| 159 | `integrations/tee-wallet-pluggable/src/visual/IPv6Visualizer.ts` | IPv6 visualizer | TypeScript | ✅ |
| 160 | `integrations/tee-wallet-pluggable/src/compliance/VLEIValidator.ts` | vLEI validator | TypeScript | ✅ |
| 161 | `integrations/tee-wallet-pluggable/src/storage/LocalStorage.ts` | Local storage implementation | TypeScript | ✅ |
| 162 | `integrations/tee-wallet-pluggable/src/core/WalletManager.ts` | Wallet core manager | TypeScript | ✅ |
| 163 | `integrations/tee-wallet-pluggable/test/wallet.spec.ts` | Unit tests | TypeScript | ✅ |
| 164 | `integrations/tee-wallet-pluggable/examples/basic-usage.ts` | Usage example | TypeScript | ✅ |

---

### 4.2 `dual-gateway/` — Dual Gateway Authentication (.utxo ↔ ENS)

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 165 | `integrations/dual-gateway/README.md` | Project documentation | Docs | ✅ |
| 166 | `integrations/dual-gateway/package.json` | NPM config | JSON | ✅ |
| 167 | `integrations/dual-gateway/tsconfig.json` | TypeScript config | JSON | ✅ |
| 168 | `integrations/dual-gateway/src/types/index.ts` | Type definitions | TypeScript | ✅ |
| 169 | `integrations/dual-gateway/src/contracts/CrossNameBridge.sol` | Cross-name bridge contract | Solidity | ✅ |
| 170 | `integrations/dual-gateway/src/core/ENSResolver.ts` | ENS resolver | TypeScript | ✅ |
| 171 | `integrations/dual-gateway/src/core/UTXOResolver.ts` | UTXO resolver | TypeScript | ✅ |
| 172 | `integrations/dual-gateway/src/core/CrossNameVerifier.ts` | Cross-name verifier | TypeScript | ✅ |
| 173 | `integrations/dual-gateway/src/core/DualGatewayAuth.ts` | Dual gateway auth core | TypeScript | ✅ |
| 174 | `integrations/dual-gateway/src/index.ts` | Module entry | TypeScript | ✅ |
| 175 | `integrations/dual-gateway/test/dual-gateway.test.ts` | Unit tests | TypeScript | ✅ |
| 176 | `integrations/dual-gateway/examples/basic-usage.ts` | Usage example | TypeScript | ✅ |

---

### 4.3 `jmbc-bis-unified-ledger/` — BIS Unified Ledger Integration (J. Tian)

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 177 | `integrations/jmbc-bis-unified-ledger/src/utxoResolver.ts` | UTXO domain resolver | TypeScript | ✅ |
| 178 | `integrations/jmbc-bis-unified-ledger/src/atomicSettlement.ts` | Atomic settlement engine | TypeScript | ✅ |
| 179 | `integrations/jmbc-bis-unified-ledger/src/tradingEngine.ts` | Trading engine | TypeScript | ✅ |
| 180 | `integrations/jmbc-bis-unified-ledger/contracts/PRNNode.sol` | PRN node contract | Solidity | ✅ |
| 181 | `integrations/jmbc-bis-unified-ledger/contracts/VLEIRegistry.sol` | vLEI registry contract | Solidity | ✅ |

---

### 4.4 `trade-profile/` — Enterprise Trade Profile (Guo Sheng)

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 182 | `integrations/trade-profile/README.md` | Project documentation | Docs | ✅ |
| 183 | `integrations/trade-profile/package.json` | NPM config | JSON | ✅ |
| 184 | `integrations/trade-profile/tsconfig.json` | TypeScript config | JSON | ✅ |
| 185 | `integrations/trade-profile/src/types/index.ts` | Type definitions | TypeScript | ✅ |
| 186 | `integrations/trade-profile/src/contracts/TradeProfile.sol` | Trade profile contract | Solidity | ✅ |
| 187 | `integrations/trade-profile/src/utils/utxoResolver.ts` | UTXO resolver utility | TypeScript | ✅ |
| 188 | `integrations/trade-profile/src/utils/vleiVerifier.ts` | vLEI verifier utility | TypeScript | ✅ |
| 189 | `integrations/trade-profile/src/utils/ipfsStorage.ts` | IPFS storage utility | TypeScript | ✅ |
| 190 | `integrations/trade-profile/src/core/ComplianceChecker.ts` | Compliance checker | TypeScript | ✅ |
| 191 | `integrations/trade-profile/src/core/TrustScoreCalculator.ts` | Trust score calculator | TypeScript | ✅ |
| 192 | `integrations/trade-profile/src/core/TradeProfileManager.ts` | Core manager | TypeScript | ✅ |
| 193 | `integrations/trade-profile/src/index.ts` | Module entry | TypeScript | ✅ |
| 194 | `integrations/trade-profile/examples/basic-usage.ts` | Usage example | TypeScript | ✅ |
| 195 | `integrations/trade-profile/test/TradeProfileManager.test.ts` | Unit tests | TypeScript | ✅ |

---

## V. `examples/` — Example Code

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 196 | `examples/state-example.ts` | UTXO state management example | TypeScript | ✅ |
| 197 | `examples/evm-example.ts` | EVM compatibility layer example | TypeScript | ✅ |
| 198 | `examples/htlc-example.ts` | HTLC atomic swap example | TypeScript | ✅ |
| 199 | `examples/cross-chain-swap.ts` | Complete cross-chain swap example | TypeScript | ✅ |
| 200 | `examples/explorer-example.ts` | UTXO explorer example | TypeScript | ✅ |
| 201 | `examples/monitor-example.ts` | Address monitor example | TypeScript | ✅ |
| 202 | `examples/opcode-example.ts` | EVM opcode example | TypeScript | ✅ |
| 203 | `examples/contract-utxo-example.ts` | Smart contract UTXO interaction example | TypeScript | ✅ |
| 204 | `examples/bis-settlement-example.ts` | BIS settlement example | TypeScript | ✅ |
| 205 | `examples/cross-border-swap-example.ts` | Cross-border swap example | TypeScript | ✅ |
| 206 | `examples/iso20022-example.ts` | ISO 20022 message example | TypeScript | ✅ |
| 207 | `examples/bank-endpoint-example.ts` | bank.utxo endpoint example | TypeScript | ✅ |
| 208 | `examples/daily-settlement-example.ts` | Daily net settlement example | TypeScript | ✅ |
| 209 | `examples/audit-summary-example.ts` | Audit summary example | TypeScript | ✅ |
| 210 | `examples/privacy-transaction-example.ts` | Privacy transaction example | TypeScript | ✅ |
| 211 | `examples/zk-verification-example.ts` | ZK verification example | TypeScript | ✅ |

---

## VI. `test/` — Unit Tests

| No. | File Path | Description | Type | Status |
| :--- | :--- | :--- | :--- | :--- |
| 212 | `test/dual-gateway.test.ts` | Dual gateway authentication test | TypeScript | ✅ |
| 213 | `test/tee-wallet-pluggable/wallet.spec.ts` | Pluggable wallet test | TypeScript | ✅ |
| 214 | `test/trade-profile/TradeProfileManager.test.ts` | Trade profile test | TypeScript | ✅ |
| 215 | `test/iso20022.test.ts` | ISO 20022 test | TypeScript | ✅ |
| 216 | `test/net-settlement.test.ts` | Net settlement module test | TypeScript | ✅ |
| 217 | `test/zk-privacy.test.ts` | ZK privacy test | TypeScript | ✅ |

---

## 📊 Module Dependency Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Application Layer                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  wallet-sdk  │  trade-profile  │  dual-gateway  │  tee-wallet        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                         Feature Layer                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │     htlc  │  explorer  │  opcodes  │  iso20022  │  net-settlement    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                         Core Layer                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │      bis-integration  │    evm    │  state  │  zk-privacy            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                         Foundation Layer                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │     core     │  dns-resolver  │  tee-verifier  │  multichain-tx      │   │
│  │  compliance  │  visual-utils  │              storage                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 NPM Package Status

| Package | Version | Status |
| :--- | :--- | :--- |
| `@utxodns/core` | v0.1.0 | ✅ |
| `@utxodns/dns-resolver` | v0.1.0 | ✅ |
| `@utxodns/tee-verifier` | v0.1.0 | ✅ |
| `@utxodns/multichain-tx` | v0.1.0 | ✅ |
| `@utxodns/compliance` | v0.1.0 | ✅ |
| `@utxodns/visual-utils` | v0.1.0 | ✅ |
| `@utxodns/storage` | v0.1.0 | ✅ |
| `@utxodns/wallet-sdk` | v0.1.0 | ✅ |
| `@utxodns/state` | v0.1.0 | ✅ |
| `@utxodns/evm` | v0.1.0 | ✅ |
| `@utxodns/htlc` | v0.1.0 | ✅ |
| `@utxodns/explorer` | v0.1.0 | ✅ |
| `@utxodns/opcodes` | v0.1.0 | ✅ |
| `@utxodns/bis-integration` | v0.1.0 | ✅ |
| `@utxodns/iso20022` | v0.1.0 | ✅ |
| `@utxodns/net-settlement` | v0.1.0 | ✅ |
| `@utxodns/zk-privacy` | v0.1.0 | ✅ |

---

## 📋 Quick Query Index

| Need | Recommended Path |
| :--- | :--- |
| **DNS Resolution** | `packages/dns-resolver/` |
| **TEE Hardware Security** | `packages/tee-verifier/` |
| **Multi-Chain Transactions** | `packages/multichain-tx/` |
| **vLEI Compliance** | `packages/compliance/` |
| **IPv6 Visualization** | `packages/visual-utils/` |
| **UTXO State Management** | `packages/state/` |
| **EVM Compatibility** | `packages/evm/` |
| **Cross-Chain Atomic Swaps** | `packages/htlc/` |
| **UTXO Explorer** | `packages/explorer/` |
| **EVM OpCode Extensions** | `packages/opcodes/` |
| **BIS Unified Ledger Integration** | `packages/bis-integration/` |
| **ISO 20022 Banking Messages** | `packages/iso20022/` |
| **Daily Net Settlement** | `packages/net-settlement/` |
| **ZK Privacy Transactions** | `packages/zk-privacy/` |
| **Quick Wallet Integration** | `integrations/tee-wallet-pluggable/` |
| **.utxo ↔ ENS Interoperability** | `integrations/dual-gateway/` |
| **Enterprise Trade Profile** | `integrations/trade-profile/` |

---

## 📌 Upload Location

This directory index file should be placed in the repository root:

```
docs/DIRECTORY_INDEX.md
```

---

**🎯 Total: 217 files indexed, covering 17 NPM packages + 4 integration modules.**
