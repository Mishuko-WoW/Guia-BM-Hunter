// Imágenes de cada página para Google y redes: public/og/<versión>/<pestaña>{.jpg,-1x1.webp,-4x3.webp,-16x9.webp}
//   .jpg (1200×630)  → og:image / twitter:image (Discord, WhatsApp, X…)
//   -1x1/-4x3/-16x9  → "image" del JSON-LD (Google recomienda dar las tres proporciones)
// Todo va CENTRADO: Google recorta la miniatura (a menudo en cuadrado) y así nunca corta lo importante.
// Uso: node scripts/og-images.mjs   (volver a ejecutarlo al cambiar textos, retratos del Top 5 o iconos)
// Las rutas las calcula ogImagenes() en src/lib/seo.ts; si falta una imagen se usa la de la versión.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const pub = (p) => path.join(root, 'public', p);
const LOGO = pub('brand/mishuko-logo.webp');

const PALETA = {
  portada: { bg: ['#1c2208', '#0c0f04', '#070803'], acento: '#c4d70b', marco: '#c4d70b', linea: '#c4d70b' },
  midnight: { bg: ['#1d1740', '#0c0a1c', '#06050e'], acento: '#8f7bff', marco: '#c4d70b', linea: '#8f7bff' },
  forever: { bg: ['#103238', '#081618', '#050d0e'], acento: '#4fc4cf', marco: '#d6a868', linea: '#4fc4cf' },
};
const KICKER = { portada: 'GUÍA EN ESPAÑOL · MISHUKO', midnight: 'WOW MIDNIGHT · TEMPORADA 2', forever: 'WOW FOREVER · NIVEL 60' };

// visual: 'logo' | 'pets' | lista de iconos de public/icons (sin .webp)
const PAGINAS = {
  portada: {
    index: { titulo: 'GUÍA HUNTER BM', sub: 'Cazador de Bestias · Midnight y WoW Forever', visual: 'logo' },
  },
  forever: {
    mecanicas: { titulo: 'GUÍA HUNTER BM', sub: 'Cazador de Bestias en WoW Forever', visual: 'logo' },
    talentos: { titulo: 'MEJORES TALENTOS', sub: 'Build 31/20/0 del Hunter BM y orden para subir', visual: ['ability_hunter_bestialdiscipline', 'ability_druid_ferociousbite', 'ability_trueshot'] },
    estadisticas: { titulo: 'ESTADÍSTICAS', sub: 'Prioridad de stats del Hunter BM', visual: ['ability_marksmanship', 'ability_hunter_criticalshot', 'ability_piercedamage'] },
    rotacion: { titulo: 'ROTACIÓN', sub: 'Un objetivo y AoE del Hunter BM', visual: ['ability_poisonsting', 'ability_hunter_aimedshot', 'ability_upgrademoonglaive'] },
    bis: { titulo: 'BIS Y CONSUMIBLES', sub: 'Equipo del Hunter BM por fase', visual: 'logo' },
    mascotas: { titulo: 'MEJORES MASCOTAS', sub: 'Top 5 pets del Hunter y dónde domesticarlas', visual: 'pets' },
    macros: { titulo: 'MACROS', sub: 'Mascota y Tiro automático, listas para copiar', visual: ['ability_hunter_beastcall', 'ability_hunter_mendpet', 'ability_hunter_runningshot'] },
    leveling: { titulo: 'LEVELING 1-60', sub: 'Talentos, munición, carcaj y mascotas para subir', visual: ['inv_weapon_crossbow_10', 'inv_misc_quiver_10', 'ability_hunter_pet_cat', 'inv_weapon_rifle_05'] },
    coaching: { titulo: 'COACHING', sub: 'Mejora tu Hunter BM con Mishuko', visual: ['ability_hunter_eagleeye'] },
  },
  midnight: {
    mecanicas: { titulo: 'GUÍA HUNTER BM', sub: 'Maestro de bestias · Midnight Temporada 2', visual: 'logo' },
    talentos: { titulo: 'TALENTOS', sub: 'Builds de raid y M+ del Hunter BM', visual: 'logo' },
    estadisticas: { titulo: 'ESTADÍSTICAS', sub: 'Prioridad de stats del Hunter BM', visual: 'logo' },
    rotacion: { titulo: 'ROTACIÓN Y OPENER', sub: 'Pack Leader y Dark Ranger', visual: 'logo' },
    bis: { titulo: 'BIS Y CONSUMIBLES', sub: 'Equipo del Hunter BM por ranura', visual: 'logo' },
    mascotas: { titulo: 'MASCOTAS', sub: 'Qué pet llevar con tu Hunter BM', visual: 'logo' },
    macros: { titulo: 'MACROS', sub: 'Las imprescindibles del Hunter BM', visual: 'logo' },
    simulacion: { titulo: 'SIMULACIÓN', sub: 'Raidbots y Top Gear para el Hunter BM', visual: 'logo' },
    coaching: { titulo: 'COACHING', sub: 'Mejora tu Hunter BM con Mishuko', visual: 'logo' },
  },
};

