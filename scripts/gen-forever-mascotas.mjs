// Genera src/content/data/forever-mascotas.json: familias de mascotas de WoW Forever, su habilidad propia,
// habilidades comunes y, para cada habilidad, qué bestia domesticar (Alianza y Horda) para el rango más bajo
// y el más alto con fuente conocida (más uno intermedio si tiene más de 3 rangos), con enlace a Wowhead.
//
// Uso: node scripts/gen-forever-mascotas.mjs
// - Rangos y bestias: Petopia Forever (wow-petopia.com/forever/abilities.php).
// - Nombres de bestias y zonas en español: tooltips de Wowhead Forever (es-ES).
// - Familias, nombres de habilidades en español y descripciones: comprobados en Wowhead Forever (es) para el
//   vídeo 3 del proyecto TikTok (guion 2026-11-16_habilidad-familia.md). Ojo: la habilidad del murciélago
//   (Explosión sónica) no está en Petopia, solo en Wowhead.
import fs from 'node:fs';
import path from 'node:path';

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
const OUT = path.join(process.cwd(), 'src', 'content', 'data', 'forever-mascotas.json');

// ─── Habilidades: id de Petopia → nombre es, icono, descripción (rango 1, en palabras sencillas) ───
const HABILIDADES = {
  // propias de familia
  charge: { nombre: 'Embestir', icono: 'ability_hunter_pet_boar', desc: 'Carga contra el enemigo, lo inmoviliza 1 s y su siguiente golpe pega más.' },
  furioushowl: { nombre: 'Aullido furioso', icono: 'ability_hunter_pet_wolf', desc: 'Aumenta el poder de ataque cuerpo a cuerpo de tu grupo cercano durante 1 min.' },
  prowl: { nombre: 'Acechar', icono: 'ability_druid_supriseattack', desc: 'Entra en sigilo (se mueve a la mitad de velocidad) y su primer golpe hace un 20% más de daño.' },
  web: { nombre: 'Telaraña', icono: 'spell_nature_web', desc: 'Inmoviliza al enemigo 4 s y le hace daño de Naturaleza.' },
  scorpidpoison: { nombre: 'Veneno de escórpido', icono: 'ability_poisonsting', desc: 'Daño de Naturaleza en el tiempo que se acumula hasta 5 veces.' },
  shellshield: { nombre: 'Escudo de caparazón', icono: 'ability_hunter_pet_turtle', desc: 'Recibe un 50% menos de daño durante 12 s, pero ataca más lento (y más fuerte).' },
  thunderstomp: { nombre: 'Pisotón de trueno', icono: 'ability_hunter_pet_gorilla', desc: 'Daño de Naturaleza a todos los enemigos a 8 m.' },
  lightningbreath: { nombre: 'Aliento de relámpagos', icono: 'spell_nature_lightning', desc: 'Daño de Naturaleza a distancia a un objetivo. Ignora la armadura.' },
  swipe: { nombre: 'Flagelo', icono: 'inv_misc_monsterclaw_03', desc: 'Golpea a la vez a hasta 3 enemigos cercanos.' },
  savagerend: { nombre: 'Desgarro salvaje', icono: 'ability_hunter_pet_raptor', desc: 'Hace sangrar al enemigo durante 18 s.' },
  tendonrip: { nombre: 'Desgarre de tendón', icono: 'ability_hunter_pet_hyena', desc: 'Daño y reduce un 50% la velocidad de movimiento del enemigo.' },
  pinch: { nombre: 'Pellizco', icono: 'ability_hunter_pet_crab', desc: 'Daño instantáneo y reduce un 50% la velocidad de movimiento del enemigo.' },
  dismember: { nombre: 'Desmembramiento', icono: 'ability_hunter_pet_crocolisk', desc: 'Daño y reduce la sanación que recibe el enemigo. No se acumula con Golpe mortal.' },
  dustcloud: { nombre: 'Nube de polvo', icono: 'spell_nature_sleep', desc: 'Reduce la armadura del enemigo durante 30 s. No se acumula con Fuego feérico.' },
  'mine!': { nombre: '¡Mío!', icono: 'spell_nature_natureswrath', desc: 'Daño y desarma al enemigo unos segundos.' },
  demoralizingscreech: { nombre: 'Chirrido desmoralizador', icono: 'ability_hunter_pet_bat', desc: 'Daño y reduce el poder de ataque de los enemigos cercanos durante 30 s. No se acumula con Rugido desmoralizador.' },
  trickstersdance: { nombre: 'Baile de timador', icono: 'ability_hunter_aspectofthefox', desc: 'Un 50% más de esquivar y ataca más rápido durante 12 s.' },
  sonicblast: { nombre: 'Explosión sónica', icono: 'ability_vehicle_sonicshockwave', desc: 'Daño de Naturaleza y hace que los hechizos del enemigo sean un 30% más lentos durante 20 s.' },
  // comunes (se aprenden domesticando)
  bite: { nombre: 'Mordedura', icono: 'ability_druid_ferociousbite', desc: 'Muerde al enemigo. Ataque principal de casi todas las familias.' },
  claw: { nombre: 'Zarpa', icono: 'ability_druid_rake', desc: 'Araña al enemigo. Ataque principal de las familias sin Mordedura y de otras.' },
  // Wowhead es la llama "Diligencia"; en el juego sale "Carrerilla" (confirmado por Mishuko, 2026-11-13)
  dash: { nombre: 'Carrerilla', icono: 'ability_druid_dash', desc: 'Un 40% más de velocidad de movimiento durante 15 s.' },
  dive: { nombre: 'Lanzada', icono: 'spell_shadow_burningspirit', desc: 'Un 40% más de velocidad de movimiento durante 15 s (la versión de las que vuelan).' },
  cower: { nombre: 'Pavor', icono: 'ability_druid_cower', desc: 'Reduce la amenaza que genera tu mascota.' },
};

