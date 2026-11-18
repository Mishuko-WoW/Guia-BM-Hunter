// Lee un objeto de WoW Forever desde su tooltip de Wowhead (nether.wowhead.com, el mismo que usa
// scripts/gen-forever-objetos.mjs) y lo pasa a una ficha del catálogo del BiS:
//   { id, nombre, calidad, icono, slot, tipo, nivel, ilvl, unico, clases, ranuras }
// Nombre: Forever es-ES → si sale sin traducir ([corchetes]), Classic es-ES → nombre inglés.
// Lo usan el editor local (/__editor/objeto) y scripts/gen-forever-catalogo.mjs.
import { RANURAS, TIPOS_HUNTER, TIPOS_NO, ranuraBase, paraHunter } from '../../src/lib/ranuras-forever.mjs';

const UA = { headers: { 'User-Agent': 'guia-bm-hunter/1.0' } };
const json = async (url) => {
  const r = await fetch(url, UA);
  return r.ok ? r.json() : null;
};
const sinCorchetes = (n = '') => n.replace(/^\[(.*)\]$/, '$1');
const traducido = (n) => n && !/^\[.*\]$/.test(n);

const SLOTS = new Set(RANURAS.flatMap((r) => r.acepta).concat(['Camisa', 'Tabardo']));
const TIPOS = new Set([...TIPOS_HUNTER, ...Object.keys(TIPOS_NO)]);
const CLASES = ['Guerrero', 'Paladín', 'Cazador', 'Pícaro', 'Sacerdote', 'Chamán', 'Mago', 'Brujo', 'Druida'];

/** Texto plano del tooltip en trozos (cada etiqueta HTML corta) */
const trozos = (html) => html
  .replace(/<!--[\s\S]*?-->/g, '')
  .split(/<[^>]+>/)
  .map((t) => t.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
  .filter(Boolean);

/** Saca ranura, tipo, nivel, clases… del HTML del tooltip */
export function leerTooltip(html) {
  const t = trozos(html);
  const i = t.findIndex((x) => SLOTS.has(ranuraBase(x)));
  const slot = i >= 0 ? t[i] : '';
  const tipo = i >= 0 && TIPOS.has(t[i + 1]) ? t[i + 1] : '';
  const plano = t.join(' · ');
  // «Clases: Guerrero, Paladín» llega en trozos: «Clases:», «Guerrero», «,», «Paladín»
  const clases = [];
  const k = t.findIndex((x) => /^Clases?:/.test(x));
  if (k >= 0) {
    for (const x of [t[k].replace(/^Clases?:/, ''), ...t.slice(k + 1)].flatMap((y) => y.split(',')).map((y) => y.trim())) {
      if (!x) continue;
      if (!CLASES.includes(x)) break;
      clases.push(x);
    }
  }
  return {
    slot,
    tipo,
    nivel: Number(html.match(/<!--rlvl-->(\d+)/)?.[1] ?? 0) || null,
    ilvl: Number(html.match(/<!--ilvl-->(\d+)/)?.[1] ?? 0) || null,
    unico: /Único/.test(plano),
    clases,
  };
}

/**
 * Ficha de un objeto de Forever. Lanza un Error con el motivo si no existe o un Cazador no lo puede llevar.
 * @param {number} id
 */
export async function leerObjeto(id) {
  if (!Number.isInteger(id) || id <= 0 || id > 9_999_999) throw new Error('ID de objeto no válido');
  const f = await json(`https://nether.wowhead.com/forever/tooltip/item/${id}?locale=6`);
  if (!f?.tooltip) throw new Error(`El objeto ${id} no existe en Wowhead Forever`);
  let nombre = f.name;
  if (!traducido(nombre)) {
    const c = await json(`https://nether.wowhead.com/classic/tooltip/item/${id}?locale=6`);
    nombre = traducido(c?.name) ? c.name : sinCorchetes(nombre);
  }
  const datos = leerTooltip(f.tooltip);
  const v = paraHunter(datos);
  if (!v.ok) throw new Error(`«${nombre}» no vale para un Cazador: ${v.motivo}`);
  return { id, nombre, calidad: f.quality ?? 1, icono: f.icon ?? 'inv_misc_questionmark', ...datos, ranuras: v.ranuras };
}

/** «https://www.wowhead.com/forever/es/item=13404/…», «item=13404» o «13404» → 13404 */
export const idDeTexto = (s = '') => Number(String(s).match(/item=(\d+)/)?.[1] ?? String(s).trim().match(/^\d+$/)?.[0] ?? NaN);
