

<p align="center">
  <img 
    width="300" 
    alt="UTXO6-DNS Brand Image" 
    src="https://github.com/user-attachments/assets/594e740c-ede8-46e0-8c62-5d6ca9a6737c" 
  />
</p>

<p align="center">
  <b>⚡ Decentralized UTXO-Based Domain Resolution Protocol · Global Performance Testnet Now Live</b>
</p>


<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" />
  <img src="https://img.shields.io/badge/Testnet-Global_Active-brightgreen" />
</p>

# utxo6-dns

[![IETFStatus](https://img.shields.io/badge/IETF-Experimental-blue)](https://datatracker.ietf.org/doc/draft-guorong-utxo-dns/)
[![W3C CG](https://img.shields.io/badge/W3C-UW2ICG-green)](https://www.w3.org/community/uw2icg/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Community & Related Links

- [**IETF DNSOP Working Group**](https://datatracker.ietf.org/group/dnsop/about/) – DNS protocol standardization.
- [**ENS (Ethereum Name Service)**](https://ens.domains/) – Decentralised naming for Web3.
- [**W3C UW2ICG**](https://www.w3.org/community/uw2icg/) – Decentralised identity and verifiable credentials.
- [**GLEIF vLEI**](https://www.gleif.org/en/vlei/) – Legal‑entity trust layer for compliance.

## BIS Unified Ledger Integration

UTXO6-DNS supports programmable payments and embedded supervision as envisioned by the BIS Unified Ledger concept. The integration module in `integrations/jmbc-bis-unified-ledger/` provides:

- **Atomic settlement** between UTXO-based assets and central bank digital currencies (CBDCs).
- **Compliance rule translation** for PRN (Penetrating Regulatory Node) nodes.
- **Sandbox deployment scripts** for testing cross-institution payment flows.
- **vLEI verification** via GLEIF for legal-entity trust.

For detailed documentation, see [integrations/jmbc-bis-unified-ledger/README.md](./integrations/jmbc-bis-unified-ledger/README.md).

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
