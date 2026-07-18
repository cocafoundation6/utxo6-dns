// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  DailySettlementRequest,
  DailySettlementResult,
  SettlementTransaction,
  NetPosition
} from '../types';
import { NettingEngine } from './NettingEngine';
import { SettlementCalculator } from './SettlementCalculator';
import { AuditTrail } from '../audit/AuditTrail';
import { BISLedgerClient } from '@utxodns/bis-integration';
import { createHash } from 'crypto';

/**
 * Daily Settlement Executor
 * Orchestrates the end-of-day net settlement process
 */
export class DailySettlement {
  private engine: NettingEngine;
  private calculator: SettlementCalculator;
  private auditTrail: AuditTrail;
  private ledgerClient: BISLedgerClient;

  constructor(
    engine: NettingEngine,
    ledgerClient: BISLedgerClient
  ) {
    this.engine = engine;
    this.ledgerClient = ledgerClient;
    this.calculator = new SettlementCalculator();
    this.auditTrail = new AuditTrail(ledgerClient);
  }

  /**
   * Execute daily net settlement
   */
  async executeDailySettlement(
    request: DailySettlementRequest
  ): Promise<DailySettlementResult> {
    console.log(`[DailySettlement] Starting for ${request.date}`);

    // 1. Validate participants
    await this.validateParticipants(request.participants);

    // 2. Calculate net positions
    const netPositions = this.engine.calculateNetPositions(
      request.transactions
    );

    // 3. Validate balance
    const balanceCheck = this.engine.validateBalance(netPositions);
    if (!balanceCheck.balanced) {
      console.warn(
        `[DailySettlement] Balance mismatch: ${balanceCheck.difference}`
      );
    }

    // 4. Generate net transactions
    const netTransactions = this.engine.generateNetTransactions(netPositions);

    // 5. Calculate compression statistics
    const compression = this.engine.generateCompressionReport(
      request.transactions,
      netTransactions
    );

    // 6. Execute settlement transactions
    const settledTxs: SettlementTransaction[] = [];
    for (const tx of netTransactions) {
      try {
        const settled = await this.executeSettlement(tx);
        settledTxs.push(settled);
      } catch (error: any) {
        console.error(`[DailySettlement] Failed: ${error.message}`);
        tx.status = 'failed';
        settledTxs.push(tx);
      }
    }

    // 7. Generate audit hash
    const auditHash = this.generateAuditHash(
      request.date,
      netPositions,
      settledTxs
    );

    // 8. Generate PRN attestation
    const prnAttestation = await this.auditTrail.generatePRNAttestation(
      request.date,
      request.participants,
      netPositions,
      settledTxs
    );

    return {
      date: request.date,
      totalTransactions: request.transactions.length,
      totalAmount: compression.originalAmount,
      netTransactions: settledTxs.length,
      netAmount: compression.netAmount,
      efficiency: compression.compressionRate,
      netPositions,
      settlements: settledTxs,
      status: this.determineStatus(settledTxs),
      auditHash,
      prnAttestation,
      timestamp: Date.now()
    };
  }

  /**
   * Validate participants
   */
  private async validateParticipants(participants: string[]): Promise<void> {
    for (const domain of participants) {
      const participant = this.ledgerClient.getParticipant(domain);
      if (!participant) {
        throw new Error(`Participant ${domain} not registered`);
      }
      if (participant.status !== 'active') {
        throw new Error(`Participant ${domain} is not active`);
      }
    }
  }

  /**
   * Execute a single settlement transaction
   */
  private async executeSettlement(
    tx: SettlementTransaction
  ): Promise<SettlementTransaction> {
    try {
      const result = await this.ledgerClient.executeAtomicSettlement({
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        assetId: tx.assetId,
        settlementCurrency: tx.currency as any,
        settlementChain: 'utxo'
      });

      tx.status = 'settled';
      tx.txHash = result.txHash;
      tx.blockHeight = result.blockHeight;

      return tx;
    } catch (error: any) {
      tx.status = 'failed';
      throw error;
    }
  }

  /**
   * Generate audit hash
   */
  private generateAuditHash(
    date: string,
    positions: NetPosition[],
    transactions: SettlementTransaction[]
  ): string {
    const data = JSON.stringify({
      date,
      positions: positions.map(p => ({
        participant: p.participant,
        net: p.netPosition.toString()
      })),
      transactions: transactions.map(t => t.id)
    });

    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Determine settlement status
   */
  private determineStatus(
    transactions: SettlementTransaction[]
  ): 'completed' | 'partial' | 'failed' {
    const failed = transactions.filter(t => t.status === 'failed').length;
    const total = transactions.length;

    if (failed === 0) return 'completed';
    if (failed < total) return 'partial';
    return 'failed';
  }

  /**
   * Get settlement efficiency
   */
  getEfficiency(
    original: SettlementTransaction[],
    net: SettlementTransaction[]
  ): number {
    return this.engine.calculateEfficiency(original, net);
  }
}
