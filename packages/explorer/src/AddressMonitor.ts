// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { MonitorRule, TransactionEvent, AddressInfo } from './types';
import { TransactionTracker } from './TransactionTracker';
import { UTXOExplorer } from './UTXOExplorer';

/**
 * Address Monitor
 * Monitor address activity and trigger rules.
 */
export class AddressMonitor {
  private tracker: TransactionTracker;
  private explorer: UTXOExplorer;
  private rules: Map<string, MonitorRule> = new Map();
  private eventHistory: Map<string, TransactionEvent[]> = new Map();

  constructor(tracker: TransactionTracker, explorer: UTXOExplorer) {
    this.tracker = tracker;
    this.explorer = explorer;
  }

  /**
   * Add monitoring rules
   */
  addRule(rule: MonitorRule): void {
    this.rules.set(rule.id, rule);

    // Subscription address events
    for (const address of rule.addresses) {
      this.tracker.trackAddressTransactions(address, (event) => {
        this.evaluateRule(rule, event);
      });
    }
  }

  /**
   * Remove monitoring rules
   */
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Retrieval Rules
   */
  getRule(ruleId: string): MonitorRule | null {
    return this.rules.get(ruleId) || null;
  }

  /**
   *Retrieve all rules
   */
  getAllRules(): MonitorRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Retrieve address event history
   */
  getEventHistory(address: string, limit: number = 50): TransactionEvent[] {
    const events = this.eventHistory.get(address) || [];
    return events.slice(-limit);
  }

  /**
   * Check if the address complies with the rules.
   */
  checkAddress(address: string): {
    matches: MonitorRule[];
    events: TransactionEvent[];
  } {
    const matches: MonitorRule[] = [];
    const events = this.getEventHistory(address);

    for (const rule of this.rules.values()) {
      if (rule.addresses.includes(address)) {
        matches.push(rule);
      }
    }

    return { matches, events };
  }

  /**
   * Evaluation Criteria
   */
  private evaluateRule(rule: MonitorRule, event: TransactionEvent): void {
    // Verify the amount condition.
    if (rule.conditions.minAmount && event.amount < rule.conditions.minAmount) {
      return;
    }
    if (rule.conditions.maxAmount && event.amount > rule.conditions.maxAmount) {
      return;
    }

    // Verify the confirmation count condition
    if (rule.conditions.maxConfirmations &&
        event.confirmations > rule.conditions.maxConfirmations) {
      return;
    }

    // Log the event
    if (!this.eventHistory.has(event.address)) {
      this.eventHistory.set(event.address, []);
    }
    this.eventHistory.get(event.address)!.push(event);

    // Trigger callback
    rule.callback(event);
  }
}
