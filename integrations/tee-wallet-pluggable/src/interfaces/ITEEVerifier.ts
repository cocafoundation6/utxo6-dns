import { AddressBook, TEEDomainAssertion } from '../types';

export interface ITEEVerifier {
  generateAssertion(domain: string, utxo: any, addressBook: AddressBook['addresses']): Promise<TEEDomainAssertion>;
  verifyAssertion(assertion: TEEDomainAssertion): Promise<boolean>;
}
