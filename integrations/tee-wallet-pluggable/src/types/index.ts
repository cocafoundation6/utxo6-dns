export interface AddressBook {
  domain: string;
  ownerPubkeyHash: Uint8Array;
  addresses: {
    btc?: string;
    eth?: string;
    sol?: string;
    jms?: string;
    usdc?: string;
    usdt?: string;
    hkdStable?: string;
    bankSwift?: string;
  };
  ipv6Fingerprint?: string;
  vleiDid?: string;
  blockHeight: number;
  proof?: {
    merkleRoot: string;
    inclusionProof: string[];
  };
}

export interface TEEDomainAssertion {
  domain: string;
  utxoTxid: Uint8Array;
  utxoVout: number;
  assertionTime: number;
  nonce: number;
  addressBook: AddressBook['addresses'];
  userSignature: Uint8Array;
  ipv6Fingerprint?: string;
  teeAttestation: Uint8Array;
  assertionSignature: Uint8Array;
}

export interface PaymentRequest {
  fromDomain?: string;
  toDomain: string;
  amount: string;
  currency: 'BTC' | 'ETH' | 'USDC' | 'JMS' | 'HKD_STABLE';
  chain?: 'bitcoin' | 'ethereum' | 'solana' | 'jmbc';
  memo?: string;
  requireTEEProof?: boolean;
}

export interface PaymentResponse {
  txHash: string;
  chain: string;
  blockHeight?: number;
}

export interface IPv6Colors {
  tl: { r: number; g: number; b: number };
  tr: { r: number; g: number; b: number };
  bl: { r: number; g: number; b: number };
  br: { r: number; g: number; b: number };
}

export interface WalletConfig {
  dnsResolver: IDNSResolver;
  teeVerifier: ITEEVerifier;
  txBuilder: IMultiChainTxBuilder;
  visualizer?: IVisualUtils;
  compliance?: ICompliance;
  storage?: IStorage;
}

export interface IDNSResolver {
  resolve(domain: string): Promise<AddressBook>;
}

export interface ITEEVerifier {
  generateAssertion(domain: string, utxo: any, addressBook: AddressBook['addresses']): Promise<TEEDomainAssertion>;
  verifyAssertion(assertion: TEEDomainAssertion): Promise<boolean>;
}

export interface IMultiChainTxBuilder {
  buildTx(addressBook: AddressBook, request: PaymentRequest): Promise<any>;
  signAndBroadcast(tx: any): Promise<PaymentResponse>;
}

export interface IVisualUtils {
  computeIPv6ColorFingerprint(ipv6Addr: string): string;
  getIPv6Colors(ipv6Addr: string): IPv6Colors;
  renderColorBlocks(colors: IPv6Colors): string;
}

export interface ICompliance {
  verifyCredential(vleiCredential: string): Promise<{ valid: boolean; lei?: string }>;
  bindVLEI(utxoRef: any, vleiCredential: string, teeAssertion: TEEDomainAssertion): Promise<string>;
}

export interface IStorage {
  saveAssertion(domain: string, assertion: TEEDomainAssertion): Promise<void>;
  getAssertion(domain: string): Promise<TEEDomainAssertion | null>;
  saveAddressBook(domain: string, book: AddressBook): Promise<void>;
  getAddressBook(domain: string): Promise<AddressBook | null>;
}
