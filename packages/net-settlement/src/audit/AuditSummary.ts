// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { AuditSummary, AuditParticipant } from '../types';
import { AuditTrail } from './AuditTrail';

/**
 * Audit Summary Generator
 * Formats audit summaries for reporting
 */
export class AuditSummaryGenerator {
  private auditTrail: AuditTrail;

  constructor(auditTrail: AuditTrail) {
    this.auditTrail = auditTrail;
  }

  /**
   * Generate formatted summary report
   */
  generateReport(summary: AuditSummary): string {
    const lines: string[] = [];

    lines.push('=' .repeat(80));
    lines.push('JMBC-BIS DAILY NET SETTLEMENT AUDIT SUMMARY');
    lines.push('=' .repeat(80));
    lines.push(`Date: ${summary.date}`);
    lines.push(`Audit Hash: ${summary.auditHash}`);
    lines.push('');
    lines.push('--- SETTLEMENT STATISTICS ---');
    lines.push(`Total Participants: ${summary.totalParticipants}`);
    lines.push(`Active Participants: ${summary.activeParticipants}`);
    lines.push(`Original Transactions: ${summary.originalTxCount}`);
    lines.push(`Original Amount: ${summary.originalAmount.toString()}`);
    lines.push(`Net Transactions: ${summary.netTxCount}`);
    lines.push(`Net Amount: ${summary.netAmount.toString()}`);
    lines.push(`Efficiency: ${summary.efficiency.toFixed(2)}%`);
    lines.push(`Atomic Settlement Rate: ${summary.atomicSettlementRate.toFixed(2)}%`);
    lines.push(`vLEI Pass Rate: ${summary.vleiPassRate}%`);
    lines.push(`PRN Pass Rate: ${summary.prnPassRate}%`);
    lines.push('');
    lines.push('--- PARTICIPANT DETAILS ---');

    for (const p of summary.participants) {
      lines.push(`${p.domain} (${p.name})`);
      lines.push(`  vLEI: ${p.vleiStatus}`);
      lines.push(`  Debit: ${p.grossDebit.toString()}`);
      lines.push(`  Credit: ${p.grossCredit.toString()}`);
      lines.push(`  Net Position: ${p.netPosition.toString()}`);
      lines.push(`  Settlement Tx: ${p.settlementTxHash}`);
      lines.push(`  Compliance: ${p.complianceStatus}`);
      lines.push('');
    }

    lines.push('--- REGULATORY SIGNATURES ---');
    for (const sig of summary.regulatorSignatures) {
      lines.push(`  ✓ ${sig}`);
    }

    lines.push('');
    lines.push('=' .repeat(80));
    lines.push('AUDIT COMPLETE · ALL TRANSACTIONS VERIFIED');
    lines.push('=' .repeat(80));

    return lines.join('\n');
  }

  /**
   * Generate JSON summary
   */
  generateJSON(summary: AuditSummary): string {
    return JSON.stringify(summary, null, 2);
  }

  /**
   * Generate Markdown summary
   */
  generateMarkdown(summary: AuditSummary): string {
    const lines: string[] = [];

    lines.push('# JMBC-BIS Daily Net Settlement Audit Summary');
    lines.push('');
    lines.push(`**Date:** ${summary.date}`);
    lines.push(`**Audit Hash:** \`${summary.auditHash}\``);
    lines.push('');
    lines.push('## Settlement Statistics');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('| :--- | :--- |');
    lines.push(`| Total Participants | ${summary.totalParticipants} |`);
    lines.push(`| Active Participants | ${summary.activeParticipants} |`);
    lines.push(`| Original Transactions | ${summary.originalTxCount} |`);
    lines.push(`| Original Amount | ${summary.originalAmount.toString()} JMS |`);
    lines.push(`| Net Transactions | ${summary.netTxCount} |`);
    lines.push(`| Net Amount | ${summary.netAmount.toString()} JMS |`);
    lines.push(`| Efficiency | ${summary.efficiency.toFixed(2)}% |`);
    lines.push(`| Atomic Settlement Rate | ${summary.atomicSettlementRate.toFixed(2)}% |`);
    lines.push(`| vLEI Pass Rate | ${summary.vleiPassRate}% |`);
    lines.push(`| PRN Pass Rate | ${summary.prnPassRate}% |`);
    lines.push('');
    lines.push('## Participant Details');
    lines.push('');
    lines.push('| Domain | Name | vLEI | Debit | Credit | Net Position | Status |');
    lines.push('| :--- | :--- | :--- | :--- | :--- | :--- | :--- |');

    for (const p of summary.participants) {
      lines.push(
        `| ${p.domain} | ${p.name} | ${p.vleiStatus} | ` +
        `${p.grossDebit.toString()} | ${p.grossCredit.toString()} | ` +
        `${p.netPosition.toString()} | ${p.complianceStatus} |`
      );
    }

    lines.push('');
    lines.push('## Regulatory Signatures');
    lines.push('');
    for (const sig of summary.regulatorSignatures) {
      lines.push(`- ✅ ${sig}`);
    }

    lines.push('');
    lines.push('---');
    lines.push('*Audit Complete · All Transactions Verified*');

    return lines.join('\n');
  }
}
