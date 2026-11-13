// Genera src/content/data/forever-talentos.json: árboles de talentos del Cazador en WoW Forever
// (posición, rangos, iconos, requisitos) + habilidades entrenables, con nombres y descripciones
// en español de los tooltips de Wowhead Forever (es-ES).
//
// Uso: node scripts/gen-forever-talentos.mjs
// Datos de posición e IDs sacados de la calculadora de Wowhead (wowhead.com/forever/es/talent-calc/hunter)
// y de la lista "Highest Trainable Ranks at Level 60" de su guía de leveling de BM (13-11-2026).
import fs from 'node:fs';
import path from 'node:path';

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
const OUT = path.join(process.cwd(), 'src', 'content', 'data', 'forever-talentos.json');

// [fila, columna, rangos, spellId, defId, icono]
const ARBOLES = [
  {
    id: 'bm', nombre: 'Dominio de bestias', icono: 'ability_hunter_bestialdiscipline',
    fondo: 'https://wow.zamimg.com/images/wow/talents/backgrounds/classicplus/361.jpg',
    talentos: [
      [0, 1, 5, 19552, 134422, 'spell_nature_ravenform'], [0, 2, 5, 19583, 134438, 'spell_nature_reincarnation'],
      [1, 0, 2, 1223755, 134437, 'inv_weapon_crossbow_10'], [1, 1, 3, 19549, 134436, 'ability_hunter_aspectofthemonkey'],
      [1, 2, 2, 24443, 134434, 'ability_hunter_beastsoothe'], [2, 0, 2, 19559, 134435, 'ability_mount_jungletiger'],
      [2, 1, 1, 19596, 134432, 'ability_druid_dash'], [2, 2, 5, 19616, 134431, 'ability_bullrush'],
      [3, 0, 2, 19572, 134430, 'ability_hunter_mendpet'], [3, 2, 5, 19598, 134429, 'inv_misc_monsterclaw_04'],
      [3, 3, 1, 1293241, 134428, 'ability_hunter_animalhandler'], [4, 0, 2, 19578, 134427, 'ability_druid_demoralizingroar'],
      [4, 1, 1, 19577, 134426, 'ability_devour'], [4, 3, 2, 19590, 134425, 'spell_nature_abolishmagic'],
      [5, 2, 5, 19621, 134424, 'inv_misc_monsterclaw_03'], [6, 1, 1, 19574, 134423, 'ability_druid_ferociousbite'],
    ],
    flechas: [[2, 1, 2], [4, 1, 2], [3, 2, 2]], // [fila, columna, filas hacia abajo]
  },
  {
    id: 'mm', nombre: 'Puntería', icono: 'ability_marksmanship',
    fondo: 'https://wow.zamimg.com/images/wow/talents/backgrounds/classicplus/363.jpg',
    talentos: [
      [0, 0, 3, 19498, 134478, 'ability_townwatch'], [0, 1, 5, 19407, 134477, 'spell_frost_stun'],
      [0, 2, 5, 19426, 134476, 'ability_searingarrow'], [1, 0, 3, 1310661, 142622, 'ability_hunter_quickshot'],
      [1, 1, 5, 19416, 134474, 'spell_frost_wizardmark'], [1, 2, 5, 1223984, 134473, 'ability_hunter_zenarchery'],
      [2, 0, 2, 415405, 134470, 'ability_hunter_rapidkilling'], [2, 1, 5, 19454, 134471, 'ability_impalingbolt'],
      [2, 3, 1, 415370, 134472, 'ability_mount_whitedirewolf'], [3, 1, 1, 1299346, 134469, 'ability_trueshot'],
      [3, 2, 5, 19485, 134467, 'ability_piercedamage'], [4, 0, 2, 1223987, 134464, 'ability_hunter_rapidregeneration'],
      [4, 2, 3, 19461, 134466, 'ability_upgrademoonglaive'], [4, 3, 1, 19503, 134465, 'ability_golemstormbolt'],
      [5, 2, 5, 19507, 134463, 'inv_weapon_rifle_06'], [6, 1, 1, 1310687, 134462, 'hunter_pvp_snipershot'],
    ],
    flechas: [[3, 1, 3], [2, 0, 2], [1, 2, 2]],
  },
  {
    id: 'sv', nombre: 'Supervivencia', icono: 'ability_hunter_swiftstrike',
    fondo: 'https://wow.zamimg.com/images/wow/talents/backgrounds/classicplus/362.jpg',
    talentos: [
      [0, 1, 5, 24293, 134461, 'inv_misc_head_dragon_black'], [0, 2, 5, 19295, 134460, 'ability_parry'],
      [1, 0, 5, 19184, 134459, 'spell_nature_stranglevines'], [1, 1, 2, 19159, 134458, 'ability_racial_bloodrage'],
      [1, 2, 5, 19255, 134457, 'spell_shadow_twilight'], [1, 3, 3, 19228, 134455, 'ability_rogue_trip'],
      [2, 0, 2, 19239, 134456, 'spell_nature_timestop'], [2, 1, 3, 19290, 134452, 'ability_kick'],
      [2, 2, 1, 19263, 134451, 'ability_whirlwind'], [3, 0, 2, 19376, 134453, 'ability_ensnare'],
      [3, 1, 5, 1310627, 142607, 'ability_dualwield'], [3, 2, 1, 19306, 134454, 'ability_warrior_challange'],
      [4, 0, 2, 440529, 134448, 'ability_hunter_resourcefulness'], [4, 1, 2, 1310532, 134450, 'ability_hunter_swiftstrike'],
      [4, 2, 2, 1310496, 142606, 'ability_hunter_mastertactitian'], [4, 3, 1, 1317257, 134446, 'ability_hunter_pet_tallstrider'],
      [5, 2, 5, 19168, 142605, 'spell_nature_invisibilty'], [6, 1, 1, 1310533, 134449, 'ability_gouge'],
    ],
    flechas: [[4, 1, 2], [2, 2, 1]],
  },
];

