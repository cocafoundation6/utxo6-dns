feat: add UTXO model implementation on EVM (30 files)
feat: add core types for UTXO on EVM implementation

import { IDNSResolver, ResolveOptions } from './resolver';
import { AddressBook } from '@utxodns/core';
import { ethers } from 'ethers';

/**
 * ENSSubdomain Delegation Implementation (EIP-3668 CCIP-Read)
 */
export class ENSSubdomainResolver implements IDNSResolver {
  constructor(
    private ensResolverAddress: string,
    private gatewayUrl: string,
    private provider: ethers.Provider
  ) {}

  async resolve(domain: string, options?: ResolveOptions): Promise<AddressBook> {
    const ensName = domain.endsWith('.eth') ? domain : `${domain}.utxo.eth`;

    const resolver = await this.provider.getResolver(ensName);
    if (!resolver) {
      throw new Error(`No ENS resolver found for: ${ensName}`);
    }

    try {
      const result = await resolver.getText('utxo.addressbook');
      if (result) {
        return this.decodeAddressBook(result, domain);
      }
    } catch (error: any) {
      if (error.data?.startsWith('0x556f1830')) {
        return this.handleOffchainLookup(error, domain);
      }
      throw error;
    }

    throw new Error(`No UTXO address book found for: ${domain}`);
  }

  async resolveBatch(domains: string[]): Promise<AddressBook[]> {
    return Promise.all(domains.map(d => this.resolve(d)));
  }

  private async handleOffchainLookup(error: any, domain: string): Promise<AddressBook> {
    const { sender, urls, callData, callbackFunction, extraData } = this.parseOffchainLookupError(error);

    const response = await fetch(urls[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: callData, sender, extraData })
    });

    if (!response.ok) {
      throw new Error(`CCIP-Read failed: ${response.status}`);
    }

    const result = await response.json();
    return this.decodeAddressBook(result.data, domain);
  }

  private parseOffchainLookupError(error: any): any {
    return {
      sender: '0x...',
      urls: ['https://gateway.ens.utxo/'],
      callData: '0x...',
      callbackFunction: '0x...',
      extraData: '0x...'
    };
  }

  private decodeAddressBook(data: string, domain: string): AddressBook {
    return JSON.parse(Buffer.from(data.slice(2), 'hex').toString());
  }
}
