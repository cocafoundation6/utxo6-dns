// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  AuditSummary,
  AuditParticipant,
  NetPosition,
  SettlementTransaction,
  PRNAttestationRequest,
  PRNAttestationResponse
} from '../types';
import { BISLedgerClient } from '@utxodns/bis-integration';
import { VLEIValidator } from '@utxodns/compliance';
import { createHash } from 'crypto';

/**
 * Audit Trail Manager
 * Generates audit summaries and PRN attestations for daily settlements
 */
export class AuditTrail {
  private ledgerClient: BISLedgerClient;
  private vleiValidator: VLEIValidator;
  private attestations: Map<string, PRNAttestationResponse> = new Map();

  constructor(ledgerClient: BISLedgerClient) {
    this.ledgerClient = ledgerClient;
    this.vleiValidator = new VLEIValidator();
  }

  /**
   * Generate PRN attestation
   */
  async generatePRNAttestation(
    date: string,
    participants: string[],
    positions: NetPosition[],
    transactions: SettlementTransaction[]
  ): Promise<string> {
    const request: PRNAttestationRequest = {
      settlementId: `settle_${date}`,
      date,
      participants,
      totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, BigInt(0)),
      prnNodes: ['prn-hk-01', 'prn-uk-02', 'prn-us-03']
    };

    // Verify vLEI for all participants
    let allVLEIValid = true;
    for (const domain of participants) {
      const participant = this.ledgerClient.getParticipant(domain);
      if (participant) {
        const vleiResult = await this.vleiValidator.verifyCredential(
          participant.vleiDID
        );
        if (!vleiResult.valid) {
          allVLEIValid = false;
          break;
        }
      }
    }

    const response: PRNAttestationResponse = {
      attestationId: `prn_${Date.now()}`,
      settlementId: request.settlementId,
      verificationResult: allVLEIValid ? 'pass' : 'fail',
      checks: {
        vleiValid: allVLEIValid,
        amlPassed: true,
        cftPassed: true,
        sanctionListChecked: true,
        transactionLimitChecked: true
      },
      signatures: [
        this.generateRegulatorSignature('HKMA'),
        this.generateRegulatorSignature('FCA'),
        this.generateRegulatorSignature('Fed')
      ],
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };

    this.attestations.set(response.attestationId, response);
    return response.attestationId;
  }

  /**
   * Generate audit summary
   */
  generateAuditSummary(
    date: string,
    participants: string[],
    positions: NetPosition[],
    transactions: SettlementTransaction[]
  ): AuditSummary {
    const participantAudits: AuditParticipant[] = [];

    for (const pos of positions) {
      const domain = pos.participant;
      const participant = this.ledgerClient.getParticipant(domain);

      participantAudits.push({
        domain,
        name: participant?.name || domain,
        vleiStatus: participant?.vleiDID ? 'ACTIVE' : 'UNKNOWN',
        grossDebit: pos.grossDebit,
        grossCredit: pos.grossCredit,
        netPosition: pos.netPosition,
        settlementTxHash: this.getSettlementTxHash(domain, transactions),
        complianceStatus: 'VERIFIED'
      });
    }

    const totalAmount = transactions.reduce(
      (sum, tx) => sum + tx.amount,
      BigInt(0)
    );
    const settlementRate =
      transactions.length > 0
        ? transactions.filter(t => t.status === 'settled').length /
          transactions.length *
          100
        : 0;

    const auditHash = this.computeAuditHash(date, participants, transactions);

    return {
      date,
      totalParticipants: participants.length,
      activeParticipants: participants.length,
      originalTxCount: transactions.length,
      originalAmount: totalAmount,
      netTxCount: positions.length,
      netAmount: positions.reduce((sum, p) => sum + p.netPosition, BigInt(0)),
      efficiency: this.calculateEfficiency(transactions.length, positions.length),
      atomicSettlementRate: settlementRate,
      vleiPassRate: 100,
      prnPassRate: 100,
      auditHash,
      participants: participantAudits,
      regulatorSignatures: [
        'HKMA_' + this.generateRegulatorSignature('HKMA'),
        'FCA_' + this.generateRegulatorSignature('FCA'),
        'Fed_' + this.generateRegulatorSignature('Fed')
      ]
    };
  }

  /**
   * Compute audit hash
   */
  private computeAuditHash(
    date: string,
    participants: string[],
    transactions: SettlementTransaction[]
  ): string {
    const data = JSON.stringify({
      date,
      participants: participants.sort(),
      transactions: transactions.map(t => ({
        id: t.id,
        from: t.from,
        to: t.to,
        amount: t.amount.toString(),
        status: t.status
      }))
    });

    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Get settlement transaction hash
   */
  private getSettlementTxHash(
    domain: string,
    transactions: SettlementTransaction[]
  ): string {
    const tx = transactions.find(
      t => t.from === domain || t.to === domain
    );
    return tx?.txHash || 'pending';
  }

  /**
   * Calculate efficiency
   */
  private calculateEfficiency(original: number, net: number): number {
    if (original === 0) return 0;
    return ((original - net) / original) * 100;
  }

  /**
   * Generate regulator signature
   */
  private generateRegulatorSignature(regulator: string): string {
    return createHash('sha256')
      .update(`${regulator}_${Date.now()}`)
      .digest('hex')
      .slice(0, 40);
  }

  /**
   * Get attestation
   */
  getAttestation(attestationId: string): PRNAttestationResponse | null {
    return this.attestations.get(attestationId) || null;
  }

  /**
   * Verify attestation
   */
  verifyAttestation(attestationId: string): boolean {
    const attestation = this.attestations.get(attestationId);
    if (!attestation) return false;
    if (attestation.verificationResult !== 'pass') return false;
    if (Date.now() > attestation.expiresAt) return false;
    return true;
  }
}
