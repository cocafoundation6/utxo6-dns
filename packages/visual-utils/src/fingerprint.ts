import { IPv6Colors } from '@utxodns/core';
import { createHash } from 'crypto';

/**
 * Calculate IPv6 color fingerprint
 */
export function computeIPv6ColorFingerprint(ipv6Addr: string): string {
  const normalized = normalizeIPv6(ipv6Addr);
  const parts = normalized.split(':');
  const suffix = parts.slice(4).join('');
  const hash = createHash('sha256').update(suffix).digest();
  return hash.subarray(0, 12).toString('hex');
}

/**
 * Generate 4-block RGB values from IPv6 fingerprints
 */
export function getIPv6Colors(fingerprint: string): IPv6Colors {
  const hex = fingerprint.padStart(24, '0');
  return {
    tl: { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) },
    tr: { r: parseInt(hex.slice(6, 8), 16), g: parseInt(hex.slice(8, 10), 16), b: parseInt(hex.slice(10, 12), 16) },
    bl: { r: parseInt(hex.slice(12, 14), 16), g: parseInt(hex.slice(14, 16), 16), b: parseInt(hex.slice(16, 18), 16) },
    br: { r: parseInt(hex.slice(18, 20), 16), g: parseInt(hex.slice(20, 22), 16), b: parseInt(hex.slice(22, 24), 16) }
  };
}

function normalizeIPv6(addr: string): string {
  return addr.toLowerCase();
}
