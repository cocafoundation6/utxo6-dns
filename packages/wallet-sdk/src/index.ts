feat: add UTXO model implementation on EVM (30 files)
feat: add core types for UTXO on EVM implementation
import {
  IDNSResolver,
  UTXODNSResolver,
  ENSSubdomainResolver
} from '@utxodns/dns-resolver';
import {
  ITEEVerifier,
  SGXTEEVerifier,
  MockTEEVerifier
} from '@utxodns/tee-verifier';
import {
  IMultiChainTxBuilder,
  BitcoinTxBuilder
} from '@utxodns/multichain-tx';
import {
  IVLEIValidator,
  GLEIFValidator
} from '@utxodns/compliance';
import {
  IStorage,
  MemoryStorage
} from '@utxodns/storage';
import {
  computeIPv6ColorFingerprint,
  getIPv6Colors,
  renderColorBlocks,
  drawColorBlocks
} from '@utxodns/visual-utils';
import {
  AddressBook,
  PaymentRequest,
  PaymentResponse,
  TEEDomainAssertion,
  VLEIVerificationResult
} from '@utxodns/core';

export interface WalletSDKConfig {
  dns: {
    mode: 'utxo-dns' | 'ens' | 'hybrid';
    gatewayUrl?: string;
    ensResolverAddress?: string;
    ensRpcUrl?: string;
  };
  tee: {
    mode: 'sgx' | 'mock';
    enclavePath?: string;
  };
  chains: {
    bitcoin?: { rpcUrl: string; network?: string };
    ethereum?: { rpcUrl: string; chainId: number };
    solana?: { rpcUrl: string; cluster?: string };
  };
  compliance?: {
    gleifApiUrl?: string;
  };
  storage?: {
    type: 'memory' | 'persistent';
  };
}

/**
 * UTXODNS Wallet SDK - Unified Entry Point
 */
export class UTXODNSWallet {
  private dnsResolver: IDNSResolver;
  private teeVerifier: ITEEVerifier;
  private txBuilder: IMultiChainTxBuilder;
  private vleiValidator?: IVLEIValidator;
  private storage: IStorage;

  constructor(private config: WalletSDKConfig) {
    this.dnsResolver = this.initDNSResolver(config.dns);
    this.teeVerifier = this.initTEEVerifier(config.tee);
    this.txBuilder = new BitcoinTxBuilder(
      config.chains.bitcoin?.rpcUrl || 'http://localhost:8332'
    );
    if (config.compliance) {
      this.vleiValidator = new GLEIFValidator(config.compliance.gleifApiUrl);
    }
    this.storage = new MemoryStorage();
  }

  async resolveDomain(domain: string): Promise<AddressBook> {
    return this.dnsResolver.resolve(domain);
  }

  async generateAssertion(
    domain: string,
    utxo: any,
    addressBook: AddressBook['addresses']
  ): Promise<TEEDomainAssertion> {
    return this.teeVerifier.generateAssertion(domain, utxo, addressBook);
  }

  async verifyAssertion(assertion: TEEDomainAssertion): Promise<boolean> {
    return this.teeVerifier.verifyAssertion(assertion);
  }

  async pay(request: PaymentRequest): Promise<PaymentResponse> {
    const addrBook = await this.dnsResolver.resolve(request.toDomain);
    const tx = await this.txBuilder.buildTx(addrBook, request);
    return this.txBuilder.signAndBroadcast(tx);
  }

  async verifyVLEI(credential: string): Promise<VLEIVerificationResult> {
    if (!this.vleiValidator) {
      throw new Error('Compliance module not configured');
    }
    return this.vleiValidator.verifyCredential(credential);
  }

  getIPv6Fingerprint(ipv6Addr: string): string {
    return computeIPv6ColorFingerprint(ipv6Addr);
  }

  getIPv6Colors(fingerprint: string): ReturnType<typeof getIPv6Colors> {
    return getIPv6Colors(fingerprint);
  }

  renderColorBlocks(colors: ReturnType<typeof getIPv6Colors>): string {
    return renderColorBlocks(colors);
  }

  private initDNSResolver(dnsConfig: WalletSDKConfig['dns']): IDNSResolver {
    switch (dnsConfig.mode) {
      case 'utxo-dns':
        return new UTXODNSResolver(dnsConfig.gatewayUrl);
      case 'ens':
        return new ENSSubdomainResolver(
          dnsConfig.ensResolverAddress || '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
          dnsConfig.gatewayUrl || 'https://gateway.ens.utxo/',
          null as any
        );
      case 'hybrid':
      default:
        return new UTXODNSResolver(dnsConfig.gatewayUrl);
    }
  }

  private initTEEVerifier(teeConfig: WalletSDKConfig['tee']): ITEEVerifier {
    switch (teeConfig.mode) {
      case 'sgx':
        return new SGXTEEVerifier(teeConfig.enclavePath || '/path/to/enclave');
      case 'mock':
      default:
        return new MockTEEVerifier();
    }
  }
}

export * from '@utxodns/core';
export * from '@utxodns/dns-resolver';
export * from '@utxodns/tee-verifier';
export * from '@utxodns/multichain-tx';
export * from '@utxodns/compliance';
export * from '@utxodns/visual-utils';
export * from '@utxodns/storage';
