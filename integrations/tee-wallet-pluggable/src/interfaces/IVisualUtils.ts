import { IPv6Colors } from '../types';

export interface IVisualUtils {
  computeIPv6ColorFingerprint(ipv6Addr: string): string;
  getIPv6Colors(ipv6Addr: string): IPv6Colors;
  renderColorBlocks(colors: IPv6Colors): string;
}
