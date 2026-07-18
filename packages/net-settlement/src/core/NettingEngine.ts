// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  SettlementTransaction,
  NetPosition,
  DailySettlementRequest,
  DailySettlementResult
} from '../types';
import { BISLedgerClient } from '@utxodns/bis-integration';

/**
 * Netting Engine
 * Calculates multilateral net positions for daily settlement
 */
export class NettingEngine {
  private ledgerClient: BISLedgerClient;

  constructor(ledgerClient: BISLedgerClient) {
    this.ledgerClient = ledgerClient;
  }

  /**
   * Calculate net positions for all participants
   */
  calculateNetPositions(
    transactions: SettlementTransaction[]
  ): NetPosition[] {
    const positionMap = new Map<string, { debit: bigint; credit: bigint }>();

    for (const tx of transactions) {
      // Debit (from participant)
      if (!positionMap.has(tx.from)) {
        positionMap.set(tx.from, { debit: BigInt(0), credit: BigInt(0) });
      }
      positionMap.get(tx.from)!.debit += tx.amount;

      // Credit (to participant)
      if (!positionMap.has(tx.to)) {
        positionMap.set(tx.to, { debit: BigInt(0), credit: BigInt(0) });
      }
      positionMap.get(tx.to)!.credit += tx.amount;
    }

    const positions: NetPosition[] = [];
    for (const [participant, pos] of positionMap) {
      positions.push({
        participant,
        grossDebit: pos.debit,
        grossCredit: pos.credit,
        netPosition: pos.credit - pos.debit
      });
    }

    return positions;
  }

  /**
   * Calculate settlement efficiency
   */
  calculateEfficiency(
    originalTransactions: SettlementTransaction[],
    netTransactions: SettlementTransaction[]
  ): number {
    const originalCount = originalTransactions.length;
    const netCount = netTransactions.length;
    if (originalCount === 0) return 0;
    return ((originalCount - netCount) / originalCount) * 100;
  }

  /**
   * Generate net settlement transactions
   */
  generateNetTransactions(positions: NetPosition[]): SettlementTransaction[] {
    const settlements: SettlementTransaction[] = [];

    for (const pos of positions) {
      if (pos.netPosition === BigInt(0)) continue;

      const isReceivable = pos.netPosition > 0;
      const amount = isReceivable ? pos.netPosition : -pos.netPosition;

      settlements.push({
        id: `net_${Date.now()}_${pos.participant}`,
        from: isReceivable ? 'bis_ccp' : pos.participant,
        to: isReceivable ? pos.participant : 'bis_ccp',
        amount,
        assetId: 'jms_asset',
        currency: 'JMS',
        timestamp: Date.now(),
        status: 'pending'
      });
    }

    return settlements;
  }

  /**
   * Validate net positions balance
   */
  validateBalance(positions: NetPosition[]): {
    balanced: boolean;
    totalDebit: bigint;
    totalCredit: bigint;
    difference: bigint;
  } {
    let totalDebit = BigInt(0);
    let totalCredit = BigInt(0);

    for (const pos of positions) {
      if (pos.netPosition > 0) {
        totalCredit += pos.netPosition;
      } else {
        totalDebit += -pos.netPosition;
      }
    }

    return {
      balanced: totalDebit === totalCredit,
      totalDebit,
      totalCredit,
      difference: totalDebit - totalCredit
    };
  }

  /**
   * Generate compression report
   */
  generateCompressionReport(
    originalTransactions: SettlementTransaction[],
    netTransactions: SettlementTransaction[]
  ): {
    originalCount: number;
    originalAmount: bigint;
    netCount: number;
    netAmount: bigint;
    compressionRate: number;
    amountReduction: bigint;
  } {
    const originalAmount = originalTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      BigInt(0)
    );
    const netAmount = netTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      BigInt(0)
    );

    return {
      originalCount: originalTransactions.length,
      originalAmount,
      netCount: netTransactions.length,
      netAmount,
      compressionRate: this.calculateEfficiency(
        originalTransactions,
        netTransactions
      ),
      amountReduction: originalAmount - netAmount
    };
  }
}
