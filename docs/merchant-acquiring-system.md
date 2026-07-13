# CoCa Merchant Acquiring System and API Design

**Version**: 1.0.0  
**Date**: 2026-07-14  
**Authors**: Tian Guorong, Lei Zhibin, Huang Xinfeng  
**Institution**: Hong Kong Ronghua International Group Limited  
**Repository**: https://github.com/utxo6-dns/utxo6-dns  
**License**: Apache 2.0

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Core Module Design](#2-core-module-design)
   - 2.1 Acquiring Gateway Module
   - 2.2 Payment Processing Module
   - 2.3 JMS Minting Module
   - 2.4 Investment Allocation Module
   - 2.5 T+1 Withdrawal Module
   - 2.6 User Rewards Module (CoCa)
3. [Complete API Interface Design](#3-complete-api-interface-design)
   - 3.1 RESTful API Endpoints
   - 3.2 WebSocket Real-time Notifications
   - 3.3 Admin Backend APIs
4. [Database Schema Design](#4-database-schema-design)
5. [Smart Contract Design](#5-smart-contract-design)
   - 5.1 JMS Minting Contract (Ethereum)
   - 5.2 CoCa Rewards Contract
6. [Configuration and Deployment](#6-configuration-and-deployment)
   - 6.1 Docker Compose Configuration
   - 6.2 Environment Variables
7. [Security and Compliance](#7-security-and-compliance)
   - 7.1 Security Measures
   - 7.2 Compliance Audit Logging
8. [Performance Metrics](#8-performance-metrics)

---

## 1. System Architecture Overview

The CoCa Merchant Acquiring System enables the complete flow from fiat card payments to JMS minting, investment allocation, and user rewards. The architecture is divided into eight layers:

```mermaid
flowchart TD
    %% User Payment Layer
    subgraph A[User Payment Layer]
        direction LR
        A1[Card Payment]
        A2[Merchant QR Code Scan]
        A3[Customer Payment Code]
        A4[Manual Order Entry]
    end

    %% Acquiring Gateway Layer
    subgraph B[Acquiring Gateway Layer]
        B1[Payment Gateway]
        B2[QR Code Generator]
        B3[Order Manager]
        B4[Risk Controller]
    end

    %% Payment Processing Layer
    subgraph C[Payment Processing Layer]
        C1[Bank Authorization API]
        C2[Payment Channel Router]
        C3[Settlement Processor]
        C4[Reconciliation Engine]
    end

    %% JMS Minting Layer
    subgraph D[JMS Minting Layer]
        D1[Bank Settlement Verifier]
        D2[1:1 Minting Engine]
        D3[Reserve Adequacy Checker]
        D4[Blockchain Contract Interface]
    end

    %% Investment Allocation Layer
    subgraph E[Investment Allocation Layer]
        E1[Portfolio Manager]
        E2[90-Day HK Bond Channel]
        E3[93-Day US Treasury Channel]
        E4[IMF-SDR Overnight Repo Channel]
    end

    %% Withdrawal & Settlement Layer
    subgraph F[Withdrawal & Settlement Layer]
        F1[T+1 Liquidity Check]
        F2[JMS Burn Engine]
        F3[Fiat Settlement Interface]
        F4[Fund Clearing System]
    end

    %% User Rewards Layer
    subgraph G[User Rewards Layer]
        G1[Contribution Calculator]
        G2[CoCa Reward Engine]
        G3[Loyalty Management System]
        G4[DEX Export Gateway]
    end

    %% Regulatory Compliance Layer
    subgraph H[Regulatory Compliance Layer]
        H1[AML/CTF Check]
        H2[Transaction Monitoring]
        H3[Audit Logging]
        H4[Regulatory Report Generation]
    end

    %% Data Storage Layer
    subgraph I[Data Storage Layer]
        I1[Payment Orders DB]
        I2[JMS Minting Records]
        I3[Investment Ledger]
        I4[User Reward History]
    end

    %% API Layer
    subgraph J[API Interface Layer]
        J1[RESTful API Gateway]
        J2[WebSocket Notification Service]
        J3[Merchant Backend API]
        J4[Admin Console API]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G

    H --> B
    H --> C
    H --> D
    H --> F
    I --> B
    I --> C
    I --> D
    I --> E
    I --> F
    I --> G
    J --> B
    J --> F
    J --> G

    C -->|"Bank Settlement Proof"| D
    D -->|"1:1 JMS Minting"| E
    E -->|"T+1 Investment Maturity"| F
    F -->|"JMS Burn"| G
    G -->|"Reward CoCa"| J4

    linkStyle 16 stroke:#ff6b6b,stroke-width:2px,stroke-dasharray:5 5
    linkStyle 17 stroke:#4ecdc4,stroke-width:2px
    linkStyle 18 stroke:#45b7d1,stroke-width:2px
    linkStyle 19 stroke:#96ceb4,stroke-width:2px
    linkStyle 20 stroke:#feca57,stroke-width:2px
```

**Core Flow**:  
User Payment → Acquiring Gateway → Payment Processing → JMS Minting → Investment Allocation → T+1 Withdrawal → User Rewards → DEX Export

**Layer Responsibilities**:

| Layer | Modules | Functions |
|-------|---------|-----------|
| User Payment | Card/QR/Manual | Multiple payment methods |
| Acquiring Gateway | Gateway, QR, Order, Risk | Unified interface, risk control |
| Payment Processing | Bank Auth, Routing, Settlement, Reconciliation | Authorization, clearing |
| JMS Minting | Settlement verification, Minting engine, Reserve check | 1:1 minting, blockchain interaction |
| Investment Allocation | Portfolio manager, HK Bond, US Treasury, SDR Repo | Diversified investment channels |
| Withdrawal & Settlement | Liquidity check, Burn, Fiat settlement | T+1 withdrawal, JMS burn |
| User Rewards | Contribution, CoCa reward, Loyalty, DEX export | Incentives and loyalty |
| Regulatory Compliance | AML/CTF, Monitoring, Audit, Reports | Full compliance |
| Data Storage | Payment, Minting, Investment, Rewards | Persistence |
| API Interface | REST, WebSocket, Admin, Console | External access |

---

## 2. Core Module Design

### 2.1 Acquiring Gateway Module

**File**: `src/acquiring_gateway/mod.rs`

```rust
pub mod api;
pub mod qr_code;
pub mod payment_processing;
pub mod order_management;

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PaymentType {
    MerchantQRCode,
    CustomerQRCode,
    ManualOrder,
    CardPayment,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentRequest {
    pub merchant_id: Uuid,
    pub payment_type: PaymentType,
    pub amount: BigDecimal,
    pub currency: String, // CNY, USD, HKD etc.
    pub description: Option<String>,
    pub customer_info: CustomerInfo,
    pub device_info: Option<DeviceInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentResponse {
    pub payment_id: Uuid,
    pub status: PaymentStatus,
    pub qr_code_url: Option<String>,
    pub order_code: Option<String>,
    pub expires_at: DateTime<Utc>,
    pub estimated_settlement_time: DateTime<Utc>,
}
```

### 2.2 Payment Processing Module

**File**: `src/payment_processing/mod.rs`

```rust
pub mod bank_card;
pub mod qr_payment;
pub mod settlement;
pub mod risk_control;

use crate::shared::models::Currency;
use crate::regulatory::aml::TransactionMonitoring;

pub struct BankCardProcessor {
    acquirer_bank: AcquirerBank,
    card_network: CardNetwork,
    risk_engine: RiskEngine,
    compliance_checker: ComplianceChecker,
}

impl BankCardProcessor {
    pub async fn process_card_payment(
        &self,
        request: CardPaymentRequest,
    ) -> Result<CardPaymentResponse, PaymentError> {
        // 1. AML/CTF check
        self.compliance_checker.check_transaction(&request)?;

        // 2. Risk assessment
        let risk_score = self.risk_engine.assess_risk(&request)?;

        // 3. Bank authorization
        let auth_result = self.acquirer_bank.authorize_payment(&request).await?;

        // 4. Fund settlement
        let settlement = self.acquirer_bank.settle_payment(&auth_result).await?;

        // 5. Trigger JMS minting
        self.trigger_jms_minting(&settlement).await?;

        Ok(CardPaymentResponse {
            transaction_id: auth_result.transaction_id,
            auth_code: auth_result.auth_code,
            settlement_time: settlement.settlement_time,
            jms_mint_tx_hash: settlement.jms_mint_tx_hash,
        })
    }

    async fn trigger_jms_minting(
        &self,
        settlement: &BankSettlement,
    ) -> Result<String, PaymentError> {
        let mint_request = JMSMintRequest {
            bank_settlement_id: settlement.id.clone(),
            amount: settlement.net_amount,
            currency: settlement.currency.clone(),
            merchant_address: settlement.merchant_address.clone(),
            bank_proof: settlement.bank_proof.clone(),
        };
        let tx_hash = self.jms_minting_contract.mint(mint_request).await?;
        Ok(tx_hash)
    }
}
```

### 2.3 JMS Minting Module

**File**: `src/jms_minting/mod.rs`

```rust
pub mod minting_engine;
pub mod redemption;
pub mod reserve_backing;

use crate::asset_layer::reserve::JMSReserveManager;
use crate::protocol_layer::currency::CurrencyManager;
use crate::regulatory::compliance::RegulatoryCompliance;

pub struct JMSMintingEngine {
    reserve_manager: JMSReserveManager,
    currency_manager: CurrencyManager,
    compliance: RegulatoryCompliance,
    smart_contract: JMSSmartContract,
    event_bus: EventBus,
}

impl JMSMintingEngine {
    pub async fn mint_jms(
        &self,
        request: MintRequest,
    ) -> Result<MintResponse, MintingError> {
        // 1. Verify bank settlement proof
        self.verify_bank_settlement(&request.bank_proof)?;

        // 2. Check reserve adequacy
        let reserve_status = self.reserve_manager.check_reserve_adequacy(
            &request.currency,
            request.amount,
        );
        if !reserve_status.is_adequate {
            return Err(MintingError::InsufficientReserve);
        }

        // 3. Execute 1:1 minting
        let jms_amount = self.convert_to_jms(request.amount, &request.currency)?;

        // 4. Call smart contract
        let mint_tx = self.smart_contract.mint(
            request.merchant_address,
            jms_amount,
            request.bank_settlement_id,
        ).await?;

        // 5. Update reserve records
        self.reserve_manager.record_minting(
            &request.currency,
            request.amount,
            jms_amount,
            &mint_tx.hash,
        );

        // 6. Trigger investment allocation
        self.trigger_investment_allocation(jms_amount, &request.merchant_id).await?;

        Ok(MintResponse {
            jms_amount,
            mint_tx_hash: mint_tx.hash,
            reserve_backing: reserve_status.backing_ratio,
            estimated_apy: self.calculate_estimated_yield(&request.currency),
        })
    }

    fn convert_to_jms(&self, amount: BigDecimal, currency: &str) -> Result<BigDecimal, MintingError> {
        let exchange_rate = self.currency_manager.get_exchange_rate(currency, "JMS");
        Ok(amount * exchange_rate)
    }
}
```

### 2.4 Investment Allocation Module

**File**: `src/investment_allocation/mod.rs`

```rust
pub mod portfolio;
pub mod bond_investment;
pub mod sdr_repo;
pub mod yield_calculation;

use crate::asset_layer::rwa::RWAProjectRegistry;
use crate::protocol_layer::currency::CurrencyManager;

pub struct InvestmentPortfolioManager {
    bond_manager: BondInvestmentManager,
    sdr_repo_manager: SDRRepoManager,
    risk_assessor: RiskAssessor,
    yield_calculator: YieldCalculator,
}

impl InvestmentPortfolioManager {
    pub async fn allocate_investment(
        &self,
        jms_amount: BigDecimal,
        merchant_id: Uuid,
        merchant_preference: Option<InvestmentPreference>,
    ) -> Result<AllocationResult, InvestmentError> {
        let preference = merchant_preference.unwrap_or_else(|| self.get_default_allocation());

        let allocations = match preference {
            InvestmentPreference::HongKongBond => {
                self.allocate_to_hk_bond(jms_amount, merchant_id).await?
            }
            InvestmentPreference::USTreasury => {
                self.allocate_to_us_treasury(jms_amount, merchant_id).await?
            }
            InvestmentPreference::IMFSDR => {
                self.allocate_to_sdr_repo(jms_amount, merchant_id).await?
            }
            InvestmentPreference::Balanced => {
                self.allocate_balanced(jms_amount, merchant_id).await?
            }
        };

        let expected_yield = self.yield_calculator.calculate_expected_yield(&allocations)?;

        Ok(AllocationResult {
            allocations,
            expected_yield,
            settlement_date: self.calculate_settlement_date(),
            maturity_date: self.calculate_maturity_date(&allocations),
        })
    }

    async fn allocate_to_hk_bond(
        &self,
        amount: BigDecimal,
        merchant_id: Uuid,
    ) -> Result<Vec<InvestmentAllocation>, InvestmentError> {
        let hk_bond = self.bond_manager.get_hk_90day_bond().await?;
        let purchase = self.bond_manager.purchase_bond(
            &hk_bond.bond_id,
            amount,
            merchant_id,
            Duration::days(90),
        ).await?;
        Ok(vec![InvestmentAllocation {
            instrument: InvestmentInstrument::HKD90DayBond,
            amount,
            purchase_ref: purchase.purchase_id,
            expected_yield: hk_bond.current_yield,
            risk_rating: RiskRating::Low,
        }])
    }

    async fn allocate_to_us_treasury(
        &self,
        amount: BigDecimal,
        merchant_id: Uuid,
    ) -> Result<Vec<InvestmentAllocation>, InvestmentError> {
        let us_treasury = self.bond_manager.get_us_93day_treasury().await?;
        let purchase = self.bond_manager.purchase_treasury(
            &us_treasury.cusip,
            amount,
            merchant_id,
            Duration::days(93),
        ).await?;
        Ok(vec![InvestmentAllocation {
            instrument: InvestmentInstrument::USTreasury93Day,
            amount,
            purchase_ref: purchase.purchase_id,
            expected_yield: us_treasury.current_yield,
            risk_rating: RiskRating::VeryLow,
        }])
    }

    async fn allocate_to_sdr_repo(
        &self,
        amount: BigDecimal,
        merchant_id: Uuid,
    ) -> Result<Vec<InvestmentAllocation>, InvestmentError> {
        let sdr_rate = self.sdr_repo_manager.get_sdr_overnight_rate().await?;
        let repo = self.sdr_repo_manager.execute_reverse_repo(
            amount,
            merchant_id,
            Duration::days(1),
        ).await?;
        Ok(vec![InvestmentAllocation {
            instrument: InvestmentInstrument::IMFSDRRepo,
            amount,
            purchase_ref: repo.repo_id,
            expected_yield: sdr_rate,
            risk_rating: RiskRating::Minimal,
        }])
    }
}
```

### 2.5 T+1 Withdrawal Module

**File**: `src/withdrawal/mod.rs`

```rust
pub mod withdrawal_processing;
pub mod jms_burning;
pub mod settlement;
pub mod fee_calculation;

use crate::jms_minting::redemption::JMSRedemption;
use crate::communication_layer::cbdc_gateway::CBDCGateway;

pub struct TPlusOneWithdrawalProcessor {
    redemption_engine: JMSRedemption,
    cbdc_gateway: CBDCGateway,
    fee_calculator: FeeCalculator,
    compliance_checker: ComplianceChecker,
}

impl TPlusOneWithdrawalProcessor {
    pub async fn process_withdrawal(
        &self,
        request: WithdrawalRequest,
    ) -> Result<WithdrawalResponse, WithdrawalError> {
        // 1. Check T+1 eligibility
        self.check_tplus1_eligibility(&request).await?;

        // 2. Calculate redemption amount (deduct fees)
        let redemption_amount = self.calculate_redemption_amount(
            request.jms_amount,
            &request.target_currency,
        )?;

        // 3. Burn JMS
        let burn_tx_hash = self.redemption_engine.burn_jms_for_withdrawal(
            request.merchant_address,
            request.jms_amount,
            &request.withdrawal_id,
        ).await?;

        // 4. Execute fiat settlement
        let settlement = self.settle_to_fiat(
            redemption_amount.net_amount,
            &request.target_currency,
            &request.bank_account,
        ).await?;

        // 5. Record completion
        self.record_withdrawal_completion(
            &request,
            &burn_tx_hash,
            &settlement,
        ).await?;

        Ok(WithdrawalResponse {
            withdrawal_id: request.withdrawal_id,
            status: WithdrawalStatus::Completed,
            jms_burned: request.jms_amount,
            fiat_settled: redemption_amount.net_amount,
            fees_deducted: redemption_amount.fees,
            burn_tx_hash,
            settlement_ref: settlement.settlement_id,
            completion_time: Utc::now(),
        })
    }

    async fn check_tplus1_eligibility(
        &self,
        request: &WithdrawalRequest,
    ) -> Result<(), WithdrawalError> {
        let investment = self.get_investment_record(&request.jms_source_id).await?;
        let investment_age = Utc::now() - investment.purchase_time;
        if investment_age < Duration::days(1) {
            return Err(WithdrawalError::TPlus1NotMet);
        }
        let liquidity = self.check_investment_liquidity(&investment).await?;
        if !liquidity.is_sufficient {
            return Err(WithdrawalError::InsufficientLiquidity);
        }
        Ok(())
    }
}
```

### 2.6 User Rewards Module (CoCa)

**File**: `src/user_rewards/mod.rs`

```rust
pub mod contribution_calculation;
pub mod coca_rewarding;
pub mod dex_export;
pub mod loyalty_program;

use crate::asset_layer::coca_finance::CocaFinanceManager;
use crate::communication_layer::message_queue::EventBus;

pub struct UserRewardEngine {
    coca_manager: CocaFinanceManager,
    contribution_calculator: ContributionCalculator,
    dex_exporter: DEXExporter,
    event_bus: EventBus,
    loyalty_program: LoyaltyProgram,
}

impl UserRewardEngine {
    pub async fn calculate_and_reward(
        &self,
        user_id: Uuid,
        payment_info: PaymentInfo,
    ) -> Result<RewardResult, RewardError> {
        // 1. Calculate base contribution
        let contribution = self.contribution_calculator.calculate_contribution(
            user_id,
            &payment_info,
        );

        // 2. Calculate CoCa reward
        let coca_reward = self.calculate_coca_reward(contribution.score)?;

        // 3. Issue CoCa reward
        let reward_tx = self.coca_manager.reward_user(
            user_id,
            coca_reward.amount,
            &contribution.reason,
        ).await?;

        // 4. Update loyalty tier
        self.loyalty_program.update_user_loyalty(
            user_id,
            contribution.score,
        ).await?;

        // 5. Export to DEX if requested
        if payment_info.auto_export_to_dex {
            self.export_to_dex(user_id, coca_reward.amount).await?;
        }

        Ok(RewardResult {
            user_id,
            contribution_score: contribution.score,
            coca_rewarded: coca_reward.amount,
            reward_tx_hash: reward_tx.hash,
            loyalty_tier_updated: contribution.new_tier,
            dex_exported: payment_info.auto_export_to_dex,
        })
    }

    fn calculate_coca_reward(
        &self,
        contribution_score: u64,
    ) -> Result<CocaReward, RewardError> {
        let base_reward_rate = self.get_base_reward_rate();
        let tier_multiplier = self.get_tier_multiplier(contribution_score);
        let promotion_multiplier = self.get_current_promotion_multiplier();
        let reward_amount = BigDecimal::from(contribution_score)
            * base_reward_rate
            * tier_multiplier
            * promotion_multiplier;
        Ok(CocaReward {
            amount: reward_amount,
            rate: base_reward_rate,
            multiplier: tier_multiplier * promotion_multiplier,
        })
    }

    async fn export_to_dex(
        &self,
        user_id: Uuid,
        amount: BigDecimal,
    ) -> Result<String, RewardError> {
        let export_request = DEXExportRequest {
            user_id,
            coca_amount: amount,
            target_dex: TargetDEX::CoCaDEX,
            slippage_tolerance: BigDecimal::from_str("0.5").unwrap(),
            deadline: Utc::now() + Duration::minutes(30),
        };
        let export_result = self.dex_exporter.export_to_dex(export_request).await?;
        self.event_bus.publish(CocaExportedEvent {
            user_id,
            coca_amount: amount,
            dex_transaction_hash: export_result.tx_hash,
            timestamp: Utc::now(),
        }).await?;
        Ok(export_result.tx_hash)
    }
}
```

---

## 3. Complete API Interface Design

### 3.1 RESTful API Endpoints

**File**: `src/api/mod.rs`

```rust
pub mod v1;

use actix_web::{web, HttpResponse, Responder};
use crate::acquiring_gateway::PaymentRequest;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            // Payment endpoints
            .route("/payment/initiate", web::post().to(initiate_payment))
            .route("/payment/status/{payment_id}", web::get().to(get_payment_status))
            .route("/payment/callback", web::post().to(payment_callback))
            // Merchant endpoints
            .route("/merchant/register", web::post().to(register_merchant))
            .route("/merchant/qr-code", web::get().to(generate_qr_code))
            .route("/merchant/balance", web::get().to(get_merchant_balance))
            // JMS endpoints
            .route("/jms/mint/status/{tx_hash}", web::get().to(get_mint_status))
            .route("/jms/investment/portfolio", web::get().to(get_investment_portfolio))
            .route("/jms/withdraw", web::post().to(request_withdrawal))
            // User rewards
            .route("/rewards/calculate", web::post().to(calculate_rewards))
            .route("/rewards/history", web::get().to(get_reward_history))
            .route("/rewards/export-to-dex", web::post().to(export_to_dex))
            // Investment management
            .route("/investment/preferences", web::put().to(update_investment_preferences))
            .route("/investment/yield", web::get().to(get_investment_yield))
            .route("/investment/liquidity", web::get().to(check_liquidity))
            // Reports and analytics
            .route("/reports/daily-settlement", web::get().to(get_daily_settlement))
            .route("/reports/tax-document", web::get().to(generate_tax_document))
    );
}

async fn initiate_payment(
    request: web::Json<PaymentRequest>,
    gateway: web::Data<AcquiringGateway>,
) -> impl Responder {
    match gateway.process_payment(request.into_inner()).await {
        Ok(response) => HttpResponse::Ok().json(response),
        Err(e) => HttpResponse::BadRequest().json(ErrorResponse {
            error: e.to_string(),
            code: "PAYMENT_INIT_FAILED".to_string(),
        }),
    }
}

async fn request_withdrawal(
    request: web::Json<WithdrawalRequest>,
    withdrawal_processor: web::Data<TPlusOneWithdrawalProcessor>,
) -> impl Responder {
    match withdrawal_processor.process_withdrawal(request.into_inner()).await {
        Ok(response) => HttpResponse::Ok().json(response),
        Err(e) => HttpResponse::BadRequest().json(ErrorResponse {
            error: e.to_string(),
            code: "WITHDRAWAL_FAILED".to_string(),
        }),
    }
}

async fn calculate_rewards(
    request: web::Json<RewardCalculationRequest>,
    reward_engine: web::Data<UserRewardEngine>,
) -> impl Responder {
    match reward_engine.calculate_and_reward(request.user_id, request.payment_info).await {
        Ok(response) => HttpResponse::Ok().json(response),
        Err(e) => HttpResponse::BadRequest().json(ErrorResponse {
            error: e.to_string(),
            code: "REWARD_CALCULATION_FAILED".to_string(),
        }),
    }
}
```

### 3.2 WebSocket Real-time Notifications

**File**: `src/api/websocket.rs`

```rust
use actix_web::{web, HttpRequest, HttpResponse};
use actix_web_actors::ws;
use crate::communication_layer::message_queue::NotificationManager;

pub async fn payment_notifications(
    req: HttpRequest,
    stream: web::Payload,
    notification_manager: web::Data<NotificationManager>,
) -> Result<HttpResponse, actix_web::Error> {
    let session_id = extract_session_id(&req)?;
    let notification_handler = PaymentNotificationHandler {
        session_id,
        notification_manager: notification_manager.get_ref().clone(),
    };
    ws::start(notification_handler, &req, stream)
}

pub struct PaymentNotificationHandler {
    session_id: String,
    notification_manager: Arc<NotificationManager>,
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for PaymentNotificationHandler {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
            Ok(ws::Message::Text(text)) => {
                if let Ok(cmd) = serde_json::from_str::<ClientCommand>(&text) {
                    match cmd {
                        ClientCommand::SubscribePayment(payment_id) => {
                            self.notification_manager.subscribe(self.session_id.clone(), payment_id);
                            ctx.text(serde_json::to_string(&SubscribeResponse { success: true }).unwrap());
                        }
                        ClientCommand::UnsubscribePayment(payment_id) => {
                            self.notification_manager.unsubscribe(self.session_id.clone(), payment_id);
                        }
                    }
                }
            }
            Ok(ws::Message::Binary(_)) => {}
            _ => {}
        }
    }
}
```

### 3.3 Admin Backend APIs

**File**: `src/api/admin.rs`

```rust
pub mod merchant_management;
pub mod risk_monitoring;
pub mod settlement_reconciliation;

#[derive(Debug, Deserialize)]
pub struct MerchantRegistrationRequest {
    pub business_name: String,
    pub business_type: BusinessType,
    pub registration_number: String,
    pub country: String,
    pub contact_email: String,
    pub contact_phone: String,
    pub bank_accounts: Vec<BankAccountInfo>,
    pub kyc_documents: KycDocuments,
}

#[derive(Debug, Serialize)]
pub struct RiskDashboard {
    pub total_transactions_24h: u64,
    pub total_volume_24h: BigDecimal,
    pub suspicious_transactions: u64,
    pub avg_risk_score: f64,
    pub top_risk_indicators: Vec<RiskIndicator>,
}
```

---

## 4. Database Schema Design

```sql
-- Payment orders table
CREATE TABLE payment_orders (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    payment_type VARCHAR(20) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    qr_code_url TEXT,
    customer_info JSONB,
    bank_settlement_id VARCHAR(100),
    jms_mint_tx_hash VARCHAR(66),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    settled_at TIMESTAMPTZ,
    INDEX idx_payment_merchant (merchant_id),
    INDEX idx_payment_status (status),
    INDEX idx_payment_created (created_at)
);

-- JMS minting records
CREATE TABLE jms_minting_records (
    id UUID PRIMARY KEY,
    payment_order_id UUID NOT NULL REFERENCES payment_orders(id),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    fiat_amount DECIMAL(20, 8) NOT NULL,
    fiat_currency VARCHAR(10) NOT NULL,
    jms_amount DECIMAL(20, 8) NOT NULL,
    mint_tx_hash VARCHAR(66) NOT NULL UNIQUE,
    reserve_backing_ratio DECIMAL(10, 4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_minting_merchant (merchant_id),
    INDEX idx_minting_tx_hash (mint_tx_hash)
);

-- Investment allocations
CREATE TABLE investment_allocations (
    id UUID PRIMARY KEY,
    jms_minting_id UUID NOT NULL REFERENCES jms_minting_records(id),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    instrument_type VARCHAR(30) NOT NULL,
    instrument_id VARCHAR(100),
    amount DECIMAL(20, 8) NOT NULL,
    purchase_ref VARCHAR(100),
    expected_yield DECIMAL(10, 4),
    maturity_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_investment_merchant (merchant_id),
    INDEX idx_investment_maturity (maturity_date)
);

-- Withdrawal records
CREATE TABLE withdrawal_records (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    jms_amount DECIMAL(20, 8) NOT NULL,
    fiat_amount DECIMAL(20, 8) NOT NULL,
    fiat_currency VARCHAR(10) NOT NULL,
    target_bank_account JSONB NOT NULL,
    burn_tx_hash VARCHAR(66) NOT NULL,
    status VARCHAR(20) NOT NULL,
    fees DECIMAL(20, 8) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    INDEX idx_withdrawal_merchant (merchant_id),
    INDEX idx_withdrawal_status (status)
);

-- User rewards
CREATE TABLE user_rewards (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    payment_order_id UUID NOT NULL REFERENCES payment_orders(id),
    contribution_score INTEGER NOT NULL,
    coca_amount DECIMAL(20, 8) NOT NULL,
    reward_tx_hash VARCHAR(66),
    dex_export_tx_hash VARCHAR(66),
    loyalty_tier VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_rewards_user (user_id),
    INDEX idx_rewards_created (created_at)
);
```

---

## 5. Smart Contract Design

### 5.1 JMS Minting Contract (Ethereum)

**File**: `contracts/JMSMinting.sol`

```solidity
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title JMS Minting Contract
 * @dev Handles 1:1 fiat-to-JMS minting
 */
contract JMSMinting is AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    IERC20 public jmsToken;
    address public bankProofVerifier;

    struct MintRecord {
        address merchant;
        uint256 fiatAmount;
        string fiatCurrency;
        uint256 jmsAmount;
        string bankSettlementId;
        bytes32 bankProofHash;
        uint256 timestamp;
    }

    event JMSMinted(
        address indexed merchant,
        uint256 fiatAmount,
        string fiatCurrency,
        uint256 jmsAmount,
        string bankSettlementId,
        bytes32 indexed mintId
    );

    event JMSBurned(
        address indexed merchant,
        uint256 jmsAmount,
        uint256 fiatAmount,
        string fiatCurrency,
        string withdrawalId
    );

    mapping(bytes32 => MintRecord) public mintRecords;
    mapping(string => bool) public usedSettlementIds;

    constructor(address jmsTokenAddress, address verifierAddress) {
        jmsToken = IERC20(jmsTokenAddress);
        bankProofVerifier = verifierAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
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
        bytes calldata signature
    ) external nonReentrant onlyRole(MINTER_ROLE) returns (bytes32) {
        require(!usedSettlementIds[bankSettlementId], "Settlement ID already used");
        require(verifyBankProof(
            merchant,
            fiatAmount,
            fiatCurrency,
            bankSettlementId,
            bankProofHash,
            signature
        ), "Invalid bank proof");

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
            timestamp: block.timestamp
        });

        usedSettlementIds[bankSettlementId] = true;
        emit JMSMinted(merchant, fiatAmount, fiatCurrency, jmsAmount, bankSettlementId, mintId);
        return mintId;
    }

    /**
     * @dev Burn JMS for withdrawal
     */
    function burnJMS(
        address merchant,
        uint256 jmsAmount,
        string calldata fiatCurrency,
        string calldata withdrawalId
    ) external nonReentrant onlyRole(BURNER_ROLE) returns (uint256) {
        require(jmsToken.transferFrom(merchant, address(this), jmsAmount), "JMS transfer failed");
        jmsToken.burn(jmsAmount);

        uint256 fiatAmount = calculateFiatAmount(jmsAmount, fiatCurrency);
        emit JMSBurned(merchant, jmsAmount, fiatAmount, fiatCurrency, withdrawalId);
        return fiatAmount;
    }

    function verifyBankProof(
        address merchant,
        uint256 amount,
        string calldata currency,
        string calldata settlementId,
        bytes32 proofHash,
        bytes calldata signature
    ) internal view returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(
            merchant,
            amount,
            currency,
            settlementId,
            proofHash,
            block.chainid
        ));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            messageHash
        ));
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        address signer = ecrecover(ethSignedMessageHash, v, r, s);
        return signer == bankProofVerifier;
    }

    function calculateJMSAmount(uint256 fiatAmount, string calldata currency) internal pure returns (uint256) {
        // 1:1 conversion – in production integrate Chainlink oracle
        return fiatAmount;
    }

    function calculateFiatAmount(uint256 jmsAmount, string calldata currency) internal pure returns (uint256) {
        return jmsAmount;
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        if (v < 27) v += 27;
    }
}
```

### 5.2 CoCa Rewards Contract

**File**: `contracts/CocaRewards.sol`

```solidity
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

/**
 * @title CoCa Consumption Rewards Contract
 * @dev Distributes CoCa rewards based on user consumption contribution
 */
contract CocaRewards is AccessControl {
    using BitMaps for BitMaps.BitMap;

    bytes32 public constant REWARDER_ROLE = keccak256("REWARDER_ROLE");

    IERC20 public cocaToken;

    uint256 public baseRewardRate = 10;    // 0.1% base rate (scaled by 10^4)
    uint256 public rewardDecimals = 4;

    struct UserReward {
        uint256 totalContribution;
        uint256 totalRewarded;
        uint256 lastRewardTime;
        uint8 loyaltyTier;
    }

    event CocaRewarded(
        address indexed user,
        uint256 contributionScore,
        uint256 cocaAmount,
        uint256 paymentAmount,
        string paymentCurrency,
        bytes32 indexed paymentId
    );

    mapping(address => UserReward) public userRewards;
    mapping(bytes32 => bool) public rewardedPayments;

    struct TierConfig {
        uint256 minContribution;
        uint256 multiplier;   // base 10000
        string name;
    }

    TierConfig[] public tierConfigs;

    constructor(address cocaTokenAddress) {
        cocaToken = IERC20(cocaTokenAddress);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        initializeTiers();
    }

    function initializeTiers() internal {
        tierConfigs.push(TierConfig({ minContribution: 0, multiplier: 10000, name: "Bronze" }));
        tierConfigs.push(TierConfig({ minContribution: 1000, multiplier: 12000, name: "Silver" }));
        tierConfigs.push(TierConfig({ minContribution: 5000, multiplier: 15000, name: "Gold" }));
        tierConfigs.push(TierConfig({ minContribution: 20000, multiplier: 20000, name: "Platinum" }));
    }

    /**
     * @dev Reward user with CoCa
     */
    function rewardUser(
        address user,
        uint256 paymentAmount,
        string calldata paymentCurrency,
        uint256 contributionScore,
        bytes32 paymentId
    ) external onlyRole(REWARDER_ROLE) returns (uint256) {
        require(!rewardedPayments[paymentId], "Payment already rewarded");

        uint256 cocaAmount = calculateReward(user, paymentAmount, contributionScore);
        require(cocaToken.transfer(user, cocaAmount), "CoCa transfer failed");

        UserReward storage userReward = userRewards[user];
        userReward.totalContribution += contributionScore;
        userReward.totalRewarded += cocaAmount;
        userReward.lastRewardTime = block.timestamp;
        updateLoyaltyTier(user);
        rewardedPayments[paymentId] = true;

        emit CocaRewarded(user, contributionScore, cocaAmount, paymentAmount, paymentCurrency, paymentId);
        return cocaAmount;
    }

    function calculateReward(
        address user,
        uint256 paymentAmount,
        uint256 contributionScore
    ) internal view returns (uint256) {
        UserReward storage userReward = userRewards[user];
        uint256 baseReward = paymentAmount * baseRewardRate / (10 ** rewardDecimals);
        uint256 contributionBonus = contributionScore * 1e14; // simplified
        uint256 tierMultiplier = getTierMultiplier(userReward.loyaltyTier);
        return (baseReward + contributionBonus) * tierMultiplier / 10000;
    }

    function getTierMultiplier(uint8 tier) internal view returns (uint256) {
        if (tier >= tierConfigs.length) {
            return tierConfigs[tierConfigs.length - 1].multiplier;
        }
        return tierConfigs[tier].multiplier;
    }

    function updateLoyaltyTier(address user) internal {
        UserReward storage userReward = userRewards[user];
        uint256 contribution = userReward.totalContribution;
        for (uint8 i = uint8(tierConfigs.length) - 1; i >= 0; i--) {
            if (contribution >= tierConfigs[i].minContribution) {
                userReward.loyaltyTier = i;
                break;
            }
        }
    }

    function getUserRewardInfo(address user) external view returns (
        uint256 totalContribution,
        uint256 totalRewarded,
        uint8 loyaltyTier,
        string memory tierName,
        uint256 nextTierThreshold
    ) {
        UserReward storage userReward = userRewards[user];
        uint8 currentTier = userReward.loyaltyTier;
        uint256 nextThreshold = 0;
        if (currentTier < tierConfigs.length - 1) {
            nextThreshold = tierConfigs[currentTier + 1].minContribution;
        }
        return (
            userReward.totalContribution,
            userReward.totalRewarded,
            userReward.loyaltyTier,
            tierConfigs[currentTier].name,
            nextThreshold
        );
    }
}
```

---

## 6. Configuration and Deployment

### 6.1 Docker Compose Configuration

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: jmbc
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: jmbc_merchant
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - jmbc-network

  redis:
    image: redis:7-alpine
    networks:
      - jmbc-network

  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      RABBITMQ_DEFAULT_USER: jmbc
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - jmbc-network

  api-gateway:
    build:
      context: .
      dockerfile: Dockerfile.api-gateway
    environment:
      DATABASE_URL: postgres://jmbc:${DB_PASSWORD}@postgres/jmbc_merchant
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://jmbc:${RABBITMQ_PASSWORD}@rabbitmq:5672
      ETH_RPC_URL: ${ETH_RPC_URL}
      JMS_CONTRACT_ADDRESS: ${JMS_CONTRACT_ADDRESS}
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
      - rabbitmq
    networks:
      - jmbc-network

  acquiring-service:
    build:
      context: .
      dockerfile: Dockerfile.acquiring
    environment:
      DATABASE_URL: postgres://jmbc:${DB_PASSWORD}@postgres/jmbc_merchant
      REDIS_URL: redis://redis:6379
      BANK_API_KEY: ${BANK_API_KEY}
    depends_on:
      - postgres
      - redis
    networks:
      - jmbc-network

  payment-service:
    build:
      context: .
      dockerfile: Dockerfile.payment
    environment:
      DATABASE_URL: postgres://jmbc:${DB_PASSWORD}@postgres/jmbc_merchant
      RABBITMQ_URL: amqp://jmbc:${RABBITMQ_PASSWORD}@rabbitmq:5672
      CARD_NETWORK_API_KEY: ${CARD_NETWORK_API_KEY}
    depends_on:
      - postgres
      - rabbitmq
    networks:
      - jmbc-network

  minting-service:
    build:
      context: .
      dockerfile: Dockerfile.minting
    environment:
      DATABASE_URL: postgres://jmbc:${DB_PASSWORD}@postgres/jmbc_merchant
      ETH_RPC_URL: ${ETH_RPC_URL}
      JMS_CONTRACT_ADDRESS: ${JMS_CONTRACT_ADDRESS}
      CONTRACT_PRIVATE_KEY: ${CONTRACT_PRIVATE_KEY}
    depends_on:
      - postgres
    networks:
      - jmbc-network

  investment-service:
    build:
      context: .
      dockerfile: Dockerfile.investment
    environment:
      DATABASE_URL: postgres://jmbc:${DB_PASSWORD}@postgres/jmbc_merchant
      BOND_API_URL: ${BOND_API_URL}
      IMF_API_KEY: ${IMF_API_KEY}
    depends_on:
      - postgres
    networks:
      - jmbc-network

  reward-service:
    build:
      context: .
      dockerfile: Dockerfile.reward
    environment:
      DATABASE_URL: postgres://jmbc:${DB_PASSWORD}@postgres/jmbc_merchant
      COCA_CONTRACT_ADDRESS: ${COCA_CONTRACT_ADDRESS}
      DEX_API_URL: ${DEX_API_URL}
    depends_on:
      - postgres
    networks:
      - jmbc-network

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:

networks:
  jmbc-network:
    driver: bridge
```

### 6.2 Environment Variables

**File**: `.env`

```bash
# Database
DB_PASSWORD=your_secure_password
DATABASE_URL=postgres://jmbc:${DB_PASSWORD}@localhost/jmbc_merchant

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_PASSWORD=your_rabbitmq_password

# Blockchain
ETH_RPC_URL=https://mainnet.infura.io/v3/your_infura_key
JMS_CONTRACT_ADDRESS=0x...
COCA_CONTRACT_ADDRESS=0x...
CONTRACT_PRIVATE_KEY=your_private_key

# API keys
BANK_API_KEY=your_bank_api_key
CARD_NETWORK_API_KEY=your_card_network_key
BOND_API_URL=https://api.treasury.gov
IMF_API_KEY=your_imf_api_key
DEX_API_URL=https://api.cocadex.com

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Business configuration
BASE_REWARD_RATE=0.001
T_PLUS_1_DAYS=1
MIN_WITHDRAWAL_AMOUNT=100
MAX_WITHDRAWAL_AMOUNT=1000000
```

---

## 7. Security and Compliance

### 7.1 Security Measures

**File**: `src/security/mod.rs`

```rust
pub mod encryption;
pub mod authentication;
pub mod authorization;
pub mod audit_logging;

pub struct PaymentDataEncryption {
    encryption_key: [u8; 32],
    nonce: [u8; 12],
}

impl PaymentDataEncryption {
    pub fn encrypt_payment_data(&self, data: &PaymentData) -> Result<EncryptedData, EncryptionError> {
        let plaintext = serde_json::to_vec(data)?;
        let ciphertext = chacha20poly1305::XChaCha20Poly1305::new(
            GenericArray::from_slice(&self.encryption_key)
        ).encrypt(
            GenericArray::from_slice(&self.nonce),
            plaintext.as_ref(),
        )?;
        Ok(EncryptedData {
            ciphertext: ciphertext.to_vec(),
            nonce: self.nonce.to_vec(),
        })
    }

    pub fn decrypt_payment_data(&self, encrypted: &EncryptedData) -> Result<PaymentData, EncryptionError> {
        let plaintext = chacha20poly1305::XChaCha20Poly1305::new(
            GenericArray::from_slice(&self.encryption_key)
        ).decrypt(
            GenericArray::from_slice(&encrypted.nonce),
            encrypted.ciphertext.as_ref(),
        )?;
        Ok(serde_json::from_slice(&plaintext)?)
    }
}
```

### 7.2 Compliance Audit Logging

```rust
pub struct ComplianceAuditLogger {
    audit_db: AuditDatabase,
    retention_period: Duration,
}

impl ComplianceAuditLogger {
    pub fn log_payment_audit(&self, audit: PaymentAudit) -> Result<(), AuditError> {
        let encrypted_audit = self.encrypt_audit_data(&audit)?;
        self.audit_db.store_audit(AuditRecord {
            id: Uuid::new_v4(),
            event_type: "payment_processed".to_string(),
            user_id: audit.user_id,
            merchant_id: audit.merchant_id,
            amount: audit.amount,
            currency: audit.currency,
            encrypted_data: encrypted_audit,
            timestamp: Utc::now(),
            ip_address: audit.ip_address,
            user_agent: audit.user_agent,
            compliance_check: audit.compliance_check,
            risk_score: audit.risk_score,
        })?;
        Ok(())
    }

    pub fn generate_regulatory_report(
        &self,
        start_date: DateTime<Utc>,
        end_date: DateTime<Utc>,
        regulator: RegulatorType,
    ) -> Result<RegulatoryReport, AuditError> {
        let audits = self.audit_db.get_audits_in_range(start_date, end_date)?;
        let report = RegulatoryReport {
            regulator,
            period_start: start_date,
            period_end: end_date,
            total_transactions: audits.len() as u64,
            total_volume: audits.iter().map(|a| a.amount).sum(),
            suspicious_transactions: audits.iter().filter(|a| a.risk_score > 70).count() as u64,
            compliance_violations: audits.iter().filter(|a| !a.compliance_check.passed).count() as u64,
            detailed_audits: audits.iter().map(|a| self.decrypt_audit_data(a)).collect::<Result<Vec<_>, _>>()?,
            generated_at: Utc::now(),
            signature: self.sign_report(start_date, end_date)?,
        };
        Ok(report)
    }
}
```

---

## 8. Performance Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Payment Throughput | 10,000 TPS | Peak transaction processing |
| Response Time | < 200 ms | 95th percentile |
| System Availability | 99.99% | < 53 minutes downtime/year |
| Data Consistency | 99.999% | Transaction accuracy |
| Disaster Recovery RTO | < 30 min | Recovery time objective |
| Data Backup RPO | < 1 min | Recovery point objective |

---

## Contributing

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-07-14  
**Status**: Active Development

---

docs: add CoCa Merchant Acquiring System and API Design

Co-authors: Tian Guorong, Lei Zhibin, Huang Xinfeng
Institution: Hong Kong Ronghua International Group Limited
Standards: IETF draft-guorong-utxo-dns-01 · W3C UW2ICG
