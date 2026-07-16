import { WalletConfig, AddressBook, PaymentRequest, PaymentResponse } from '../types';
import { IDNSResolver } from '../interfaces/IDNSResolver';
import { ITEEVerifier } from '../interfaces/ITEEVerifier';
import { IMultiChainTxBuilder } from '../interfaces/IMultiChainTxBuilder';
import { IVisualUtils } from '../interfaces/IVisualUtils';
import { ICompliance } from '../interfaces/ICompliance';
import { IStorage } from '../interfaces/IStorage';

export class WalletManager {
  private dnsResolver: IDNSResolver;
  private teeVerifier: ITEEVerifier;
  private txBuilder: IMultiChainTxBuilder;
  private visualizer?: IVisualUtils;
  private compliance?: ICompliance;
  private storage?: IStorage;
  private initialized = false;

  constructor(config: WalletConfig) {
    this.dnsResolver = config.dnsResolver;
    this.teeVerifier = config.teeVerifier;
    this.txBuilder = config.txBuilder;
    this.visualizer = config.visualizer;
    this.compliance = config.compliance;
    this.storage = config.storage;
  }

  async initialize(): Promise<void> {
    // Perform any async setup (e.g., TEE attestation)
    this.initialized = true;
  }

  async resolve(domain: string): Promise<AddressBook> {
    if (!this.initialized) throw new Error('Wallet not initialized');
    // Check cache
    if (this.storage) {
      const cached = await this.storage.getAddressBook(domain);
      if (cached) return cached;
    }
    const book = await this.dnsResolver.resolve(domain);
    if (this.storage) {
      await this.storage.saveAddressBook(domain, book);
    }
    return book;
  }

  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    const book = await this.resolve(request.toDomain);
    // If TEE proof required, generate and verify
    if (request.requireTEEProof) {
      const utxo = { txid: 'mock', vout: 0 }; // real UTXO fetch omitted
      const assertion = await this.teeVerifier.generateAssertion(
        request.toDomain,
        utxo,
        book.addresses
      );
      const valid = await this.teeVerifier.verifyAssertion(assertion);
      if (!valid) throw new Error('TEE assertion invalid');
      if (this.storage) {
        await this.storage.saveAssertion(request.toDomain, assertion);
      }
    }
    // Build and broadcast tx
    const tx = await this.txBuilder.buildTx(book, request);
    const result = await this.txBuilder.signAndBroadcast(tx);
    return result;
  }

  // Additional methods for visual, compliance, etc.
  getVisualizer(): IVisualUtils | undefined { return this.visualizer; }
  getCompliance(): ICompliance | undefined { return this.compliance; }
}
