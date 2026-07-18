# UTXO6-DNS BIS Unified Ledger Integration Design
## Technical Reference & Ecosystem Positioning

**Document Type:** Technical Analysis Reference
**Version:** 1.0
**Date:** July 2026

**Reference Sources:**
- BIS (2026), "Project Agorá: a shared programmable platform for wholesale cross-border payments"
- IETF draft-guorong-utxo-dns-01
- W3C UW2ICG Charter

---

## 1. Introduction

This document aims to articulate the design philosophy of the **UTXO6-DNS BIS Unified Ledger integration** and to illustrate how it engages in technical dialogue and ecosystem complementarity with central bank‑grade initiatives such as **BIS Project Agorá**.

The UTXO6-DNS integration is **inspired by Project Agorá**, but is positioned as an open‑source reference implementation for the developer community. It serves as a **complementary counterpart** to central‑bank‑led experiments, not as a competitor.

---

## 2. Performance Reference

| Performance Metric | BIS Project Agorá (Official) | UTXO6‑DNS Integration Design | Analysis |
| :--- | :--- | :--- | :--- |
| **Settlement Speed** | Seconds for wholesale cross‑border payments | Seconds (atomic settlement) | ✅ Consistent |
| **vs. Traditional Systems** | 24‑72 hours → seconds | Days → seconds | ✅ Consistent |
| **Atomic Settlement** | All‑or‑nothing settlement | Atomic settlement supported | ✅ Consistent |
| **24/7 Operation** | Supported | Supported | ✅ Consistent |
| **Parallel Compliance** | AML/CFT, sanctions screening, fraud detection running in parallel | PRN node real‑time compliance verification | ✅ Consistent |
| **Settlement Finality** | Achievable across 7 jurisdictions | Supported by design (multi‑jurisdictional) | ⚠️ Requires real‑world verification |
| **Network Scale** | 8 central banks + 40+ financial institutions | Supports multilateral settlement by design | ⚠️ Not yet live‑network validated |

**Performance Note:** The UTXO6‑DNS design aligns with Project Agorá on core performance metrics — all achieving second‑grade atomic settlement, 24/7 operation, and parallel compliance checks. The distinction lies in Project Agorá's live‑network validation with 8 central banks and 40+ institutions, whereas this design remains at the code prototype stage.

---

## 3. Functional Alignment

| Feature | BIS Project Agorá (Official) | UTXO6‑DNS Integration Design | Analysis |
| :--- | :--- | :--- | :--- |
| **Core Positioning** | Wholesale cross‑border payment settlement | Unified ledger integration + multilateral settlement + cross‑chain swaps | ➕ **Broader scope** |
| **Asset Types** | Tokenised central bank reserves + tokenised bank deposits | Central bank reserves + bank deposits + stablecoins + RWA + CBDC | ➕ **More asset types** |
| **Settlement Currencies** | Multiple currencies (major reserve currencies) | JMS + USDC + USDT + HKDA + CBDC | ➕ **Stablecoin inclusion** |
| **Architecture** | Two‑tier: jurisdictional ledgers + shared unifying layer | Three‑tier: Application + Settlement + Identity/Trust | ➕ **Additional identity layer** |
| **Smart Contracts** | Workflow logic, embedded compliance conditions | UTXO opcode extensions (OP_CREATE/OP_CALL) | ✅ Both support |
| **Compliance Mechanism** | Programmable compliance, privacy protection | PRN penetrative regulation + vLEI legal identity + compliance anchors | ➕ **More comprehensive compliance** |
| **Cross‑Chain Capability** | Not explicitly specified | .utxo ↔ ENS dual‑gateway + UTXO↔EVM HTLC atomic swaps | ➕ **Native cross‑chain** |
| **Identity Layer** | LEI verification | vLEI + .utxo domain + VRF cryptographic anchoring | ➕ **More complete identity** |
| **Messaging Standards** | Not specified | ISO 20022 bank message charset + JMBC extensions | ➕ **Banking standard support** |
| **Programmable Conditional Payments** | Supported | Supported (HTLC + smart contracts) | ✅ Both support |

