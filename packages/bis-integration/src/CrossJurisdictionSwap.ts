// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  CrossJurisdictionSwapRequest,
  AtomicSettlementTransaction,
  BISParticipant
} from './types';
import { BISLedgerClient } from './BISLedgerClient';
import { ComplianceAnchorManager } from './ComplianceAnchor';
import { HTLCContractManager } from '@utxodns/htlc';

/**
 * Cross-jurisdictional exchange engine 
 * Enables compliant asset transfers across different jurisdictions
 */
export class CrossJurisdictionSwap {
  private ledgerClient: BISLedgerClient;
  private complianceManager: ComplianceAnchorManager;
  private swaps: Map<string, CrossJurisdictionSwapRequest> = new Map();

  constructor(ledgerClient: BISLedgerClient) {
    this.ledgerClient = ledgerClient;
    this.complianceManager = new ComplianceAnchorManager();
  }

  /**
   * Initiate cross-jurisdictional data exchange
   */
  async initiateSwap(params: {
    fromJurisdiction: string;
    toJurisdiction: string;
    fromParticipant: string;
    toParticipant: string;
    fromAmount: bigint;
    toAmount: bigint;
    fromAssetId: string;
    toAssetId: string;
    exchangeRate: number;
  }): Promise<CrossJurisdictionSwapRequest> {
    // Verify participants
    const from = this.ledgerClient.getParticipant(params.fromParticipant);
    const to = this.ledgerClient.getParticipant(params.toParticipant);

    if (!from) {
      throw new Error(`Participant ${params.fromParticipant} not found`);
    }
    if (!to) {
      throw new Error(`Participant ${params.toParticipant} not found`);
    }

    // Verification Jurisdiction
    if (from.jurisdiction !== params.fromJurisdiction) {
      throw new Error(`Jurisdiction mismatch for ${params.fromParticipant}`);
    }
    if (to.jurisdiction !== params.toJurisdiction) {
      throw new Error(`Jurisdiction mismatch for ${params.toParticipant}`);
    }

    // Verify compliance anchor points
    const fromAnchors = this.complianceManager.getAnchorsByParticipant(params.fromParticipant);
    const toAnchors = this.complianceManager.getAnchorsByParticipant(params.toParticipant);

    if (fromAnchors.length === 0) {
      throw new Error(`No compliance anchor found for ${params.fromParticipant}`);
    }
    if (toAnchors.length === 0) {
      throw new Error(`No compliance anchor found for ${params.toParticipant}`);
    }

    const swap: CrossJurisdictionSwapRequest = {
      id: `cjs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      fromJurisdiction: params.fromJurisdiction,
      toJurisdiction: params.toJurisdiction,
      fromParticipant: params.fromParticipant,
      toParticipant: params.toParticipant,
      fromAmount: params.fromAmount,
      toAmount: params.toAmount,
      fromAssetId: params.fromAssetId,
      toAssetId: params.toAssetId,
      exchangeRate: params.exchangeRate,
      status: 'pending'
    };

    this.swaps.set(swap.id, swap);
    return swap;
  }

  /**
   * Regulatory approval for exchange
   */
  async approveSwap(swapId: string, regulatorSignature: string): Promise<CrossJurisdictionSwapRequest> {
    const swap = this.swaps.get(swapId);
    if (!swap) {
      throw new Error(`Swap ${swapId} not found`);
    }

    if (swap.status !== 'pending') {
      throw new Error(`Swap ${swapId} is not pending`);
    }

    swap.status = 'approved';
    swap.regulatorApproval = regulatorSignature;
    this.swaps.set(swapId, swap);

    return swap;
  }

  /**
   * Execute swap
   */
  async executeSwap(swapId: string): Promise<CrossJurisdictionSwapRequest> {
    const swap = this.swaps.get(swapId);
    if (!swap) {
      throw new Error(`Swap ${swapId} not found`);
    }

    if (swap.status !== 'approved') {
      throw new Error(`Swap ${swapId} is not approved`);
    }

    swap.status = 'executing';

    try {
      // Initiate atomic settlement from Jurisdiction A.
      const settlement1 = await this.ledgerClient.executeAtomicSettlement({
        from: swap.fromParticipant,
        to: `bridge_${swap.toJurisdiction}`,
        amount: swap.fromAmount,
        assetId: swap.fromAssetId,
        settlementCurrency: 'JMS',
        settlementChain: 'utxo'
      });

      // Initiate atomic settlement from jurisdiction B.
      const settlement2 = await this.ledgerClient.executeAtomicSettlement({
        from: `bridge_${swap.fromJurisdiction}`,
        to: swap.toParticipant,
        amount: swap.toAmount,
        assetId: swap.toAssetId,
        settlementCurrency: 'JMS',
        settlementChain: 'utxo'
      });

      swap.status = 'completed';
      swap.completedAt = Date.now();

      // Generate PRN Certificate
      const prnAttestation = this.complianceManager.generatePRNAttestation(
        swap.id,
        `prn_${swap.fromJurisdiction}_${swap.toJurisdiction}`,
        swap.fromJurisdiction
      );
      swap.prnAttestation = prnAttestation.signature;

      this.swaps.set(swapId, swap);
      return swap;
    } catch (error: any) {
      swap.status = 'failed';
      this.swaps.set(swapId, swap);
      throw error;
    }
  }

  /**
   *Retrieve exchange status
   */
  getSwapStatus(swapId: string): CrossJurisdictionSwapRequest | null {
    return this.swaps.get(swapId) || null;
  }

  /**
   * Retrieve all exchanges
   */
  getAllSwaps(): CrossJurisdictionSwapRequest[] {
    return Array.from(this.swaps.values());
  }

  /**
   * Retrieve district statistics
   */
  getJurisdictionStats(jurisdiction: string): {
    totalSwaps: number;
    totalVolume: bigint;
    activeParticipants: number;
  } {
    const jurisSwaps = Array.from(this.swaps.values())
      .filter(s => s.fromJurisdiction === jurisdiction || s.toJurisdiction === jurisdiction);

    const totalVolume = jurisSwaps.reduce(
      (sum, s) => sum + s.fromAmount + s.toAmount,
      BigInt(0)
    );

    const participants = new Set<string>();
    for (const s of jurisSwaps) {
      participants.add(s.fromParticipant);
      participants.add(s.toParticipant);
    }

    return {
      totalSwaps: jurisSwaps.length,
      totalVolume,
      activeParticipants: participants.size
    };
  }
}
