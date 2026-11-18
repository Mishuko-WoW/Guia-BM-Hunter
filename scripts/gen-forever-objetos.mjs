// Genera src/content/data/forever-objetos.json: nombre en español, calidad e icono de cada objeto/hechizo
// que aparece en src/content/data/forever-bis.json (lo usa BisForever.astro).
// Uso: node scripts/gen-forever-objetos.mjs   (volver a ejecutarlo al añadir objetos a forever-bis.json)
// Nombre: Wowhead Forever es-ES → si no está traducido (sale entre [corchetes]), Wowhead Classic es-ES → nombre inglés.
import fs from 'node:fs';

const bis = JSON.parse(fs.readFileSync('src/content/data/forever-bis.json', 'utf8'));
const UA = { headers: { 'User-Agent': 'guia-bm-hunter/1.0' } };
const json = async (url) => {
  const r = await fetch(url, UA);
  return r.ok ? r.json() : null;
};
const sinCorchetes = (n = '') => n.replace(/^\[(.*)\]$/, '$1');
const traducido = (n) => n && !/^\[.*\]$/.test(n);

const items = new Set();
const spells = new Set();
// Las piezas de la ventana de personaje salen de forever-bis-catalogo.json (gen-forever-catalogo.mjs), no de aquí
for (const a of bis.armas ?? []) items.add(a.alianza), items.add(a.horda);
for (const g of bis.consumibles) for (const o of g.objetos) items.add(o.id);
for (const e of bis.encantamientos) (e.tipo === 'spell' ? spells : items).add(e.id);

const out = { item: {}, spell: {} };
for (const id of [...items].sort((a, b) => a - b)) {
  const f = await json(`https://nether.wowhead.com/forever/tooltip/item/${id}?locale=6`);
  let nombre = f?.name;
  if (!traducido(nombre)) {
    const c = await json(`https://nether.wowhead.com/classic/tooltip/item/${id}?locale=6`);
    nombre = traducido(c?.name) ? c.name : sinCorchetes(nombre ?? c?.name ?? `Objeto ${id}`);
  }
  out.item[id] = { nombre, calidad: f?.quality ?? 1, icono: f?.icon ?? 'inv_misc_questionmark' };
  console.log(id, nombre);
}
for (const id of [...spells].sort((a, b) => a - b)) {
  const f = await json(`https://nether.wowhead.com/forever/tooltip/spell/${id}?locale=6`);
  out.spell[id] = { nombre: sinCorchetes(f?.name ?? `Hechizo ${id}`), calidad: 1, icono: f?.icon ?? 'inv_misc_questionmark' };
  console.log(id, out.spell[id].nombre);
}
fs.writeFileSync('src/content/data/forever-objetos.json', JSON.stringify(out, null, 2) + '\n');
console.log(`Listo: ${items.size} objetos y ${spells.size} hechizos.`);