// ─── Familias (orden alfabético en español) ───
const FAMILIAS = [
  { id: 'jabali', nombre: 'Jabalí', en: 'Boar', icono: 'ability_hunter_pet_boar', propia: 'charge', ataque: ['bite'], mov: 'dash', dieta: 'Pan, queso, pescado, fruta, hongos y carne' },
  { id: 'lobo', nombre: 'Lobo', en: 'Wolf', icono: 'ability_hunter_pet_wolf', propia: 'furioushowl', ataque: ['bite'], mov: 'dash', dieta: 'Carne' },
  { id: 'felino', nombre: 'Felino', en: 'Cat', icono: 'ability_hunter_pet_cat', propia: 'prowl', ataque: ['bite', 'claw'], mov: 'dash', dieta: 'Pescado y carne' },
  { id: 'arana', nombre: 'Araña', en: 'Spider', icono: 'ability_hunter_pet_spider', propia: 'web', ataque: ['bite'], mov: 'dash', dieta: 'Carne' },
  { id: 'escorpido', nombre: 'Escórpido', en: 'Scorpid', icono: 'ability_hunter_pet_scorpid', propia: 'scorpidpoison', ataque: ['claw'], mov: 'dash', dieta: 'Carne' },
  { id: 'tortuga', nombre: 'Tortuga', en: 'Turtle', icono: 'ability_hunter_pet_turtle', propia: 'shellshield', ataque: ['bite'], mov: 'dash', dieta: 'Pan, pescado, fruta y hongos' },
  { id: 'gorila', nombre: 'Gorila', en: 'Gorilla', icono: 'ability_hunter_pet_gorilla', propia: 'thunderstomp', ataque: ['bite'], mov: 'dash', dieta: 'Pan, fruta y hongos' },
  { id: 'serpiente', nombre: 'Serpiente alada', en: 'Wind Serpent', icono: 'ability_hunter_pet_windserpent', propia: 'lightningbreath', ataque: ['bite'], mov: 'dive', dieta: 'Pan, queso y pescado' },
  { id: 'oso', nombre: 'Oso', en: 'Bear', icono: 'ability_hunter_pet_bear', propia: 'swipe', ataque: ['bite', 'claw'], mov: 'dash', dieta: 'Pan, queso, pescado, fruta, hongos y carne', nueva: true },
  { id: 'raptor', nombre: 'Raptor', en: 'Raptor', icono: 'ability_hunter_pet_raptor', propia: 'savagerend', ataque: ['bite', 'claw'], mov: 'dash', dieta: 'Carne', nueva: true },
  { id: 'hiena', nombre: 'Hiena', en: 'Hyena', icono: 'ability_hunter_pet_hyena', propia: 'tendonrip', ataque: ['bite'], mov: 'dash', dieta: 'Carne', nueva: true },
  { id: 'cangrejo', nombre: 'Cangrejo', en: 'Crab', icono: 'ability_hunter_pet_crab', propia: 'pinch', ataque: ['claw'], mov: 'dash', dieta: 'Pan, pescado, fruta y hongos', nueva: true },
  { id: 'crocolisco', nombre: 'Crocolisco', en: 'Crocolisk', icono: 'ability_hunter_pet_crocolisk', propia: 'dismember', ataque: ['bite'], mov: 'dash', dieta: 'Pescado y carne', nueva: true },
  { id: 'zancudo', nombre: 'Zancudo', en: 'Tallstrider', icono: 'ability_hunter_pet_tallstrider', propia: 'dustcloud', ataque: ['bite'], mov: 'dash', dieta: 'Pan, queso, fruta y hongos', nueva: true },
  { id: 'rapaz', nombre: 'Ave rapaz', en: 'Bird of Prey', icono: 'ability_hunter_pet_owl', propia: 'mine!', ataque: ['claw'], mov: 'dive', dieta: 'Pescado y carne', nueva: true },
  { id: 'carronero', nombre: 'Carroñero', en: 'Carrion Bird', icono: 'ability_hunter_pet_vulture', propia: 'demoralizingscreech', ataque: ['bite', 'claw'], mov: 'dive', dieta: 'Pescado y carne', nueva: true },
  { id: 'murcielago', nombre: 'Murciélago', en: 'Bat', icono: 'ability_hunter_pet_bat', propia: 'sonicblast', ataque: ['bite'], mov: 'dive', dieta: 'Fruta y hongos', nueva: true },
  { id: 'zorro', nombre: 'Zorro', en: 'Fox', icono: 'ability_hunter_aspectofthefox', propia: 'trickstersdance', ataque: ['bite'], mov: 'dash', dieta: 'Fruta y carne', nueva: true, familiaNueva: true },
];
const COMUNES = ['bite', 'claw', 'dash', 'dive', 'cower'];

