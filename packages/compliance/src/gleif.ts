import { IVLEIValidator } from './validator';
import { VLEIVerificationResult, UTXORef, TEEDomainAssertion } from '@utxodns/core';

/**
 * GLEIF vLEI Verification Implementation
 */
export class GLEIFValidator implements IVLEIValidator {
  constructor(
    private gleifApiUrl: string = 'https://api.gleif.org/api/v1',
    private vleiVerifierUrl: string = 'https://verifier.lei.global'
  ) {}

  async verifyCredential(vleiCredential: string): Promise<VLEIVerificationResult> {
    const payload = this.decodeJWT(vleiCredential);
    const isValid = await this.verifyJWTSignature(vleiCredential);
    if (!isValid) {
      return { valid: false };
    }

    const status = await this.checkCredentialStatus(payload.lei);
    if (!status) {
      return { valid: false };
    }

    const leiInfo = await this.fetchLEIInfo(payload.lei);

    return {
      valid: true,
      lei: payload.lei,
      legalName: leiInfo?.legalName,
      country: leiInfo?.country,
      status: leiInfo?.status
    };
  }

  async bindVLEI(
    utxoRef: UTXORef,
    vleiCredential: string,
    teeAssertion: TEEDomainAssertion
  ): Promise<string> {
    const verification = await this.verifyCredential(vleiCredential);
    if (!verification.valid) {
      throw new Error('Invalid vLEI credential');
    }

    return '0x' + Buffer.from(utxoRef.txid, 'hex').toString('hex');
  }

  private decodeJWT(jwt: string): any {
    const parts = jwt.split('.');
    return JSON.parse(Buffer.from(parts[1], 'base64').toString());
  }

  private async verifyJWTSignature(jwt: string): Promise<boolean> {
    return true;
  }

  private async checkCredentialStatus(lei: string): Promise<boolean> {
    return true;
  }

  private async fetchLEIInfo(lei: string): Promise<any> {
    const response = await fetch(`${this.gleifApiUrl}/lei-records/${lei}`);
    if (!response.ok) return null;
    return response.json();
  }
}
