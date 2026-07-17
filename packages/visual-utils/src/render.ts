feat: add UTXO model implementation on EVM (30 files)
feat: add core types for UTXO on EVM implementation

import { IPv6Colors } from '@utxodns/core';

/**
 * Generate HTML/CSS for color blocks
 */
export function renderColorBlocks(colors: IPv6Colors): string {
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;width:100px;height:100px;">
      <div style="background:rgb(${colors.tl.r},${colors.tl.g},${colors.tl.b});"></div>
      <div style="background:rgb(${colors.tr.r},${colors.tr.g},${colors.tr.b});"></div>
      <div style="background:rgb(${colors.bl.r},${colors.bl.g},${colors.bl.b});"></div>
      <div style="background:rgb(${colors.br.r},${colors.br.g},${colors.br.b});"></div>
    </div>
  `;
}

/**
 * Generate color blocks using Canvas drawing
 */
export function drawColorBlocks(
  ctx: CanvasRenderingContext2D,
  colors: IPv6Colors,
  x: number,
  y: number,
  size: number
): void {
  const half = size / 2;
  const positions = [
    { dx: 0, dy: 0, color: colors.tl },
    { dx: half, dy: 0, color: colors.tr },
    { dx: 0, dy: half, color: colors.bl },
    { dx: half, dy: half, color: colors.br }
  ];

  for (const pos of positions) {
    ctx.fillStyle = `rgb(${pos.color.r},${pos.color.g},${pos.color.b})`;
    ctx.fillRect(x + pos.dx, y + pos.dy, half, half);
  }
}