**Functional Note:** The UTXO6‑DNS design extends the vision of Project Agorá by adding:
1. **Broader asset coverage** — from central bank reserves to stablecoins, RWA, and CBDC
2. **Identity layer** — vLEI legal identity and .utxo domain naming
3. **Cross‑chain interoperability** — native UTXO↔EVM atomic swaps
4. **Compliance infrastructure** — PRN penetrative regulatory nodes with programmable compliance
5. **Banking standards** — ISO 20022 message format support

These extensions position the UTXO6‑DNS design as a **complementary open‑source layer** that builds upon the foundation established by central‑bank‑led initiatives.

---

## 4. Productisation Positioning

| Metric | BIS Project Agorá (Official) | UTXO6‑DNS Integration Design | Analysis |
| :--- | :--- | :--- | :--- |
| **Current Status** | Prototype complete; entering live‑value testing phase | Code prototype (Pluggable SDK) | ⚠️ Agorá more advanced |
| **Production Readiness** | Not yet production‑ready | Experimental | ✅ Both pre‑production |
| **Participant Base** | 8 central banks + 40+ financial institutions | Open‑source community + developers | ⚠️ Agorá has stronger institutional backing |
| **Open Source** | Not publicly available | **Fully open source** (Apache 2.0) | ➕ **Open‑source advantage** |
| **Standardisation** | BIS Innovation Hub project | IETF Experimental Draft + W3C UW2ICG | ➕ **Standards‑backed** |
| **Deployment Model** | Private consortium / permissioned ledger | Pluggable, modular deployment | ➕ **Greater flexibility** |
| **Developer Tooling** | Not publicly available | Complete TypeScript SDK + examples | ➕ **Developer‑friendly** |
| **Test Environment** | Simulation → live‑value testing | Global performance testnet (live) | ✅ Both have test environments |
| **Regulatory Endorsement** | 7 central banks directly involved | W3C CG + IETF draft | ⚠️ Agorá has central bank participation |
| **Business Model** | Public good | Open source + ecosystem collaboration | ✅ Both non‑commercial |

**Productisation Note:** The two projects follow structurally distinct paths:

- **Project Agorá** is a top‑down, central‑bank‑driven initiative with 8 central banks and 40+ financial institutions, moving from simulation toward live‑value testing. It represents the **most authoritative central‑bank‑grade cross‑border payment experiment globally**.

- **The UTXO6‑DNS design** is a bottom‑up, open‑source, community‑driven implementation. Its code is fully open source, with IETF and W3C standards backing, providing complete developer tooling and a pluggable SDK architecture.

**The UTXO6‑DNS design's core advantages include:**
1. **Full open‑source transparency** — anyone can inspect, use, and modify the code
2. **Standards organisation backing** — IETF Experimental Draft + W3C UW2ICG Community Group
3. **Developer ecosystem** — complete TypeScript SDK, pluggable architecture, detailed examples
4. **Flexible deployment** — modular design, components can be used independently

**The current gap for the UTXO6‑DNS design is:**
1. No direct central bank participation — no live‑network validation with monetary authorities
2. Smaller ecosystem scale compared to 40+ institutional participants
3. Not yet advanced to live‑value testing stage

---

## 5. Ecosystem Perspective: Complementary, Not Competitive

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BIS Project Agorá                                   │
│              Central‑bank‑driven · Top‑down · Live‑value testing            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  8 central banks + 40+ institutions · live‑value validation ·         │  │
│  │  wholesale cross‑border payment settlement                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                   Programmable Unified Ledger Infrastructure          │  │
│  │            Atomic settlement · 24/7 · Multi‑currency ·                │  │
│  │            Programmable compliance                                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │               UTXO6‑DNS Unified Ledger Integration Design             │  │
│  │         Open‑source‑driven · Bottom‑up · Developer ecosystem          │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  .utxo naming layer + vLEI identity + PRN compliance +          │  │  │
│  │  │  ISO20022 + cross‑chain swaps                                   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Dimension | BIS Project Agorá | UTXO6‑DNS Integration Design |
| :--- | :--- | :--- |
| **Positioning** | Central‑bank‑grade cross‑border payment experiment | Open‑source unified ledger integration framework |
| **Driving Model** | Top‑down (central‑bank‑led) | Bottom‑up (open‑source community) |
| **Core Strengths** | Live‑network validation · Institutional endorsement | Open transparency · Developer‑friendly |
| **Coverage** | Wholesale cross‑border payments | Payments + Identity + Compliance + Cross‑chain |
| **Productisation Stage** | Live‑value testing phase | Code prototype + testnet |

