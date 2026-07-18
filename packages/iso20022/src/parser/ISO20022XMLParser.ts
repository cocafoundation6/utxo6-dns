// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  ISO20022Message,
  ISO20022MessageType,
  PACS008Message,
  PAIN001Message,
  JmbcExtension
} from '../types';
import { ISO20022Charset } from '../charset/ISO20022Charset';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

/**
 * ISO 20022 XML Message Parser
 * Supports PACS.008, PAIN.001, CAMT.053 standard messages
 */
export class ISO20022XMLParser {
  private parser: XMLParser;
  private builder: XMLBuilder;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseTagValue: true,
      trimValues: true
    });
    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      format: true,
      indentBy: '  '
    });
  }

  /**
   * Parse ISO 20022 XML message
   */
  parse<T>(xml: string, type: ISO20022MessageType): ISO20022Message<T> {
    // 1. Validate character set
    const charsetResult = ISO20022Charset.validateCharset(xml);
    if (!charsetResult.valid) {
      throw new Error(
        `Invalid characters in ISO 20022 message: ${charsetResult.invalidChars.join(', ')}`
      );
    }

    // 2. Parse XML
    const parsed = this.parser.parse(xml) as T;

    // 3. Extract message ID
    const messageId = this.extractMessageId(parsed, type);

    // 4. Extract JMBC extension
    const jmbcExtension = this.extractJmbcExtension(parsed);

    return {
      id: messageId,
      type,
      version: this.extractVersion(parsed, type),
      xml,
      parsed,
      jmbcExtension,
      timestamp: Date.now()
    };
  }

  /**
   * Build ISO 20022 XML message
   */
  build<T>(message: ISO20022Message<T>): string {
    // 1. Validate JMBC extension
    if (message.jmbcExtension) {
      const result = ISO20022Charset.validateJmbcExtension(message.jmbcExtension);
      if (!result.valid) {
        throw new Error(`Invalid JMBC extension: ${result.errors.join(', ')}`);
      }
    }

    // 2. Build XML
    const xml = this.builder.build(message.parsed);

    // 3. Validate generated XML
    const charsetResult = ISO20022Charset.validateCharset(xml);
    if (!charsetResult.valid) {
      throw new Error(
        `Generated XML contains invalid characters: ${charsetResult.invalidChars.join(', ')}`
      );
    }

    return xml;
  }

  /**
   * Parse PACS.008 message
   */
  parsePACS008(xml: string): ISO20022Message<PACS008Message> {
    return this.parse<PACS008Message>(xml, ISO20022MessageType.PACS_008);
  }

  /**
   * Parse PAIN.001 message
   */
  parsePAIN001(xml: string): ISO20022Message<PAIN001Message> {
    return this.parse<PAIN001Message>(xml, ISO20022MessageType.PAIN_001);
  }

  /**
   * Extract JMBC settlement information from PACS.008
   */
  extractJMBCSettlement(message: ISO20022Message<PACS008Message>): {
    fromDomain: string;
    toDomain: string;
    amount: number;
    asset: string;
    utxoRefs: string[];
  } | null {
    const pacs = message.parsed;
    if (!pacs.paymentInformation || pacs.paymentInformation.length === 0) {
      return null;
    }

    const payment = pacs.paymentInformation[0];
    const debtorDomain = payment.debtorAccount?.utxoDomain;
    const creditorDomain = payment.creditorAccount?.utxoDomain;

    if (!debtorDomain || !creditorDomain) {
      return null;
    }

    return {
      fromDomain: debtorDomain,
      toDomain: creditorDomain,
      amount: payment.instructedAmount.amount,
      asset: payment.jmbcSettlement?.assetType || 'JMS',
      utxoRefs: []
    };
  }

  private extractMessageId(parsed: any, type: ISO20022MessageType): string {
    const path = this.getMessagePath(type);
    const parts = path.split('.');
    let current = parsed;
    for (const part of parts) {
      if (current && current[part]) {
        current = current[part];
      } else {
        return `msg_${Date.now()}`;
      }
    }
    return current?.GrpHdr?.MsgId || `msg_${Date.now()}`;
  }

  private extractVersion(parsed: any, type: ISO20022MessageType): string {
    return '1.0';
  }

  private getMessagePath(type: ISO20022MessageType): string {
    const paths: Record<ISO20022MessageType, string> = {
      [ISO20022MessageType.PACS_008]: 'Document.FIToFICstmrCdtTrf',
      [ISO20022MessageType.PAIN_001]: 'Document.CstmrCdtTrfInitn',
      [ISO20022MessageType.CAMT_053]: 'Document.BkToCstmrStmt',
      [ISO20022MessageType.CAMT_054]: 'Document.BkToCstmrDbtCdtNtfctn'
    };
    return paths[type] || 'Document';
  }

  private extractJmbcExtension(parsed: any): JmbcExtension | undefined {
    return undefined;
  }
}
