// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * BIS Unified Ledger Participant Types
 */
export enum BISParticipantType {
  CENTRAL_BANK = 'central_bank',
  COMMERCIAL_BANK = 'commercial_bank',
  FINANCIAL_INSTITUTION = 'financial_institution',
  CORPORATE = 'corporate'
}

/**
 * BIS Unified Ledger Participant
 */
export interface BISParticipant {
  id: string;
  name: string;
  type: BISParticipantType;
  jurisdiction: string;
  utxoDomain: string;              // .utxo Domain name
  vleiDID: string;                 // vLEI Legal Representative Status
  addresses: {
    jms?: string;                  // JMS Account Address
    btc?: string;
    eth?: string;
    usdc?: string;
    usdt?: string;
    hkdStable?: string;
  };
  publicKey: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: number;
}

/**
 * BIS Unified Ledger Asset Types
 */
export enum BISAssetType {
  CENTRAL_BANK_RESERVE = 'central_bank_reserve',
  COMMERCIAL_BANK_DEPOSIT = 'commercial_bank_deposit',
  STABLECOIN = 'stablecoin',
  TOKENIZED_BOND = 'tokenized_bond',
  RWA = 'rwa',
  CBDC = 'cbdc'
}

/**
 * BIS Unified Ledger Assets
 */
export interface BISAsset {
  id: string;
  type: BISAssetType;
  issuer: string;                  //Issuer: .utxo domain
  symbol: string;
  name: string;
  totalSupply: bigint;
  decimals: number;
  jurisdiction: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending';
  contractAddress?: string;        // Smart contract address
  utxoId?: string;                 // UTXO ID
}

/**
 * 多边结算请求
 */
export interface MultiLateralSettlementRequest {
  id: string;
  participants: {
    from: string;                  // Participant .utxo domain
    to: string;
    amount: bigint;
    assetId: string;
  }[];
  timestamp: number;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'refunded';
  txId?: string;
  completedAt?: number;
}

/**
 * Atomic Settlement Transaction
 */
export interface AtomicSettlementTransaction {
  id: string;
  from: string;                    // Initiator .utxo domain
  to: string;                      // Recipient .utxo domain
  amount: bigint;
  assetId: string;
  settlementCurrency: 'JMS' | 'USDC' | 'USDT' | 'HKD_STABLE' | 'CBDC';
  settlementChain: 'utxo' | 'evm' | 'jmbc';
  status: 'pending' | 'settled' | 'failed' | 'reversed';
  txHash: string;
  blockHeight: number;
  confirmations: number;
  timestamp: number;
  prnProof?: string;               // PRN Node Compliance Certification
  vleiAttestation?: string;        // vLEI Verification Proof

/**
 * Cross-jurisdictional exchange requests
 */
export interface CrossJurisdictionSwapRequest {
  id: string;
  fromJurisdiction: string;
  toJurisdiction: string;
  fromParticipant: string;         // .utxo Domain name
  toParticipant: string;           // .utxo Domain name
  fromAmount: bigint;
  toAmount: bigint;
  fromAssetId: string;
  toAssetId: string;
  exchangeRate: number;
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed' | 'rejected';
  regulatorApproval?: string;      // Regulatory approval signature
  prnAttestation?: string;         // PRN Node Proof
  completedAt?: number;
}

/**
 * Compliance Anchor
 */
export interface ComplianceAnchor {
  id: string;
  participant: string;             // .utxo domain
  vleiDID: string;
  jurisdiction: string;
  complianceStatus: 'verified' | 'pending' | 'expired' | 'revoked';
  lastVerified: number;
  expiresAt: number;
  attestationHash: string;
  regulatoryBody: string;
}

/**
 * PRN Node Proof
 */
export interface PRNAttestation {
  id: string;
  transactionId: string;
  prnNodeId: string;
  jurisdiction: string;
  verificationResult: 'pass' | 'fail' | 'pending';
  checks: {
    vleiValid: boolean;
    amlPassed: boolean;
    cftPassed: boolean;
    sanctionListChecked: boolean;
    transactionLimitChecked: boolean;
  };
  timestamp: number;
  signature: string;
  expiresAt: number;
}

/**
 * BIS Unified Ledger State
 */
export interface BISLedgerState {
  participants: BISParticipant[];
  assets: BISAsset[];
  transactions: AtomicSettlementTransaction[];
  totalSettlementVolume: bigint;
  activeParticipants: number;
  avgSettlementTime: number;
}
