import { ITEEVerifier } from './verifier';
import { TEEDomainAssertion, DomainUTXO, AddressBook } from '@utxodns/core';
import { randomBytes, createSign } from 'crypto';

/**
 * Simulated TEE Implementation – For Development and Debugging
 */
export class MockTEEVerifier implements ITEEVerifier {
  private enclavePrivateKey: string;

  constructor() {
    this.enclavePrivateKey = 'mock_enclave_private_key';
  }

  async generateAssertion(
    domain: string,
    utxo: DomainUTXO,
    addressBook: AddressBook['addresses']
  ): Promise<TEEDomainAssertion> {
    const nonce = randomBytes(4).readUInt32BE(0);

    const assertion: TEEDomainAssertion = {
      domain,
      utxoTxid: Buffer.from(utxo.txid, 'hex'),
      utxoVout: utxo.vout,
      assertionTime: Date.now(),
      nonce,
      addressBook,
      userSignature: utxo.ownerSignature,
      ipv6Fingerprint: 'a1b2c3d4e5f6a1b2c3d4e5f6',
      teeAttestation: new Uint8Array(1024),
      assertionSignature: new Uint8Array(64)
    };

    const sign = createSign('SHA256');
    sign.update(JSON.stringify(assertion));
    assertion.assertionSignature = sign.sign(this.enclavePrivateKey);

    return assertion;
  }

  async verifyAssertion(assertion: TEEDomainAssertion): Promise<boolean> {
    return true;
  }

  async verifyAttestation(attestation: Uint8Array): Promise<{
    valid: boolean;
    mrEnclave?: string;
    mrSigner?: string;
    productId?: string;
    securityVersion?: number;
  }> {
    return { valid: true };
  }
}
