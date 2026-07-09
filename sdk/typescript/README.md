
# UTXO6-DNS

[![IETF Status](https://img.shields.io/badge/IETF-Experimental-blue)](https://datatracker.ietf.org/doc/draft-guorong-utxo-dns/)
[![W3C CG](https://img.shields.io/badge/W3C-UW2ICG-green)](https://www.w3.org/community/uw2icg/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/cocafoundation6/utxo6-dns/actions/workflows/ci.yml/badge.svg)](https://github.com/cocafoundation6/utxo6-dns/actions/workflows/ci.yml)

## Overview

**UTXO6-DNS** is an open-source protocol that anchors blockchain UTXO ownership to **IPv6 Interface Identifiers (IIDs)** using **Verifiable Random Functions (VRFs)**. It transforms IPv6 addresses from mere network locators into **cryptographically verifiable digital asset endpoints**, providing native compliance infrastructure for Web3 payments, DeFi, and AI agents.

## Key Features

- 🔗 **VRF-Driven IPv6 Address Generation**: Deterministically generates 64-bit IPv6 IIDs from UTXO proofs (compliant with RFC 9381)
- 📦 **UTXO RR Record (type 260)**: A novel DNS record type for storing on-chain addresses and VRF proofs
- 🛡️ **PRN Penetrating Regulatory Nodes**: Built-in compliance auditing framework with real-time AML/CFT pre-screening
- 🏛️ **vLEI Integration**: GLEIF-standard verifiable legal entity identity verification
- ⛓️ **Multi-Chain Support**: Compatible with Bitcoin, Ethereum, Solana, and other major blockchains
- 🤖 **AI-Native**: Enables AI aggregators to execute on-chain operations via domain resolution

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│              Application Layer (CoCaDEX / Wallet / DApp)    │
├─────────────────────────────────────────────────────────────┤
│              Compliance Layer (PRN Nodes + vLEI)            │
├─────────────────────────────────────────────────────────────┤
│              DNS Resolution Layer (UTXO RR + VRF)           │
├─────────────────────────────────────────────────────────────┤
│              Infrastructure (Bitcoin / Ethereum / Solana)   │
└─────────────────────────────────────────────────────────────┘
```

> For detailed architecture, please refer to [ARCHITECTURE](ARCHITECTURE).

## Quick Start

### 1. Install TypeScript SDK

```bash
npm install @utxo6-dns/core
# or
yarn add @utxo6-dns/core
```

### 2. Resolve a .utxo Domain

```typescript
import { UTXO6Resolver } from '@utxo6-dns/core';

const resolver = new UTXO6Resolver();

// Resolve an enterprise domain to get the on-chain payment address
const result = await resolver.resolve('alice.coca.utxo');
console.log(result.address); // 0xABC... (ETH address)
console.log(result.chain);   // 'ethereum'
console.log(result.vleiDID); // did:vlei:xxxx (legal entity identity)
```

### 3. Install Python SDK (Optional)

```bash
pip install utxo6-dns
```

```python
from utxo6_dns import Resolver

resolver = Resolver()
result = resolver.resolve("bob.coca.utxo")
print(result.address)
```

## Documentation & Resources

- 📖 [Architecture Design](ARCHITECTURE) - Deep dive into protocol layers and core components
- 📄 [White Paper](docs/white-paper.md) - Complete protocol design principles
- 🌐 [IETF Draft](https://datatracker.ietf.org/doc/draft-guorong-utxo-dns/) - Standardization progress
- 🛠️ [Contributing Guide](CONTRIBUTING.md) - How to get involved in development

## Development Setup

To build and debug the SDK locally:

```bash
# Clone the repository
git clone https://github.com/cocafoundation6/utxo6-dns.git
cd utxo6-dns/sdk/typescript

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Contributing

We welcome all forms of contributions! Whether it's filing issues, improving documentation, or submitting code.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines, branch naming conventions, and PR workflows.

## License

This project is open-sourced under the [MIT License](LICENSE).

---

**Star ⭐ this repository** to stay updated on the latest UTXO6-DNS developments!
```

---
