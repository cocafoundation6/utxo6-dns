import { IVisualUtils, IPv6Colors } from '../types';

export class IPv6Visualizer implements IVisualUtils {
  computeIPv6ColorFingerprint(ipv6Addr: string): string {
    return ipv6Addr.replace(/:/g, '').slice(0, 12);
  }
  getIPv6Colors(ipv6Addr: string): IPv6Colors {
    const hex = this.computeIPv6ColorFingerprint(ipv6Addr);
    return {
      tl: { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) },
      tr: { r: parseInt(hex.slice(6,8),16), g: parseInt(hex.slice(8,10),16), b: parseInt(hex.slice(10,12),16) },
      bl: { r: parseInt(hex.slice(2,4),16), g: parseInt(hex.slice(4,6),16), b: parseInt(hex.slice(6,8),16) },
      br: { r: parseInt(hex.slice(8,10),16), g: parseInt(hex.slice(10,12),16), b: parseInt(hex.slice(0,2),16) }
    };
  }
  renderColorBlocks(colors: IPv6Colors): string {
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;width:100px;height:100px;">
        <div style="background:rgb(${colors.tl.r},${colors.tl.g},${colors.tl.b});"></div>
        <div style="background:rgb(${colors.tr.r},${colors.tr.g},${colors.tr.b});"></div>
        <div style="background:rgb(${colors.bl.r},${colors.bl.g},${colors.bl.b});"></div>
        <div style="background:rgb(${colors.br.r},${colors.br.g},${colors.br.b});"></div>
      </div>
    `;
  }
}
