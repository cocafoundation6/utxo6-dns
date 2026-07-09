# utxo6-dns

[![IETFStatus](https://img.shields.io/badge/IETF-Experimental-blue)](https://datatracker.ietf.org/doc/draft-guorong-utxo-dns/)
[![W3C CG](https://img.shields.io/badge/W3C-UW2ICG-green)](https://www.w3.org/community/uw2icg/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

UTXO6-DNS is an open-source protocol that anchors blockchain UTXO ownership to IPv6 Interface Identifiers (IIDs) via Verifiable Random Functions (VRF), enabling each IPv6 address to serve as a cryptographically verifiable binding for digital assets—transforming IPv6 addresses from mere network locators into programmable asset endpoints.

## Core Features

**VRF-Driven IPv6 Address Generation**: Deterministic generation of IPv6 IIDs based on UTXO proofs
- **UTXO RR Record**: A new DNS record type (code 260) for storing UTXO proofs
- **PRN Penetrating Regulatory Nodes**: Built-in compliance audit framework
- **vLEI Integration**: GLEIF Verifiable Legal Entity Identity Authentication
- **Multi-Chain Support**: Bitcoin, Ethereum, Solana, etc.


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
