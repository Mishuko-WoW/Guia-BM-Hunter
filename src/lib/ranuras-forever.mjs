// Ranuras del BiS de WoW Forever y qué puede equipar un Cazador.
// Lo usan BisForever.astro (maniquí), el editor local (scripts/editor-local/) y
// scripts/gen-forever-catalogo.mjs. Es .mjs (no .ts) para poder importarlo también desde Node.
//
// `acepta` = texto de la ranura tal como sale en el tooltip es-ES de Wowhead Forever
// (Cabeza, Hombro, Alhaja, Una mano, Mano secundaria…). Comprobado el 18-11-2026.

/** @typedef {{ id: string, label: string, lado: 'izq' | 'der' | 'armas', icono: string, acepta: string[], nota?: string }} Ranura */

/** Orden = orden en la página (columna izquierda, derecha y fila de armas). @type {Ranura[]} */
export const RANURAS = [
  { id: 'cabeza', label: 'Cabeza', lado: 'izq', icono: 'inventoryslot_head', acepta: ['Cabeza'] },
  { id: 'cuello', label: 'Cuello', lado: 'izq', icono: 'inventoryslot_neck', acepta: ['Cuello'] },
  { id: 'hombros', label: 'Hombros', lado: 'izq', icono: 'inventoryslot_shoulder', acepta: ['Hombro'] },
  { id: 'espalda', label: 'Espalda', lado: 'izq', icono: 'inventoryslot_chest', acepta: ['Espalda'] },
  { id: 'pecho', label: 'Pecho', lado: 'izq', icono: 'inventoryslot_chest', acepta: ['Pecho'] },
  { id: 'munecas', label: 'Muñecas', lado: 'izq', icono: 'inventoryslot_wrists', acepta: ['Muñeca'] },
  { id: 'manos', label: 'Manos', lado: 'izq', icono: 'inventoryslot_hands', acepta: ['Manos'] },
  { id: 'cintura', label: 'Cintura', lado: 'der', icono: 'inventoryslot_waist', acepta: ['Cintura'] },
  { id: 'piernas', label: 'Piernas', lado: 'der', icono: 'inventoryslot_legs', acepta: ['Piernas'] },
  { id: 'pies', label: 'Pies', lado: 'der', icono: 'inventoryslot_feet', acepta: ['Pies'] },
  { id: 'anillo1', label: 'Anillo 1', lado: 'der', icono: 'inventoryslot_finger', acepta: ['Dedo'] },
  { id: 'anillo2', label: 'Anillo 2', lado: 'der', icono: 'inventoryslot_finger', acepta: ['Dedo'] },
  { id: 'abalorio1', label: 'Abalorio 1', lado: 'der', icono: 'inventoryslot_trinket', acepta: ['Alhaja'] },
  { id: 'abalorio2', label: 'Abalorio 2', lado: 'der', icono: 'inventoryslot_trinket', acepta: ['Alhaja'] },
  { id: 'principal', label: 'Cuerpo a cuerpo', lado: 'armas', icono: 'inventoryslot_mainhand', acepta: ['Una mano', 'Mano principal', 'Dos manos'], nota: 'Arma de una o dos manos' },
  { id: 'secundaria', label: 'Mano secundaria', lado: 'armas', icono: 'inventoryslot_offhand', acepta: ['Una mano', 'Mano secundaria', 'Sostener con la mano izquierda'], nota: 'Segunda arma (sin escudos)' },
  { id: 'distancia', label: 'A distancia', lado: 'armas', icono: 'inventoryslot_ranged', acepta: ['A distancia', 'Arma arrojadiza'], nota: 'Arco, arma de fuego o ballesta' },
  { id: 'municion', label: 'Munición', lado: 'armas', icono: 'inventoryslot_ammo', acepta: ['Munición'], nota: 'Flechas o balas' },
  { id: 'carcaj', label: 'Carcaj o bolsa de munición', lado: 'armas', icono: 'inventoryslot_bag', acepta: ['Carcaj', 'Bolsa de munición'] },
];

/** Tipos de objeto que un Cazador puede llevar (tooltip es-ES de Wowhead Forever) */
export const TIPOS_HUNTER = [
  'Tela', 'Cuero', 'Malla', 'Miscelánea',
  'Hacha', 'Espada', 'Arma de asta', 'Bastón', 'Daga', 'Arma de puño',
  'Arco', 'Arma de fuego', 'Ballesta', 'Arrojadizas',
  'Flecha', 'Bala',
];
/** Tipos que un Cazador NO puede llevar → motivo para el editor */
export const TIPOS_NO = {
  Placas: 'es de placas', Maza: 'es una maza', Escudo: 'es un escudo', Varita: 'es una varita',
  Libram: 'es un libram', Ídolo: 'es un ídolo', Tótem: 'es un tótem', 'Caña de pescar': 'es una caña de pescar',
};

/** Texto de ranura del tooltip («Carcaj de 18 casillas» → «Carcaj») */
export const ranuraBase = (slot = '') => slot.replace(/ de \d+ casillas$/, '');

/** Ranuras del maniquí donde cabe un objeto con ese texto de ranura */
export const ranurasDe = (slot) => RANURAS.filter((r) => r.acepta.includes(ranuraBase(slot))).map((r) => r.id);

/**
 * ¿Lo puede equipar un Cazador? `o` = { slot, tipo, clases? } (ver objeto-wowhead.mjs).
 * @returns {{ ok: true, ranuras: string[] } | { ok: false, motivo: string }}
 */
export function paraHunter(o) {
  if (o.clases?.length && !o.clases.includes('Cazador')) return { ok: false, motivo: `solo para ${o.clases.join(', ')}` };
  if (o.tipo && TIPOS_NO[o.tipo]) return { ok: false, motivo: TIPOS_NO[o.tipo] };
  if (o.tipo && !TIPOS_HUNTER.includes(o.tipo)) return { ok: false, motivo: `tipo «${o.tipo}» desconocido: pídeselo a Claude` };
  const ranuras = ranurasDe(o.slot);
  if (!ranuras.length) return { ok: false, motivo: o.slot ? `la ranura «${o.slot}» no está en el BiS` : 'no es un objeto equipable' };
  return { ok: true, ranuras };
}
