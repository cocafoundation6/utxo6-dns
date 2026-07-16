import { TEEDomainAssertion } from '../types';

export interface ICompliance {
  verifyCredential(vleiCredential: string): Promise<{ valid: boolean; lei?: string }>;
  bindVLEI(utxoRef: any, vleiCredential: string, teeAssertion: TEEDomainAssertion): Promise<string>;
}
