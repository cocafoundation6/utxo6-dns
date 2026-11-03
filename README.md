
<p align="center">
  <img width="300" alt="UTXO6-DNS Brand Image" src="https://github.com/user-attachments/assets/594e740c-ede8-46e0-8c62-5d6ca9a6737c" />
</p>

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


# Whitepaper: coca: A Payment Addressing Communication Protocol

**Version:** v1.0 (Official Release)
**Publisher:** CoCa Foundation
**Date:** November 2026

---

## Table of Contents
1. [Abstract](#abstract)
2. [Introduction](#introduction)
3. [Chapter 1: Market Context](#chapter-1-market-context)
4. [Chapter 2: The coca Mechanism](#chapter-2-the-coca-mechanism)
5. [Chapter 3: Technical Architecture & Anti-Fork Design](#chapter-3-technical-architecture)
6. [Chapter 4: Lifecycle State Machine](#chapter-4-lifecycle-state-machine)
7. [Chapter 5: Engineering & 15 Core Security Test Cases](#chapter-5-engineering-test-cases)
8. [Chapter 6: Standards & Compliance Moat](#chapter-6-standards-compliance)
9. [Chapter 7: Investment Equity, Agency Implementation, and Regional Distribution Framework](#chapter-7-business-model)
10. [Conclusion](#conclusion)

---

## Abstract

The current global payment network is highly fragmented. Although systems such as PayPal, Visa, USDC/USDT, and Bitcoin (BTC) have significantly improved the efficiency of fund movement, the starting point of the payment link—the "addressing declaration authority" (which endpoint should receive the funds)—remains encapsulated within centralized APIs, account risk controls, and routing rules. Merchants must repeatedly configure endpoints and undergo reviews across different gateways, bearing high addressing premiums and lock-in risks.

This paper proposes a payment addressing communication protocol based on native DNS protocols and TEE (Trusted Execution Environment). By introducing the `coca:` communication header and the `_utxo` namespace, we construct an independently verifiable addressing declaration layer that does not rely on any single payment institution. At the protocol level, we actively reject the burden of exacerbating public RRTYPE space congestion and transparent DNS-layer parsing. Instead, we utilize the RFC 3597 Private-use space (QTYPE 65400) for opaque CBOR byte stream transmission. Combined with TEE hardware-level lifecycle state machine verification and the engineering implementation of 15 core security test cases, this protocol achieves seamless interoperability across traditional fiat, stablecoin, and cryptocurrency clearing channels.

## Introduction

Traditional payment APIs give merchants a rented key that can be revoked at any time; however, through this lifecycle state machine featuring grace periods, on-chain anchoring, and hardware cryptographic endorsement, we hand merchants a property deed that bears their name and is protected by both mathematical and physical certainty.

From now on, consumer payment rights and merchants' receiving endpoints are no longer appendages of the platform, but a truly cross-platform, censorship-resistant, and tamper-proof "Consumer Capital".

---

## Chapter 1: Market Context

Currently, the addressing declaration authority for mainstream payment methods is locked by institutions, creating unavoidable fragmentation:
*   **PayPal**: Addressing is bound to account risk control. Funds are withheld for 21-180 days; merchants cannot declare their true endpoints.
*   **Visa**: Addressing is filtered by acquirers and the VAMP monitoring system. Merchants pay a 2-3.5% comprehensive cost but only gain a passive submission qualification.
*   **USDC/USDT**: Although settlement is decentralized, it is re-intermediated by gateways like Stripe (1.5% addressing premium).
*   **BTC**: A decentralized asset, yet its address addressing rights are custodied by payment processors.

**Why do we need "Consumer Domains"?**
Traditional DNS only solves "where the network goes," not "who the funds are paid to." A merchant only needs a consumer domain like `jmbc.user.utxo6.com` to establish their own publicly verifiable payment endpoint declaration on top of various payment platforms.

---

## Chapter 2: The coca Mechanism

We defined the `coca:` communication header as an instruction to wake up payment applications and request authorization, decoupling the application layer from the network layer.

### 2.1 Standard Instruction Format
**Full Format:** `coca:https://jmbc.user.utxo6.com`
*   **`coca:`** Wakes up the local client (e.g., wallet or Web3 browser) and initiates authorization and resolution requests.
*   **`https://`** Enforces the establishment of a DoH (DNS over HTTPS) encrypted transmission channel to prevent man-in-the-middle eavesdropping.
*   **`jmbc`** Routing identifier. Indicates that this payment intent requires access to the Jonathan Central Bank Bridge for institutional-level compliant clearing.
*   **`user.utxo6.com`** The Consumer Domain entity, pointing to the merchant's identity and endpoint carrier.

### 2.2 Four Core Business Values

#### Value 1: From "Platform Rental" to "Autonomous Property Rights" (Assetization)
*   **Web2 Status Quo**: A merchant's "receiving capability" on PayPal or e-commerce platforms is rented. If the account is frozen or banned, the merchant not only loses money but also loses the "entry point where customers can find them."
*   **Coca Value**: Through `REGISTER` and `TRANSFER` operations (mapped to on-chain Identity Anchor UTXOs), the consumer domain becomes a digital asset truly owned by the merchant.
*   **Transferable & Inheritable**: Merchants can transfer the domain as an asset or use it as on-chain collateral for financing.
*   **Censorship-Resistant**: No payment platform can unilaterally shut down or confiscate your domain. As long as the private key is in the merchant's hands, the addressing right belongs to the merchant.
*   **Asset Premium**: Short, memorable domains (e.g., `pay.utxo6.com`) will have immense commercial premium space, creating a decentralized domain trading market.

#### Value 2: Business Fault Tolerance via "Grace Period" (Risk Control)
*   **Web2 Status Quo**: If you forget to renew a domain or a Stripe API config fails, your business instantly paralyzes without a buffer.
*   **Coca Value**: The `GRACE_PERIOD` (typically 90 days) in the state machine, combined with TEE local verification, provides high commercial fault tolerance.
*   **Smooth Transition**: Even if the merchant's on-chain identity anchor briefly expires, during the grace period, the TEE will still issue a low-risk "yellow warning" to allow business to continue.
*   **Anti-Cybersquatting**: Only the legitimate owner holding the original private key can initiate renewal (`UPDATE`) during the grace period. After the grace period, anyone can release the resource via `RECLAIM`. This mechanism completely eliminates the possibility of hackers using platform backdoors to strip a merchant's domain.

#### Value 3: "Zero-Trust Security" Endorsed by Hardware Cryptography (Security)
*   **Web2 Status Quo**: Merchants rely on the black-box risk control of platform APIs. If the platform server is hacked or DNS cache is poisoned, the merchant and user are completely unaware.
*   **Coca Value**: The introduction of TEE (e.g., HarmonyOS/Intel SGX) hardware enclaves and VRF cryptographic proofs (Test cases T5/T8/T9 passed) shifts addressing security from "relying on centralized institutions" to "mathematical certainty."
*   **Eliminate Address Tampering**: Even if a hacker compromises the Alibaba Cloud DNS server and modifies the RDATA, since they cannot forge the `addressBookHash` and VRF signature within the TEE, the user's mobile TEE will directly intercept and alert.
*   **Anti-Replay & Anti-Fork**: Every state transition is bound to a monotonically increasing Nonce (T11). Even if a 51% fork or rollback occurs on the blockchain, the uniqueness of the TEE hardware state ensures historical transactions are never maliciously replayed. Oversized payloads (>512 bytes) are also circuit-broken and rejected by the TEE (T14).

#### Value 4: "Universal Routing Anchor" for Multi-Chain and Fiat (Interoperability)
*   **Web2 Status Quo**: To receive fiat, USDT, and BTC, merchants must open accounts at Stripe, banks, and crypto gateways, managing different address lifecycles separately.
*   **Coca Value**: The `UPDATE` operation allows merchants to update multi-chain endpoints in their CBOR mapping under a single unified domain.
*   **One-Stop Management, Global Interconnection**: Merchants only need one lifecycle via `user.utxo6.com` to switch underlying clearing channels at any time (e.g., Visa today, JMBC tomorrow).
*   **Sovereignty Declaration**: This is equivalent to merchants planting a flag that never falls on the high seas of the Internet (DNS). No matter how underlying payment channels change, customers always know where to pay.

---

## Chapter 3: Technical Architecture & Anti-Fork Design

### 3.1 End-to-End Architecture

**Figure 1: coca Protocol End-to-End Addressing and Clearing Sequence Diagram**

This sequence diagram includes the AI Agent/User, TEE (W3C Application Layer), and Blockchain Validators (IETF/Network Layer), illustrating the complete flow: Addressing, Verification, Assertion Generation, Transaction Submission, and Minimalist Network Verification.
*   **Phase 1: Addressing & Privacy Isolation** (DNS parsing, endpoint hash verification, VRF validation, policy engine).
*   **Phase 2: Cryptographic Assertion Generation** (Encapsulation, hardware signing, TEE credential generation).
*   **Phase 3: Minimalist Network Verification** (Check UTXO, verify signature, verify TEE credential, anti-replay check).

By isolating complex business logic inside the TEE hardware enclave (blue area), the network layer validators (green area) only perform minimal Boolean checks. This "heavy edge, light core" design protects commercial privacy, enables high-frequency micropayments (<1ms), and completely cuts off malicious nodes from forging addressing records.

```mermaid
sequenceDiagram
    autonumber
    
    actor Agent as AI Agent / User
    box rgb(225, 245, 254) W3C Application Layer (Edge)
        participant TEE as Wallet TEE Enclave
    end
    box rgb(232, 245, 233) IETF/Network Layer (Core)
        participant Validator as Blockchain Validators
    end

    Agent->>TEE: 1. Initiate Payment Request (with coca: URI & Amount)
    
    rect rgb(240, 248, 255)
        Note over TEE: [Phase 1: Addressing & Privacy Isolation]<br/>All complex logic occurs inside the hardware black box
        TEE->>TEE: 2. Parse _utxo.domain record (Extract QTYPE 65400 CBOR)
        TEE->>TEE: 3. Local verify endpoint (Verify paymentEndpointHash)
        TEE->>TEE: 4. Verify UTXO anchor & VRF proof (Anti-forgery/Rollback)
        TEE->>TEE: 5. Execute policy engine (Nonce anti-replay / daily_cap limit)
    end

    rect rgb(240, 248, 255)
        Note over TEE: [Phase 2: Cryptographic Assertion Generation]
        TEE->>TEE: 6. Encapsulate instruction (UTXO ref + Endpoint Hash + Amount) & sign
        TEE->>TEE: 7. Generate TEE Hardware Attestation (Intel SGX DCAP / ARM TrustZone)
    end
    
    TEE-->>Validator: 8. Broadcast Transaction (with UTXO spend + TEE Attestation)
    
    rect rgb(255, 253, 231)
        Note over Validator: [Phase 3: Minimalist Network Verification]<br/><1ms execution, only deterministic checks
        Validator->>Validator: 9. Check if UTXO is unspent
        Validator->>Validator: 10. Verify TEE Assertion Signature
        Validator->>Validator: 11. Verify Hardware Attestation Validity
        Validator->>Validator: 12. Check Anti-replay State (Nonce not used)
    end
    
    Validator-->>Agent: 13. Validation Passed (Boolean: True), Tx Finalized
```

### 3.2 Opaque Binary Data Layer (Opaque RDATA)
At the protocol level, we actively reject the burden of exacerbating public RRTYPE space congestion and transparent DNS-layer parsing. We adopt the RFC 3597 Private-use space (QTYPE 65400), strictly bound with the `_utxo` prefix (e.g., `_utxo.user.utxo6.com`). The RDATA is purely an opaque CBOR byte stream. The DNS network acts only as a transparent transmission and caching layer, never parsing its content.

### 3.3 Local Terminal Verification (TEE & VRF)
Addressing security verification is performed entirely on the client side. After retrieving the RDATA, wallets or TEEs (such as HarmonyOS TEE or Intel SGX) locally decode the CBOR and verify the VRF proofs and TEE attestations within. A payment is only initiated after confirming that the Payment Endpoint Hash matches the domain declaration.

### 3.4 Cryptographic Anti-Fork Mechanism Based on BTC-UTXO
When the underlying blockchain experiences a 51% attack, fork, or rollback, the `coca:` protocol remains unaffected:
1.  **DNS Layer Transparency**: It is only responsible for transmitting the merchant's declaration, not adjudicating authenticity.
2.  **State Commitment Comparison**: TEE verifies whether the UTXO on the forked chain carries the same Taproot/MAST commitment root. If the commitment root on the forked chain is maliciously tampered with, the TEE directly rejects that chain's UTXO as the identity anchor.
3.  **Local Monotonic Increment State (Anti-Replay)**: Even if the underlying chain rollback resurrects old transactions, the independent Nonce sequence maintained internally by the TEE will immediately intercept the transaction once it detects it has been consumed, ensuring the fork cannot "double-spend" the domain's addressing right.

---

## Chapter 4: Consumer Domain Lifecycle State Machine

The lifecycle of a Consumer Domain is driven by four core primitives. Every state transition is strictly constrained by TEE cryptographic verifications.

**Figure 2: Consumer Domain Lifecycle State Machine**

```mermaid
stateDiagram-v2
    direction TB
    [*] --> AVAILABLE: Initial State

    AVAILABLE --> ACTIVE: REGISTER<br/>(Create Identity Anchor UTXO + Write CBOR record)
    
    ACTIVE --> ACTIVE: UPDATE<br/>(Sign to update CBOR endpoint mapping)
    ACTIVE --> ACTIVE: TRANSFER<br/>(Transfer owner public key / Multi-sig)

    ACTIVE --> GRACE_PERIOD: Timestamp > expires_at<br/>(Triggered by block height or TEE time)
    
    GRACE_PERIOD --> ACTIVE: Renewal<br/>(Pay renewal fee and update expires_at)
    GRACE_PERIOD --> EXPIRED: Grace Period Timeout

    EXPIRED --> AVAILABLE: RECLAIM<br/>(Trigger reclaim script)
    
    note right of AVAILABLE: TEE Verification:<br/>Domain hash does not exist<br/>and TEE proof is valid
    note left of ACTIVE: TEE Verification Rules:<br/>1. UTXO Unspent (T12)<br/>2. Signature and Nonce Valid (T11)<br/>3. Endpoint Hash Match (T8/T9)
    note right of GRACE_PERIOD: Grace Period (e.g., 30-90 days)<br/>Original owner can renew during this time
    note right of EXPIRED: Domain becomes dead<br/>Anyone can initiate reclaim<br/>Reclaimer receives incentive<br/>Original Identity Anchor UTXO is destroyed
```

*Caption: The lifecycle of a Consumer Domain is driven by four core primitives. Every state transition is strictly constrained by TEE cryptographic verifications (referencing test cases T8, T9, T11, T12), ensuring that domain ownership and endpoint mappings cannot be forged or hijacked.*

---

## Chapter 5: Engineering & 15 Core Security Test Cases

This protocol is not a theoretical deduction. The underlying engine has completed 15 security tests locally (100% PASS), covering the entire chain from DNS parsing to TEE hardware verification.

| Test Case | Objective | Result |
| :--- | :--- | :--- |
| **T1** | Experimental mode TBD1 passes normally | PASS |
| **T2** | Production mode TBD1 rejected (enforces official code) | PASS |
| **T3** | Production mode official code passes | PASS |
| **T4** | VRF missing: assertion has no fingerprint, Validator passes | PASS |
| **T5** | VRF exists and proof is valid | PASS |
| **T6** | Forged VRF proof rejected | PASS |
| **T7** | `ext` unknown field safely ignored | PASS |
| **T8** | `tx.to` tampering rejected (endpoint hash mismatch) | PASS |
| **T9** | `addressBookHash` tampering rejected | PASS |
| **T10** | `dailyCap` exceeded rejected (limit circuit breaker) | PASS |
| **T11** | `nonce` replay rejected | PASS |
| **T12** | UTXO spent rejected (lifecycle failure) | PASS |
| **T13** | Wildcard/CNAME transparent, no dependency on special DNS handling | PASS |
| **T14** | Payload oversized rejected (RDATA > 512 bytes intercepted) | PASS |
| **T14b** | Payload exactly 512 bytes passes | PASS |

*Note: The T14 test cases strictly defend against Denial of Service (DoS) attacks where attackers construct oversized CBOR payloads to exhaust TEE memory or trigger DNS fragmentation amplification.*

---

## Chapter 6: Standards & Compliance Moat

### 6.1 The "Private Space + Prefix" Consensus, Bypassing the IETF Quagmire
During the IETF DNSOP community's debate over "RRTYPE generality," we adopted the advice of experts (Mukund, Ray, etc.) to complete engineering implementation using the RFC 3597 Private-use space (65400) combined with the `_utxo` prefix. This specification has been officially archived as `draft-guorong-utxo-dns-03` in the IETF database.

### 6.2 ISO 20022 Extension Declaration
The Belgian entity (AISBL) serves as the sole submitting organization, mapping the endpoint information parsed by `coca:` into the `SupplementaryData` structured container of the `pacs.008` message. Led jointly by Sean (Legal, Canadian licensed lawyer) and Guorong Tian (Technical), targeting global institutional endorsement.

### 6.3 Compliance Firewalls Across Jurisdictions
*   **Mainland China (Zhongshiyuan)**: As the sole ICP filing entity for `utxo6.com`. Hainan scenarios only provide "addressing information routing services" and do not touch fund pools.
*   **Hong Kong (HKBC)**: Docking with the stablecoin licensing sandbox to ensure liquidity compliance.
*   **European Union**: Providing regulatory perspectives on MiCA and PSD2. We broadly welcome European local compliant institutions and standards entities to join us for deep collaboration.

---

## Chapter 7: Investment Equity, Agency Implementation, and Regional Distribution Framework

1.  **Open to All Investors**: The Foundation retains core wholesale pricing power and is fully open to global investors and regional agencies for cooperation.
2.  **Generalized Regional Distribution**: Whether in the Asia-Pacific or the EU region, we do not impose exclusive, locked-in thresholds. Institutions with financial strength and local compliance capabilities (e.g., Ronghua, or other licensed entities) are highly encouraged to actively join and co-build the registrar economy ecosystem based on Consumer Domains, sharing the commercial growth dividends.
3.  **The "Registrar Economy" of Consumer Domains**: The Foundation retains wholesale pricing power, while regional licensees (e.g., Ronghua) execute retail distribution.
4.  **Third-Party Wallet Agency Recruitment (B2B2C)**: Recruiting "Implementing Members" from top wallets like imToken, charging an agency annual fee ($10/address) to rapidly establish early cash flow for the Foundation.
5.  **Addressing Technology Service Fees**: Zhongshiyuan provides routing and addressing technology service fees domestically; PT COCA collects channel fees in Southeast Asian energy RWA settlements.

---

## Conclusion

`user.utxo6.com` (Consumer Domain) does not replace any existing payment channels. It simply separates the declaration authority of "where to pay and which channels to accept" from the black-box APIs of major institutions and writes it into a public DNS record controlled by the domain holder.

Settlement can continue to flow through any compliant channel, but the control over the addressing layer must be returned to the merchant. This is the entire significance of building the `coca:` protocol.

---

## Appendix

*   **Appendix A:** Core summary and official link of the `draft-guorong-utxo-dns-03`.
*   **Appendix B:** Full report on 15 TEE security test cases.
*   **Appendix C:** Founding member and Letter of Intent (LOI) templates.
*   **Appendix D:** Glossary (UTXO, TEE, CBOR, QTYPE 65400, JMBC, etc.).

## BIS Unified Ledger Integration

UTXO6-DNS supports programmable payments and embedded supervision as envisioned by the BIS Unified Ledger concept. The integration module in `integrations/jmbc-bis-unified-ledger/` provides:

- **Atomic settlement** between UTXO-based assets and central bank digital currencies (CBDCs).
- **Compliance rule translation** for PRN (Penetrating Regulatory Node) nodes.
- **Sandbox deployment scripts** for testing cross-institution payment flows.
- **vLEI verification** via GLEIF for legal-entity trust.

For detailed documentation, see [integrations/jmbc-bis-unified-ledger/README.md](./integrations/jmbc-bis-unified-ledger/README.md).
—— To Developers and Regulators: This is not a new product, but a foundational infrastructure underpinning the orderly sovereignty of the digital civilization.

📌 Disclaimer: This document serves as a technical analysis reference to elucidate the design philosophy of UTXO6-DNS. The BIS Project Agorá is an official central bank-grade experimental initiative with authoritative real-network validation. The two differ in positioning: a central bank-led experiment versus an open-source community implementation.

<img width="907" height="1119" alt="image" src="https://github.com/user-attachments/assets/3034f49e-7cdb-4f27-825e-3a06c90c6fab" />


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


[📺 观看 DNSOP Vienna 126 远程演示（现场录制）](./5cdd740d694dacc44eeb710c94501654.mp4)




<img width="1589" height="689" alt="image" src="https://github.com/user-attachments/assets/6a5059a6-3a68-415b-ac32-82243f85e007" />

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

fix: correct image syntax in README.md
