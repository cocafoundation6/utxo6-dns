import { AddressBook, TEEDomainAssertion } from '../types';

export interface IStorage {
  saveAssertion(domain: string, assertion: TEEDomainAssertion): Promise<void>;
  getAssertion(domain: string): Promise<TEEDomainAssertion | null>;
  saveAddressBook(domain: string, book: AddressBook): Promise<void>;
  getAddressBook(domain: string): Promise<AddressBook | null>;
}
