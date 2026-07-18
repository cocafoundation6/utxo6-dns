// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  ISO20022Message,
  ISO20022MessageType,
  PACS008Message,
  JmbcExtension,
  JMBCSettlementResult,
  DomainResolutionResult
} from '../types';
import { ISO20022Charset } from '../charset/ISO20022Charset';
import { ISO20022XMLParser } from '../parser/ISO20022XMLParser';
import { BISLedgerClient } from '@utxodns/bis-integration';
import { UTXOSetManager } from '@utxodns/state';
import { VLEIValidator } from '@utxodns/compliance';

/**
 * JMBC-ISO20022 Adapter
 * Bridges ISO 20022 banking messages with JMBC blockchain settlement
 */
export class JMBCISO20022Adapter {
  private parser: ISO20022XMLParser;
  private ledgerClient: BISLedgerClient;
  private utxoManager: UTXOSetManager;
  private vleiValidator: VLEIValidator;

  constructor(
    ledgerClient: BISLedgerClient,
    utxoManager: UTXOSetManager
  ) {
    this.parser = new ISO20022XMLParser();
    this.ledgerClient = ledgerClient;
    this.utxoManager = utxoManager;
    this.vleiValidator = new VLEIValidator();
  }

  /**
   * Process PACS.008 message → Execute JMBC settlement
   */
  async processPACS008(xml: string): Promise<JMBCSettlementResult> {
    // 1. Parse message
    const message = this.parser.parsePACS008(xml);
    console.log(`[JMBC-ISO20022] Parsed PACS.008: ${message.id}`);

    // 2. Extract settlement information
    const settlement = this.parser.extractJMBCSettlement(message);
    if (!settlement) {
      throw new Error('No JMBC settlement information found in message');
    }

    // 3. Verify vLEI (legal entity identity)
    const fromVLEI = await this.vleiValidator.verifyCredential(
      `did:vlei:${settlement.fromDomain.replace('.utxo', '')}`
    );
    const toVLEI = await this.vleiValidator.verifyCredential(
      `did:vlei:${settlement.toDomain.replace('.utxo', '')}`
    );

    if (!fromVLEI.valid || !toVLEI.valid) {
      throw new Error('vLEI verification failed for one or both participants');
    }

    // 4. Validate character set (Remittance Information)
    const remittance = message.parsed.paymentInformation?.[0]?.remittanceInformation;
    if (remittance?.unstructured) {
      const charsetResult = ISO20022Charset.validateCharset(remittance.unstructured);
      if (!charsetResult.valid) {
        console.warn(
          `[JMBC-ISO20022] Remittance contains special chars: ${charsetResult.invalidChars.join(', ')}`
        );
      }
    }

    // 5. Execute JMBC atomic settlement
    const asset = await this.ledgerClient.getAsset(settlement.asset);
    if (!asset) {
      throw new Error(`Asset ${settlement.asset} not found`);
    }

    const settlementTx = await this.ledgerClient.executeAtomicSettlement({
      from: settlement.fromDomain,
      to: settlement.toDomain,
      amount: BigInt(Math.round(settlement.amount * 1000000)),
      assetId: asset.id,
      settlementCurrency: settlement.asset as any,
      settlementChain: 'utxo'
    });

    console.log(`[JMBC-ISO20022] Settlement executed: ${settlementTx.txHash}`);

    return {
      messageId: message.id,
      settlementTxId: settlementTx.txHash,
      status: 'settled',
      timestamp: Date.now(),
      confirmations: 1,
      prnAttestation: 'pending'
    };
  }