// ─── Zonas: facción (A = Alianza, H = Horda; sin entrada = compartida) ───
const ZONA_FACCION = {
  'Dun Morogh': 'A', 'Elwynn Forest': 'A', Teldrassil: 'A', Darkshore: 'A', Westfall: 'A', 'Loch Modan': 'A',
  'Redridge Mountains': 'A', Duskwood: 'A', Wetlands: 'A', 'Stormwind City': 'A', 'Darkshore; Ashenvale': 'A',
  'Westfall; Redridge Mountains': 'A', 'Excavation Site: Wetlands (Dungeon)': 'A',
  Durotar: 'H', Mulgore: 'H', 'Tirisfal Glades': 'H', 'Silverpine Forest': 'H', 'The Barrens': 'H',
  'Ruins of Lordaeron (Dungeon)': 'H',
};
// Zona de Petopia (inglés) → id de zona de Wowhead, para sacar su nombre oficial en español
const ZONA_ID = {
  'Alterac Mountains': 36, 'Arathi Highlands': 45, Ashenvale: 331, Azshara: 16, Badlands: 3,
  'Blackfathom Deeps (Dungeon)': 719, 'Blackrock Depths (Dungeon)': 1584, 'Blackrock Spire (Dungeon)': 1583,
  'Blasted Lands': 4, 'Burning Steppes': 46, Darkshore: 148, Desolace: 405, 'Dun Morogh': 1, Durotar: 14,
  Duskwood: 10, 'Dustwallow Marsh': 15, 'Eastern Plaguelands': 139, 'Elwynn Forest': 12, Felwood: 361,
  Feralas: 357, 'Hillsbrad Foothills': 267, 'Loch Modan': 38, Mulgore: 215, 'Razorfen Kraul (Dungeon)': 491,
  'Redridge Mountains': 44, 'Scarlet Monastery (Dungeon)': 796, 'Searing Gorge': 51, Silithus: 1377,
  'Silverpine Forest': 130, 'Stonetalon Mountains': 406, 'Stormwind City': 1519, 'Stranglethorn Vale': 33,
  'Swamp of Sorrows': 8, Tanaris: 440, Teldrassil: 141, 'The Barrens': 17, 'The Hinterlands': 47,
  "The Temple of Atal'Hakkar (Dungeon)": 1477, 'Thousand Needles': 400, 'Tirisfal Glades': 85,
  'Uldaman (Dungeon)': 1337, "Un'Goro Crater": 490, 'Wailing Caverns (Dungeon)': 718,
  'Western Plaguelands': 28, Westfall: 40, Wetlands: 11, Winterspring: 618, "Zul'Gurub (Raid)": 1977,
};
const esMazmorra = (z) => /\((Dungeon|Raid)\)/.test(z);
const nivelMin = (n) => Number(String(n.nivel).split('-')[0]) || 99;

function elegir(npcs, faccion) {
  const coste = (n) => {
    const f = ZONA_FACCION[n.zona];
    return (f === faccion ? 0 : f ? 30 : 10) + (esMazmorra(n.zona) ? 20 : 0) + nivelMin(n) / 100;
  };
  return [...npcs].sort((a, b) => coste(a) - coste(b))[0] ?? null;
}

