feat: add UTXO model implementation on EVM (30 files)
feat: add core types for UTXO on EVM implementation

import { VLEIVerificationResult, UTXORef, TEEDomainAssertion } from '@utxodns/core';

export interface IVLEIValidator {
  verifyCredential(vleiCredential: string): Promise<VLEIVerificationResult>;
  bindVLEI(
    utxoRef: UTXORef,
    vleiCredential: string,
    teeAssertion: TEEDomainAssertion
  ): Promise<string>;
}
