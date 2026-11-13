// Genera la imagen para redes (Open Graph, 1200×630) de la guía Forever: public/brand/og-forever.png
// Mismo diseño que og-image.png (Midnight) con la paleta de Forever. Uso: node scripts/og-images.mjs
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const W = 1200, H = 630;
const LOGO = path.join(root, 'public/brand/mishuko-logo.webp');
const OUT = path.join(root, 'public/brand/og-forever.png');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="g" cx="0.24" cy="0.5" r="0.75">
      <stop offset="0" stop-color="#103238"/><stop offset="0.55" stop-color="#081618"/><stop offset="1" stop-color="#050d0e"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g stroke="#4fc4cf" stroke-opacity="0.22" stroke-width="10">
    <line x1="1115" y1="-20" x2="1035" y2="660"/><line x1="1170" y1="-20" x2="1090" y2="660"/>
  </g>
  <g font-family="Arial, Helvetica, sans-serif" font-weight="700">
    <text x="560" y="214" fill="#b2aa9a" font-size="25" letter-spacing="6">WOW FOREVER · NIVEL 60</text>
    <text x="556" y="310" fill="#efe7da" font-size="74">GUÍA HUNTER</text>
    <text x="560" y="380" fill="#4fc4cf" font-size="50">BEAST MASTERY</text>
    <text x="560" y="442" fill="#b2aa9a" font-size="27" font-weight="400">Talentos · Mascotas · Leveling · Rotación</text>
  </g>
  <rect x="560" y="472" width="110" height="6" fill="#d6a868"/>
</svg>`;

const logo = await sharp(LOGO).resize(430, 430).toBuffer();
await sharp(Buffer.from(svg))
  .composite([{ input: logo, left: 82, top: 100 }])
  .png({ compressionLevel: 9 })
  .toFile(OUT);
console.log('Escrito', OUT);