// Highest Trainable Ranks at Level 60: [nivel, spellId, rango, cambio (C=cambia de nivel, N=nuevo, T=ahora entrenable), icono]
const ENTRENABLES = `1,75,,,ability_whirlwind|1,1494,,,ability_tracking|4,13163,,,ability_hunter_aspectofthemonkey|8,5116,,,spell_frost_stun|10,883,,,ability_hunter_beastcall|10,2641,,,spell_nature_spiritwolf|10,6991,,,ability_hunter_beasttraining|10,982,,,ability_hunter_beastsoothe|10,1515,,,ability_hunter_beasttaming|10,19883,,,spell_holy_prayerofhealing|14,6197,,,ability_hunter_eagleeye|14,1002,,,ability_eyeoftheowl|18,2643,,C,ability_upgrademoonglaive|18,19884,,,spell_shadow_darksummoning|20,5118,,,ability_mount_jungletiger|22,3043,,C,ability_hunter_criticalshot|24,1462,,,ability_physical_taunt|24,19885,,,ability_stealth|26,3045,,,ability_hunter_runningshot|26,19880,,,spell_frost_summonwaterelemental|28,13809,,,spell_frost_freezingbreath|30,5384,,,ability_rogue_feigndeath|32,1543,,,spell_fire_flare|32,19878,,,spell_shadow_summonfelhunter|40,13159,,,ability_mount_whitetiger|40,19882,,,ability_racial_avatar|46,14327,3,,ability_druid_cower|48,14273,3,,ability_rogue_feint|50,24510,4,C,spell_nature_starfall|50,24464,4,C,spell_fire_firearmor|50,24478,4,C,spell_frost_frostward|50,24513,4,C,spell_nature_resistnature|50,24516,4,C,spell_shadow_antishadow|50,1264456,4,T,ability_hunter_pet_gorilla|50,19879,,,inv_misc_head_dragon_01|54,20910,4,C,ability_warrior_challange|54,14317,3,,spell_fire_selfdestruct|56,20190,2,,spell_nature_protectionformnature|56,14305,5,,spell_fire_flameshock|56,14266,8,,ability_meleedamage|56,14280,3,,ability_hunter_aimedshot|58,14325,4,,ability_hunter_snipershot|58,14271,4,,ability_hunter_swiftstrike|58,1310786,3,N,hunter_pvp_snipershot|58,14295,3,,ability_marksmanship|60,20904,6,C,inv_spear_07|60,14287,8,,ability_impalingbolt|60,1299447,4,C,ability_mount_pinktiger|60,25296,7,,spell_nature_ravenform|60,15632,6,,spell_arcane_blink|60,14311,3,,spell_frost_chainsofice|60,5049,10,C,spell_nature_unyeildingstamina|60,14927,7,C,ability_physical_taunt|60,1299332,4,N,ability_gouge|60,13544,7,,ability_hunter_mendpet|60,24632,10,C,spell_nature_spiritarmor|60,25295,9,,ability_hunter_quickshot|60,1293527,4,N,ability_hunter_animalhandler|60,19801,,,spell_nature_drowsy|60,20906,5,C,ability_trueshot|60,14268,3,,ability_rogue_trip`;

// (Quitado: 20 Baile de timador / Trickster's Dance, habilidad de la familia zorro sin descripción.)

