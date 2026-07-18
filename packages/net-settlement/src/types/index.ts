// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * Settlement Transaction
 */
export interface SettlementTransaction {
  id: string;
  from: string;
  to: string;
  amount: bigint;
  assetId: string;
  currency: string;
  timestamp: number;
  status: 'pending' | 'settled' | 'failed';
  txHash?: string;
  blockHeight?: number;
}

/**
 * Net Position
 */
export interface NetPosition {
  participant: string;
  grossDebit: bigint;
  grossCredit: bigint;
  netPosition: bigint; // positive = receivable, negative = payable
}

/**
 * Daily Settlement Request
 */
export interface DailySettlementRequest {
  date: string;
  participants: string[];
  transactions: SettlementTransaction[];
  settlementAsset: string;
  settlementCurrency: string;
}

/**
 * Daily Settlement Result
 */
export interface DailySettlementResult {
  date: string;
  totalTransactions: number;
  totalAmount: bigint;
  netTransactions: number;
  netAmount: bigint;
  efficiency: number;
  netPositions: NetPosition[];
  settlements: SettlementTransaction[];
  status: 'completed' | 'partial' | 'failed';
  auditHash: string;
  prnAttestation: string;
  timestamp: number;
}

/**
 * Audit Summary
 */
export interface AuditSummary {
  date: string;
  totalParticipants: number;
  activeParticipants: number;
  originalTxCount: number;
  originalAmount: bigint;
  netTxCount: number;
  netAmount: bigint;
  efficiency: number;
  atomicSettlementRate: number;
  vleiPassRate: number;
  prnPassRate: number;
  auditHash: string;
  participants: AuditParticipant[];
  regulatorSignatures: string[];
}

/**
 * Audit Participant
 */
export interface AuditParticipant {
  domain: string;
  name: string;
  vleiStatus: string;
  grossDebit: bigint;
  grossCredit: bigint;
  netPosition: bigint;
  settlementTxHash: string;
  complianceStatus: string;
}

/**
 * Settlement Statistics
 */
export interface SettlementStats {
  avgBlockTime: number;
  avgTxSize: number;
  feeRate: bigint;
  activeAddresses24h: number;
}

/**
 * PRN Attestation Request
 */
export interface PRNAttestationRequest {
  settlementId: string;
  date: string;
  participants: string[];
  totalAmount: bigint;
  prnNodes: string[];
}

/**
 * PRN Attestation Response
 */
export interface PRNAttestationResponse {
  attestationId: string;
  settlementId: string;
  verificationResult: 'pass' | 'fail';
  checks: {
    vleiValid: boolean;
    amlPassed: boolean;
    cftPassed: boolean;
    sanctionListChecked: boolean;
    transactionLimitChecked: boolean;
  };
  signatures: string[];
  timestamp: number;
  expiresAt: number;
}
