// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { SettlementTransaction, NetPosition, SettlementStats } from '../types';

/**
 * Settlement Calculator
 * Provides statistical calculations for settlement operations
 */
export class SettlementCalculator {
  /**
   * Calculate total amount from transactions
   */
  calculateTotal(transactions: SettlementTransaction[]): bigint {
    return transactions.reduce((sum, tx) => sum + tx.amount, BigInt(0));
  }

  /**
   * Calculate average transaction amount
   */
  calculateAverage(transactions: SettlementTransaction[]): bigint {
    if (transactions.length === 0) return BigInt(0);
    return this.calculateTotal(transactions) / BigInt(transactions.length);
  }

  /**
   * Calculate participant statistics
   */
  calculateParticipantStats(
    positions: NetPosition[]
  ): {
    totalParticipants: number;
    netDebitParticipants: number;
    netCreditParticipants: number;
    zeroBalanceParticipants: number;
  } {
    let netDebit = 0;
    let netCredit = 0;
    let zeroBalance = 0;

    for (const pos of positions) {
      if (pos.netPosition > 0) netCredit++;
      else if (pos.netPosition < 0) netDebit++;
      else zeroBalance++;
    }

    return {
      totalParticipants: positions.length,
      netDebitParticipants: netDebit,
      netCreditParticipants: netCredit,
      zeroBalanceParticipants: zeroBalance
    };
  }

  /**
   * Calculate settlement concentration
   */
  calculateConcentration(
    positions: NetPosition[],
    topN: number = 5
  ): {
    topParticipants: NetPosition[];
    concentrationRatio: number;
  } {
    const sorted = [...positions].sort(
      (a, b) => Number(Math.abs(b.netPosition) - Math.abs(a.netPosition))
    );

    const top = sorted.slice(0, topN);
    const total = Math.abs(
      positions.reduce((sum, p) => sum + p.netPosition, BigInt(0))
    );
    const topTotal = Math.abs(
      top.reduce((sum, p) => sum + p.netPosition, BigInt(0))
    );

    return {
      topParticipants: top,
      concentrationRatio: total > 0
        ? Number((topTotal * BigInt(100)) / total)
        : 0
    };
  }
}
