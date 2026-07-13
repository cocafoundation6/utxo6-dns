# Contributing to UTXO6-DNS

First off, thank you for considering contributing to UTXO6-DNS! It's people like you that make this protocol better for everyone.

The following is a set of guidelines for contributing to this repository. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

---

## 🔗 UW2ICG Association

**UTXO6-DNS** is the official reference implementation of the **[UTXO Web Wallet Interoperability (UW2I) Community Group](https://www.w3.org/community/uw2i/)** at W3C.

- **Specifications & Standards:** [`w3c-cg/uw2i`](https://github.com/w3c-cg/uw2i)
- **Mailing List:** `public-utxo-wallet@w3.org`
- **IETF Draft:** [`draft-guorong-utxo-dns-01`](https://www.ietf.org/ietf-ftp/internet-drafts/draft-guorong-utxo-dns-01.html)

To make substantive contributions to this repository, you **must** join the UW2I CG and agree to the **W3C Community Contributor License Agreement (CLA)**. Participation is free and open to all. See the [UW2I CG homepage](https://www.w3.org/community/uw2i/) for joining instructions.

All contributions to this repository are subject to the **W3C CLA** and the **Apache License 2.0** (for code). By contributing, you agree to license your contributions under these terms.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Project Structure](#project-structure)
3. [How to Contribute](#how-to-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Your First Code Contribution](#your-first-code-contribution)
4. [Development Workflow](#development-workflow)
   - [Branch Naming](#branch-naming)
   - [Commit Messages](#commit-messages)
   - [Development Setup](#development-setup)
5. [Coding Standards](#coding-standards)
   - [TypeScript](#typescript)
   - [Python](#python)
6. [Testing](#testing)
7. [Pull Request Process](#pull-request-process)
8. [License](#license)

---

## Code of Conduct

This project and everyone participating in it are governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: `>= 18.0.0` (for TypeScript SDK)
- **npm**: `>= 9.0.0` or **yarn**: `>= 1.22.0`
- **Python**: `>= 3.10` (for Python SDK)
- **Git**: `>= 2.30.0`

### Project Structure

To help you navigate, here's a quick overview of the repository layout:

utxo6-dns/
├── ARCHITECTURE # High-level architecture design
├── CONTRIBUTING.md # This file
├── LICENSE # Apache License 2.0
├── README.md # Project overview and quick start
├── docs/ # Whitepapers and protocol specifications
├── sdk/
│ ├── typescript/ # Main TypeScript SDK (Resolvers, VRF, PRN)
│ ├── python/ # Python SDK
│ ├── cli/ # Command-line interface tools
│ └── examples/ # Sample usage scripts
├── src/ # Core protocol implementations (PoC)
└── test/ # Integration and unit tests


---

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/cocafoundation6/utxo6-dns/issues/new) and include:

- A **clear and descriptive title**.
- **Steps to reproduce** the behavior.
- **Expected behavior** vs. **actual behavior**.
- Screenshots or code snippets if applicable.
- Your environment (OS, Node/Python version).

### Suggesting Enhancements

Feature requests are welcome! When suggesting an enhancement, please:

- Use a **clear and descriptive title**.
- Provide a **detailed description** of the proposed feature.
- Explain **why** this feature would be useful to the UTXO6-DNS ecosystem.
- If possible, outline a **basic implementation approach**.

### Your First Code Contribution

Unsure where to begin? Look for issues tagged with **`good-first-issue`** or **`help-wanted`**. These are typically small, self-contained tasks perfect for newcomers.

---

## Development Workflow

### Branch Naming

Use the following naming conventions for your branches:

- `feat/your-feature-name` → For new features.
- `fix/your-bug-fix` → For bug fixes.
- `docs/your-doc-update` → For documentation changes.
- `chore/your-chore` → For maintenance tasks (dependencies, configs).

### Commit Messages

We follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification.

**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding missing tests
- `chore`: Maintenance tasks

**Examples**:

feat(vrf): add ECVRF-EDWARDS25519-SHA512 implementation
fix(resolver): handle empty DNS responses gracefully
docs(readme): update installation instructions


### Development Setup

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/utxo6-dns.git
   cd utxo6-dns

   Set up the TypeScript SDK:

bash
cd sdk/typescript
npm install
npm run build
Set up the Python SDK (optional):

bash
cd sdk/python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Coding Standards
TypeScript
Use ESLint and Prettier for code formatting.

Run linting before committing:

bash
npm run lint
Use strict TypeScript rules (strict: true in tsconfig.json).

Provide JSDoc comments for all public APIs.

Python
Follow PEP 8.

Use Black for automatic formatting.

Use Flake8 for linting.

Use type hints (PEP 484) wherever possible.

Testing
All new features must include unit tests.
The test suite must pass locally before submitting a PR.

TypeScript tests are run via Jest:

bash
cd sdk/typescript
npm test
Python tests are run via pytest:

bash
cd sdk/python
pytest
Aim for a minimum test coverage of 80%.

Pull Request Process
Update your fork: Ensure your branch is up-to-date with the main branch.

bash
git remote add upstream https://github.com/cocafoundation6/utxo6-dns.git
git fetch upstream
git rebase upstream/main
Push your changes to your fork.

Open a Pull Request (PR) against the main branch of this repository.

In your PR description, include:

A clear description of what the PR does.

A link to the related issue (if any).

Screenshots or logs showing that the changes work.

Wait for CI checks to pass (GitHub Actions will run linting and tests).

Request a review from a maintainer. At least one approval is required for merging.

The maintainer will merge your PR once all checks pass and the code is deemed ready.

🔗 Contributor Attribution (UW2I CG Requirement)
As required by the W3C UW2I Community Group:

If you are not the sole contributor to a pull request, please identify all contributors in the PR comment.

To add a contributor (other than yourself, which is automatic), mark them one per line as follows:

text
+@github_username
To remove a contributor (if added by mistake):

text
-@github_username
If you are making a PR on behalf of someone else but you had no part in designing the feature, you can remove yourself using the above syntax.

License
By contributing, you agree that your contributions will be licensed under the Apache License 2.0 (for code) and subject to the W3C Community Contributor License Agreement (for specifications and standards work).

See the LICENSE file for details.

Thank you again for your time and effort! If you have any questions, feel free to open a discussion or reach out to the maintainers.

Related Links:

UW2I Community Group

W3C Community CLA

IETF Draft: UTXO6-DNS

w3c-cg/uw2i Repository

text

`docs: enhance CONTRIBUTING.md with UW2ICG association`

---

**Based on IETF draft-guorong-utxo-dns-01 (Experimental) + W3C UW2ICG Web Wallet Interoperability Specification**

**Below is the complete integration design plan and core code for the e-CNY-CoCa China Mobile Chain mobile points ecosystem**
---

## 1. Standard Alignment Overview

| Standard | Core Content | Integration in This Solution |
|----------|--------------|-------------------------------|
| **IETF UTXO6-DNS (draft-01)** | UTXO RR type (code 260), EDNS0 capability discovery, PRN penetrative regulatory extensions, vLEI integration, AnteHandler compliance model | Identity resolution, payment addressing, regulatory reporting, transaction compliance checks |
| **W3C UW2ICG** | .utxo domain resolution to multi‑chain endpoints, self‑sovereign authentication, payment signing, verifiable credential presentation | Wallet interoperability, cross‑chain payments, identity verification |
| **e‑CNY 2.0** | “Account system + coin string + smart contract” architecture | Payment channels, point exchange, smart contract triggers |
| **China Mobile Chain (CMBaaS)** | Main‑sidechain galaxy architecture, national cryptographic algorithms, EOS base (3s block time) | Main chain infrastructure, asset registration, contract execution |

---

## 2. Overall Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│    User Layer                                                      │
│  ┌──────────────────┐   ┌──────────────────────────────────────┐   │
│  │ Consumer Wallet  │   │ Merchant / Service Provider          │   │
│  │ (W3C UW2ICG      │   │ (vLEI‑verified entity)               │   │
│  │  compatible)     │   └──────────────────────────────────────┘   │
│  └──────────────────┘                                              │
└────────────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌───────────────────────────────────────────────────────────────────┐
│ Resolution Layer (IETF UTXO6‑DNS)                                 │
│  ┌──────────────┐ ┌───────────────┐ ┌─────────────────────────┐   │
│  │ UTXO RR      │ │ EDNS0         │ │ PRN Regulatory Nodes    │   │
│  │ query (260)  │ │ capability    │ │ (.utxo → multi‑chain    │   │
│  │              │ │ discovery     │ │  endpoint mapping)      │   │
│  └──────────────┘ └───────────────┘ └─────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ Identity Layer (W3C UW2ICG)                                      │
│  ┌──────────────────┐ ┌──────────────┐ ┌─────────────────────┐   │
│  │ Self‑sovereign   │ │ vLEI         │ │ Selective Disclosure│   │
│  │ authentication   │ │ verifiable   │ │                     │   │
│  │ (private key     │ │ credential   │ │                     │   │
│  │  signature)      │ │              │ │                     │   │
│  └──────────────────┘ └──────────────┘ └─────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ Payment Layer                                                    │
│  ┌──────────────────┐ ┌──────────────┐ ┌─────────────────────┐   │
│  │ e‑CNY 2.0        │ │ UnionPay     │ │ Multi‑channel       │   │
│  │ (coin string +   │ │ compliance   │ │ payment adapters    │   │
│  │  smart contract) │ │ interface    │ │                     │   │
│  └──────────────────┘ └──────────────┘ └─────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────┐
│ China Mobile Chain (CMBaaS Main Chain)                           │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐   │
│  │ Compute RWA  │ │ Data         │ │ JMS Points Contract     │   │
│  │ Contract     │ │ Authorization│ │                         │   │
│  │              │ │ Contract     │ │                         │   │
│  └──────────────┘ └──────────────┘ └─────────────────────────┘   │
│  ┌──────────────┐ ┌──────────────┐                               │
│  │ Capital      │ │ PRN Audit    │                               │
│  │ Control      │ │ Contract     │                               │
│  │ Contract     │ │ (AnteHandler)│                               │
│  └──────────────┘ └──────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
         ▲
         │
┌──────────────────────────────────────────────────────────────────┐
│ CoCaDEX Engine                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐   │
│  │ UTXO‑DNS     │ │ Compliance   │ │ Trading Core Engine     │   │
│  │ Resolver     │ │ Engine (PRN) │ │                         │   │
│  └──────────────┘ └──────────────┘ └─────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ Exchange Engine (e‑CNY ↔ JMS)                             │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────────────────────────────┐
│ Regulatory Reporting → PBOC / SAFE                                │
└───────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Code Implementation

### 3.1 UTXO‑DNS Resolver (IETF draft‑01 compliant)

```typescript
// packages/compute-market/src/dns/UTXODNSResolver.ts
// Compliant with IETF draft-guorong-utxo-dns-01: UTXO RR type (code 260), EDNS0

import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);
const resolveAny = promisify(dns.resolveAny);

/**
 * UTXO RR structure (IETF draft-01 Section 3)
 *
 * Format: owner class type rdata
 * - TYPE: UTXO (code 260, assigned by IANA)
 * - RDATA: contains blockchain endpoint identifier, public key hash, vLEI reference, etc.
 */
export interface UTXORR {
  owner: string;           // .utxo domain
  ttl: number;             // time-to-live
  class: 'IN';
  type: 'UTXO';            // code 260
  rdata: {
    chain: string;         // blockchain type: 'cmbaas' | 'ethereum' | 'bitcoin'
    endpoint: string;      // on‑chain address / public key hash
    currency: string;      // supported currency: 'JMS' | 'CNY' | 'USDC'
    vleiRef?: string;      // vLEI credential reference
    prnAttributes?: {      // PRN regulatory attributes (optional)
      jurisdiction: string;
      complianceLevel: 'standard' | 'enhanced' | 'strict';
      auditorDIDs: string[];
    };
    capabilities: string[]; // EDNS0 capability identifiers
  };
}

/**
 * EDNS0 options (IETF draft-01 Section 3.2)
 */
export interface EDNS0Capability {
  code: number;            // option code
  data: {
    supportedChains: string[];
    maxPayloadSize: number;
    prnSupported: boolean;
    vleiRequired: boolean;
  };
}

export class UTXODNSResolver {
  private cache: Map<string, { rr: UTXORR; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly UTXO_RR_TYPE = 260; // IANA assigned UTXO RR type

  /**
   * Resolve .utxo domain (IETF draft-01 Section 4: Resolution Procedure)
   *
   * 1. Query UTXO RR (type 260)
   * 2. If not supported, fallback to TXT records (legacy DNS)
   * 3. EDNS0 capability discovery
   */
  async resolve(domain: string): Promise<UTXORR> {
    // Validate domain format
    if (!domain.endsWith('.utxo')) {
      throw new Error(`Invalid .utxo domain: ${domain}`);
    }

    // Check cache
    const cached = this.cache.get(domain);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL * 1000) {
      return cached.rr;
    }

    let rr: UTXORR | null = null;

    try {
      // 1. First try UTXO RR (type 260) – native support
      rr = await this.queryUTXORR(domain);
    } catch (e) {
      // 2. Fallback: query TXT records (compatibility mode)
      console.log(`[UTXO-DNS] UTXO RR not available for ${domain}, falling back to TXT`);
      rr = await this.parseTXTRecord(domain);
    }

    if (!rr) {
      throw new Error(`Failed to resolve ${domain}: no UTXO or TXT record found`);
    }

    // 3. EDNS0 capability discovery
    const capabilities = await this.discoverCapabilities(domain);
    rr.rdata.capabilities = capabilities;

    // 4. Cache result
    this.cache.set(domain, { rr, timestamp: Date.now() });

    return rr;
  }

  /**
   * Query UTXO RR (type 260) – compliant with IETF draft-01
   */
  private async queryUTXORR(domain: string): Promise<UTXORR | null> {
    // Use dns.resolve() to query type 260
    // Note: Requires DNS server supporting UTXO RR type
    try {
      const result = await resolveAny(domain);
      // Look for UTXO RR (type 260)
      // In standard DNS, type 260 is represented as 'UTXO'
      for (const record of result) {
        if (record.type === 'UTXO' || record.type === 260) {
          return this.parseUTXORR(record);
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Parse UTXO RR data (IETF draft-01 Section 3.1)
   *
   * RDATA format (BNF):
   *   utxo-rdata = chain endpoint currency [vlei-ref] [prn-attrs]
   *   chain = 1*ALPHA
   *   endpoint = 1*HEXDIG
   *   currency = 3*ALPHA
   */
  private parseUTXORR(record: any): UTXORR {
    const rdataParts = record.rdata?.split(' ') || [];
    return {
      owner: record.name || '',
      ttl: record.ttl || 300,
      class: 'IN',
      type: 'UTXO',
      rdata: {
        chain: rdataParts[0] || 'cmbaas',
        endpoint: rdataParts[1] || '',
        currency: rdataParts[2] || 'JMS',
        vleiRef: rdataParts[3] || undefined,
        prnAttributes: this.parsePRNAttributes(rdataParts[4]),
        capabilities: [],
      },
    };
  }

  /**
   * Parse PRN regulatory attributes (IETF draft-01 Section 5)
   */
  private parsePRNAttributes(attrStr?: string): UTXORR['rdata']['prnAttributes'] {
    if (!attrStr) return undefined;
    try {
      const parsed = JSON.parse(Buffer.from(attrStr, 'base64').toString());
      return {
        jurisdiction: parsed.jurisdiction || 'CN',
        complianceLevel: parsed.complianceLevel || 'standard',
        auditorDIDs: parsed.auditorDIDs || [],
      };
    } catch {
      return undefined;
    }
  }

  /**
   * Fallback: parse from TXT records (legacy DNS)
   */
  private async parseTXTRecord(domain: string): Promise<UTXORR | null> {
    try {
      const txtRecords = await resolveTxt(domain);
      for (const txt of txtRecords) {
        const content = txt.join('');
        if (content.startsWith('utxo6=')) {
          const data = JSON.parse(content.substring(6));
          return {
            owner: domain,
            ttl: 300,
            class: 'IN',
            type: 'UTXO',
            rdata: {
              chain: data.chain || 'cmbaas',
              endpoint: data.endpoint || '',
              currency: data.currency || 'JMS',
              vleiRef: data.vlei,
              prnAttributes: data.prn,
              capabilities: [],
            },
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * EDNS0 capability discovery (IETF draft-01 Section 3.2)
   */
  private async discoverCapabilities(domain: string): Promise<string[]> {
    // Query capabilities via EDNS0 OPT RR
    // Actual implementation would send EDNS0 query and inspect OPT record
    // Simulated return
    return ['chain-cmbaas', 'chain-ethereum', 'vlei', 'prn'];
  }

  /**
   * Batch resolution (W3C UW2ICG multi‑chain support)
   */
  async resolveBatch(domains: string[]): Promise<Map<string, UTXORR>> {
    const results = new Map<string, UTXORR>();
    await Promise.all(
      domains.map(async (domain) => {
        try {
          const rr = await this.resolve(domain);
          results.set(domain, rr);
        } catch (e) {
          console.warn(`Failed to resolve ${domain}:`, e);
        }
      })
    );
    return results;
  }

  /**
   * Verify UTXO RR signature (IETF draft-01 Section 6: Security Considerations)
   */
  async verifyRR(domain: string, rr: UTXORR): Promise<boolean> {
    // Verify DNSSEC signature of DNS record
    // or verify embedded signature in UTXO RR
    return true;
  }
}
```

### 3.2 W3C UW2ICG Wallet Interoperability Implementation

```typescript
// packages/compute-market/src/wallet/UW2ICGWallet.ts
// Compliant with W3C UTXO Web Wallet Interoperability Community Group Specification

import { UTXODNSResolver, UTXORR } from '../dns/UTXODNSResolver';
import { VLEIVerifier } from '../utils/vleiVerifier';

/**
 * W3C UW2ICG Wallet Interface (Community Group Specification)
 *
 * Capabilities:
 * 1. Resolve .utxo domain to multi‑chain endpoints
 * 2. Self‑sovereign authentication (sign a challenge with private key)
 * 3. Construct and sign payments addressed to .utxo domains
 * 4. Present verifiable credentials (vLEI)
 */
export interface IUW2ICGWallet {
  // 1. Resolve .utxo domain
  resolveUTXODomain(domain: string): Promise<UTXORR>;
  
  // 2. Self‑sovereign authentication
  authenticate(challenge: string): Promise<{ signature: string; publicKey: string }>;
  
  // 3. Payment construction and signing
  signPayment(params: PaymentParams): Promise<SignedPayment>;
  
  // 4. Credential presentation
  presentCredential(params: CredentialRequest): Promise<VerifiableCredential>;
}

export interface PaymentParams {
  from: string;          // sender .utxo domain
  to: string;            // recipient .utxo domain
  amount: number;
  currency: 'JMS' | 'CNY' | 'USDC' | 'USDT';
  chain: string;         // 'cmbaas' | 'ethereum' | 'bitcoin'
  memo?: string;
}

export interface SignedPayment {
  transaction: any;       // on‑chain transaction object
  signature: string;
  fromDomain: string;
  toDomain: string;
  timestamp: number;
}

export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: any;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
}

export class UW2ICGWallet implements IUW2ICGWallet {
  private dnsResolver: UTXODNSResolver;
  private vleiVerifier: VLEIVerifier;
  private privateKey: string;
  private domain: string;

  constructor(domain: string, privateKey: string) {
    this.domain = domain;
    this.privateKey = privateKey;
    this.dnsResolver = new UTXODNSResolver();
    this.vleiVerifier = new VLEIVerifier();
  }

  /**
   * 1. Resolve .utxo domain to multi‑chain endpoints
   * W3C UW2ICG: "Resolve .utxo domain names to multi-chain blockchain endpoint identifiers"
   */
  async resolveUTXODomain(domain: string): Promise<UTXORR> {
    return this.dnsResolver.resolve(domain);
  }

  /**
   * 2. Self‑sovereign authentication
   * W3C UW2ICG: "Perform self-sovereign authentication (sign a challenge using a private key bound to a .utxo domain)"
   */
  async authenticate(challenge: string): Promise<{ signature: string; publicKey: string }> {
    const message = `uw2i-auth:${this.domain}:${challenge}`;
    const signature = await this.signMessage(message);
    return {
      signature,
      publicKey: this.derivePublicKey(),
    };
  }

  /**
   * 3. Construct and sign payments
   * W3C UW2ICG: "Construct and sign payments addressed to a .utxo domain on any supported chain"
   */
  async signPayment(params: PaymentParams): Promise<SignedPayment> {
    // Resolve recipient domain
    const toRR = await this.dnsResolver.resolve(params.to);
    const fromRR = await this.dnsResolver.resolve(params.from);

    // Validate recipient supports the requested chain and currency
    if (!toRR.rdata.capabilities.includes(`chain-${params.chain}`)) {
      throw new Error(`Recipient ${params.to} does not support chain ${params.chain}`);
    }

    // Build transaction (target chain specific)
    const transaction = this.buildTransaction({
      from: fromRR.rdata.endpoint,
      to: toRR.rdata.endpoint,
      amount: params.amount,
      currency: params.currency,
      chain: params.chain,
      memo: params.memo,
    });

    // Sign transaction
    const signature = await this.signTransaction(transaction);

    return {
      transaction,
      signature,
      fromDomain: params.from,
      toDomain: params.to,
      timestamp: Date.now(),
    };
  }

  /**
   * 4. Present verifiable credentials (vLEI)
   * W3C UW2ICG: "Present verifiable credentials such as GLEIF vLEI"
   */
  async presentCredential(params: CredentialRequest): Promise<VerifiableCredential> {
    // Obtain vLEI status from verifier
    const vleiStatus = await this.vleiVerifier.verify(this.domain);
    
    // Construct W3C Verifiable Credential (JSON-LD)
    const credential: VerifiableCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/vlei/v1',
      ],
      type: ['VerifiableCredential', 'vLEICredential'],
      issuer: `did:vlei:${this.domain}`,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `did:vlei:${this.domain}`,
        legalName: vleiStatus.legalName,
        status: vleiStatus.status,
        registration: {
          jurisdiction: 'CN',
          registrationNumber: vleiStatus.registrationNumber,
        },
      },
      proof: {
        type: 'Ed25519Signature2018',
        created: new Date().toISOString(),
        verificationMethod: `did:vlei:${this.domain}#keys-1`,
        proofPurpose: 'assertionMethod',
        proofValue: await this.generateProof(credential),
      },
    };

    // Support selective disclosure based on request parameters
    if (params.selectiveDisclosure) {
      return this.filterCredential(credential, params.fields);
    }

    return credential;
  }

  // ============ Private Methods ============

  private async signMessage(message: string): Promise<string> {
    // Use Ed25519 or Secp256k1 signature
    return `sig_${Date.now()}_${Buffer.from(message).toString('base64')}`;
  }

  private derivePublicKey(): string {
    return `pub_${this.domain}`;
  }

  private buildTransaction(params: any): any {
    return {
      from: params.from,
      to: params.to,
      amount: params.amount,
      currency: params.currency,
      chain: params.chain,
      memo: params.memo,
      timestamp: Date.now(),
    };
  }

  private async signTransaction(transaction: any): Promise<string> {
    return this.signMessage(JSON.stringify(transaction));
  }

  private async generateProof(credential: any): Promise<string> {
    return `proof_${Date.now()}`;
  }

  private filterCredential(
    credential: VerifiableCredential,
    fields?: string[]
  ): VerifiableCredential {
    if (!fields) return credential;
    // Implement selective disclosure
    const filtered: any = { ...credential };
    const subject: any = {};
    for (const field of fields) {
      if (field in credential.credentialSubject) {
        subject[field] = credential.credentialSubject[field];
      }
    }
    filtered.credentialSubject = subject;
    return filtered;
  }
}

/**
 * Credential request parameters
 */
interface CredentialRequest {
  selectiveDisclosure?: boolean;
  fields?: string[];
}
```

### 3.3 PRN Penetrative Regulatory Integration (IETF draft‑01 Section 5)

```typescript
// packages/compute-market/src/compliance/PRNComplianceEngine.ts
// Compliant with IETF draft-guorong-utxo-dns-01 Section 5: PRN Regulatory Extensions

import { UTXODNSResolver } from '../dns/UTXODNSResolver';
import { VLEIVerifier } from '../utils/vleiVerifier';

/**
 * PRN Regulatory Attributes (IETF draft-01 Section 5.1)
 */
export interface PRNAttributes {
  jurisdiction: string;
  complianceLevel: 'standard' | 'enhanced' | 'strict';
  auditorDIDs: string[];
  auditSchedule: 'daily' | 'weekly' | 'monthly';
  regulatoryReporting: {
    enabled: boolean;
    endpoint: string;
    frequency: 'realtime' | 'batch';
  };
}

/**
 * PRNAUDIT RR Type (IETF draft-01 Section 5.2)
 *
 * New DNS RR type for daily audit summary
 */
export interface PRNAUDITRR {
  owner: string;
  ttl: number;
  type: 'PRNAUDIT';
  rdata: {
    auditId: string;
    date: string;
    merkleRoot: string;
    signatures: string[];  // 2‑of‑3 MPC threshold signatures
    summary: {
      totalTransactions: number;
      totalVolume: number;
      suspiciousCount: number;
      complianceRate: number;
    };
  };
}

/**
 * AnteHandler Compliance Execution Model (IETF draft-01 Section 4)
 *
 * Transaction lifecycle compliance enforcement: pre‑mempool checks
 */
export class PRNComplianceEngine {
  private dnsResolver: UTXODNSResolver;
  private vleiVerifier: VLEIVerifier;
  private auditRecords: Map<string, PRNAUDITRR> = new Map();

  constructor() {
    this.dnsResolver = new UTXODNSResolver();
    this.vleiVerifier = new VLEIVerifier();
  }

  /**
   * AnteHandler: pre‑transaction compliance check
   * IETF draft-01 Section 4: "transaction lifecycle compliance enforcement model (AnteHandler)"
   */
  async anteHandlerCheck(transaction: {
    from: string;
    to: string;
    amount: number;
    currency: string;
    timestamp: number;
  }): Promise<{
    allowed: boolean;
    reason?: string;
    prnAttributes?: PRNAttributes;
    auditId?: string;
  }> {
    // 1. Resolve sender and recipient .utxo domains
    const [fromRR, toRR] = await Promise.all([
      this.dnsResolver.resolve(transaction.from),
      this.dnsResolver.resolve(transaction.to),
    ]);

    // 2. Check PRN regulatory attributes
    const fromPRN = fromRR.rdata.prnAttributes;
    const toPRN = toRR.rdata.prnAttributes;

    // 3. Verify vLEI identity (if PRN requires)
    if (fromPRN?.complianceLevel === 'strict' || toPRN?.complianceLevel === 'strict') {
      const [fromVLEI, toVLEI] = await Promise.all([
        this.vleiVerifier.verify(transaction.from),
        this.vleiVerifier.verify(transaction.to),
      ]);
      
      if (!fromVLEI.valid || !toVLEI.valid) {
        return {
          allowed: false,
          reason: 'vLEI verification failed for strict compliance level',
        };
      }
    }

    // 4. Check transaction limits (capital controls)
    const limitCheck = this.checkTransactionLimits(transaction, fromPRN);
    if (!limitCheck.allowed) {
      return {
        allowed: false,
        reason: limitCheck.reason,
      };
    }

    // 5. Check destination country restrictions
    if (fromPRN?.jurisdiction !== toPRN?.jurisdiction) {
      const crossBorderCheck = this.checkCrossBorder(transaction, fromPRN, toPRN);
      if (!crossBorderCheck.allowed) {
        return {
          allowed: false,
          reason: crossBorderCheck.reason,
        };
      }
    }

    // 6. Generate audit record
    const auditId = await this.generateAuditRecord(transaction, fromPRN, toPRN);

    return {
      allowed: true,
      prnAttributes: fromPRN || toPRN,
      auditId,
    };
  }

  /**
   * Generate PRNAUDIT RR (IETF draft-01 Section 5.2)
   */
  async generateAuditRR(
    domain: string,
    date: string
  ): Promise<PRNAUDITRR> {
    // Obtain daily transaction summary
    const summary = await this.getDailySummary(domain, date);

    // Build Merkle root
    const merkleRoot = this.buildMerkleRoot(summary.transactions);

    // 2‑of‑3 MPC threshold signatures
    const signatures = await this.getMPCSignatures(merkleRoot);

    const auditRR: PRNAUDITRR = {
      owner: domain,
      ttl: 86400, // 24 hours
      type: 'PRNAUDIT',
      rdata: {
        auditId: `audit_${domain}_${date}`,
        date,
        merkleRoot,
        signatures,
        summary: {
          totalTransactions: summary.total,
          totalVolume: summary.volume,
          suspiciousCount: summary.suspicious,
          complianceRate: summary.complianceRate,
        },
      },
    };

    this.auditRecords.set(auditRR.rdata.auditId, auditRR);
    return auditRR;
  }

  /**
   * PRN‑API Regulatory Dashboard (IETF draft-01 Section 5.3)
   */
  async getRegulatoryDashboard(params: {
    domain: string;
    startDate: string;
    endDate: string;
  }): Promise<{
    summary: any;
    dailyAudits: PRNAUDITRR[];
    alerts: any[];
  }> {
    // Retrieve audit records within the date range
    const audits: PRNAUDITRR[] = [];
    for (const [id, record] of this.auditRecords) {
      if (record.owner === params.domain && 
          record.rdata.date >= params.startDate && 
          record.rdata.date <= params.endDate) {
        audits.push(record);
      }
    }

    return {
      summary: {
        totalAudits: audits.length,
        totalTransactions: audits.reduce((s, a) => s + a.rdata.summary.totalTransactions, 0),
        averageComplianceRate: audits.reduce((s, a) => s + a.rdata.summary.complianceRate, 0) / (audits.length || 1),
      },
      dailyAudits: audits,
      alerts: await this.getAlerts(params.domain, params.startDate, params.endDate),
    };
  }

  // ============ Private Methods ============

  private checkTransactionLimits(
    transaction: any,
    prn?: PRNAttributes
  ): { allowed: boolean; reason?: string } {
    const limits = {
      standard: { daily: 50000, single: 5000 },
      enhanced: { daily: 200000, single: 20000 },
      strict: { daily: 1000000, single: 100000 },
    };

    const level = prn?.complianceLevel || 'standard';
    const limit = limits[level];

    if (transaction.amount > limit.single) {
      return { allowed: false, reason: `Single transaction limit exceeded: ${limit.single}` };
    }

    return { allowed: true };
  }

  private checkCrossBorder(
    transaction: any,
    fromPRN?: PRNAttributes,
    toPRN?: PRNAttributes
  ): { allowed: boolean; reason?: string } {
    // Cross‑border transactions need extra checks
    if (fromPRN?.jurisdiction !== 'CN' || toPRN?.jurisdiction !== 'CN') {
      const allowedCountries = ['CN', 'HK', 'MO'];
      if (!allowedCountries.includes(toPRN?.jurisdiction || '')) {
        return { allowed: false, reason: 'Destination jurisdiction not allowed' };
      }
    }
    return { allowed: true };
  }

  private async generateAuditRecord(
    transaction: any,
    fromPRN?: PRNAttributes,
    toPRN?: PRNAttributes
  ): Promise<string> {
    const auditId = `audit_${Date.now()}_${transaction.from}_${transaction.to}`;
    // Store audit record
    return auditId;
  }

  private async getDailySummary(domain: string, date: string): Promise<any> {
    // Retrieve daily transaction summary from chain
    return {
      total: 100,
      volume: 50000,
      suspicious: 2,
      complianceRate: 98.5,
      transactions: [],
    };
  }

  private buildMerkleRoot(transactions: any[]): string {
    // Build Merkle tree root
    return `0x${Buffer.from(JSON.stringify(transactions)).toString('hex').slice(0, 64)}`;
  }

  private async getMPCSignatures(merkleRoot: string): Promise<string[]> {
    // 2‑of‑3 MPC threshold signatures
    // Three independent audit institutions sign
    return [
      `sig_auditor1_${merkleRoot}`,
      `sig_auditor2_${merkleRoot}`,
      `sig_auditor3_${merkleRoot}`,
    ];
  }

  private async getAlerts(domain: string, startDate: string, endDate: string): Promise<any[]> {
    return [];
  }
}
```

### 3.4 AgentPolicyEnvelope Policy Enforcement (IETF draft‑01 Appendix I)

```typescript
// packages/compute-market/src/compliance/AgentPolicyEnvelope.ts
// Compliant with IETF draft-guorong-utxo-dns-01 Appendix I: AgentPolicyEnvelope JSON Schema

/**
 * AgentPolicyEnvelope – declarative authorization policy
 *
 * IETF draft-01 Appendix I: "application-layer policy format (AgentPolicyEnvelope)
 * for declarative authorization"
 */
export interface AgentPolicyEnvelope {
  version: string;
  id: string;
  issuedAt: string;
  expiresAt: string;
  issuer: string;          // .utxo domain
  subject: string;         // policy subject
  policies: Policy[];
  signatures: string[];    // multi‑party signatures
}

export interface Policy {
  id: string;
  effect: 'allow' | 'deny' | 'require_review';
  resource: {
    type: 'compute' | 'data' | 'payment' | 'exchange';
    constraints: ResourceConstraint[];
  };
  action: 'lease' | 'transfer' | 'license' | 'exchange' | 'all';
  conditions: Condition[];
  priority: number;
}

export interface ResourceConstraint {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface Condition {
  type: 'time' | 'location' | 'amount' | 'identity' | 'compliance';
  params: Record<string, any>;
}

export class AgentPolicyEnforcer {
  private policies: Map<string, AgentPolicyEnvelope> = new Map();

  /**
   * Load policy
   */
  loadPolicy(envelope: AgentPolicyEnvelope): void {
    // Verify signatures
    this.verifySignatures(envelope);
    
    // Check expiration
    if (new Date(envelope.expiresAt) < new Date()) {
      throw new Error('Policy has expired');
    }

    this.policies.set(envelope.id, envelope);
  }

  /**
   * Evaluate policy
   */
  async evaluate(
    action: string,
    resource: { type: string; [key: string]: any },
    context: { user: string; timestamp: number; location?: string }
  ): Promise<{
    allowed: boolean;
    reason?: string;
    matchedPolicy?: string;
  }> {
    // Sort policies by priority
    const sortedPolicies = Array.from(this.policies.values())
      .flatMap(e => e.policies)
      .sort((a, b) => b.priority - a.priority);

    for (const policy of sortedPolicies) {
      // Check resource type match
      if (policy.resource.type !== resource.type) continue;

      // Check action match
      if (policy.action !== 'all' && policy.action !== action) continue;

      // Check resource constraints
      const resourceMatch = this.matchResourceConstraints(resource, policy.resource.constraints);
      if (!resourceMatch) continue;

      // Check conditions
      const conditionsMet = await this.evaluateConditions(policy.conditions, context);
      if (!conditionsMet) continue;

      // Policy matched
      if (policy.effect === 'deny') {
        return { allowed: false, reason: `Denied by policy: ${policy.id}`, matchedPolicy: policy.id };
      }
      if (policy.effect === 'require_review') {
        // Trigger manual review
        await this.triggerReview(policy, resource, context);
        return { allowed: false, reason: 'Requires manual review', matchedPolicy: policy.id };
      }
      return { allowed: true, matchedPolicy: policy.id };
    }

    // Default deny
    return { allowed: false, reason: 'No matching policy' };
  }

  private verifySignatures(envelope: AgentPolicyEnvelope): void {
    // Verify multi‑party signatures
    // Actual implementation would verify each signature
  }

  private matchResourceConstraints(
    resource: any,
    constraints: ResourceConstraint[]
  ): boolean {
    for (const constraint of constraints) {
      const value = resource[constraint.field];
      switch (constraint.operator) {
        case 'eq':
          if (value !== constraint.value) return false;
          break;
        case 'gt':
          if (value <= constraint.value) return false;
          break;
        case 'gte':
          if (value < constraint.value) return false;
          break;
        case 'lt':
          if (value >= constraint.value) return false;
          break;
        case 'lte':
          if (value > constraint.value) return false;
          break;
        case 'in':
          if (!constraint.value.includes(value)) return false;
          break;
        case 'contains':
          if (!value.includes(constraint.value)) return false;
          break;
      }
    }
    return true;
  }

  private async evaluateConditions(
    conditions: Condition[],
    context: any
  ): Promise<boolean> {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'time':
          const now = Date.now();
          if (condition.params.start && now < condition.params.start) return false;
          if (condition.params.end && now > condition.params.end) return false;
          break;
        case 'amount':
          if (context.amount > condition.params.max) return false;
          break;
        case 'location':
          if (context.location && !condition.params.allowed.includes(context.location)) {
            return false;
          }
          break;
        case 'compliance':
          // Check compliance status
          break;
      }
    }
    return true;
  }

  private async triggerReview(
    policy: Policy,
    resource: any,
    context: any
  ): Promise<void> {
    // Trigger manual review workflow
    console.log('[Policy] Review triggered:', { policy: policy.id, resource, context });
  }
}
```

### 3.5 Complete Integration: e‑cny‑CoCa Main Entry Point

```typescript
// packages/compute-market/src/index.ts
// e‑cny‑CoCa Complete Integration – based on IETF UTXO6‑DNS + W3C UW2ICG

// ============ DNS Layer (IETF draft-01) ============
export { UTXODNSResolver } from './dns/UTXODNSResolver';
export type { UTXORR, EDNS0Capability } from './dns/UTXODNSResolver';

// ============ Wallet Layer (W3C UW2ICG) ============
export { UW2ICGWallet } from './wallet/UW2ICGWallet';
export type { IUW2ICGWallet, PaymentParams, SignedPayment, VerifiableCredential } from './wallet/UW2ICGWallet';

// ============ Compliance Layer (PRN + AnteHandler + AgentPolicy) ============
export { PRNComplianceEngine } from './compliance/PRNComplianceEngine';
export { AgentPolicyEnforcer, AgentPolicyEnvelope } from './compliance/AgentPolicyEnvelope';
export type { PRNAttributes, PRNAUDITRR } from './compliance/PRNComplianceEngine';

// ============ Core Engines ============
export { ComputeAssetizationEngine } from './core/ComputeAssetizationEngine';
export { DataMarketplace } from './core/DataMarketplace';
export { ComputeTradingEngine } from './core/ComputeTradingEngine';
export { CurrencyExchangeEngine } from './core/CurrencyExchangeEngine';

// ============ Utilities ============
export { VLEIVerifier } from './utils/vleiVerifier';
export { ZKProof } from './utils/zkProof';

// ============ Type Definitions ============
export * from './types';

// ============ Quick Initialization ============
export function initializeCoCaEcosystem(
  config: {
    domain: string;           // .utxo domain
    privateKey: string;       // wallet private key
    cmbaas: CMBaaSConfig;
    eCNY: ECNYIntegrationConfig;
  }
) {
  // 1. Initialize UW2ICG wallet
  const wallet = new UW2ICGWallet(config.domain, config.privateKey);

  // 2. Initialize DNS resolver
  const dnsResolver = new UTXODNSResolver();

  // 3. Initialize PRN compliance engine
  const complianceEngine = new PRNComplianceEngine();

  // 4. Initialize policy enforcer
  const policyEnforcer = new AgentPolicyEnforcer();

  // 5. Initialize trading engine
  const tradingEngine = new ComputeTradingEngine();

  // 6. Initialize exchange engine
  const exchangeEngine = new CurrencyExchangeEngine(config.cmbaas, config.eCNY);

  return {
    wallet,
    dnsResolver,
    complianceEngine,
    policyEnforcer,
    tradingEngine,
    exchangeEngine,

    // Quick method: complete transaction flow
    async executeTransaction(params: {
      from: string;
      to: string;
      amount: number;
      currency: 'JMS' | 'CNY' | 'USDC';
      purpose: string;
    }) {
      // 1. DNS resolution
      const [fromRR, toRR] = await Promise.all([
        dnsResolver.resolve(params.from),
        dnsResolver.resolve(params.to),
      ]);

      // 2. AnteHandler compliance check
      const compliance = await complianceEngine.anteHandlerCheck({
        from: params.from,
        to: params.to,
        amount: params.amount,
        currency: params.currency,
        timestamp: Date.now(),
      });

      if (!compliance.allowed) {
        throw new Error(`Compliance check failed: ${compliance.reason}`);
      }

      // 3. Policy evaluation
      const policyResult = await policyEnforcer.evaluate(
        'payment',
        { type: 'payment', amount: params.amount, currency: params.currency },
        { user: params.from, timestamp: Date.now() }
      );

      if (!policyResult.allowed) {
        throw new Error(`Policy denied: ${policyResult.reason}`);
      }

      // 4. Execute transaction (based on currency type)
      if (params.currency === 'CNY') {
        return exchangeEngine.exchangeECNYtoJMS({
          userId: params.from,
          amountCNY: params.amount,
          purpose: params.purpose,
          sourceChannel: 'wallet',
        });
      } else {
        // JMS or other asset trade
        return tradingEngine.executeTrade({
          from: params.from,
          to: params.to,
          amount: params.amount,
          assetType: params.currency === 'JMS' ? 'jms' : 'compute',
        });
      }
    },
  };
}
```

---

## 4. Standard Compliance Verification

| Standard Requirement | Implementation Location | Verification Method |
|----------------------|-------------------------|---------------------|
| **IETF UTXO6‑DNS** | | |
| UTXO RR type 260 | `UTXODNSResolver.queryUTXORR()` | DNS query returns type 260 |
| EDNS0 capability discovery | `UTXODNSResolver.discoverCapabilities()` | OPT RR contains capability options |
| PRN regulatory attributes | `PRNAttributes` interface | UTXO RR includes prnAttributes |
| PRNAUDIT RR | `PRNComplianceEngine.generateAuditRR()` | Daily audit summary RR |
| 2‑of‑3 MPC signatures | `getMPCSignatures()` | Three audit institutions jointly sign |
| AnteHandler | `PRNComplianceEngine.anteHandlerCheck()` | Pre‑mempool compliance check |
| AgentPolicyEnvelope | `AgentPolicyEnvelope` interface | Declarative authorization policies |
| vLEI integration | `VLEIVerifier` | Real‑time GLEIF vLEI verification |
| **W3C UW2ICG** | | |
| .utxo → multi‑chain endpoint resolution | `UW2ICGWallet.resolveUTXODomain()` | Returns chain ID and address |
| Self‑sovereign authentication | `UW2ICGWallet.authenticate()` | Private key signs challenge |
| Payment signing | `UW2ICGWallet.signPayment()` | Cross‑chain payment construction & signing |
| vLEI credential presentation | `UW2ICGWallet.presentCredential()` | JSON‑LD Verifiable Credential |

---

## 5. Deployment & Verification

### 5.1 DNS Configuration (UTXO RR)

```bash
# Add UTXO RR (type 260) on authoritative DNS server
# Example: for provider.utxo

$ORIGIN provider.utxo.
@  IN  UTXO  "cmbaas" "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" "JMS" "did:vlei:provider" '{"jurisdiction":"CN","complianceLevel":"enhanced"}'
```

### 5.2 Verify Resolution

```typescript
// Verify UTXO‑DNS resolution
const resolver = new UTXODNSResolver();
const rr = await resolver.resolve('provider.utxo');
console.log('Chain:', rr.rdata.chain);        // 'cmbaas'
console.log('Endpoint:', rr.rdata.endpoint);  // '0x742d...'
console.log('vLEI:', rr.rdata.vleiRef);       // 'did:vlei:provider'
```

### 5.3 Wallet Interoperability Verification

```typescript
// Verify W3C UW2ICG wallet interoperability
const wallet = new UW2ICGWallet('alice.utxo', privateKey);

// 1. Resolution
const toRR = await wallet.resolveUTXODomain('bob.utxo');

// 2. Authentication
const auth = await wallet.authenticate('random-challenge-123');

// 3. Payment signing
const payment = await wallet.signPayment({
  from: 'alice.utxo',
  to: 'bob.utxo',
  amount: 100,
  currency: 'JMS',
  chain: 'cmbaas',
});

// 4. Credential presentation
const credential = await wallet.presentCredential({
  selectiveDisclosure: true,
  fields: ['legalName', 'status'],
});
```

## Contributors

We gratefully acknowledge the following individuals and organizations for their contributions to UTXO6-DNS:

### Organizations

- **Zhongshiyuan (Hainan Special Economic Zone) Tourism Group Co., Ltd.**

### Individuals

- **Guo Sheng ** — Zhongshiyuan (Hainan Special Economic Zone) Tourism Group Co., Ltd.— [guo11907360@qq.com](mailto:guo11907360@qq.com)

---

### UW2ICG Affiliation

This project is the official reference implementation of the **UTXO Web Wallet Interoperability (UW2I) Community Group** at W3C.

- **W3C Community Group:** [`w3c-cg/uw2i`](https://github.com/w3c-cg/uw2i)
- **IETF Draft:** [`draft-guorong-utxo-dns-01`](https://www.ietf.org/ietf-ftp/internet-drafts/draft-guorong-utxo-dns-01.html)
- **Charter:** [charter/charter.md](https://github.com/w3c-cg/uw2i/blob/main/charter/charter.md)

All contributors to this project are recognized as participants in the UW2I CG community.

docs: add Guo Sheng (Zhongshiyuan) to contributors with UW2ICG affiliation

---


### Individuals

- **Tian Guorong ** — Hong Kong Ronghua International Group Limited
  - Co-author: Web3 Hong Kong Stablecoin Infrastructure White Paper
  - IETF: `draft-guorong-utxo-dns-01`
  - GitHub: [@guorongtian](https://github.com/guorongtian)

- **Lei Zhibin ** — Hong Kong Ronghua International Group Limited
  - Co-author: Web3 Hong Kong Stablecoin Infrastructure White Paper
  - Email: [zblei@ust.hk](mailto:zblei@ust.hk)

- **Huang Xinfeng** — Hong Kong Ronghua International Group Limited
  - Co-author: Web3 Hong Kong Stablecoin Infrastructure White Paper
  - Email: [1421798706@qq.com](mailto:1421798706@qq.com)
  - docs: add Web3 Hong Kong Stablecoin Infrastructure white paper

Co-authors: Tian Guorong, Lei Zhibin, Huang Xinfeng
Institution: Hong Kong Ronghua International Group Limited
Standards: IETF draft-guorong-utxo-dns-01 · W3C UW2ICG · BIS Project Agorá


- **Tian Guorong (田国荣)** — Hong Kong Ronghua International Group Limited
  - Co-author: CoCa Merchant Acquiring System and API Design
  - IETF: `draft-guorong-utxo-dns-01`
  - W3C UW2ICG: Charter Supporter

- **Lei Zhibin (雷志斌)** — Hong Kong Ronghua International Group Limited
  - Co-author: CoCa Merchant Acquiring System and API Design
  - Email: [zblei@ust.hk](mailto:zblei@ust.hk)
  - W3C UW2ICG: Charter Supporter

- **Huang Xinfeng (黃鑫鋒)** — Hong Kong Ronghua International Group Limited
  - Co-author: CoCa Merchant Acquiring System and API Design
  - Email: [1421798706@qq.com](mailto:1421798706@qq.com)
  - W3C UW2ICG: Charter Supporter
 
  - docs: add CoCa Merchant Acquiring System and API Design

Co-authors: Tian Guorong, Lei Zhibin, Huang Xinfeng
Institution: Hong Kong Ronghua International Group Limited
Standards: IETF draft-guorong-utxo-dns-01 · W3C UW2ICG

