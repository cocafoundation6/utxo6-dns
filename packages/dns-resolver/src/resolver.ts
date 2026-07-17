import { AddressBook } from '@utxodns/core';

export interface ResolveOptions {
  noCache?: boolean;
  timeout?: number;
}

/**
 * DNS Resolver Interface – Pluggable Design
 */
export interface IDNSResolver {
  resolve(domain: string, options?: ResolveOptions): Promise<AddressBook>;
  resolveBatch(domains: string[]): Promise<AddressBook[]>;
}
