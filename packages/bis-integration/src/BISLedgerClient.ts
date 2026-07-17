// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import {
  BISParticipant,
  BISAsset,
  BISLedgerState,
  BISParticipantType,
  BISAssetType,
  AtomicSettlementTransaction,
  ComplianceAnchor,
  PRNAttestation
} from './types';
import { UTXOSetManager } from '@utxodns/state';
import { EVMAdapter } from '@utxodns/evm';
import { UTXOExplorer } from '@utxodns/explorer';
import { VLEIValidator } from '@utxodns/compliance';

/**
 * BIS Unified Ledger Client 
 * Manages interactions with the BIS Unified Ledger
 */
export class BISLedgerClient {
  private utxoManager: UTXOSetManager;
  private evmAdapter: EVMAdapter;
  private explorer: UTXOExplorer;
  private vleiValidator: VLEIValidator;
  private participants: Map<string, BISParticipant> = new Map();
  private assets: Map<string, BISAsset> = new Map();
  private transactions: Map<string, AtomicSettlementTransaction> = new Map();

  constructor(
    utxoManager: UTXOSetManager,
    evmAdapter: EVMAdapter,
    explorer: UTXOExplorer
  ) {
    this.utxoManager = utxoManager;
    this.evmAdapter = evmAdapter;
    this.explorer = explorer;
    this.vleiValidator = new VLEIValidator();
  }