// Top 5 de mascotas: el #1 en el centro y más grande (si la miniatura se recorta, se ve el #1)
const top5 = JSON.parse(fs.readFileSync(path.join(root, 'src/content/data/forever-mascotas-top5.json'), 'utf8'));
const PETS = [...top5.mascotas].sort((a, b) => a.puesto - b.puesto).map((m) => pub(`pets/${m.id}.webp`));
const ORDEN_PETS = [3, 1, 0, 2, 4]; // posiciones: #4 #2 #1 #3 #5

const FORMATOS = [
  { sufijo: '.jpg', w: 1200, h: 630 },
  { sufijo: '-16x9.webp', w: 1200, h: 675 },
  { sufijo: '-4x3.webp', w: 1200, h: 900 },
  { sufijo: '-1x1.webp', w: 1200, h: 1200 },
];

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
/** Tamaño de letra para que el texto quepa en `ancho` (Arial negrita ≈ 0,66 em por letra) */
const ajusta = (texto, base, ancho, em = 0.66) => Math.min(base, Math.floor(ancho / (texto.length * em)));

async function visual(tipo, s, pal) {
  // devuelve { capas: [{input, left, top}] relativas, w, h, svg (marcos) }
  if (tipo === 'logo') {
    const t = Math.round(250 * s);
    return { w: t, h: t, piezas: [{ src: LOGO, x: 0, y: 0, t }] };
  }
  if (tipo === 'pets') {
    const grande = Math.round(205 * s), peq = Math.round(150 * s), gap = Math.round(-10 * s);
    const piezas = [];
    let x = 0;
    for (const i of ORDEN_PETS) {
      const t = i === 0 ? grande : peq;
      piezas.push({ src: PETS[i], x, y: Math.round((grande - t) / 2) + (i === 0 ? 0 : Math.round(12 * s)), t, z: i === 0 ? 1 : 0 });
      x += t + gap;
    }
    return { w: x - gap, h: grande, piezas: piezas.sort((a, b) => (a.z ?? 0) - (b.z ?? 0)) };
  }
  // iconos del juego con marco
  const t = Math.round((tipo.length > 3 ? 132 : 150) * s), gap = Math.round(26 * s), borde = Math.max(3, Math.round(4 * s));
  const piezas = tipo.map((ico, i) => ({ src: pub(`icons/${ico}.webp`), x: i * (t + gap), y: 0, t, marco: borde }));
  return { w: tipo.length * (t + gap) - gap, h: t, piezas };
}

