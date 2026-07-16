import { AddressBook } from '../types';

export interface IDNSResolver {
  resolve(domain: string): Promise<AddressBook>;
}
