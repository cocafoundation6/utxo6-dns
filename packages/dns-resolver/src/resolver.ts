feat: add UTXO model implementation on EVM (30 files)
feat: add core types for UTXO on EVM implementation

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