// Coste de enseñanza en cobre ("Costo de enseñanza" de la ficha de cada hechizo en Wowhead Forever).
// Sin entrada = sin coste conocido (se aprende por misión, libro o es gratis).
const COSTE = {
  1494: 10, 13163: 100, 5116: 200, 19883: 400, 6197: 1200, 1002: 1200, 2643: 1684, 19884: 1684, 5118: 2210,
  3043: 7368, 1462: 7578, 19885: 7578, 3045: 7789, 19880: 7789, 13809: 7894, 5384: 8000, 1543: 10000, 19878: 10000,
  13159: 16842, 19882: 16842, 14327: 28000, 14273: 32000, 24510: 7200, 24464: 7200, 24478: 7200, 24513: 7200,
  24516: 7200, 19879: 36000, 20910: 38947, 14317: 42000, 20190: 46000, 14305: 46000, 14266: 46000, 14280: 46000,
  14325: 48000, 14271: 48000, 1310786: 41052, 14295: 48000, 20904: 44210, 14287: 50000, 1299447: 44210,
  15632: 50000, 14311: 50000, 5049: 10000, 14927: 10000, 13544: 50000, 24632: 10000, 1293527: 44210,
  20906: 44210, 14268: 50000,
};

// Habilidades que se enseñan a la MASCOTA (entrenador de mascotas / Entrenamiento de bestias), no al cazador
const MASCOTA = new Set([24510, 24464, 24478, 24513, 24516, 1264456, 5049, 14927, 24632]);

const clean = (h = '') =>
  h.replace(/<!--[\s\S]*?-->/g, '').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();

// Separa el tooltip en meta (coste, alcance, lanzamiento, reutilización) y descripción
function parse(html) {
  const desc = clean((html.match(/<div class="q">([\s\S]*?)<\/div>/) || [])[1]);
  const meta = [...html.matchAll(/<table width="100%"><tr><td>([\s\S]*?)<\/td><th>([\s\S]*?)<\/th>/g)]
    .flatMap((m) => [clean(m[1]), clean(m[2])])
    .filter(Boolean);
  return { meta: meta.join(' · '), desc };
}

async function tip(spell, def, rank) {
  const q = new URLSearchParams({ locale: '6', ...(def ? { def: String(def) } : {}), ...(rank ? { rank: String(rank) } : {}) });
  for (let i = 0; i < 3; i++) {
    const r = await fetch(`https://nether.wowhead.com/forever/tooltip/spell/${spell}?${q}`, { headers: UA });
    if (r.ok) return r.json();
    await new Promise((res) => setTimeout(res, 800));
  }
  throw new Error(`tooltip ${spell} rango ${rank}`);
}

const arboles = [];
for (const a of ARBOLES) {
  const talentos = [];
  for (const [fila, col, max, spell, def, icono] of a.talentos) {
    const rangos = [];
    let nombre = '';
    let meta = '';
    for (let r = 1; r <= max; r++) {
      const t = await tip(spell, def, r);
      nombre = t.name;
      const p = parse(t.tooltip);
      meta = p.meta;
      rangos.push(p.desc);
    }
    talentos.push({ id: `${a.id}-${fila}-${col}`, nombre, icono, fila, col, max, spell, meta, rangos });
    process.stdout.write(`${a.id} ${nombre} (${max})\n`);
  }
  const flechas = a.flechas.map(([f, c, n]) => ({ desde: `${a.id}-${f}-${c}`, hasta: `${a.id}-${f + n}-${c}` }));
  arboles.push({ id: a.id, nombre: a.nombre, icono: a.icono, fondo: a.fondo, talentos, flechas });
}

const entrenables = [];
for (const linea of ENTRENABLES.split('|')) {
  const [nivel, spell, rango, cambio, icono] = linea.split(',');
  const t = await tip(spell);
  const p = parse(t.tooltip);
  entrenables.push({
    nivel: Number(nivel), spell: Number(spell), nombre: t.name, icono,
    rango: rango ? Number(rango) : null,
    cambio: { C: 'Cambia de nivel', N: 'Nueva', T: 'Ahora entrenable' }[cambio] ?? null,
    mascota: MASCOTA.has(Number(spell)),
    coste: COSTE[spell] ?? null, // en cobre
    meta: p.meta, desc: p.desc,
  });
}
process.stdout.write(`${entrenables.length} habilidades entrenables\n`);

fs.writeFileSync(OUT, JSON.stringify({ fuente: 'Wowhead Forever (es-ES), 2026-11-13', arboles, entrenables }, null, 2) + '\n');
console.log('Escrito', OUT);
