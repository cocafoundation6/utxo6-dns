# UTXO TEE Multi-Chain Wallet (Pluggable)

A modular, pluggable wallet SDK integrating UTXO-DNS, TEE hardware trust, multi-chain transaction signing, vLEI compliance, and IPv6 visual verification.

## Features

- Pluggable DNS resolution (UTXO-DNS, ENS subdomain)
- Pluggable TEE backends (SGX, TrustZone, simulation)
- Multi-chain transaction building (BTC, ETH, SOL, JMBC)
- IPv6 color fingerprint visualization
- vLEI legal entity verification
- Local caching with offline support

## Installation

```bash
npm install @utxo6-dns/tee-wallet-pluggable

Quick Start
import { WalletManager, UTXODNSResolver, SimulatedTEEVerifier } from '@utxo6-dns/tee-wallet-pluggable';

const wallet = new WalletManager({
  dnsResolver: new UTXODNSResolver('https://dns.utxo.coca'),
  teeVerifier: new SimulatedTEEVerifier(),
  // ... other modules
});

await wallet.initialize();
const result = await wallet.pay({
  toDomain: 'bob.utxo',
  amount: '0.01',
  currency: 'BTC'
});

License
Apache 2.0
