import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create crisp SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1320" />
      <stop offset="50%" stop-color="#0a0d14" />
      <stop offset="100%" stop-color="#05070a" />
    </linearGradient>
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#00d2ff" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="neonGreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="neonRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="100%" stop-color="#dc2626" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background rounded rectangle -->
  <rect width="512" height="512" rx="108" fill="url(#bg)" />
  <rect width="504" height="504" x="4" y="4" rx="104" fill="none" stroke="#1e293b" stroke-width="3" />

  <!-- Grid lines background watermark -->
  <path d="M 64 128 L 448 128 M 64 256 L 448 256 M 64 384 L 448 384" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.6"/>
  <path d="M 128 64 L 128 448 M 256 64 L 256 448 M 384 64 L 384 448" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.6"/>

  <!-- Candlestick 1 (Bullish green) -->
  <line x1="140" y1="180" x2="140" y2="350" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
  <rect x="122" y="210" width="36" height="100" rx="4" fill="url(#neonGreen)"/>

  <!-- Candlestick 2 (Bearish red) -->
  <line x1="210" y1="220" x2="210" y2="390" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
  <rect x="192" y="250" width="36" height="90" rx="4" fill="url(#neonRed)"/>

  <!-- Candlestick 3 (Strong Bullish Cyan breakout) -->
  <line x1="280" y1="120" x2="280" y2="330" stroke="#00d2ff" stroke-width="5" stroke-linecap="round"/>
  <rect x="262" y="150" width="36" height="130" rx="4" fill="url(#neonCyan)" filter="url(#glow)"/>

  <!-- Dynamic Trend Moving Average Line -->
  <path d="M 90 320 C 140 310, 180 280, 240 240 C 280 200, 320 160, 420 120" fill="none" stroke="#00d2ff" stroke-width="8" stroke-linecap="round" filter="url(#glow)"/>

  <!-- Glowing Trend Dot & Beacon -->
  <circle cx="420" cy="120" r="10" fill="#00d2ff" filter="url(#glow)" />
  <circle cx="420" cy="120" r="5" fill="#ffffff" />

  <!-- RealTrade Emblem Stamp "R" -->
  <text x="360" y="420" font-family="system-ui, sans-serif" font-weight="900" font-size="76" fill="#00d2ff" opacity="0.95" letter-spacing="-2">R</text>
  <text x="412" y="420" font-family="system-ui, sans-serif" font-weight="900" font-size="76" fill="#38bdf8" opacity="0.95" letter-spacing="-2">T</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Created public/icon.svg');

// PNG generator helper (creates clean RGBA PNG with given dimensions and background/drawing)
function createPNG(width, height, isMaskable = false) {
  // Simple CRC32 implementation
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const chunkData = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(chunkData), 0);
    return Buffer.concat([len, chunkData, crcBuf]);
  }

  // Raw RGBA image data buffer (filter byte per scanline = 0)
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (isMaskable ? 0.48 : 0.42);

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep dark sleek theme #0a0d14
      let r = 10;
      let g = 13;
      let b = 20;
      let a = 255;

      // Outer border circle or rounded region
      if (dist < radius) {
        // Gradient inner
        const grad = 1 - (dist / radius) * 0.4;
        r = Math.floor(14 * grad);
        g = Math.floor(20 * grad);
        b = Math.floor(32 * grad);

        // Draw Candlestick pattern
        // Green bar on left
        const normX = (x - cx) / radius;
        const normY = (y - cy) / radius;

        // Candle 1 (left green)
        if (normX >= -0.65 && normX <= -0.45 && normY >= -0.2 && normY <= 0.3) {
          r = 16; g = 185; b = 129; // emerald
        } else if (normX >= -0.57 && normX <= -0.53 && normY >= -0.4 && normY <= 0.5) {
          r = 16; g = 185; b = 129; // emerald wick
        }
        // Candle 2 (mid-left red)
        else if (normX >= -0.35 && normX <= -0.15 && normY >= -0.05 && normY <= 0.4) {
          r = 239; g = 68; b = 68; // rose red
        } else if (normX >= -0.27 && normX <= -0.23 && normY >= -0.2 && normY <= 0.55) {
          r = 239; g = 68; b = 68; // red wick
        }
        // Candle 3 (center cyan breakout)
        else if (normX >= -0.05 && normX <= 0.18 && normY >= -0.5 && normY <= 0.15) {
          r = 0; g = 210; b = 255; // neon cyan
        } else if (normX >= 0.05 && normX <= 0.09 && normY >= -0.65 && normY <= 0.3) {
          r = 0; g = 210; b = 255; // cyan wick
        }
        // Uptrend swoosh line: y approx = -0.5 * normX
        const lineDist = Math.abs(normY - (-0.7 * normX + 0.05));
        if (lineDist < 0.06 && normX >= -0.7 && normX <= 0.65) {
          r = 0; g = 210; b = 255;
        }
        // Beacon dot at peak
        const peakDist = Math.sqrt((normX - 0.65) ** 2 + (normY - (-0.4)) ** 2);
        if (peakDist < 0.07) {
          r = 255; g = 255; b = 255;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate PWA and store icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, false));
console.log('Generated PNG icons in /public');
