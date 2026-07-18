

<<<p p align=="center">
  <img img 
    width=="300" 
    alt="UTXO6-DNS Brand Image" 
    src="https://github.com/user-attachments/assets/594e740c-ede8-46e0-8c62-5d6ca9a6737c" 
  />
</pp>

<p p p align===="center">
  <bbbb>⚡ Decentralized UTXO-Based Domain Resolution Protocol · Global Performance Testnet Now Live⚡ Decentralized UTXO-Based Domain Resolution Protocol · Global Performance Testnet Now Live⚡ Decentralized UTXO-Based Domain Resolution Protocol · Global Performance Testnet Now Live⚡ Decentralized UTXO-Based Domain Resolution Protocol · Global Performance Testnet Now Live</bbbb>
</pp>


<p p p align===="center">
  <img img img src===="https://img.shields.io/badge/License-MIT-green" />
  <img img img src===="https://img.shields.io/badge/Version-1.0.0-blue" />
  <img img img src===="https://img.shields.io/badge/Testnet-Global_Active-brightgreen" />
</pp>

# utxo6-dns

> **📌 Agreement Ownership**
> 
>Relevant web standards are currently being incubated within the W3C Community Group. For details, see: Relevant web standards are currently being incubated within the W3C Community Group. For details, see: **[w3c-cg/uw2i](https://github.com/w3c-cg/uw2i)** repository. repository.

<img width="932" height="1118" alt="image" src="https://github.com/user-attachments/assets/b1da26f5-bfca-46b6-bf4c-c085f371df0d" />


# Community & Related Links

- **IETF DNSOP Working Group** – DNS protocol standardization. – DNS protocol standardization.

- **ENS (Ethereum Name Service)** – Decentralised naming for Web3. – Decentralised naming for Web3.

- **[W3C UW2I CG](https://www.w3.org/community/uw2i/)** – Decentralised identity and verifiable credentials. – Decentralised identity and verifiable credentials.

[![IETFStatus](https://img.shields.io/badge/IETF-Experimental-blue)](https://datatracker.ietf.org/doc/draft-guorong-utxo-dns/)
[![W3C CG](https://img.shields.io/badge/W3C-UW2I_CG-blue)](https://www.w3.org/community/uw2i/)
[![GitHub](https://img.shields.io/badge/GitHub-w3c--cg%2Fuw2i-181717)](https://github.com/w3c-cg/uw2i)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)


## Community & Related Links

- [**IETF DNSOP Working Group**](https://datatracker.ietf.org/group/dnsop/about/) – DNS protocol standardization. – DNS protocol standardization.
- [**ENS (Ethereum Name Service)**](https://ens.domains/) – Decentralised naming for Web3. – Decentralised naming for Web3.
- [**W3C UW2ICG**](https://www.w3.org/community/uw2icg/) – Decentralised identity and verifiable credentials.
- [**GLEIF vLEI**](https://www.gleif.org/en/vlei/) – Legal‑entity trust layer for compliance.

## BIS Unified Ledger Integration

UTXO6-DNS supports programmable payments and embedded supervision as envisioned by the BIS Unified Ledger concept. The integration module in `integrations/jmbc-bis-unified-ledger/` provides:

- **Atomic settlement** between UTXO-based assets and central bank digital currencies (CBDCs).
- **Compliance rule translation** for PRN (Penetrating Regulatory Node) nodes.
- **Sandbox deployment scripts** for testing cross-institution payment flows.
- **vLEI verification** via GLEIF for legal-entity trust.

For detailed documentation, see [integrations/jmbc-bis-unified-ledger/README.md](./integrations/jmbc-bis-unified-ledger/README.md).

📌 Disclaimer: This document serves as a technical analysis reference to elucidate the design philosophy of UTXO6-DNS. The BIS Project Agorá is an official central bank-grade experimental initiative with authoritative real-network validation. The two differ in positioning: a central bank-led experiment versus an open-source community implementation.

## Usage

Add this crate to your `Cargo.toml`:

```toml
[dependencies]
jmbc-bis-integration = { path = "integrations/jmbc-bis-unified-ledger" }
## Overview

UTXO6-DNS is an open-source protocol that anchors blockchain UTXO ownership to IPv6 Interface Identifiers (IIDs) via Verifiable Random Functions (VRF), enabling each IPv6 address to serve as a cryptographically verifiable binding for digital assets—transforming IPv6 addresses from mere network locators into programmable asset endpoints.

## Core Features

**VRF-Driven IPv6 Address Generation**: Deterministic generation of IPv6 IIDs based on UTXO proofs
- **UTXO RR Record**: A new DNS record type (code 260) for storing UTXO proofs
- **PRN Penetrating Regulatory Nodes**: Built-in compliance audit framework
- **vLEI Integration**: GLEIF Verifiable Legal Entity Identity Authentication
- **Multi-Chain Support**: Bitcoin, Ethereum, Solana, etc.

Then see the examples/cross_border_payment.rs for a complete end‑to‑end payment flow.

References
IETF draft‑guorong‑utxo‑dns‑01

BIS Project Agorá Technical Report (2026)

PRN Security Framework (JMBC)

GLEIF vLEI Standard

## Quick Start

### Install

```bash
npm install @utxo6-dns/core
# or
pip install utxo6-dns


Basic Usage
import { UTXO6Resolver } from '@utxo6-dns/core';

// Resolve .utxo domains
const result = await resolver.resolve('alice.coca.utxo');
console.log(result.address); // 0x...
console.log(result.chain);   // 'ethereum'

Architecture

See details below. ARCHITECTURE.md

Document

•White Paper
• API Reference
• IETF Draft

Contribution

See details below. CONTRIBUTING.md

License

MIT License

## 🤝 Contributors

- **Guo Sheng ** — Zhongshiyuan (Hainan Special Economic Zone) Tourism Group Co., Ltd.

---

## 🌐 UW2ICG Affiliation

This project is the official reference implementation of the **UTXO Web Wallet Interoperability (UW2I) Community Group** at W3C.

- [W3C UW2I CG](https://www.w3.org/community/uw2i/)
- [`w3c-cg/uw2i`](https://github.com/w3c-cg/uw2i)
- [IETF Draft: UTXO6-DNS](https://www.ietf.org/ietf-ftp/internet-drafts/draft-guorong-utxo-dns-01.html)

docs: add Guo Sheng (Zhongshiyuan) to contributors with UW2ICG affiliation

---

fix: correct W3C UW2I CG badge link to uw2i

fix: correct W3C UW2I CG links in README

- Fix missing github.com in w3c-cg/uw2i link
- Add hyperlink to W3C UW2I CG in Community section

---

docs: restore W3C UW2I CG badges and fix links

- Restore IETF, W3C CG, GitHub, and License badges
- Ensure all badges link to valid URLs:
  - IETF: https://datatracker.ietf.org/doc/draft-guorong-utxo-dns/
  - W3C CG: https://www.w3.org/community/uw2i/
  - GitHub: https://github.com/w3c-cg/uw2i
- Maintain project affiliation with UW2I Community Group

docs: fix W3C UW2I CG links in README

- Add missing github.com in first paragraph link
- Convert W3C UW2ICG text to hyperlink with correct URL
- Update name to UW2I CG for consistency

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting issues or pull requests.

# 🔌 Pluggable UTXO TEE Multi-Chain Wallet SDK


## 📖 Overview

A modular, pluggable wallet SDK integrating **UTXO-DNS resolution**, **TEE hardware trust**, **multi-chain transaction signing**, **vLEI compliance**, and **IPv6 visual verification** into a cohesive developer-friendly framework.

This SDK is the reference implementation for the **W3C UW2ICG** wallet interoperability specifications and aligns with **IETF draft-guorong-utxo-dns-01**.

---

## 🎯 Core Philosophy

> **"Code to interfaces, not implementations."**

Every core capability is exposed as a **pluggable interface**, allowing developers to:
- Swap DNS resolvers (UTXO-DNS, ENS, or custom)
- Swap TEE backends (SGX, TrustZone, simulation)
- Swap transaction builders (BTC, ETH, SOL, JMBC)
- Swap storage backends (local, cloud, encrypted)
- Swap compliance providers (vLEI, custom KYC)

This design achieves **high cohesion** within modules and **low coupling** between them.

---

## 🧩 Architecture

```
<img width="794" height="824" alt="image" src="https://github.com/user-attachments/assets/8bd205ab-424a-4874-b547-92f1c81241c6" />

---

## ✨ Features

| Module | Interface | Implementations | Description |
| :--- | :--- | :--- | :--- |
| **DNS Resolution** | `IDNSResolver` | `UTXODNSResolver`, `ENSSubdomainResolver` | Resolve `.utxo` / `.eth` to multi-chain address books |
| **TEE Verification** | `ITEEVerifier` | `SGXTEEVerifier`, `TrustZoneTEEVerifier`, `SimulatedTEEVerifier` | Hardware-backed domain ownership assertions |
| **Transaction Builder** | `IMultiChainTxBuilder` | `MultiChainTxBuilder` | Build & broadcast BTC/ETH/SOL/JMBC transactions |
| **Visualization** | `IVisualUtils` | `IPv6Visualizer` | IPv6 color fingerprint for visual verification |
| **Compliance** | `ICompliance` | `VLEIValidator` | vLEI legal entity credential verification |
| **Storage** | `IStorage` | `LocalStorage` | Cache assertions and address books locally |

---

## 🚀 Quick Start

### Installation

```bash
npm install @utxo6-dns/tee-wallet-pluggable
```

### Basic Usage

```typescript
import {
  WalletManager,
  UTXODNSResolver,
  SimulatedTEEVerifier,
  MultiChainTxBuilder,
  IPv6Visualizer,
  VLEIValidator,
  LocalStorage
} from '@utxo6-dns/tee-wallet-pluggable';

// 1. Initialize wallet with pluggable modules
const wallet = new WalletManager({
  dnsResolver: new UTXODNSResolver('https://dns.utxo.coca'),
  teeVerifier: new SimulatedTEEVerifier(), // Swap for SGX in production
  txBuilder: new MultiChainTxBuilder(),
  visualizer: new IPv6Visualizer(),
  compliance: new VLEIValidator(),
  storage: new LocalStorage(),
});

await wallet.initialize();

// 2. Resolve a domain to multi-chain addresses
const addressBook = await wallet.resolve('merchant.utxo');
console.log('BTC:', addressBook.addresses.btc);
console.log('ETH:', addressBook.addresses.eth);

// 3. Send a payment with TEE proof
const result = await wallet.pay({
  toDomain: 'bob.utxo',
  amount: '0.01',
  currency: 'BTC',
  requireTEEProof: true,
});

console.log('Transaction sent:', result.txHash);
```

---

## 🧩 Pluggable Module Guide

### Replacing the TEE Backend

```typescript
// For Intel SGX (server/desktop)
const teeVerifier = new SGXTEEVerifier('/path/to/enclave.signed.so');

// For ARM TrustZone (mobile)
const teeVerifier = new TrustZoneTEEVerifier('/path/to/trustzone');

// For development/testing
const teeVerifier = new SimulatedTEEVerifier();
```

### Replacing the DNS Resolver

```typescript
// Use UTXO-DNS gateway
const dnsResolver = new UTXODNSResolver('https://dns.utxo.coca');

// Use ENS subdomain delegation (EIP-3668)
const dnsResolver = new ENSSubdomainResolver(
  '0x1234567890123456789012345678901234567890',
  'https://gateway.ens.domains'
);

// Custom resolver (implement IDNSResolver)
class CustomResolver implements IDNSResolver {
  async resolve(domain: string): Promise<AddressBook> {
    // Your custom logic
  }
}
```

---

## 📦 Module Structure

```
integrations/tee-wallet-pluggable/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── interfaces/
│   │   ├── IDNSResolver.ts
│   │   ├── ITEEVerifier.ts
│   │   ├── IMultiChainTxBuilder.ts
│   │   ├── IVisualUtils.ts
│   │   ├── ICompliance.ts
│   │   └── IStorage.ts
│   ├── resolvers/
│   │   ├── UTXODNSResolver.ts
│   │   └── ENSSubdomainResolver.ts
│   ├── tee/
│   │   ├── SGXTEEVerifier.ts
│   │   ├── TrustZoneTEEVerifier.ts
│   │   └── SimulatedTEEVerifier.ts
│   ├── tx/
│   │   └── MultiChainTxBuilder.ts
│   ├── visual/
│   │   └── IPv6Visualizer.ts
│   ├── compliance/
│   │   └── VLEIValidator.ts
│   ├── storage/
│   │   └── LocalStorage.ts
│   └── core/
│       └── WalletManager.ts
├── test/
│   └── wallet.spec.ts
└── examples/
    └── basic-usage.ts
```

---

## 🔐 Security & Compliance

| Feature | Description |
| :--- | :--- |
| **TEE Attestation** | Remote attestation verifies the enclave's integrity before sensitive operations |
| **UTXO Anchoring** | Domain ownership is anchored in UTXO state, providing deterministic verification |
| **vLEI Integration** | GLEIF-based legal entity verification for enterprise compliance |
| **Privacy Protection** | Address books and credentials processed inside TEE; only signed assertions are exposed |
| **Audit Trail** | All binding operations are recorded on-chain for regulatory audit |

---

## 🛣️ Development Roadmap

| Phase | Module | Deliverable |
| :--- | :--- | :--- |
| 1 | Core Types | `@utxo6-dns/core` |
| 2 | DNS Resolver | `@utxo6-dns/dns-resolver` |
| 3 | TEE Interface | `@utxo6-dns/tee-interface` |
| 4 | SGX Implementation | `@utxo6-dns/tee-sgx` |
| 5 | TrustZone Implementation | `@utxo6-dns/tee-tz` |
| 6 | Multi-Chain TX | `@utxo6-dns/multichain-tx` |
| 7 | Visual & Compliance | `@utxo6-dns/visual-utils`, `@utxo6-dns/compliance` |
| 8 | Storage & Cache | `@utxo6-dns/storage` |
| 9 | Full SDK | `@utxo6-dns/wallet-sdk` |

---

## 🔗 Related Standards

| Standard | Status | Link |
| :--- | :--- | :--- |
| **IETF UTXO-DNS** | `draft-guorong-utxo-dns-01` | [IETF Datatracker](https://datatracker.ietf.org/doc/draft-guorong-utxo-dns/) |
| **W3C UW2ICG** | Community Group | [w3c-cg/uw2i](https://github.com/w3c-cg/uw2i) |
| **ENS EIP-3668** | Offchain Lookup | [EIP-3668](https://eips.ethereum.org/EIPS/eip-3668) |
| **GLEIF vLEI** | Legal Entity Identifier | [GLEIF](https://www.gleif.org/) |

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions are governed by the **W3C Community Contributor License Agreement (CLA)**.

---

## 📧 Contact

| Role | Contact |
| :--- | :--- |
| **Project Lead** | Monica Zhu — [monica0615@qq.com](mailto:monica0615@qq.com) |
| **W3C CG** | [UW2ICG](https://www.w3.org/community/uw2i/) |
| **GitHub** | [cocafoundation6/utxo6-dns](https://github.com/cocafoundation6/utxo6-dns) |

---

## 📄 License

Apache License 2.0

**Built with ❤️ by the UW2ICG community and CoCa Foundation.**
```

feat: add pluggable UTXO TEE multi-chain wallet SDK

This PR introduces a modular, pluggable wallet SDK integrating:
- Pluggable DNS resolution (UTXO-DNS, ENS subdomain)
- Pluggable TEE backends (SGX, TrustZone, simulation)
- Multi-chain transaction signing (BTC, ETH, SOL, JMBC)
- IPv6 color fingerprint visualization
- vLEI legal entity verification
- Local caching with offline support

All components are designed with dependency injection,
allowing easy replacement of implementations.

Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
License: Apache-2.0
Standards: IETF draft-guorong-utxo-dns-01 · W3C UW2ICG
```

## UTXODNS — Pluggable UTXO + TEE Multi-Chain Wallet Infrastructure
https://img.shields.io/badge/license-MIT-blue.svg
https://img.shields.io/badge/TypeScript-5.0+-3178C6
https://img.shields.io/badge/PRs-welcome-brightgreen.svg

## 👤 Author and Acknowledgments

The core design of **UTXODNS** was led by **J.tian**, covering architectural design, module interface definition and the core verification process (TEE + UTXO binding).

The development and refinement of this project have been made possible by the inspiration drawn from the following outstanding open-source projects and standards:

- [Ethereum Foundation UTXO Demo](https://github.com/ethereum/utxo) — Proof of concept for UTXO on EVM
- [EIP-3668 (CCIP-Read)](https://eips.ethereum.org/EIPS/eip-3668) — Off-chain Data Retrieval Standard
- [Intel SGX DCAP](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html) — Remote Attestation for Trusted Execution Environments
- [GLEIF vLEI](https://www.gleif.org/en/lei-solutions/verifiable-lei-vlei) — Verifiable Legal Entity Identification Standard
- [Aegis Solana TEE Agent](https://github.com/AegisSolana) TEE Implementation in Trading Agents: Practical Applications
- [Go Multichain Wallet](https://github.com/example) Multi-Chain Wallet Layered Architecture Reference
