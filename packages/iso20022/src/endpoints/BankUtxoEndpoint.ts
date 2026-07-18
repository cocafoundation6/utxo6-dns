// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { JMBCISO20022Adapter } from '../adapter/JMBCISO20022Adapter';
import { DomainResolutionResult, JMBCSettlementResult } from '../types';

/**
 * Bank.utxo API Endpoint
 * Exposes ISO 20022 banking functions via .utxo domain
 *
 * Endpoint: https://jmbc-api.bank.utxo/v1/iso20022
 */
export class BankUtxoEndpoint {
  private adapter: JMBCISO20022Adapter;

  constructor(adapter: JMBCISO20022Adapter) {
    this.adapter = adapter;
  }

  /**
   * POST /pacs.008 - Send credit transfer
   */
  async sendCreditTransfer(xml: string): Promise<JMBCSettlementResult> {
    return this.adapter.processPACS008(xml);
  }

  /**
   * POST /pain.001 - Initiate payment
   */
  async initiatePayment(params: {
    fromDomain: string;
    toDomain: string;
    amount: number;
    currency: string;
    remittance?: string;
  }): Promise<{ messageId: string; xml: string }> {
    const xml = await this.adapter.generatePACS008({
      fromDomain: params.fromDomain,
      toDomain: params.toDomain,
      amount: params.amount,
      currency: params.currency,
      remittance: params.remittance
    });

    return {
      messageId: `MSG_${Date.now()}`,
      xml
    };
  }

  /**
   * GET /camt.053/{id} - Get account statement
   */
  async getAccountStatement(accountId: string): Promise<any> {
    return {
      id: accountId,
      balance: '0',
      currency: 'JMS',
      transactions: [],
      timestamp: Date.now()
    };
  }

  /**
   * POST /resolve - Resolve .utxo domain to banking info
   */
  async resolveDomain(domain: string): Promise<DomainResolutionResult | null> {
    const result = await this.adapter.handleEndpoint('POST /resolve', { domain });
    if (result.status === 404) {
      return null;
    }
    return result.data;
  }

  /**
   * POST /jmbc/settle - Execute JMBC atomic settlement
   */
  async executeSettlement(params: {
    fromDomain: string;
    toDomain: string;
    amount: number;
    assetId: string;
    currency?: string;
  }): Promise<any> {
    return this.adapter.handleEndpoint('POST /jmbc/settle', params);
  }

  /**
   * Get endpoint documentation
   */
  getDocumentation(): any {
    return {
      name: 'bank.utxo ISO 20022 API',
      version: '1.0',
      endpoints: [
        {
          path: 'POST /pacs.008',
          description: 'Send credit transfer message',
          request: 'ISO 20022 PACS.008 XML',
          response: 'Settlement result with transaction hash'
        },
        {
          path: 'POST /pain.001',
          description: 'Initiate payment',
          request: 'Payment parameters',
          response: 'Generated ISO 20022 XML'
        },
        {
          path: 'GET /camt.053/{id}',
          description: 'Get account statement',
          response: 'Account statement data'
        },
        {
          path: 'POST /resolve',
          description: 'Resolve .utxo domain to banking information',
          request: '{ "domain": "bank.utxo" }',
          response: 'Banking information'
        },
        {
          path: 'POST /jmbc/settle',
          description: 'Execute JMBC atomic settlement',
          request: '{ "fromDomain": "...", "toDomain": "...", "amount": 1000 }',
          response: 'Settlement transaction hash'
        }
      ]
    };
  }
}