  /**
   * Generate PACS.008 message from JMBC settlement
   */
  async generatePACS008(params: {
    fromDomain: string;
    toDomain: string;
    amount: number;
    currency: string;
    remittance?: string;
    jmbcExtension?: Partial<JmbcExtension>;
  }): Promise<string> {
    // 1. Validate domains
    const from = this.ledgerClient.getParticipant(params.fromDomain);
    const to = this.ledgerClient.getParticipant(params.toDomain);
    if (!from || !to) {
      throw new Error('Invalid participant domain');
    }

    // 2. Validate character set
    if (params.remittance) {
      const result = ISO20022Charset.validateCharset(params.remittance);
      if (!result.valid) {
        throw new Error(
          `Remittance contains invalid characters: ${result.invalidChars.join(', ')}`
        );
      }
    }

    // 3. Build message
    const message: ISO20022Message<PACS008Message> = {
      id: `pacs_${Date.now()}`,
      type: ISO20022MessageType.PACS_008,
      version: '1.0',
      xml: '',
      parsed: {
        groupHeader: {
          messageId: `MSG_${Date.now()}`,
          creationDateTime: new Date().toISOString(),
          numberOfTransactions: 1,
          settlementInformation: {
            settlementMethod: 'CLRG',
            clearingSystem: 'JMBC'
          }
        },
        paymentInformation: [{
          paymentInformationId: `PMT_${Date.now()}`,
          paymentMethod: 'TRF',
          numberOfTransactions: 1,
          totalAmount: params.amount,
          currency: params.currency,
          debtor: {
            name: from.name,
            identification: {
              lei: from.vleiDID
            }
          },
          debtorAccount: {
            utxoDomain: params.fromDomain
          },
          creditor: {
            name: to.name,
            identification: {
              lei: to.vleiDID
            }
          },
          creditorAccount: {
            utxoDomain: params.toDomain
          },
          instructedAmount: {
            amount: params.amount,
            currency: params.currency
          },
          remittanceInformation: {
            unstructured: params.remittance
          },
          jmbcSettlement: {
            assetType: params.jmbcExtension?.settlementAsset || 'JMS',
            chainId: params.jmbcExtension?.jmbcChain || 'jmbc-mainnet',
            requirePrn: true
          }
        }]
      },
      jmbcExtension: {
        jmbcTxId: '',
        utxoDomain: params.fromDomain,
        jmbcChain: params.jmbcExtension?.jmbcChain || 'jmbc-mainnet',
        settlementAsset: (params.jmbcExtension?.settlementAsset || 'JMS') as any,
        prnAttestation: params.jmbcExtension?.prnAttestation,
        vleiDID: from.vleiDID,
        settlementTime: Date.now(),
        confirmations: 0
      },
      timestamp: Date.now()
    };

    // 4. Generate XML
    const xml = this.parser.build(message);
    message.xml = xml;

    return xml;
  }

  /**
   * Handle bank.utxo endpoint API requests
   * Corresponds to: https://jmbc-api.bank.utxo/v1/iso20022
   */
  async handleEndpoint(
    method: string,
    body: any
  ): Promise<{ status: number; data: any }> {
    switch (method) {
      case 'POST /pacs.008':
        const result = await this.processPACS008(body.xml);
        return {
          status: 200,
          data: result
        };

      case 'GET /camt.053/{id}':
        return {
          status: 200,
          data: {
            statement: {
              id: body.id,
              balance: '1000000',
              currency: 'JMS',
              transactions: []
            }
          }
        };

      case 'POST /jmbc/settle':
        const settlement = await this.ledgerClient.executeAtomicSettlement({
          from: body.fromDomain,
          to: body.toDomain,
          amount: BigInt(body.amount),
          assetId: body.assetId,
          settlementCurrency: body.currency || 'JMS',
          settlementChain: 'utxo'
        });
        return {
          status: 200,
          data: {
            txHash: settlement.txHash,
            status: settlement.status,
            blockHeight: settlement.blockHeight
          }
        };

      case 'POST /resolve':
        const participant = this.ledgerClient.getParticipant(body.domain);
        if (!participant) {
          return {
            status: 404,
            data: { error: `Domain ${body.domain} not found` }
          };
        }
        return {
          status: 200,
          data: {
            domain: participant.utxoDomain,
            jmsAddress: participant.addresses.jms,
            vleiDID: participant.vleiDID,
            jurisdiction: participant.jurisdiction,
            status: participant.status
          }
        };

      default:
        return {
          status: 404,
          data: { error: `Unknown endpoint: ${method}` }
        };
    }
  }
}
