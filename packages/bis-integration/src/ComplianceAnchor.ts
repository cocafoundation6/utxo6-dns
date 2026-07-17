// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { ComplianceAnchor, PRNAttestation, BISParticipant } from './types';
import { VLEIValidator } from '@utxodns/compliance';
import { createHash, randomBytes } from 'crypto';

/**
 * Compliance Anchor Manager 
 * Manages vLEI compliance anchors and PRN node attestations
 */
export class ComplianceAnchorManager {
  private vleiValidator: VLEIValidator;
  private anchors: Map<string, ComplianceAnchor> = new Map();
  private attestations: Map<string, PRNAttestation> = new Map();

  constructor() {
    this.vleiValidator = new VLEIValidator();
  }

  /**
   *Create Compliance Anchor
   */
  async createAnchor(
    participant: BISParticipant,
    regulatoryBody: string
  ): Promise<ComplianceAnchor> {
    // 验证 vLEI
    const vleiResult = await this.vleiValidator.verifyCredential(participant.vleiDID);
    if (!vleiResult.valid) {
      throw new Error(`vLEI verification failed for ${participant.utxoDomain}`);
    }

    const anchor: ComplianceAnchor = {
      id: `anchor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      participant: participant.utxoDomain,
      vleiDID: participant.vleiDID,
      jurisdiction: participant.jurisdiction,
      complianceStatus: 'verified',
      lastVerified: Date.now(),
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // One-year validity period
      attestationHash: createHash('sha256')
        .update(`${participant.vleiDID}${participant.jurisdiction}${Date.now()}`)
        .digest('hex'),
      regulatoryBody
    };

    this.anchors.set(anchor.id, anchor);
    return anchor;
  }

  /**
   *Verify Compliance Anchor Point
   */
  async verifyAnchor(anchorId: string): Promise<boolean> {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return false;

    if (anchor.complianceStatus !== 'verified') return false;
    if (Date.now() > anchor.expiresAt) {
      anchor.complianceStatus = 'expired';
      this.anchors.set(anchorId, anchor);
      return false;
    }

    // 重新验证 vLEI
    const vleiResult = await this.vleiValidator.verifyCredential(anchor.vleiDID);
    if (!vleiResult.valid) {
      anchor.complianceStatus = 'revoked';
      this.anchors.set(anchorId, anchor);
      return false;
    }

    return true;
  }

  /**
   * Generate PRN Node Proof
   */
  generatePRNAttestation(
    transactionId: string,
    prnNodeId: string,
    jurisdiction: string,
    checks?: Partial<PRNAttestation['checks']>
  ): PRNAttestation {
    const attestation: PRNAttestation = {
      id: `prn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      transactionId,
      prnNodeId,
      jurisdiction,
      verificationResult: 'pass',
      checks: {
        vleiValid: checks?.vleiValid || true,
        amlPassed: checks?.amlPassed || true,
        cftPassed: checks?.cftPassed || true,
        sanctionListChecked: checks?.sanctionListChecked || true,
        transactionLimitChecked: checks?.transactionLimitChecked || true
      },
      timestamp: Date.now(),
      signature: this.generatePRNSignature(transactionId, prnNodeId),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24-hour validity period
    };

    this.attestations.set(attestation.id, attestation);
    return attestation;
  }

  /**
   *Verify PRN Node Proof
   */
  verifyPRNAttestation(attestationId: string): boolean {
    const attestation = this.attestations.get(attestationId);
    if (!attestation) return false;

    if (attestation.verificationResult !== 'pass') return false;
    if (Date.now() > attestation.expiresAt) return false;

    // Verify signature
    const isValid = this.verifyPRNSignature(
      attestation.transactionId,
      attestation.prnNodeId,
      attestation.signature
    );

    return isValid;
  }

  /**
   * Obtain Compliance Anchors
   */
  getAnchor(anchorId: string): ComplianceAnchor | null {
    return this.anchors.get(anchorId) || null;
  }

  /**
   * Obtain participants' compliance anchors
   */
  getAnchorsByParticipant(participant: string): ComplianceAnchor[] {
    return Array.from(this.anchors.values())
      .filter(a => a.participant === participant);
  }

  /**
   * Obtain PRN Certificate
   */
  getPRNAttestation(attestationId: string): PRNAttestation | null {
    return this.attestations.get(attestationId) || null;
  }

  private generatePRNSignature(transactionId: string, prnNodeId: string): string {
    return createHash('sha256')
      .update(`${transactionId}${prnNodeId}${Date.now()}`)
      .digest('hex');
  }

  private verifyPRNSignature(transactionId: string, prnNodeId: string, signature: string): boolean {
    const expected = this.generatePRNSignature(transactionId, prnNodeId);
    return signature === expected;
  }
}
