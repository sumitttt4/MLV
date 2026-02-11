const fs = require('fs');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const padding = Math.round(size * 0.15);
  const inner = size - padding * 2;
  const fontSize = Math.round(size * 0.38);
  const subFontSize = Math.round(size * 0.1);
  const cx = size / 2;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#4A1F1A"/>`,
    `  <rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" rx="${Math.round(inner * 0.12)}" fill="#2A0D0B" stroke="#E3B25C" stroke-width="${Math.max(1, Math.round(size * 0.015))}"/>`,
    `  <text x="${cx}" y="${cx - subFontSize * 0.3}" text-anchor="middle" dominant-baseline="central" font-family="serif" font-weight="bold" font-size="${fontSize}" fill="#E3B25C">MLV</text>`,
    `  <text x="${cx}" y="${cx + fontSize * 0.5}" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="600" font-size="${subFontSize}" letter-spacing="${Math.round(size * 0.02)}" fill="#E3B25C" opacity="0.7">GRAND</text>`,
    `</svg>`
  ].join('\n');

  fs.writeFileSync(`public/icons/icon-${size}x${size}.svg`, svg);
});
console.log('SVG icons generated for sizes:', sizes.join(', '));
