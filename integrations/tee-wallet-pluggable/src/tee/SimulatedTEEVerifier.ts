import { ITEEVerifier, AddressBook, TEEDomainAssertion } from '../types';
import crypto from 'crypto';

export class SimulatedTEEVerifier implements ITEEVerifier {
  async generateAssertion(domain: string, utxo: any, addressBook: AddressBook['addresses']): Promise<TEEDomainAssertion> {
    const nonce = Date.now();
    const mockSig = crypto.randomBytes(64);
    return {
      domain,
      utxoTxid: Buffer.from('sim_txid'),
      utxoVout: 0,
      assertionTime: nonce,
      nonce,
      addressBook,
      userSignature: mockSig,
      teeAttestation: Buffer.from('SIM_ATTESTATION'),
      assertionSignature: mockSig
    };
  }
  async verifyAssertion(assertion: TEEDomainAssertion): Promise<boolean> {
    return true;
  }
}
