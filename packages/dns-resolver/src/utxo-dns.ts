import { IDNSResolver, ResolveOptions } from './resolver';
import { AddressBook } from '@utxodns/core';

/**
 * UTXO-DNS Gateway implementation (DNS-over-HTTPS)
 */
export class UTXODNSResolver implements IDNSResolver {
  constructor(
    private gatewayUrl: string = 'https://dns.utxo.coca',
    private defaultTTL: number = 3600
  ) {}

  async resolve(domain: string, options?: ResolveOptions): Promise<AddressBook> {
    const query = new URLSearchParams({
      name: domain,
      type: 'UTXO',
      _: Date.now().toString()
    });

    const response = await fetch(`${this.gatewayUrl}/dns-query?${query}`, {
      headers: { 'Accept': 'application/dns-json' }
    });

    if (!response.ok) {
      throw new Error(`DNS query failed: ${response.status}`);
    }

    const data = await response.json();
    const utxoAnswer = data.Answer?.find((r: any) => r.type === 65300);

    if (!utxoAnswer) {
      throw new Error(`No UTXO record found for domain: ${domain}`);
    }

    return this.decodeUTXORecord(utxoAnswer.data, domain);
  }

  async resolveBatch(domains: string[]): Promise<AddressBook[]> {
    return Promise.all(domains.map(d => this.resolve(d)));
  }

  private decodeUTXORecord(data: string, domain: string): AddressBook {
    const buffer = Buffer.from(data, 'base64');
    let offset = 0;

    const version = buffer.readUInt8(offset++);
    if (version !== 1) {
      throw new Error(`Unsupported UTXO record version: ${version}`);
    }

    const ownerPubkeyHash = buffer.subarray(offset, offset + 20);
    offset += 20;

    const addressesLen = buffer.readUInt16BE(offset);
    offset += 2;

    const addresses: AddressBook['addresses'] = {};
    for (let i = 0; i < addressesLen; i++) {
      const keyLen = buffer.readUInt8(offset++);
      const key = buffer.subarray(offset, offset + keyLen).toString();
      offset += keyLen;
      const valLen = buffer.readUInt16BE(offset);
      offset += 2;
      const val = buffer.subarray(offset, offset + valLen).toString();
      offset += valLen;
      (addresses as any)[key] = val;
    }

    const ipv6Fingerprint = buffer.subarray(offset, offset + 12).toString('hex');
    offset += 12;

    const vleiDidLen = buffer.readUInt16BE(offset);
    offset += 2;
    const vleiDid = vleiDidLen > 0 ? buffer.subarray(offset, offset + vleiDidLen).toString() : undefined;

    return {
      domain,
      ownerPubkeyHash: new Uint8Array(ownerPubkeyHash),
      addresses,
      ipv6Fingerprint,
      vleiDid,
      blockHeight: 0,
      ttl: this.defaultTTL
    };
  }
}
