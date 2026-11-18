// Genera/actualiza src/content/data/forever-bis-catalogo.json: catálogo de objetos que el editor local
// ofrece en cada ranura del BiS de Forever (BisForever.astro lo usa para nombre, calidad e icono).
// Uso: node scripts/gen-forever-catalogo.mjs [id id …]
//   - sin argumentos: vuelve a leer de Wowhead Forever todos los objetos del catálogo (nombres nuevos, etc.)
//     más los de `semilla` (abajo);
//   - con IDs: añade esos objetos.
// El editor local también añade objetos al catálogo (pegando el enlace o ID de Wowhead en una ranura).
// Solo entran objetos que un Cazador puede llevar (sin placas, mazas, escudos ni varitas): ver src/lib/ranuras-forever.mjs.
import fs from 'node:fs';
import { leerObjeto } from './editor-local/objeto-wowhead.mjs';

const ARCHIVO = 'src/content/data/forever-bis-catalogo.json';
// Lista pre-raid de nivel 60 preparada el 17-11-2026 (antes estaba en forever-bis.json, nunca se publicó):
// entra en el catálogo con su «dónde se consigue» como sugerencia.
const semilla = {
  13404: 'Stratholme · El Imperdonable',
  275736: 'Misión «Work Well Done» · Monte Hyjal',
  277117: 'Profundidades de Roca Negra · Grizzle',
  18511: 'Peletería',
  252483: 'Peletería',
  13211: 'Cumbre de Roca Negra · Halycon',
  15063: 'Peletería',
  18393: 'La Masacre · Tendris Madeguerra',
  15062: 'Peletería',
  13967: 'Scholomance · Kirtonos el Heraldo',
  18314: 'La Masacre · Alzzin el Formaferal',
  13392: 'Stratholme · Jefe de correos Malown',
  13213: 'Cumbre de Roca Negra · Madre Telabrasada',
  249469: 'Encantamiento',
  279910: "Misión en The Shaper's Terrace (Alianza: «Mapping the Way Forward» · Horda: «The Dark Crystal»)",
  18282: 'Ingeniería',
  12651: "Cumbre de Roca Negra · Cazador de las Sombras Vosh'gajin",
};

const catalogo = fs.existsSync(ARCHIVO) ? JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')) : {};
const pedidos = process.argv.slice(2).map(Number).filter(Boolean);
const ids = pedidos.length ? pedidos : [...new Set([...Object.keys(catalogo).map(Number), ...Object.keys(semilla).map(Number)])];

let ok = 0;
for (const id of ids) {
  try {
    const o = await leerObjeto(id);
    const origen = catalogo[id]?.origen ?? semilla[id];
    catalogo[id] = { ...o, ...(origen ? { origen } : {}) };
    delete catalogo[id].id;
    ok++;
    console.log(id, o.nombre, '→', o.ranuras.join(', '));
  } catch (e) {
    console.log(id, 'NO:', e.message);
  }
  await new Promise((r) => setTimeout(r, 300));
}
const ordenado = Object.fromEntries(Object.entries(catalogo).sort(([a], [b]) => a - b));
fs.writeFileSync(ARCHIVO, JSON.stringify(ordenado, null, 2) + '\n');
console.log(`Listo: ${ok} de ${ids.length} objetos (${Object.keys(ordenado).length} en el catálogo).`);
