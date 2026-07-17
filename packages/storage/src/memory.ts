import { IStorage } from './storage';
import { AddressBook, TEEDomainAssertion } from '@utxodns/core';

export class MemoryStorage implements IStorage {
  private assertions = new Map<string, TEEDomainAssertion>();
  private addressBooks = new Map<string, AddressBook>();

  async saveAssertion(domain: string, assertion: TEEDomainAssertion): Promise<void> {
    this.assertions.set(domain, assertion);
  }

  async getAssertion(domain: string): Promise<TEEDomainAssertion | null> {
    return this.assertions.get(domain) || null;
  }

  async saveAddressBook(domain: string, book: AddressBook): Promise<void> {
    this.addressBooks.set(domain, book);
  }

  async getAddressBook(domain: string): Promise<AddressBook | null> {
    return this.addressBooks.get(domain) || null;
  }
}