**The UTXO6‑DNS integration design is not a competitor to Project Agorá, but rather its open‑source complement** — providing a programmable, extensible, and fully transparent unified ledger integration framework for the developer community, while engaging in technical dialogue with central‑bank‑grade projects through IETF and W3C standards bodies.

---

## 6. Conclusion

The UTXO6‑DNS BIS Unified Ledger integration design demonstrates that the principles of Project Agorá — atomic settlement, programmable compliance, and multi‑currency support — can be implemented as an open‑source, developer‑friendly framework with extended capabilities.

The design extends the Project Agorá vision by adding:
- A **naming layer** (.utxo domains)
- A **legal identity layer** (vLEI integration)
- A **regulatory compliance layer** (PRN penetrative nodes)
- A **cross‑chain interoperability layer** (UTXO↔EVM HTLC swaps)
- A **banking standards layer** (ISO 20022 messaging)

While the UTXO6‑DNS design currently exists as a code prototype and testnet, it provides a **valuable open‑source reference** for developers, researchers, and standards bodies interested in programmable unified ledger infrastructure.

---

## 7. Disclaimer

> 📌 **Disclaimer:** This document is a technical analysis reference intended to articulate the design philosophy of UTXO6‑DNS. 
>
> **BIS Project Agorá** is an official central‑bank‑led experimental project with authoritative live‑network validation foundation. It involves 8 central banks, 40+ financial institutions, and is progressing toward live‑value testing.
>
> The UTXO6‑DNS design is an open‑source reference implementation developed by the community. It draws inspiration from Project Agorá but operates with a different positioning:
> - **Project Agorá:** Central‑bank‑grade experiment · Live‑value validation · Institutional governance
> - **UTXO6‑DNS:** Open‑source community implementation · Developer‑oriented · Standards‑backed (IETF/W3C)
>
> These two initiatives are **complementary** — the former provides the authoritative central‑bank‑grade validation, while the latter offers an open, transparent, and extensible reference implementation for the developer ecosystem. The code and design patterns presented here are provided "AS IS," without warranty of any kind, and should not be construed as an official endorsement by or affiliation with the Bank for International Settlements or any of its member central banks.

---

## 8. References

1. Bank for International Settlements (2026). *"Project Agorá: a shared programmable platform for wholesale cross‑border payments"*. Available at: https://www.bis.org/publ/othp/agora.htm

2. Bank for International Settlements (2026). *"Annual Economic Report 2026 — Chapter III: Anchoring trust in money: innovation beyond stablecoins"*.

3. IETF. *"draft-guorong-utxo-dns-01: UTXO Domain Name System (UTXO-DNS)"*. Available at: https://www.ietf.org/ietf-ftp/internet-drafts/draft-guorong-utxo-dns-01.html

4. W3C. *"UTXO Web Wallet Interoperability Community Group (UW2ICG) Charter"*. Available at: https://github.com/w3c-cg/uw2i

5. Maechler, A. (2026). *"What makes money, money? Ensuring trust in the next‑generation financial ecosystem"*. BIS Point Zero Forum, Zurich.

6. Aldasoro, I., Mehrling, P., & Neilson, D.H. (2023). *"On par: a money view of stablecoins"*. BIS Working Papers, No. 1146.

---

**Document prepared by:** Monica Zhu (CoCa Foundation / UW2ICG Chair)
**Date:** July 2026
**License:** Apache 2.0

---

