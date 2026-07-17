feat: add UTXO model implementation on EVM (30 files)
feat: add core types for UTXO on EVM implementation

import { AddressBook, TEEDomainAssertion } from '@utxodns/core';

export interface IStorage {
  saveAssertion(domain: string, assertion: TEEDomainAssertion): Promise<void>;
  getAssertion(domain: string): Promise<TEEDomainAssertion | null>;
  saveAddressBook(domain: string, book: AddressBook): Promise<void>;
  getAddressBook(domain: string): Promise<AddressBook | null>;
}
