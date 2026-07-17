import { VLEIVerificationResult, UTXORef, TEEDomainAssertion } from '@utxodns/core';

export interface IVLEIValidator {
  verifyCredential(vleiCredential: string): Promise<VLEIVerificationResult>;
  bindVLEI(
    utxoRef: UTXORef,
    vleiCredential: string,
    teeAssertion: TEEDomainAssertion
  ): Promise<string>;
}