  /**
   *Register Participant
   */
  async registerParticipant(
    domain: string,
    name: string,
    type: BISParticipantType,
    jurisdiction: string
  ): Promise<BISParticipant> {
    // Verification vLEI
    const vleiResult = await this.vleiValidator.verifyCredential(
      `did:vlei:${domain.replace('.utxo', '')}`
    );
    if (!vleiResult.valid) {
      throw new Error(`vLEI verification failed for ${domain}`);
    }

    const participant: BISParticipant = {
      id: `bis_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      type,
      jurisdiction,
      utxoDomain: domain,
      vleiDID: `did:vlei:${domain.replace('.utxo', '')}`,
      addresses: {
        jms: this.generateJMSAddress(domain),
        eth: this.generateEVMAddress(domain, 'eth'),
        btc: this.generateBTCAddress(domain)
      },
      publicKey: this.generatePublicKey(domain),
      status: 'active',
      createdAt: Date.now()
    };

    this.participants.set(domain, participant);

    // Sync to UTXO manager
    this.syncParticipantToUTXO(participant);

    return participant;
  }

  /**
   * Registered Assets
   */
  async registerAsset(
    issuer: string,
    type: BISAssetType,
    symbol: string,
    name: string,
    jurisdiction: string
  ): Promise<BISAsset> {
    const asset: BISAsset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      issuer,
      symbol,
      name,
      totalSupply: BigInt(0),
      decimals: 18,
      jurisdiction,
      complianceStatus: 'pending'
    };

    this.assets.set(asset.id, asset);
    return asset;
  }

  /**
   * Perform atomic settlement
   */
  async executeAtomicSettlement(params: {
    from: string;
    to: string;
    amount: bigint;
    assetId: string;
    settlementCurrency: AtomicSettlementTransaction['settlementCurrency'];
    settlementChain: AtomicSettlementTransaction['settlementChain'];
  }): Promise<AtomicSettlementTransaction> {
    //Verify participants
    const fromParticipant = this.participants.get(params.from);
    const toParticipant = this.participants.get(params.to);
    if (!fromParticipant || !toParticipant) {
      throw new Error('Invalid participants');
    }

    // Verify Assets
    const asset = this.assets.get(params.assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    // Settle payment
    const txHash = await this.executeSettlement(
      fromParticipant,
      toParticipant,
      params.amount,
      asset,
      params.settlementChain
    );

    const transaction: AtomicSettlementTransaction = {
      id: `settle_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      from: params.from,
      to: params.to,
      amount: params.amount,
      assetId: params.assetId,
      settlementCurrency: params.settlementCurrency,
      settlementChain: params.settlementChain,
      status: 'settled',
      txHash,
      blockHeight: this.explorer.getLatestBlock()?.height || 0,
      confirmations: 1,
      timestamp: Date.now()
    };

    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  /**
   * Retrieve participants
   */
  getParticipant(domain: string): BISParticipant | null {
    return this.participants.get(domain) || null;
  }

  /**
   * Retrieve all participants
   */
  getAllParticipants(): BISParticipant[] {
    return Array.from(this.participants.values());
  }

  /**
   * Retrieve assets
   */
  getAsset(assetId: string): BISAsset | null {
    return this.assets.get(assetId) || null;
  }

  /**
   * Get transaction
   */
  getTransaction(txId: string): AtomicSettlementTransaction | null {
    return this.transactions.get(txId) || null;
  }

  /**
   * Retrieve ledger status
   */
  getLedgerState(): BISLedgerState {
    const totalVolume = Array.from(this.transactions.values())
      .reduce((sum, tx) => sum + tx.amount, BigInt(0));

    return {
      participants: Array.from(this.participants.values()),
      assets: Array.from(this.assets.values()),
      transactions: Array.from(this.transactions.values()),
      totalSettlementVolume: totalVolume,
      activeParticipants: this.participants.size,
      avgSettlementTime: 1.5
    };
  }

  private generateJMSAddress(domain: string): string {
    return `jms_${domain.replace('.utxo', '')}`;
  }

  private generateEVMAddress(domain: string, chain: string): string {
    return `0x${Buffer.from(domain + chain).toString('hex').slice(0, 40)}`;
  }

  private generateBTCAddress(domain: string): string {
    return `bc1${Buffer.from(domain).toString('hex').slice(0, 30)}`;
  }

  private generatePublicKey(domain: string): string {
    return `0x${Buffer.from(domain + 'pubkey').toString('hex').slice(0, 64)}`;
  }

  private async syncParticipantToUTXO(participant: BISParticipant): Promise<void> {
    // Create the participant's UTXO representation in the UTXO manager.
    const utxo = {
      txid: `bis_${participant.id}`,
      vout: 0,
      amount: BigInt(0),
      scriptPubKey: `OP_RETURN BIS_PARTICIPANT ${participant.utxoDomain}`,
      height: 0,
      confirmations: 0,
      spent: false,
      address: participant.addresses.jms
    };
    this.utxoManager.addUTXO(utxo);
  }

  private async executeSettlement(
    from: BISParticipant,
    to: BISParticipant,
    amount: bigint,
    asset: BISAsset,
    chain: AtomicSettlementTransaction['settlementChain']
  ): Promise<string> {
    // Execute different settlement logic based on the settlement chain.
    if (chain === 'utxo') {
      return this.settleOnUTXO(from, to, amount, asset);
    } else if (chain === 'evm') {
      return this.settleOnEVM(from, to, amount, asset);
    } else {
      return this.settleOnJMBC(from, to, amount, asset);
    }
  }

  private async settleOnUTXO(
    from: BISParticipant,
    to: BISParticipant,
    amount: bigint,
    asset: BISAsset
  ): Promise<string> {
    const fromAddress = from.addresses.jms;
    const toAddress = to.addresses.jms;
    if (!fromAddress || !toAddress) {
      throw new Error('JMS addresses not configured');
    }

    // Select UTXO
    const { utxos, total, change } = this.utxoManager.selectUTXOs(fromAddress, amount);

    // Execute a trade
    const txid = `bis_settle_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.utxoManager.spendUTXOs(
      utxos.map(u => ({ txid: u.txid, vout: u.vout, sequence: 0 })),
      txid
    );

    // Create output
    const outputUtxo = {
      txid,
      vout: 0,
      amount,
      scriptPubKey: `OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG BIS_ASSET ${asset.id}`,
      height: this.explorer.getLatestBlock()?.height || 0,
      confirmations: 0,
      spent: false,
      address: toAddress
    };
    this.utxoManager.addUTXO(outputUtxo);

    if (change > 0) {
      const changeUtxo = {
        txid,
        vout: 1,
        amount: change,
        scriptPubKey: 'OP_DUP OP_HASH160 OP_EQUALVERIFY OP_CHECKSIG',
        height: this.explorer.getLatestBlock()?.height || 0,
        confirmations: 0,
        spent: false,
        address: fromAddress
      };
      this.utxoManager.addUTXO(changeUtxo);
    }

    return txid;
  }

  private async settleOnEVM(
    from: BISParticipant,
    to: BISParticipant,
    amount: bigint,
    asset: BISAsset
  ): Promise<string> {
    const fromAddress = from.addresses.eth;
    const toAddress = to.addresses.eth;
    if (!fromAddress || !toAddress) {
      throw new Error('EVM addresses not configured');
    }

    // Execute via the EVM adapter.
    const txid = await this.evmAdapter.executeTransaction(
      fromAddress,
      toAddress,
      `0x${asset.id}`,
      amount
    );

    return txid;
  }

  private async settleOnJMBC(
    from: BISParticipant,
    to: BISParticipant,
    amount: bigint,
    asset: BISAsset
  ): Promise<string> {
    // JMBC Chain Settlement (Simulation)
    return `jmbs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
