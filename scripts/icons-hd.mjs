// Iconos HD para la guía Forever.
// Descarga cada icono de wow.zamimg.com (56 px), lo reescala x4 con Real-ESRGAN
// (mismo binario que el proyecto TikTok) y lo guarda a 128 px en public/icons/<icono>.webp.
//
// Uso:  node scripts/icons-hd.mjs              → iconos usados en src/content/forever/
//       node scripts/icons-hd.mjs icono1 icono2 → solo esos
// Variable REALESRGAN para cambiar la ruta del ejecutable.
// No se ejecuta en el build: los .webp generados se suben al repo.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const root = process.cwd();
const OUT = path.join(root, 'public', 'icons');
const ESRGAN =
  process.env.REALESRGAN ??
  'C:/Users/W11/Desktop/Proyecto TikTok/herramientas/realesrgan/realesrgan-ncnn-vulkan.exe';
const SIZE = 128;

function iconsFromForever() {
  const spells = JSON.parse(fs.readFileSync(path.join(root, 'src/content/data/spells.json'), 'utf8'));
  const set = new Set();
  const walk = (d) =>
    fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const f = path.join(d, e.name);
      if (e.isDirectory()) return walk(f);
      if (!f.endsWith('.md')) return;
      const txt = fs.readFileSync(f, 'utf8');
      for (const m of txt.matchAll(/\[\[([^\]|>]+)|\{\{([^}|>]+)/g)) {
        const icon = spells[(m[1] ?? m[2]).trim()]?.icon;
        if (icon) set.add(icon);
      }
      for (const m of txt.matchAll(/^\s*-?\s*icono:\s*["']?([a-z0-9_]+)["']?\s*$/gim)) set.add(m[1]);
    });
  walk(path.join(root, 'src/content/forever'));
  // Calculadora de talentos y rangos entrenables
  const tal = JSON.parse(fs.readFileSync(path.join(root, 'src/content/data/forever-talentos.json'), 'utf8'));
  tal.arboles.forEach((a) => [a.icono, ...a.talentos.map((t) => t.icono)].forEach((i) => set.add(i)));
  tal.entrenables.forEach((e) => set.add(e.icono));
  // Mascotas: familias y habilidades
  const pet = JSON.parse(fs.readFileSync(path.join(root, 'src/content/data/forever-mascotas.json'), 'utf8'));
  pet.familias.forEach((f) => set.add(f.icono));
  Object.values(pet.habilidades).forEach((h) => set.add(h.icono));
  // Rotación: "hechizo" (icono del catálogo, iconForever si existe), "icono" y [[Hechizo]] en los textos
  const rot = fs.readFileSync(path.join(root, 'src/content/data/forever-rotacion.json'), 'utf8');
  for (const m of rot.matchAll(/"hechizo":\s*"([^"]+)"|\[\[([^\]|>]+)/g)) {
    const s = spells[(m[1] ?? m[2]).trim()];
    if (s) set.add(s.iconForever ?? s.icon);
  }
  for (const m of rot.matchAll(/"icono":\s*"([a-z0-9_]+)"/g)) set.add(m[1]);
  return [...set];
}

const icons = process.argv.slice(2).length ? process.argv.slice(2) : iconsFromForever();
fs.mkdirSync(OUT, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'icons-hd-'));

let done = 0;
for (const icon of icons) {
  const dest = path.join(OUT, `${icon}.webp`);
  if (fs.existsSync(dest)) continue;
  const res = await fetch(`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`);
  if (!res.ok) { console.warn(`No existe en zamimg: ${icon} (${res.status})`); continue; }
  const src = path.join(tmp, `${icon}.png`);
  const up = path.join(tmp, `${icon}_x4.png`);
  await sharp(Buffer.from(await res.arrayBuffer())).png().toFile(src);
  execFileSync(ESRGAN, ['-i', src, '-o', up, '-n', 'realesrgan-x4plus'], { stdio: 'ignore' });
  await sharp(up).resize(SIZE, SIZE).webp({ quality: 86 }).toFile(dest);
  done++;
  console.log(`✓ ${icon}`);
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${done} iconos nuevos en public/icons/ (${icons.length} revisados)`);
