// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { MultiLateralSettlementRequest, PRNAttestation, BISParticipant } from './types';
import { BISLedgerClient } from './BISLedgerClient';
import { UTXOSetManager } from '@utxodns/state';

/**
 * Multilateral Settlement Engine 
 * Enables multilateral net settlement for the BIS unified ledger
 */
export class MultiLateralSettlement {
  private ledgerClient: BISLedgerClient;
  private utxoManager: UTXOSetManager;
  private settlements: Map<string, MultiLateralSettlementRequest> = new Map();

  constructor(ledgerClient: BISLedgerClient, utxoManager: UTXOSetManager) {
    this.ledgerClient = ledgerClient;
    this.utxoManager = utxoManager;
  }

  /**
   * Initiate multilateral settlement
   */
  async initiateSettlement(
    transactions: Array<{
      from: string;
      to: string;
      amount: bigint;
      assetId: string;
    }>
  ): Promise<MultiLateralSettlementRequest> {
    // 计算净额
    const netPositions = this.calculateNetPositions(transactions);

    // 验证所有参与者
    for (const participant of Object.keys(netPositions)) {
      const p = this.ledgerClient.getParticipant(participant);
      if (!p) {
        throw new Error(`Participant ${participant} not registered`);
      }
    }

    const request: MultiLateralSettlementRequest = {
      id: `mls_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      participants: transactions.map(t => ({
        from: t.from,
        to: t.to,
        amount: t.amount,
        assetId: t.assetId
      })),
      timestamp: Date.now(),
      status: 'pending'
    };

    this.settlements.set(request.id, request);
    return request;
  }

  /**
   * Conduct multilateral settlement.
   */
  async executeSettlement(requestId: string): Promise<MultiLateralSettlementRequest> {
    const request = this.settlements.get(requestId);
    if (!request) {
      throw new Error(`Settlement request ${requestId} not found`);
    }

    if (request.status !== 'pending') {
      throw new Error(`Settlement ${requestId} is not pending`);
    }

    request.status = 'executing';

    try {
      // Calculate net amount
      const netPositions = this.calculateNetPositions(request.participants);

      // Netting by novation
      for (const [participant, amount] of Object.entries(netPositions)) {
        if (amount === BigInt(0)) continue;

        const p = this.ledgerClient.getParticipant(participant);
        if (!p) continue;

        // Determine whether it is a payment or receipt based on the positive or negative amount.
        if (amount > 0) {
          // Need to pay.
          const payment = await this.ledgerClient.executeAtomicSettlement({
            from: participant,
            to: 'bis_system',
            amount: amount,
            assetId: request.participants[0]?.assetId || '',
            settlementCurrency: 'JMS',
            settlementChain: 'utxo'
          });
        }
      }

      request.status = 'completed';
      request.completedAt = Date.now();
      this.settlements.set(requestId, request);

      return request;
    } catch (error: any) {
      request.status = 'failed';
      this.settlements.set(requestId, request);
      throw error;
    }
  }

  /**
   * Calculate net amount
   */
  private calculateNetPositions(
    transactions: Array<{ from: string; to: string; amount: bigint; assetId: string }>
  ): Record<string, bigint> {
    const positions: Record<string, bigint> = {};

    for (const tx of transactions) {
      // Debit (deducted from the initiating party)
      positions[tx.from] = (positions[tx.from] || BigInt(0)) + tx.amount;
      // Credit (increase to the recipient)
      positions[tx.to] = (positions[tx.to] || BigInt(0)) - tx.amount;
    }

    return positions;
  }

  /**
   * Retrieve settlement status
   */
  getSettlementStatus(requestId: string): MultiLateralSettlementRequest | null {
    return this.settlements.get(requestId) || null;
  }

  /**
   * Retrieve all settlements
   */
  getAllSettlements(): MultiLateralSettlementRequest[] {
    return Array.from(this.settlements.values());
  }

  /**
   * Calculate settlement efficiency
   */
  calculateSettlementEfficiency(requestId: string): {
    originalTransactions: number;
    netTransactions: number;
    efficiency: number;
  } {
    const request = this.settlements.get(requestId);
    if (!request) {
      throw new Error(`Settlement ${requestId} not found`);
    }

    const original = request.participants.length;
    const netPositions = this.calculateNetPositions(request.participants);
    const net = Object.keys(netPositions).filter(k => netPositions[k] !== BigInt(0)).length;

    return {
      originalTransactions: original,
      netTransactions: net,
      efficiency: original > 0 ? (1 - net / original) * 100 : 0
    };
  }
}
