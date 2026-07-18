// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

/**
 * ISO 20022 Message Types
 */
export enum ISO20022MessageType {
  PACS_008 = 'pacs.008.001.08',
  PAIN_001 = 'pain.001.001.09',
  CAMT_053 = 'camt.053.001.08',
  CAMT_054 = 'camt.054.001.08'
}

/**
 * ISO 20022 Character Set Constants
 */
export const ISO20022_CHARSET = 'UTF-8';

export const ISO20022_LATIN_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/ -?:().,\'+';

/**
 * JMBC Extension Fields
 */
export interface JmbcExtension {
  jmbcTxId: string;
  utxoDomain: string;
  jmbcChain: string;
  settlementAsset: 'JMS' | 'USDC' | 'USDT' | 'HKDA' | 'CBDC';
  prnAttestation?: string;
  vleiDID?: string;
  settlementTime: number;
  confirmations: number;
}

/**
 * ISO 20022 Message Container
 */
export interface ISO20022Message<T = any> {
  id: string;
  type: ISO20022MessageType;
  version: string;
  xml: string;
  parsed: T;
  jmbcExtension?: JmbcExtension;
  timestamp: number;
  signature?: string;
}

/**
 * PACS.008 Credit Transfer Message
 */
export interface PACS008Message {
  groupHeader: {
    messageId: string;
    creationDateTime: string;
    numberOfTransactions: number;
    settlementInformation: {
      settlementMethod: 'CLRG' | 'COVE' | 'INDA';
      clearingSystem?: string;
    };
  };
  paymentInformation: Array<{
    paymentInformationId: string;
    paymentMethod: 'TRF';
    numberOfTransactions: number;
    totalAmount: number;
    currency: string;
    debtor: {
      name: string;
      postalAddress?: string;
      identification?: {
        lei?: string;
        vleiDID?: string;
      };
    };
    debtorAccount: {
      iban?: string;
      utxoDomain?: string;
    };
    creditor: {
      name: string;
      postalAddress?: string;
      identification?: {
        lei?: string;
        vleiDID?: string;
      };
    };
    creditorAccount: {
      iban?: string;
      utxoDomain?: string;
    };
    instructedAmount: {
      amount: number;
      currency: string;
    };
    remittanceInformation?: {
      unstructured?: string;
      structured?: any;
    };
    jmbcSettlement?: {
      assetType: string;
      chainId: string;
      requirePrn: boolean;
    };
  }>;
}

/**
 * PAIN.001 Payment Initiation Message
 */
export interface PAIN001Message {
  groupHeader: {
    messageId: string;
    creationDateTime: string;
    numberOfTransactions: number;
  };
  paymentInformation: Array<{
    paymentInformationId: string;
    paymentMethod: 'TRF';
    numberOfTransactions: number;
    controlSum: number;
    debtor: {
      name: string;
      identification?: {
        lei?: string;
      };
    };
    debtorAccount: {
      iban?: string;
    };
    creditor: {
      name: string;
      identification?: {
        lei?: string;
      };
    };
    creditorAccount: {
      iban?: string;
    };
    instructedAmount: {
      amount: number;
      currency: string;
    };
    remittanceInformation?: {
      unstructured?: string;
    };
  }>;
}

/**
 * Settlement Result
 */
export interface JMBCSettlementResult {
  messageId: string;
  settlementTxId: string;
  status: 'settled' | 'failed' | 'pending';
  timestamp: number;
  confirmations: number;
  prnAttestation?: string;
}

/**
 * Domain Resolution Result
 */
export interface DomainResolutionResult {
  domain: string;
  jmsAddress: string;
  vleiDID: string;
  jurisdiction: string;
  status: 'active' | 'suspended' | 'pending';
  bankInfo?: {
    name: string;
    swift?: string;
    lei?: string;
  };
}
