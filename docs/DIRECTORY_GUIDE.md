

```markdown
# Project Directory Guide – `github.com/cocafoundation6/utxo6-dns`

*Based on actual repository structure and historical commits – sorted by file path for easy reference*

---

## 1. Root Directory

| File / Directory | Description | Corresponding Standard / Module |
|------------------|-------------|--------------------------------|
| `/README.md` | Project overview | General introduction |
| `/package.json` | Node.js project configuration | Dependency management |
| `/tsconfig.json` | TypeScript compilation config | Build configuration |
| `/Cargo.toml` | Rust project config (BIS integration) | BIS Unified Ledger |

---

## 2. `/src/` – Core Source Code

| File Path | Description | Standard / Module |
|-----------|-------------|-------------------|
| `/src/index.ts` | Module entry point | Unified exports |
| `/src/CoCaDEX-RWA Compute Resource Configuration Center module/` | CoCaDEX RWA compute resource configuration center | Compute RWA contracts |
| `/src/Vlei/` | vLEI verifiable credential module | IETF draft-01 vLEI integration |
| `/src/dns/` | DNS resolution core module | IETF UTXO6-DNS UTXO RR |
| `/src/edns0/` | EDNS0 capability discovery module | IETF draft-01 Section 3.2 |
| `/src/prn_file/` | PRN penetrative regulatory module | IETF draft-01 Section 5 |
| `/src/vrf/` | VRF verifiable random function module | UTXO6-DNS IPv6 IID generation |

### `/src/types/` – Type Definitions

| File Path | Description |
|-----------|-------------|
| `/src/types/index.ts` | Global type definitions |

### `/src/interfaces/` – Interface Definitions

| File Path | Description |
|-----------|-------------|
| `/src/interfaces/IDNSResolver.ts` | DNS resolver interface |
| `/src/interfaces/ITEEVerifier.ts` | TEE verifier interface |
| `/src/interfaces/IMultiChainTxBuilder.ts` | Multi‑chain transaction builder interface |
| `/src/interfaces/IVisualUtils.ts` | Visualisation utilities interface |
| `/src/interfaces/ICompliance.ts` | Compliance engine interface |
| `/src/interfaces/IStorage.ts` | Storage interface |

### `/src/resolvers/` – Resolver Implementations

| File Path | Description |
|-----------|-------------|
| `/src/resolvers/UTXODNSResolver.ts` | UTXO DNS resolver implementation |

---

## 3. `/packages/` – Feature Packages

| Directory Path | Description | Standard / Module |
|----------------|-------------|-------------------|
| `/packages/bis-integration/` | BIS Unified Ledger integration package | BIS Unified Ledger |
| `/packages/compliance/` | Compliance engine package | PRN AnteHandler |
| `/packages/compute-market/` | Compute market trading package | CoCaDEX trading engine |
| `/packages/core/` | Core foundational package | UTXO model types |
| `/packages/dns-resolver/` | Standalone DNS resolver package | IETF UTXO6-DNS |
| `/packages/evm/` | EVM compatibility layer | Multi‑chain support |
| `/packages/explorer/` | UTXO explorer | On‑chain data queries |
| `/packages/htlc/` | Hash‑time‑locked contracts | Cross‑chain atomic swaps |
| `/packages/iso20022/` | ISO 20022 banking message extensions | Financial messaging standards |
| `/packages/multichain-tx/` | Multi‑chain transaction construction | W3C UW2ICG multi‑chain payments |

### Detailed Structure of `/packages/compute-market/`

| File Path | Description |
|-----------|-------------|
| `/packages/compute-market/src/core/ComputeAssetizationEngine.ts` | Compute assetisation engine |
| `/packages/compute-market/src/core/DataMarketplace.ts` | Data marketplace |
| `/packages/compute-market/src/contracts/ComputeRWA.sol` | Compute RWA smart contract |

---

## 4. `/integrations/` – External Integrations

| Directory Path | Description | Standard / Module |
|----------------|-------------|-------------------|
| `/integrations/jmbc-bis-unified-ledger/` | Bank of Communications – BIS Unified Ledger integration | BIS Project Agorá |
| `/integrations/tee-wallet-pluggable/` | TEE pluggable wallet integration | W3C UW2ICG wallet |
| `/integrations/trade-profile/` | Trade profile management | Compliance & risk control |

---

## 5. `/sdk/` – Software Development Kits

| Directory Path | Description |
|----------------|-------------|
| `/sdk/python/` | Python SDK |
| `/sdk/cli/` | Command‑line tool |
| `/sdk/docs/` | SDK documentation |
| `/sdk/examples/` | Example code |
| `/sdk/typescript/` | TypeScript SDK |
| `/sdk/utxo-on-evm-zh.md` | EVM UTXO model implementation guide (Chinese) |

---

## 6. Standard Module File Index

### IETF draft‑guorong‑utxo‑dns‑01

| Standard Section | Corresponding File Path |
|------------------|--------------------------|
| Section 3: UTXO RR (type 260) | `/src/resolvers/UTXODNSResolver.ts`, `/packages/dns-resolver/` |
| Section 3.2: EDNS0 capability discovery | `/src/edns0/` |
| Section 4: AnteHandler | `/packages/compliance/` |
| Section 5: PRN regulatory extensions | `/src/prn_file/` |
| Section 5.2: PRNAUDIT RR | `/src/prn_file/` |
| Section 6: Security considerations | `/src/resolvers/UTXODNSResolver.ts` |
| Appendix I: AgentPolicyEnvelope | `/packages/compliance/` |
| vLEI integration | `/src/Vlei/` |

### W3C UW2ICG

| Capability | Corresponding File Path |
|------------|--------------------------|
| .utxo → multi‑chain endpoint resolution | `/src/resolvers/UTXODNSResolver.ts` |
| Self‑sovereign authentication | `/integrations/tee-wallet-pluggable/` |
| Cross‑chain payment signing | `/packages/multichain-tx/` |
| vLEI credential presentation | `/src/Vlei/` |

### e‑CNY 2.0 / China Mobile Chain (CMBaaS)

| Module | Corresponding File Path |
|--------|--------------------------|
| Compute RWA contract | `/packages/compute-market/src/contracts/ComputeRWA.sol` |
| JMS points contract | `/packages/compute-market/src/core/` |
| Exchange engine | `/packages/compute-market/src/core/` |
| BIS Unified Ledger integration | `/integrations/jmbc-bis-unified-ledger/` |

---

## 7. Quick Reference Index

**By Function:**

| Function | Path |
|----------|------|
| DNS resolution | `/src/dns/`, `/packages/dns-resolver/` |
| UTXO RR query | `/src/resolvers/UTXODNSResolver.ts` |
| EDNS0 | `/src/edns0/` |
| PRN regulatory | `/src/prn_file/` |
| vLEI credentials | `/src/Vlei/` |
| VRF functions | `/src/vrf/` |
| Compliance engine | `/packages/compliance/` |
| Compute trading | `/packages/compute-market/` |
| Multi‑chain support | `/packages/multichain-tx/`, `/packages/evm/` |
| Wallet integration | `/integrations/tee-wallet-pluggable/` |
| BIS integration | `/integrations/jmbc-bis-unified-ledger/` |
| SDKs | `/sdk/typescript/`, `/sdk/python/`, `/sdk/cli/` |
| Examples | `/sdk/examples/` |
| Smart contracts | `/packages/compute-market/src/contracts/` |

**By Standard:**

| Standard | Main Paths |
|----------|------------|
| IETF UTXO6-DNS | `/src/dns/`, `/src/resolvers/`, `/src/edns0/`, `/src/prn_file/`, `/src/vrf/` |
| W3C UW2ICG | `/integrations/tee-wallet-pluggable/`, `/packages/multichain-tx/` |
| BIS Unified Ledger | `/integrations/jmbc-bis-unified-ledger/`, `/packages/bis-integration/` |
| ISO 20022 | `/packages/iso20022/` |

---

*This directory guide is based on the actual file organisation of the `main` branch of `github.com/cocafoundation6/utxo6-dns`. All historically uploaded projects can be located using the paths above.*
```


   ```bash
   git add docs/DIRECTORY_GUIDE.md
   git commit -m "docs: add directory guide based on IETF UTXO6-DNS and W3C UW2ICG"
   git push origin main
   ```

---

这样，您的仓库中就有一份完整的、按路径排序的设计目录指南，方便团队查询和后续贡献。
