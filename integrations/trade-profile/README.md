# Trade Profile DApp: .utxo-based Enterprise Identity for Commodity Trade

## Overview

This module provides a framework for building and verifying **enterprise trade profiles** using `.utxo` domains as the primary digital identity anchor.

## Problem Statement

In commodity trade finance:
- Counterparty identity verification is fragmented
- Compliance status is difficult to verify in real-time
- Trade history is siloed across multiple platforms
- Fraud risks remain high due to information asymmetry

## Solution

The Trade Profile DApp enables:

- **Unified Identity:** Bind `.utxo` domains to vLEI-verified legal entities
- **Verifiable Credentials:** Store trade credentials with IPFS-backed verification
- **Real-time Compliance:** Integrate with PRN nodes for instant KYC/AML checks
- **Trust Scoring:** Calculate counterparty risk scores based on multiple data sources
- **Decentralized Profile:** Enterprises control their own trade data

## Architecture
┌─────────────────────────────────────────────────────────────┐
│ Trade Profile DApp │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │
│ │ Profile │ │ Trust │ │ Compliance │ │
│ │ Manager │ │ Score │ │ Checker │ │
│ └─────────────┘ └─────────────┘ └───────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │
│ │ UTXO │ │ vLEI │ │ IPFS │ │
│ │ Resolver │ │ Verifier │ │ Storage │ │
│ └─────────────┘ └─────────────┘ └───────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Smart Contracts │
│ ┌─────────────────────────────┐ │
│ │ TradeProfile.sol │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ UTXO6-DNS Protocol │
└─────────────────────────────────────────────────────────────┘
## Quick Start

### Installation

```bash
cd integrations/trade-profile
npm install

Build
npm run build

Test
npm test

Basic Usage
import { TradeProfileManager } from './src/core/TradeProfileManager';

const manager = new TradeProfileManager();

// Register a trade profile
const profile = await manager.registerProfile({
  domain: 'example-corp.utxo',
  legalName: 'Example Corporation Ltd.',
  vlei: 'did:vlei:example-corp',
  tradeCredentials: {
    businessLicense: '0x1234...',
    taxId: 'TIN-123456',
    certifications: ['ISO9001', 'ISO27001']
  },
  complianceStatus: {
    kycVerified: true,
    amlScreened: true,
    sanctionListChecked: false
  }
});

// Verify counterparty
const verification = await manager.verifyCounterparty('partner.utxo');
console.log(verification.trustScore);
console.log(verification.recommendation);

API Reference
TradeProfileManager
registerProfile(params)
Registers a new trade profile for a .utxo domain.

updateProfile(domain, updates)
Updates an existing trade profile.

verifyCounterparty(domain)
Verifies a counterparty and returns a trust score.

getProfile(domain)
Retrieves a trade profile by .utxo domain.

TrustScoreCalculator
calculate(profile)
Calculates a trust score based on multiple factors:

vLEI verification status (30%)

Compliance status (25%)

Trade history (25%)

Profile completeness (20%)

ComplianceChecker
check(domain)
Performs real-time compliance checks:

vLEI real-time status

Sanction list screening

KYC/AML verification

Smart Contract
TradeProfile.sol
contract TradeProfile {
    struct Profile {
        string domain;
        string legalName;
        string vlei;
        string ipfsHash;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
    }
    
    mapping(string => Profile) public profiles;
    
    event ProfileRegistered(string indexed domain);
    event ProfileUpdated(string indexed domain);
    
    function registerProfile(string memory domain, string memory legalName, string memory vlei, string memory ipfsHash) external;
    function updateProfile(string memory domain, string memory ipfsHash) external;
    function getProfile(string memory domain) external view returns (Profile memory);
    function verifyProfile(string memory domain) external view returns (bool);
}

Use Cases
1. Trade Finance Verification
Banks can verify counterparty identities before issuing LCs.

2. Supply Chain Onboarding
Suppliers can present verified trade profiles to buyers.

3. Regulatory Reporting
Regulators can query PRN nodes for trade profile compliance.

4. Cross-Border Trade
Customs authorities can verify trade parties in real time.

Contributing
Please refer to the main repository's CONTRIBUTING.md.

License
Apache License 2.0
Contact
Project Lead: Guo Sheng

Institution: Zhongshiyuan (Hainan Special Economic Zone) Tourism Group Co., Ltd.

Email: guo11907360@qq.com