// ─── Petopia ───
const txt = (s = '') => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, ' ').trim();
const html = await (await fetch('https://www.wow-petopia.com/forever/abilities.php', { headers: UA })).text();
const petopia = {};
for (const s of html.split(/<h3 class='guide_heading[^']*' id='/).slice(1)) {
  const id = s.slice(0, s.indexOf("'"));
  const rangos = [];
  for (const r of s.split(/<li id='/).slice(1)) {
    const head = txt((r.match(/abilityrankname[^']*'>[\s\S]*?<\/span>[^<]*/) || [])[0]);
    const m = head.match(/(\d+)\s*:\s*Pet Level (\d+), Cost (\d+) TP/);
    const npcs = [...r.matchAll(/npc=(\d+)'>([^<]+)<\/a>\s*\(([^()]*(?:\([^)]*\))?[^()]*)\)/g)].map((x) => {
      const p = x[3].split(',').map((v) => v.trim());
      return { id: Number(x[1]), en: x[2].trim(), familia: p[0], nivel: p[1], zona: p.slice(2).join(', ') };
    });
    if (m) rangos.push({ rango: Number(m[1]), nivelMascota: Number(m[2]), pi: Number(m[3]), npcs });
    if (/<\/ul>\s*<hr/.test(r)) break;
  }
  petopia[id] = rangos;
}

// ─── Wowhead (es): nombre de bestia y zona ───
const cacheZona = {};
async function json(url) {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url, { headers: UA });
    if (r.ok) return r.json();
    await new Promise((res) => setTimeout(res, 700));
  }
  return null;
}
// Zona en español: cada zona de Petopia (puede ser "A; B") por su id de Wowhead; si no hay id, se deja tal cual
async function zonaEs(zonaPetopia) {
  const partes = [];
  for (const z of zonaPetopia.split(';').map((s) => s.trim())) {
    const zid = ZONA_ID[z];
    if (zid && !(zid in cacheZona)) cacheZona[zid] = (await json(`https://nether.wowhead.com/forever/tooltip/zone/${zid}?locale=6`))?.name ?? null;
    const nombre = (zid && cacheZona[zid]) || z.replace(/\s*\((Dungeon|Raid)\)/, '');
    partes.push(esMazmorra(z) ? `${nombre} (${/Raid/.test(z) ? 'banda' : 'mazmorra'})` : nombre);
  }
  return partes.join(' / ');
}

async function bestia(n, faccion) {
  if (!n) return null;
  const t = await json(`https://nether.wowhead.com/forever/tooltip/npc/${n.id}?locale=6`);
  return {
    npc: n.id,
    nombre: t?.name || n.en,
    nivel: n.nivel,
    zona: await zonaEs(n.zona),
    faccionZona: ZONA_FACCION[n.zona] ?? (esMazmorra(n.zona) ? 'M' : 'C'),
    otraFaccion: (ZONA_FACCION[n.zona] ?? faccion) !== faccion,
    url: `https://www.wowhead.com/forever/es/npc=${n.id}`,
  };
}

const habilidades = {};
for (const [id, h] of Object.entries(HABILIDADES)) {
  const rangos = petopia[id] ?? [];
  const conFuente = rangos.filter((r) => r.npcs.length);
  // Rangos que se muestran: el más bajo, uno intermedio (si hay más de 3 rangos) y el más alto, todos con fuente conocida
  const elegidos = [];
  if (conFuente.length) {
    elegidos.push(conFuente[0]);
    if (rangos.length > 3) {
      const objetivo = Math.ceil(rangos.length / 2);
      const medio = [...conFuente].sort((a, b) => Math.abs(a.rango - objetivo) - Math.abs(b.rango - objetivo))[0];
      if (medio && !elegidos.includes(medio) && medio !== conFuente.at(-1)) elegidos.push(medio);
    }
    if (!elegidos.includes(conFuente.at(-1))) elegidos.push(conFuente.at(-1));
  }
  const doma = [];
  for (const r of elegidos) {
    doma.push({
      rango: r.rango, nivelMascota: r.nivelMascota, pi: r.pi,
      esMax: r.rango === rangos.length,
      alianza: await bestia(elegir(r.npcs, 'A'), 'A'),
      horda: await bestia(elegir(r.npcs, 'H'), 'H'),
    });
  }
  habilidades[id] = {
    ...h, id,
    rangos: rangos.length || null,
    rangoMaxConFuente: conFuente.at(-1)?.rango ?? null,
    doma,
  };
  console.log(`${h.nombre}: ${rangos.length} rangos, doma ${doma.map((d) => `R${d.rango} A:${d.alianza?.nombre ?? '-'} H:${d.horda?.nombre ?? '-'}`).join(' · ') || 'sin datos'}`);
}

const familias = FAMILIAS.map((f) => ({
  ...f,
  aprende: COMUNES.filter((c) => f.ataque.includes(c) || f.mov === c || c === 'cower'),
}));

fs.writeFileSync(
  OUT,
  JSON.stringify({ fuente: 'Petopia Forever + Wowhead Forever (es-ES), 2026-11-13', familias, comunes: COMUNES, habilidades }, null, 2) + '\n',
);
console.log('Escrito', OUT);
