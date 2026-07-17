/**
 * Multi-Chain Address Book - DNS Resolution Results
 */
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
  ttl?: number;
}

/**
 * UTXO Quote
 */
export interface UTXORef {
  txid: string;
  vout: number;
  amount: bigint;
  scriptPubKey: string;
}

/**
 * Domain UTXO (includes proof of ownership)
 */
export interface DomainUTXO extends UTXORef {
  domain: string;
  ownerSignature: Uint8Array;
}

/**
 * TEE domain assertion — generated within the TEE
 */
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

/**
 * Payment request
 */
export interface PaymentRequest {
  fromDomain?: string;
  toDomain: string;
  amount: string;
  currency: 'BTC' | 'ETH' | 'USDC' | 'JMS' | 'HKD_STABLE';
  chain?: 'bitcoin' | 'ethereum' | 'solana' | 'jmbc';
  memo?: string;
  requireTEEProof?: boolean;
}

/**
 * Payment response
 */
export interface PaymentResponse {
  txHash: string;
  chain: string;
  blockHeight?: number;
  confirmations?: number;
}

/**
 * Unsigned transaction
 */
export interface UnsignedTransaction {
  chain: string;
  from: string;
  to: string;
  amount: bigint;
  fee?: bigint;
  raw: unknown;
  memo?: string;
}

/**
 * vLEI Verification Result
 */
export interface VLEIVerificationResult {
  valid: boolean;
  lei?: string;
  legalName?: string;
  country?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'LAPSED';
}

/**
 * IPv6Color Fingerprint
 */
export interface IPv6Colors {
  tl: { r: number; g: number; b: number };
  tr: { r: number; g: number; b: number };
  bl: { r: number; g: number; b: number };
  br: { r: number; g: number; b: number };
}
