import { TEEDomainAssertion, DomainUTXO, AddressBook } from '@utxodns/core';

/**
 *TEE Verifier Interface – Plug-and-Play Design
 */
export interface ITEEVerifier {
  generateAssertion(
    domain: string,
    utxo: DomainUTXO,
    addressBook: AddressBook['addresses']
  ): Promise<TEEDomainAssertion>;

  verifyAssertion(assertion: TEEDomainAssertion): Promise<boolean>;

  verifyAttestation(attestation: Uint8Array): Promise<{
    valid: boolean;
    mrEnclave?: string;
    mrSigner?: string;
    productId?: string;
    securityVersion?: number;
  }>;
}
