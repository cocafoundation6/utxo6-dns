# Web3 Hong Kong Stablecoin Infrastructure

## Hong Kong Stablecoin & RWA Consumption Capitalization Ultimate Form

**Authors**: Tian Guorong, Lei Zhibin, Huang Xinfeng  
**Institution**: Hong Kong Ronghua International Group Limited  
**Standards**: IETF draft-guorong-utxo-dns-01 · W3C UW2ICG · BIS Project Agorá  
**Contribution Repository**: https://github.com/utxo6-dns/utxo6-dns

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Capital Positioning & Market Differentiation](#2-capital-positioning--market-differentiation)
3. [System Architecture](#3-system-architecture)
4. [Core Implementation](#4-core-implementation)
5. [Smart Contracts](#5-smart-contracts)
6. [Deployment Guide](#6-deployment-guide)
7. [Contributing](#7-contributing)

---

## 1. Executive Summary

### 1.1 Vision Statement

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Web3 Hong Kong Stablecoin Infrastructure                 │
│                                                                             │
│        "Not another stablecoin, but an infrastructure that transforms       │
│         Hong Kong's consumption economy into on-chain capital"              │
│                                                                             │
│   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐               │
│   │  Consumption  │ →  │  RWA Token-   │ →  │  Global       │               │
│   │  Capitaliza-  │    │  ization      │    │  Liquidity    │               │
│   │  tion         │    │  (HK Bond     │    │  (UTXO-DNS)   │               │
│   │  (PayMe)      │    │  Repo)        │    │               │               │
│   └───────────────┘    └───────────────┘    └───────────────┘               │
│                                                                             │
│   JMS = ISO 20022 Extended Character Set → Any replicable, programmable     │
│         on-chain value carrier                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Core Principles

| Principle | Description |
|-----------|-------------|
| **Open Source** | All code is publicly auditable; no proprietary lock-in |
| **Standard-Based** | IETF DNS, W3C UW2ICG, ISO 20022, BIS Project Agorá |
| **User-Centric** | Every consumer benefits directly from daily spending |
| **Capital Neutral** | Any compliant asset can register .utxo domains |
| **Regulatory Ready** | Built-in PRN compliance, AML/CTF, vLEI verification |

### 1.3 What is JMS?

> **JMS is NOT an acronym for "JiaoMi Stablecoin." It represents the ISO 20022 extended character set identifier — meaning "any replicable, programmable on-chain value carrier."**

**Design Philosophy:**
- **Replicable**: Can be issued, burned, and transferred on any compatible chain
- **Programmable**: Built-in smart contract logic for automated investment allocation
- **Interoperable**: ISO 20022 compliant, seamless integration with traditional finance

---

## 2. Capital Positioning & Market Differentiation

### 2.1 Market Positioning: From "Strategic" to "Capital"

| Aspect | Strategic Positioning (Old) | **Capital Positioning (New)** |
|--------|----------------------------|------------------------------|
| Core Question | Competing with other currencies | **How can capital flow most efficiently?** |
| Narrative Framework | Geopolitical | **Market efficiency + Tech innovation** |
| Objective | Currency internationalization | **Optimal global capital allocation** |
| Anchor | National credit | **RWA scenario credit + Consumption cash flow** |
| Moat | Policy barriers | **Open standards + Network effects** |

### 2.2 Differentiation Matrix: USD Stablecoins vs. Hong Kong Stablecoin (JMS)

| Dimension | USD Stablecoins (USDC/USDT) | **Hong Kong JMS** |
|-----------|----------------------------|-------------------|
| **Underlying Asset** | **Single: US Treasury** (80%+ of reserves) | **Diverse: Consumption cash flow + HK Bonds + RWA mix** |
| **Yield Source** | US Treasury interest (5.22%) | **Consumption capitalization + HK Bond repo (3.8%-4.8%)** |
| **Application Scenarios** | Exchange arbitrage, DeFi collateral, cross-border payments | **Retail consumption, supply chain finance, fractional RWA investment** |
| **Target Users** | Institutions, traders, high-net-worth | **SMEs, ordinary consumers, micro-enterprises** |
| **Asset Scale** | $75B-$187B (whale-level) | **Incremental from niche scenarios** |
| **Value Proposition** | "Digital twin of USD" | **"Every transaction becomes programmable capital"** |
| **Regulatory Model** | Single jurisdiction (US) | **Hong Kong framework + Global RWA scenario adaptation** |
| **Technical Standard** | ERC-20 (Ethereum) | **ISO 20022 + UTXO-DNS (IETF standard)** |

### 2.3 The Three Pillars of Capital Positioning

#### 2.3.1 Scenario-Based: RWA is Not "13 Trillion" — It's "Specific Consumption Scenarios"

**USD Stablecoin Logic:**
> 1 USD → 1 USDC → US Treasury purchase → 5.22% yield → **Capital serves "money making money" only**

**Hong Kong JMS Logic:**
> 1 HKD consumption → 1 JMS minted → Anchored to consumption cash flow + HK Bond → 3.8%-4.8% yield → **Capital serves "real economic activity"**

**Scenario Examples:**

| Consumption Scenario | JMS Minting Volume (Daily Est.) | RWA Anchor |
|---------------------|--------------------------------|------------|
| HSBC PayMe Offline Retail | HKD 200M/day | **Consumer installment cash flow** |
| Convenience Stores (7-Eleven/Circle K) | HKD 50M/day | **Supply chain receivables** |
| F&B & Retail | HKD 30M/day | **Merchant future revenue** |
| Cross-border E-commerce | HKD 10M/day | **Cross-border settlement receivables** |

> **USD stablecoins anchor to "US government taxing power." JMS anchors to "Hong Kong citizens' spending power." The former is macro and centralized; the latter is micro, distributed, and scenario-based.**

#### 2.3.2 Niche-to-Universal: From "Whale Assets" to "Capillary Network"

**USD Stablecoins: "Whale Game"**
- USDC $75B market cap, concentrated in institutional trading
- BlackRock BUIDL $2.93B, high minimum investment thresholds
- Ordinary consumers cannot participate or perceive it

**Hong Kong JMS: "Capillary Network"**
- JMS minimum unit as low as HKD 1
- Every PayMe transaction mints JMS automatically
- SMEs automatically receive JMS investment allocation (HK Bond repo)
- **Niche is not about small scale — it's about fine granularity, enabling every individual to participate in the RWA economy**

| User Type | USD Stablecoin Participation | **Hong Kong JMS Participation** |
|-----------|-----------------------------|--------------------------------|
| Ordinary Consumer | Almost none | **Daily spending → Auto JMS minting → CoCa rewards** |
| SME Merchant | High KYC/compliance barriers | **PayMe acquiring → Auto JMS → HK Bond investment** |
| Micro-Enterprise | No access to US Treasury market | **JMS staking → HK Bond repo yield** |
| Institutional Investor | Direct USDC/BUIDL purchase | **Discover JMS RWA pools via UTXO-DNS → Compliant allocation** |

#### 2.3.3 Inclusive by Design: Open Standards = Zero-Friction Access

**UTXO-DNS is an open, public IETF Internet standard (draft-01):**

| Feature | Meaning | Impact on Capital Flow |
|---------|---------|----------------------|
| **Open Source** | Publicly auditable code | **Trust without permission; capital verifiable** |
| **Public** | Globally resolvable via DNS infrastructure | **No franchise monopoly; anyone can access** |
| **Standard** | IETF experimental RFC process | **Internet spirit → Financial Internet infrastructure** |
| **Interoperable** | Multi-chain compatible (CMBaaS/Ethereum/mBridge) | **Capital freely flows across RWA scenarios** |

**Inclusivity at Three Levels:**

**Level 1 — Issuance:** Any compliant institution can register a `.utxo` domain and issue RWA assets — no "single issuer" monopoly.

**Level 2 — Access:** Any consumer can participate in JMS minting via PayMe and similar wallets — no "accredited investor" requirement.

**Level 3 — Yield:** Any JMS holder automatically receives HK Bond repo yield — distribution based on code logic, not relationships.

### 2.4 The "Third Path": Technology Neutrality

| Dimension | Choosing Sides (USDC/USDT Model) | **Not Choosing Sides (JMS + UTXO-DNS Model)** |
|-----------|----------------------------------|---------------------------------------------|
| Political Stance | Must pick a side | **Technology neutral, user-first** |
| Asset Anchor | Single: US Treasury | **Diverse: Consumption cash flow + HK Bonds + Any RWA** |
| Core Logic | "You must use my money" | **"You can use any money, but run on my track"** |
| User Benefit | Indirect (institutions first) | **Direct (everyone benefits from daily spending)** |

> **USDC represents Western capital and order. USDT represents the essential needs of Global South nations. They are essentially different facets of the USD system — two wings of the dollar's sphere of influence.**

> **JMS + UTXO-DNS represents not a third currency, but a third infrastructure — it does not oppose any currency, nor endorse any camp. It does one thing: enable any compliant currency, asset, and capital to be discovered, verified, and interacted with on a unified naming layer.**

> **In the end, it's not technology that wins, nor capital — users win. Because small-value consumption generates yield, ordinary people can participate in RWA, merchants receive automated investment, and global liquidity converges at one point.**

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Web3 Hong Kong Stablecoin Infrastructure                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    FRONTEND LAYER (Consumption Entry)               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ HSBC PayMe   │  │ Merchant POS │  │ Web3 Wallet  │               │    │
│  │  │ 3M+ Users    │  │ 100K+ Merch. │  │ W3C UW2ICG   │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    PAYMENT LAYER (Consumption Capitalization)       │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  Acquiring → Payment → Bank → 1:1 JMS → HK Bond             │    │    │
│  │  │  Gateway   Processing Settlement Minting    Repo            │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    COMPLIANCE LAYER (PRN)                           │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  • Real-time AML/CTF    • vLEI Verification (GLEIF)         │    │    │
│  │  │  • PRNAUDIT RR Digest   • 2-of-3 MPC Threshold Signatures   │    │    │
│  │  │  • AgentPolicyEnvelope  • HKMA Real-time Reporting          │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    ASSET LAYER (JMS + RWA)                          │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  JMS Minting Contract  →  CMBaaS (3s Block Time)            │    │    │
│  │  │       (1:1 Fiat Anchor)                                     │    │    │
│  │  │       ↓                              ↓                      │    │    │
│  │  │  ZA Bank Reserve Custody     CoCa DEX (JMS/CoCa Trading)    │    │    │
│  │  │  (HKMA Regulated)            (RWA Consumption Liquidity)    │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    NAMING LAYER (UTXO-DNS)                          │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  • .utxo Domain Resolution (IETF RR Type 260)               │    │    │
│  │  │  • Multi-Chain Endpoint Mapping (CMBaaS/Ethereum/mBridge)   │    │    │
│  │  │  • vLEI Legal Entity Binding                                │    │    │
│  │  │  • PRN Regulatory Attribute Declaration                     │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    CROSS-CHAIN LAYER (BIS Unified Ledger)           │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  • Standard Chartered mBridge HKD CBDC Liquidity            │    │    │
│  │  │  • Atomic Settlement (VRF Finality Proof)                   │    │    │
│  │  │  • BIS Unified Ledger Interoperability                      │    │    │
│  │  │  • Cross-border Settlement (Sub-second)                     │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    INCENTIVE LAYER (CoCa Rewards)                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  • Consumption Contribution Calculation                     │    │    │
│  │  │  • Loyalty Tiers (Bronze/Silver/Gold/Platinum)              │    │    │
│  │  │  • CoCa Reward Distribution                                 │    │    │
│  │  │  • DEX Export (CoCa DEX)                                    │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Architecture Flow

1. **User Payment**: Consumer pays via HSBC PayMe at offline merchants
2. **Acquiring Gateway**: Processes payment, validates bank settlement
3. **JMS Minting**: 1:1 fiat-backed JMS minting on CMBaaS
4. **HK Bond Repo**: Automatic investment allocation to HK Government bonds
5. **PRN Compliance**: Real-time AML/CTF, vLEI verification, audit logging
6. **UTXO-DNS Resolution**: Human-readable .utxo domain → on-chain address mapping
7. **Cross-Chain Settlement**: mBridge/BIS Unified Ledger atomic settlement
8. **User Rewards**: CoCa rewards based on consumption contribution

---

## 4. Core Implementation

### 4.1 Directory Structure

```
integrations/hk-stablecoin-infrastructure/
├── README.md                          # Strategic whitepaper
├── Cargo.toml                         # Rust dependencies
├── package.json                       # TypeScript dependencies
├── src/
│   ├── lib.rs                         # Library entry
│   ├── payment/                       # Payment layer
│   │   ├── payme_adapter.rs           # HSBC PayMe integration
│   │   ├── acquiring_gateway.rs       # Acquiring gateway
│   │   └── settlement_verifier.rs     # Settlement verification
│   ├── jms/                           # JMS minting layer
│   │   ├── minting_engine.rs          # 1:1 minting engine
│   │   ├── iso20022_compliance.rs     # ISO 20022 standard alignment
│   │   └── reserve_manager.rs         # Reserve management (ZA Bank)
│   ├── investment/                    # Investment layer
│   │   ├── hk_bond_repo.rs            # HK Government bond repo
│   │   └── portfolio_manager.rs       # Portfolio manager
│   ├── compliance/                    # Compliance layer
│   │   ├── prn_adapter.rs             # PRN regulatory compliance
│   │   ├── ante_handler.rs            # AnteHandler compliance check
│   │   ├── vlei_verifier.rs           # vLEI identity verification
│   │   └── agent_policy.rs            # AgentPolicyEnvelope
│   ├── naming/                        # Naming layer
│   │   ├── utxo_dns_resolver.rs       # UTXO-DNS resolver
│   │   └── domain_manager.rs          # .utxo domain management
│   ├── cross_chain/                   # Cross-chain layer
│   │   ├── mbridge_connector.rs       # Standard Chartered mBridge
│   │   ├── bis_ledger_connector.rs    # BIS Unified Ledger
│   │   └── atomic_settlement.rs       # Atomic settlement (VRF)
│   ├── rewards/                       # Incentive layer
│   │   ├── contribution_calculator.rs # Consumption contribution
│   │   ├── coca_reward_engine.rs      # CoCa reward engine
│   │   └── dex_exporter.rs            # DEX export
│   └── contracts/                     # Smart contracts
│       ├── JMSMinting.sol             # JMS minting contract
│       ├── HKRepoManager.sol          # HK Bond repo management
│       └── CocaRewards.sol            # CoCa rewards contract
├── tests/                             # Integration tests
│   └── integration_test.rs
├── examples/                          # Examples
│   ├── consumer_payment.rs            # Consumer payment example
│   └── cross_border_settlement.rs     # Cross-border settlement
└── docs/                              # Documentation
    ├── architecture.md
    ├── api_reference.md
    └── deployment_guide.md
```

### 4.2 Payment Layer: HSBC PayMe Adapter

```rust
// src/payment/payme_adapter.rs
// HSBC PayMe Payment Integration Adapter

use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// PayMe Payment Request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PayMePaymentRequest {
    pub payme_token: String,         // PayMe payment token
    pub merchant_id: Uuid,            // Merchant ID
    pub amount: BigDecimal,           // Payment amount
    pub currency: String,             // HKD
    pub merchant_address: String,     // Merchant blockchain address (.utxo domain)
    pub payme_user_id: String,        // PayMe user ID
    pub timestamp: DateTime<Utc>,
}

/// HSBC PayMe Adapter
pub struct HSBCPayMeAdapter {
    hsbc_api_endpoint: String,
    hsbc_api_key: String,
    jms_minting_engine: Arc<JMSMintingEngine>,
    compliance_checker: Arc<PRNComplianceAdapter>,
}

impl HSBCPayMeAdapter {
    pub async fn process_payment(
        &self,
        request: PayMePaymentRequest,
    ) -> Result<PaymentResult, PaymentError> {
        // 1. Validate PayMe payment token
        let validation = self.validate_payme_token(&request.payme_token).await?;
        
        // 2. AML/CTF compliance check (AnteHandler)
        let compliance = self.compliance_checker
            .check_compliance(PrnComplianceRequest {
                transaction_id: format!("payme_{}", Uuid::new_v4()),
                payer_domain: format!("{}.payme.utxo", request.payme_user_id),
                payee_domain: request.merchant_address.clone(),
                amount: request.amount.clone(),
                currency: request.currency.clone(),
                timestamp: request.timestamp.timestamp() as u64,
            })
            .await?;
        
        if compliance.status == PrnComplianceStatus::Rejected {
            return Err(PaymentError::ComplianceRejected(compliance.risk_score));
        }
        
        // 3. Call HSBC settlement API
        let settlement = self.hsbc_settlement(&request).await?;
        
        // 4. Trigger JMS minting (1:1 fiat anchor)
        let mint_result = self.jms_minting_engine
            .mint_jms(MintRequest {
                fiat_amount: settlement.net_amount.clone(),
                fiat_currency: "HKD".to_string(),
                bank_settlement_id: settlement.settlement_id.clone(),
                bank_proof: settlement.bank_proof.clone(),
                merchant_address: request.merchant_address.clone(),
                payment_source: PaymentSource::PayMe,
            })
            .await?;
        
        Ok(PaymentResult {
            payment_id: validation.payment_id,
            settlement: settlement,
            mint: mint_result,
            compliance: compliance,
            timestamp: Utc::now(),
        })
    }
}
```

### 4.3 Investment Layer: HK Government Bond Repo

```rust
// src/investment/hk_bond_repo.rs
// Hong Kong Government Bond Repo Investment Module

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Duration, Utc};

/// Hong Kong Government Bond Types
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HKBondType {
    /// Exchange Fund Bill (91-day)
    ExchangeFundBill91Day,
    /// Government Bond (3-year)
    GovernmentBond3Year,
    /// Government Bond (5-year)
    GovernmentBond5Year,
    /// Government Bond (10-year)
    GovernmentBond10Year,
}

/// HK Government Bond Repo Request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HKBondRepoRequest {
    pub jms_amount: BigDecimal,          // JMS amount to invest
    pub merchant_id: Uuid,               // Merchant ID
    pub bond_type: HKBondType,           // Bond type
    pub tenor_days: u32,                 // Tenor (days)
    pub expected_yield: f64,             // Expected yield
}

/// HK Government Bond Repo Response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HKBondRepoResponse {
    pub repo_id: String,                 // Repo transaction ID
    pub bond_type: HKBondType,
    pub principal: BigDecimal,           // Principal
    pub yield_rate: f64,                 // Yield rate
    pub purchase_date: DateTime<Utc>,
    pub maturity_date: DateTime<Utc>,
    pub expected_return: BigDecimal,     // Expected return
    pub repo_tx_hash: String,            // On-chain transaction hash
}

/// HK Government Bond Repo Manager
pub struct HKBondRepoManager {
    hkma_api_endpoint: String,           // HKMA bond API endpoint
    hkicl_connector: HKICLConnector,     // HKICL settlement system
    positions: HashMap<String, HKBondRepoResponse>,
}

impl HKBondRepoManager {
    /// Execute HK Government Bond Repo
    pub async fn execute_repo(
        &self,
        request: HKBondRepoRequest,
    ) -> Result<HKBondRepoResponse, RepoError> {
        // 1. Query HKMA for latest bond yields
        let bond_info = self.hkma_get_bond_info(&request.bond_type).await?;
        
        // 2. Calculate purchase price
        let purchase_price = self.calculate_purchase_price(
            &request.jms_amount,
            &bond_info,
        );
        
        // 3. Execute repo via HKICL
        let repo_tx = self.hkicl_connector
            .execute_repo(RepoExecutionRequest {
                bond_id: bond_info.bond_id.clone(),
                amount: purchase_price,
                buyer: request.merchant_id.to_string(),
                settlement_date: Utc::now() + Duration::days(2),
                maturity_date: Utc::now() + Duration::days(request.tenor_days as i64),
            })
            .await?;
        
        // 4. Calculate expected return
        let expected_return = purchase_price.clone()
            * (BigDecimal::from_f64(1.0 + bond_info.current_yield).unwrap())
            .pow(request.tenor_days as u32);
        
        let response = HKBondRepoResponse {
            repo_id: format!("hk_repo_{}", Uuid::new_v4()),
            bond_type: request.bond_type,
            principal: purchase_price.clone(),
            yield_rate: bond_info.current_yield,
            purchase_date: Utc::now(),
            maturity_date: Utc::now() + Duration::days(request.tenor_days as i64),
            expected_return: expected_return,
            repo_tx_hash: repo_tx.tx_hash,
        };
        
        self.positions.insert(response.repo_id.clone(), response.clone());
        Ok(response)
    }
}
```

### 4.4 JMS Minting Engine (ISO 20022 Compliant)

```rust
// src/jms/minting_engine.rs
// JMS Minting Engine - ISO 20022 Extended Character Set Implementation

use iso20022::messages::PaymentInstruction;
use iso20022::extensions::JMSCharacterSet;

/// JMS Mint Request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JMintRequest {
    pub fiat_amount: BigDecimal,        // Fiat amount
    pub fiat_currency: String,          // HKD/USD/CNY
    pub bank_settlement_id: String,     // Bank settlement ID
    pub bank_proof: BankSettlementProof, // Bank settlement proof
    pub merchant_address: String,       // Merchant blockchain address (.utxo)
    pub payment_source: PaymentSource,  // Payment source
}

/// ISO 20022 JMS Message Extension
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JMSISO20022Extension {
    pub character_set: String,          // "JMS" - ISO 20022 extended charset
    pub message_type: String,           // "pacs.008" / "pacs.009"
    pub settlement_amount: BigDecimal,
    pub settlement_currency: String,
    pub chain_metadata: ChainMetadata,
}

/// JMS Minting Engine
pub struct JMSMintingEngine {
    reserve_manager: Arc<ZAReserveManager>,  // ZA Bank reserve manager
    cmbaas_contract: Arc<CMBaaSContract>,    // CMBaaS contract interface
    iso20022_generator: ISO20022Generator,   // ISO 20022 message generator
}

impl JMSMintingEngine {
    /// 1:1 mint JMS (ISO 20022 compliant)
    pub async fn mint_jms(&self, request: JMintRequest) -> Result<JMintResponse, MintingError> {
        // 1. Verify bank settlement proof
        self.verify_bank_settlement(&request.bank_proof).await?;
        
        // 2. Check ZA Bank reserve adequacy
        let reserve_status = self.reserve_manager
            .check_reserve_adequacy(&request.fiat_currency, request.fiat_amount.clone())
            .await?;
        
        if !reserve_status.is_adequate {
            return Err(MintingError::InsufficientReserve);
        }
        
        // 3. Generate ISO 20022 compliant message
        let iso20022_message = self.iso20022_generator
            .generate_payment_instruction(PaymentInstruction {
                settlement_amount: request.fiat_amount.clone(),
                settlement_currency: request.fiat_currency.clone(),
                payer: request.merchant_address.clone(),
                extension: JMSISO20022Extension {
                    character_set: "JMS".to_string(),
                    message_type: "pacs.008".to_string(),
                    settlement_amount: request.fiat_amount.clone(),
                    settlement_currency: request.fiat_currency.clone(),
                    chain_metadata: ChainMetadata {
                        chain: "CMBaaS".to_string(),
                        contract: env!("JMS_CONTRACT_ADDRESS").to_string(),
                    },
                },
            })?;
        
        // 4. 1:1 JMS minting (with exchange rate)
        let jms_amount = self.convert_to_jms(request.fiat_amount, &request.fiat_currency)?;
        
        // 5. Call CMBaaS smart contract
        let mint_tx = self.cmbaas_contract
            .mint_jms(JMSMintTransaction {
                merchant: request.merchant_address.clone(),
                fiat_amount: request.fiat_amount,
                fiat_currency: request.fiat_currency,
                jms_amount: jms_amount.clone(),
                bank_settlement_id: request.bank_settlement_id.clone(),
                iso20022_message_hash: iso20022_message.hash(),
                reserve_proof: reserve_status.proof,
            })
            .await?;
        
        // 6. Trigger HK Bond Repo investment allocation
        let allocation = self.investment_manager
            .allocate_to_hk_bond_repo(AllocationRequest {
                jms_amount: jms_amount.clone(),
                merchant_id: request.merchant_address.clone(),
                preference: InvestmentPreference::HKBondRepo,
            })
            .await?;
        
        Ok(JMintResponse {
            jms_amount,
            mint_tx_hash: mint_tx.hash,
            iso20022_message: iso20022_message.to_string(),
            reserve_backing: reserve_status.backing_ratio,
            allocation: allocation,
            estimated_apy: allocation.expected_yield,
        })
    }
}
```

### 4.5 UTXO-DNS Resolver (Naming Layer)

```rust
// src/naming/utxo_dns_resolver.rs
// UTXO-DNS Resolver - IETF draft-guorong-utxo-dns-01

/// UTXO RR Record (type 260)
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct UTXORR {
    pub owner: String,             // .utxo domain
    pub ttl: u32,
    pub class: String,             // "IN"
    pub rdata: UTXORDATA,
}

/// UTXO RDATA (IETF draft-01 Section 3.1)
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct UTXORDATA {
    pub chain: String,             // "cmbaas" | "ethereum" | "mbridge"
    pub endpoint: String,          // On-chain address
    pub currency: String,          // "JMS" | "HKD" | "CNY"
    pub vlei_ref: Option<String>,  // vLEI credential reference
    pub prn_attributes: Option<PRNAttributes>,
    pub capabilities: Vec<String>, // EDNS0 capability identifiers
}

/// PRN Regulatory Attributes
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct PRNAttributes {
    pub jurisdiction: String,      // "HK"
    pub compliance_level: ComplianceLevel,
    pub auditor_dids: Vec<String>,
    pub hkma_regulatory_id: String, // HKMA regulatory ID
}

/// UTXO-DNS Resolver
pub struct UTXODNSResolver {
    dns_server: String,
    cache: Arc<Mutex<HashMap<String, UTXORR>>>,
}

impl UTXODNSResolver {
    /// Resolve .utxo domain (IETF draft-01 Section 4)
    pub async fn resolve(&self, domain: &str) -> Result<UTXORR, ResolveError> {
        if !domain.ends_with(".utxo") {
            return Err(ResolveError::InvalidDomain);
        }
        
        // Check cache
        {
            let cache = self.cache.lock().await;
            if let Some(cached) = cache.get(domain) {
                return Ok(cached.clone());
            }
        }
        
        // DNS over HTTPS query for UTXO RR (type 260)
        let url = format!(
            "https://{}/dns-query?name={}&type=260",
            self.dns_server, domain
        );
        let response = reqwest::get(&url).await?;
        let rr: UTXORR = response.json().await?;
        
        // Verify record
        self.verify_rr(&rr).await?;
        
        // Cache result
        {
            let mut cache = self.cache.lock().await;
            cache.insert(domain.to_string(), rr.clone());
        }
        
        Ok(rr)
    }
}
```

### 4.6 PRN Compliance Adapter

```rust
// src/compliance/prn_adapter.rs
// PRN Regulatory Compliance Adapter - HKMA Integration

use serde::{Deserialize, Serialize};

/// PRN Compliance Request (HKMA integration)
#[derive(Debug, Serialize)]
pub struct PrnComplianceRequest {
    pub transaction_id: String,
    pub payer_domain: String,          // .utxo domain
    pub payee_domain: String,          // .utxo domain
    pub amount: u64,
    pub currency: String,              // HKD
    pub timestamp: u64,
    pub hkma_regulatory_id: String,    // HKMA regulatory ID
}

/// PRN Compliance Response
#[derive(Debug, Deserialize)]
pub struct PrnComplianceResponse {
    pub status: PrnComplianceStatus,
    pub risk_score: f64,
    pub audit_hash: String,            // PRNAUDIT RR hash
    pub requires_manual_review: bool,
    pub hkma_reference: String,        // HKMA reference number
}

/// PRN Compliance Adapter
pub struct PRNComplianceAdapter {
    hkma_prn_endpoint: String,         // HKMA PRN node endpoint
    mpc_participants: Vec<String>,     // MPC threshold signature participants
    audit_log: Vec<PrnAuditEntry>,
}

impl PRNComplianceAdapter {
    pub async fn check_compliance(
        &self,
        request: PrnComplianceRequest,
    ) -> Result<PrnComplianceResponse, ComplianceError> {
        // 1. Call PRN node (HKMA integration)
        let response = self.call_prn_node(&request).await?;
        
        // 2. Generate immutable audit entry
        let audit_entry = PrnAuditEntry {
            transaction_id: request.transaction_id.clone(),
            event_type: "compliance_check".to_string(),
            event_data: serde_json::json!({
                "payer": request.payer_domain,
                "payee": request.payee_domain,
                "amount": request.amount,
                "status": format!("{:?}", response.status),
                "hkma_reference": response.hkma_reference,
            }),
            previous_hash: self.get_latest_audit_hash(),
            signature: self.sign_audit_entry().await,
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        };
        self.audit_log.push(audit_entry);
        
        // 3. Generate PRNAUDIT RR record
        self.generate_prnaudit_rr(&request.transaction_id);
        
        Ok(response)
    }
    
    /// Generate PRNAUDIT RR (IETF draft-01)
    pub fn generate_prnaudit_rr(&self, transaction_id: &str) -> Option<String> {
        self.audit_log
            .iter()
            .find(|entry| entry.transaction_id == transaction_id)
            .map(|entry| {
                format!(
                    "PRNAUDIT 0 0 0 {} {} {} {} {}",
                    entry.transaction_id,
                    entry.event_type,
                    entry.previous_hash,
                    entry.signature,
                    entry.timestamp,
                )
            })
    }
}
```

---

## 5. Smart Contracts

### 5.1 JMS Minting Contract (CMBaaS)

```solidity
// src/contracts/JMSMinting.sol
// JMS Minting Contract - Deployed on CMBaaS

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title JMS Minting Contract
 * @dev Handles 1:1 fiat-to-JMS minting - ISO 20022 Extended Character Set
 * 
 * JMS = ISO 20022 Extended Character Set → Any replicable, programmable
 *       on-chain value carrier
 */
contract JMSMinting is AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    IERC20 public jmsToken;
    address public hkmaVerifier;        // HKMA regulatory verifier
    address public zaReserveVerifier;   // ZA Bank reserve proof verifier
    
    struct MintRecord {
        address merchant;
        uint256 fiatAmount;
        string fiatCurrency;
        uint256 jmsAmount;
        string bankSettlementId;
        bytes32 bankProofHash;
        bytes32 iso20022MessageHash;
        uint256 timestamp;
        string hkmaReference;
    }
    
    mapping(bytes32 => MintRecord) public mintRecords;
    mapping(string => bool) public usedSettlementIds;
    
    event JMSMinted(
        address indexed merchant,
        uint256 fiatAmount,
        string fiatCurrency,
        uint256 jmsAmount,
        string bankSettlementId,
        bytes32 indexed mintId,
        string hkmaReference
    );
    
    event JMSBurned(
        address indexed merchant,
        uint256 jmsAmount,
        uint256 fiatAmount,
        string fiatCurrency,
        string withdrawalId
    );
    
    event HKRepoAllocated(
        address indexed merchant,
        uint256 jmsAmount,
        string repoId,
        uint256 expectedYield
    );

    constructor(
        address jmsTokenAddress,
        address hkmaVerifierAddress,
        address zaReserveAddress
    ) {
        jmsToken = IERC20(jmsTokenAddress);
        hkmaVerifier = hkmaVerifierAddress;
        zaReserveVerifier = zaReserveAddress;
        
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(COMPLIANCE_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint JMS (authorized minters only)
     */
    function mintJMS(
        address merchant,
        uint256 fiatAmount,
        string calldata fiatCurrency,
        string calldata bankSettlementId,
        bytes32 bankProofHash,
        bytes32 iso20022MessageHash,
        string calldata hkmaReference,
        bytes calldata signature
    ) external nonReentrant onlyRole(MINTER_ROLE) returns (bytes32) {
        require(!usedSettlementIds[bankSettlementId], "Settlement ID already used");
        require(verifyBankProof(...), "Invalid bank proof");
        
        uint256 jmsAmount = calculateJMSAmount(fiatAmount, fiatCurrency);
        require(jmsToken.transfer(merchant, jmsAmount), "JMS transfer failed");
        
        bytes32 mintId = keccak256(abi.encodePacked(
            merchant,
            fiatAmount,
            bankSettlementId,
            block.timestamp
        ));
        
        mintRecords[mintId] = MintRecord({
            merchant: merchant,
            fiatAmount: fiatAmount,
            fiatCurrency: fiatCurrency,
            jmsAmount: jmsAmount,
            bankSettlementId: bankSettlementId,
            bankProofHash: bankProofHash,
            iso20022MessageHash: iso20022MessageHash,
            timestamp: block.timestamp,
            hkmaReference: hkmaReference
        });
        
        usedSettlementIds[bankSettlementId] = true;
        
        emit HKRepoAllocated(merchant, jmsAmount, "", 0);
        emit JMSMinted(merchant, fiatAmount, fiatCurrency, jmsAmount, bankSettlementId, mintId, hkmaReference);
        
        return mintId;
    }
}
```

### 5.2 HK Bond Repo Management Contract

```solidity
// src/contracts/HKRepoManager.sol
// Hong Kong Government Bond Repo Management Contract

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HK Government Bond Repo Management Contract
 * @dev Manages JMS to HK Government Bond repo investments
 * 
 * Strategic Positioning: Transforms consumption capital into
 * HK Government bond investments
 */
contract HKRepoManager is AccessControl, ReentrancyGuard {
    bytes32 public constant REPO_ROLE = keccak256("REPO_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    enum BondType {
        ExchangeFundBill91Day,
        GovernmentBond3Year,
        GovernmentBond5Year,
        GovernmentBond10Year
    }
    
    struct RepoRecord {
        address merchant;
        uint256 jmsAmount;
        BondType bondType;
        uint256 principal;
        uint256 expectedReturn;
        uint256 yieldRate;
        uint256 purchaseTime;
        uint256 maturityTime;
        string hkmaBondId;
        bool settled;
    }
    
    mapping(bytes32 => RepoRecord) public repoRecords;
    mapping(address => bytes32[]) public merchantRepos;
    
    // Current yield curve (updated via HKMA API oracle)
    uint256 public hk91DayYield = 380;   // 3.80%
    uint256 public hk3YearYield = 420;   // 4.20%
    uint256 public hk5YearYield = 450;   // 4.50%
    uint256 public hk10YearYield = 480;  // 4.80%
    
    event RepoExecuted(
        address indexed merchant,
        bytes32 repoId,
        BondType bondType,
        uint256 jmsAmount,
        uint256 expectedReturn,
        uint256 maturityTime,
        string hkmaBondId
    );
    
    event RepoSettled(
        bytes32 repoId,
        uint256 returnAmount,
        uint256 yieldEarned
    );
}
```

---

## 6. Deployment Guide

### 6.1 Prerequisites

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker & Docker Compose
sudo apt-get install docker.io docker-compose -y

# Clone repository
git clone https://github.com/utxo6-dns/utxo6-dns.git
cd utxo6-dns/integrations/hk-stablecoin-infrastructure
```

### 6.2 Environment Configuration

```bash
# .env file
# Database
DB_PASSWORD=your_secure_password
DATABASE_URL=postgres://jms:${DB_PASSWORD}@localhost/jms_merchant

# Redis
REDIS_URL=redis://localhost:6379

# Blockchain
CMBAAS_RPC_URL=https://cmbaas-mainnet.infura.io/v3/your_key
JMS_CONTRACT_ADDRESS=0x...
COCA_CONTRACT_ADDRESS=0x...

# HKMA
HKMA_API_KEY=your_hkma_api_key
HKMA_PRN_ENDPOINT=https://prn.hkma.gov.hk/api/v1

# HSBC PayMe
HSBC_API_KEY=your_hsbc_api_key
HSBC_API_ENDPOINT=https://api.hsbc.com.hk/payme

# ZA Bank
ZA_RESERVE_API_KEY=your_za_api_key
ZA_RESERVE_ENDPOINT=https://api.zabank.com/reserve

# Standard Chartered mBridge
MBRIDGE_API_KEY=your_mbridge_api_key
MBRIDGE_ENDPOINT=https://api.mbridge.sc.com

# JWT
JWT_SECRET=your_jwt_secret
```

### 6.3 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: jms
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: jms_merchant
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - jms-network

  redis:
    image: redis:7-alpine
    networks:
      - jms-network

  api-gateway:
    build:
      context: .
      dockerfile: Dockerfile.api-gateway
    environment:
      DATABASE_URL: postgres://jms:${DB_PASSWORD}@postgres/jms_merchant
      REDIS_URL: redis://redis:6379
      CMBAAS_RPC_URL: ${CMBAAS_RPC_URL}
      JMS_CONTRACT_ADDRESS: ${JMS_CONTRACT_ADDRESS}
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    networks:
      - jms-network

  acquiring-service:
    build:
      context: .
      dockerfile: Dockerfile.acquiring
    environment:
      DATABASE_URL: postgres://jms:${DB_PASSWORD}@postgres/jms_merchant
      HSBC_API_KEY: ${HSBC_API_KEY}
    depends_on:
      - postgres
    networks:
      - jms-network

  minting-service:
    build:
      context: .
      dockerfile: Dockerfile.minting
    environment:
      DATABASE_URL: postgres://jms:${DB_PASSWORD}@postgres/jms_merchant
      CMBAAS_RPC_URL: ${CMBAAS_RPC_URL}
      JMS_CONTRACT_ADDRESS: ${JMS_CONTRACT_ADDRESS}
    depends_on:
      - postgres
    networks:
      - jms-network

  compliance-service:
    build:
      context: .
      dockerfile: Dockerfile.compliance
    environment:
      HKMA_API_KEY: ${HKMA_API_KEY}
      HKMA_PRN_ENDPOINT: ${HKMA_PRN_ENDPOINT}
    depends_on:
      - postgres
    networks:
      - jms-network

  investment-service:
    build:
      context: .
      dockerfile: Dockerfile.investment
    environment:
      HKMA_API_KEY: ${HKMA_API_KEY}
    depends_on:
      - postgres
    networks:
      - jms-network

  reward-service:
    build:
      context: .
      dockerfile: Dockerfile.reward
    environment:
      DATABASE_URL: postgres://jms:${DB_PASSWORD}@postgres/jms_merchant
      COCA_CONTRACT_ADDRESS: ${COCA_CONTRACT_ADDRESS}
    depends_on:
      - postgres
    networks:
      - jms-network

volumes:
  postgres_data:

networks:
  jms-network:
    driver: bridge
```

### 6.4 Build & Run

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f api-gateway

# Run tests
cargo test --all

# Run example
cargo run --example consumer_payment
```

### 6.5 Git Commit

```bash
# In utxo6-dns repository root
git checkout -b feature/hk-stablecoin-infrastructure

# Create directory structure
mkdir -p integrations/hk-stablecoin-infrastructure/src/{payment,jms,investment,compliance,naming,cross_chain,rewards,contracts}
mkdir -p integrations/hk-stablecoin-infrastructure/tests
mkdir -p integrations/hk-stablecoin-infrastructure/examples
mkdir -p integrations/hk-stablecoin-infrastructure/docs

# Add all files
git add integrations/hk-stablecoin-infrastructure/

git commit -m "feat(hk-stablecoin): Web3 Hong Kong Stablecoin Infrastructure

- Capital Positioning: Consumption capitalization + RWA tokenization
- Payment Layer: HSBC PayMe integration (3M+ users, 100K+ merchants)
- JMS Layer: ISO 20022 extended character set → replicable programmable value carrier
- Investment Layer: HK Government Bond repo (differentiated from US Treasury)
- Compliance Layer: PRN regulatory compliance + HKMA real-time reporting
- Naming Layer: UTXO-DNS (IETF draft-guorong-utxo-dns-01)
- Cross-Chain Layer: Standard Chartered mBridge + BIS Unified Ledger
- Incentive Layer: CoCa consumption rewards + loyalty tiers

Key Differentiation:
- US Treasury repo → HK Government Bond repo
- USD stablecoins → JMS programmable stablecoin (ISO 20022)
- Technology neutral, market-driven, user-centric

Authors: Tian Guorong, Lei Zhibin, Huang Xinfeng
Institution: Hong Kong Ronghua International Group Limited
Standards: IETF draft-guorong-utxo-dns-01 · W3C UW2ICG · BIS Project Agorá"

git push origin feature/hk-stablecoin-infrastructure
```

---

## 7. Contributing

### 7.1 Code of Conduct

This project follows the Contributor Covenant Code of Conduct. Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

### 7.2 How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 7.3 Development Guidelines

- All code must be **open source** and **publicly auditable**
- All standards must be **IETF**, **W3C**, or **ISO** compliant
- All compliance modules must support **HKMA real-time reporting**
- All user data must be **encrypted** and **GDPR/HK PDPO compliant**
- All smart contracts must be **audited** by third-party security firms

### 7.4 Contact

- **Authors**: Tian Guorong, Lei Zhibin, Huang Xinfeng
- **Institution**: Hong Kong Ronghua International Group Limited
- **Repository**: https://github.com/utxo6-dns/utxo6-dns
- **Issues**: https://github.com/utxo6-dns/utxo6-dns/issues

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- IETF UTXO6-DNS Working Group
- W3C UTXO Web Wallet Interoperability Community Group
- BIS Project Agorá
- Hong Kong Monetary Authority (HKMA)
- HSBC PayMe
- Standard Chartered mBridge
- ZA Bank
- China Mobile CMBaaS

- docs: add Web3 Hong Kong Stablecoin Infrastructure white paper

Co-authors: Tian Guorong, Lei Zhibin, Huang Xinfeng
Institution: Hong Kong Ronghua International Group Limited
Standards: IETF draft-guorong-utxo-dns-01 · W3C UW2ICG · BIS Project Agorá

---

**Document Version**: 1.0.0
**Last Updated**: 2026-07-14
**Status**: Active Development