async function pinta(realm, tab, pag, { w, h }) {
  const pal = PALETA[realm];
  const s = Math.min(w, h) / 630; // escala respecto al formato de redes
  const corto = Math.min(w, h); // zona segura: el cuadrado central
  const sv = s * (h > w * 0.7 ? 1.25 : 1);
  let v = await visual(pag.visual, sv, pal);
  if (v.w > w * 0.92) v = await visual(pag.visual, (sv * w * 0.92) / v.w, pal); // que quepa a lo ancho

  const kicker = KICKER[realm];
  const fK = Math.round(22 * s), fT = ajusta(pag.titulo, Math.round(70 * s), corto * 0.92), fS = ajusta(pag.sub, Math.round(28 * s), corto * 0.92, 0.5);
  const gap = Math.round(34 * s);
  const alto = v.h + gap + fK + Math.round(18 * s) + fT + Math.round(20 * s) + fS;
  let y = Math.round((h - alto) / 2) - Math.round(10 * s);
  const vx = Math.round((w - v.w) / 2), vy = y;
  y += v.h + gap;
  const yK = y + fK; y = yK + Math.round(18 * s);
  const yT = y + fT * 0.82; y = yT + Math.round(26 * s);
  const yS = y + fS * 0.82;

  const marcos = v.piezas.filter((p) => p.marco).map((p) =>
    `<rect x="${vx + p.x - p.marco}" y="${vy + p.y - p.marco}" width="${p.t + 2 * p.marco}" height="${p.t + 2 * p.marco}" fill="#000" stroke="${pal.marco}" stroke-width="${p.marco}"/>`).join('');
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="g" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stop-color="${pal.bg[0]}"/><stop offset="0.55" stop-color="${pal.bg[1]}"/><stop offset="1" stop-color="${pal.bg[2]}"/>
    </radialGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${pal.acento}" stop-opacity="0.28"/><stop offset="1" stop-color="${pal.acento}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g stroke="${pal.linea}" stroke-opacity="0.16" stroke-width="${Math.round(10 * s)}">
    <line x1="${w * 0.08}" y1="-20" x2="${w * 0.02}" y2="${h + 20}"/><line x1="${w * 0.13}" y1="-20" x2="${w * 0.07}" y2="${h + 20}"/>
    <line x1="${w * 0.93}" y1="-20" x2="${w * 0.87}" y2="${h + 20}"/><line x1="${w * 0.98}" y1="-20" x2="${w * 0.92}" y2="${h + 20}"/>
  </g>
  <ellipse cx="${w / 2}" cy="${vy + v.h / 2}" rx="${Math.max(v.w, v.h) * 0.75}" ry="${v.h * 0.85}" fill="url(#halo)"/>
  ${marcos}
  <g font-family="Arial, Helvetica, sans-serif" font-weight="700" text-anchor="middle">
    <text x="${w / 2}" y="${yK}" fill="#b2aa9a" font-size="${fK}" letter-spacing="${Math.round(5 * s)}">${esc(kicker)}</text>
    <text x="${w / 2}" y="${yT}" fill="#efe7da" font-size="${fT}">${esc(pag.titulo)}</text>
    <text x="${w / 2}" y="${yS}" fill="${pal.acento}" font-size="${fS}" font-weight="400">${esc(pag.sub)}</text>
  </g>
  <rect x="${w / 2 - 55 * s}" y="${Math.round(yS + 26 * s)}" width="${110 * s}" height="${Math.max(4, Math.round(5 * s))}" fill="${pal.marco}"/>
</svg>`;

  const capas = [];
  for (const p of v.piezas) {
    capas.push({ input: await sharp(p.src).resize(p.t, p.t, { kernel: 'lanczos3' }).toBuffer(), left: vx + p.x, top: vy + p.y });
  }
  return sharp(Buffer.from(svg)).composite(capas);
}

let n = 0;
for (const [realm, pags] of Object.entries(PAGINAS)) {
  const dir = pub(`og/${realm === 'portada' ? '' : realm}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const [tab, pag] of Object.entries(pags)) {
    for (const f of FORMATOS) {
      const img = await pinta(realm, tab, pag, f);
      const out = path.join(dir, `${realm === 'portada' ? 'portada' : tab}${f.sufijo}`);
      await (f.sufijo.endsWith('.jpg') ? img.jpeg({ quality: 84, mozjpeg: true }) : img.webp({ quality: 82 })).toFile(out);
      n++;
    }
  }
}
console.log(`Escritas ${n} imágenes en public/og/`);
