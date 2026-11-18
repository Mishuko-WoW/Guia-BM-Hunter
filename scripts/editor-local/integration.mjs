// ─── EDITOR LOCAL (solo `npm run dev`) ───
// Permite a Mishuko editar textos y colores de bloque de Forever desde el navegador, en localhost.
// Seguridad: nada de esto existe en `npm run build` ni en la web publicada:
//   - el script del navegador solo se inyecta con command === 'dev';
//   - los endpoints /__editor/* solo existen en el servidor de desarrollo (astro:server:setup);
//   - solo aceptan POST desde la propia máquina (127.0.0.1 / ::1), con Host y Origin localhost
//     y la cabecera X-Editor-Local (otra web abierta en el navegador no puede llamarlos);
//   - solo escriben en una lista fija de archivos de contenido de Forever.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import yaml from 'js-yaml';
import { RANURAS } from '../../src/lib/ranuras-forever.mjs';
import { leerObjeto, idDeTexto } from './objeto-wowhead.mjs';

const DATA = 'src/content/data';
const PAGINAS = 'src/content/forever/paginas';
const COLORES = `${DATA}/forever-colores.json`;
// Generados por scripts (se sobrescriben al regenerar) o escritos por su propio endpoint: no se editan como texto
const NO_EDITABLES = new Set(['forever-talentos.json', 'forever-mascotas.json', 'forever-objetos.json', 'forever-colores.json', 'forever-bis-catalogo.json']);
// BiS de Forever: pieza elegida por ranura (/__editor/bis) y catálogo de objetos que se pueden elegir (/__editor/objeto)
const EQUIPO = `${DATA}/forever-bis-equipo.json`;
const CATALOGO = `${DATA}/forever-bis-catalogo.json`;
export const COLORES_VALIDOS = ['marca', 'ambar', 'violeta', 'oro', 'verde', 'rojo'];
export const SELECTOR_VALIDO = /^#[A-Za-z][\w-]*( > [a-z][a-z0-9]*:nth-of-type\(\d{1,3}\))*$/;

function archivos() {
  const json = fs.readdirSync(DATA)
    .filter((f) => /^(forever-[\w-]+|faq-forever)\.json$/.test(f) && !NO_EDITABLES.has(f))
    .map((f) => `${DATA}/${f}`);
  const md = fs.readdirSync(PAGINAS).filter((f) => f.endsWith('.md')).map((f) => `${PAGINAS}/${f}`);
  return [...json, ...md];
}

const FM = /^---\r?\n([\s\S]*?)\r?\n---/;
function leer(file) {
  const texto = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.json')) return { texto, datos: JSON.parse(texto) };
  const m = texto.match(FM);
  return { texto, fm: m?.[1] ?? '', datos: m ? yaml.load(m[1]) : {} };
}

function cadenas(obj, ruta = [], out = []) {
  if (typeof obj === 'string') out.push({ ruta, raw: obj });
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) cadenas(v, [...ruta, k], out);
  return out;
}
const valorEn = (obj, ruta) => ruta.reduce((o, k) => (o == null ? o : o[k]), obj);

const ENT = { '&amp;': '&', '&quot;': '"', '&lt;': '<', '&gt;': '>', '&#39;': "'", '&nbsp;': ' ' };
const plano = (html) =>
  html.replace(/<[^>]*>/g, '').replace(/&(amp|quot|lt|gt|#39|nbsp);/g, (e) => ENT[e]).replace(/\s+/g, ' ').trim();

async function buscar(server, textos) {
  const { md } = await server.ssrLoadModule('/src/lib/markup.ts');
  const todas = [];
  for (const file of archivos()) {
    try {
      for (const c of cadenas(leer(file).datos)) if (c.raw.trim().length > 1) todas.push({ file, ...c, p: plano(md(c.raw)), p2: plano(c.raw) });
    } catch { /* archivo con error: se ignora */ }
  }
  // Del bloque pulsado hacia fuera: primero coincidencia exacta, luego "el texto es parte de una cadena"
  for (const t of textos) {
    const exactas = todas.filter((c) => c.p === t || c.p2 === t);
    if (exactas.length) return { texto: t, coincidencias: exactas };
  }
  for (const t of textos) {
    if (t.length < 25) continue;
    const parciales = todas.filter((c) => c.p.includes(t));
    if (parciales.length) return { texto: t, coincidencias: parciales, parcial: true };
  }
  return { coincidencias: [] };
}

function guardar(file, ruta, antes, despues) {
  if (!archivos().includes(file)) throw new Error('Archivo no permitido');
  if (typeof despues !== 'string' || !despues.trim()) throw new Error('El texto no puede quedar vacío');
  const { texto, fm, datos } = leer(file);
  if (valorEn(datos, ruta) !== antes) throw new Error('El texto ha cambiado en el archivo; recarga la página');
  let nuevo;
  if (file.endsWith('.json')) {
    // Se cambia solo ese trozo del archivo (no se reescribe entero: respeta formato y números como 5.0).
    // Si el mismo texto sale varias veces, se cambia la aparición que corresponde a esta ruta.
    const lit = JSON.stringify(antes);
    const trozos = texto.split(lit);
    const rutas = cadenas(datos).filter((c) => c.raw === antes).map((c) => c.ruta.join('/'));
    const n = rutas.indexOf(ruta.join('/'));
    if (n < 0 || trozos.length - 1 !== rutas.length) throw new Error('No se pudo guardar con seguridad: pídeselo a Claude');
    nuevo = trozos.slice(0, n + 1).join(lit) + JSON.stringify(despues) + trozos.slice(n + 1).join(lit);
    const comprobado = JSON.parse(nuevo);
    if (valorEn(comprobado, ruta) !== despues) throw new Error('No se pudo guardar con seguridad: pídeselo a Claude');
    for (const c of cadenas(datos)) if (c.ruta.join('/') !== ruta.join('/') && valorEn(comprobado, c.ruta) !== c.raw) throw new Error('No se pudo guardar con seguridad: pídeselo a Claude');
  } else {
    if (fm.split(antes).length !== 2) throw new Error('Este texto está escrito de forma especial en el .md: pídeselo a Claude');
    const fmNuevo = fm.replace(antes, () => despues);
    let ok = false;
    try { ok = valorEn(yaml.load(fmNuevo), ruta) === despues; } catch { /* YAML roto */ }
    if (!ok) throw new Error('Ese cambio rompería el .md (comillas o dos puntos): pídeselo a Claude');
    nuevo = texto.replace(fm, () => fmNuevo);
  }
  fs.writeFileSync(file, nuevo);
}

function guardarColor(tab, selector, color) {
  if (!/^[a-z]+$/.test(tab)) throw new Error('Pestaña no válida');
  if (!SELECTOR_VALIDO.test(selector)) throw new Error('No se puede colorear este bloque');
  if (color !== null && !COLORES_VALIDOS.includes(color)) throw new Error('Color no válido');
  const texto = fs.existsSync(COLORES) ? fs.readFileSync(COLORES, 'utf8') : '{}';
  const datos = JSON.parse(texto || '{}');
  datos[tab] ??= {};
  if (color === null) delete datos[tab][selector];
  else datos[tab][selector] = color;
  if (!Object.keys(datos[tab]).length) delete datos[tab];
  fs.writeFileSync(COLORES, JSON.stringify(datos, null, 2) + '\n');
}

// ─── BiS de Forever: catálogo y pieza por ranura ───
const leerJson = (f, def) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : def);
const escribirJson = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');

/** Catálogo como lista (con id), del ilvl más alto al más bajo */
function catalogo() {
  const c = leerJson(CATALOGO, {});
  return Object.entries(c).map(([id, o]) => ({ id: Number(id), ...o })).sort((a, b) => (b.ilvl ?? 0) - (a.ilvl ?? 0) || a.nombre.localeCompare(b.nombre, 'es'));
}

/** Lee un objeto de Wowhead Forever, comprueba que un Cazador lo puede llevar y lo añade al catálogo */
async function anadirObjeto(texto) {
  const id = idDeTexto(texto);
  if (!id) throw new Error('Escribe el número del objeto o pega su enlace de Wowhead Forever (…/item=13404/…)');
  const o = await leerObjeto(id);
  const c = leerJson(CATALOGO, {});
  const { id: _, ...ficha } = o;
  c[id] = { ...ficha, ...(c[id]?.origen ? { origen: c[id].origen } : {}) };
  escribirJson(CATALOGO, Object.fromEntries(Object.entries(c).sort(([a], [b]) => a - b)));
  return { id, ...c[id] };
}

/** Pone (o quita, con id null) la pieza de una ranura de una fase (preraid, raid…) en forever-bis-equipo.json */
function guardarPieza(fase, ranura, id, origen) {
  const r = RANURAS.find((x) => x.id === ranura);
  if (!r) throw new Error('Ranura no válida');
  const todo = leerJson(EQUIPO, { imagen: null, fases: {} });
  if (!todo.fases?.[fase]) throw new Error('Fase no válida (pre-raid / raid)');
  const eq = todo.fases[fase];
  eq.ranuras ??= {};
  for (const x of RANURAS) if (!(x.id in eq.ranuras)) eq.ranuras[x.id] = null;
  let aviso = '';
  if (id == null) {
    eq.ranuras[ranura] = null;
  } else {
    const o = leerJson(CATALOGO, {})[id];
    if (!o) throw new Error('Ese objeto no está en el catálogo: añádelo primero con su ID o enlace');
    if (!o.ranuras.includes(ranura)) throw new Error(`«${o.nombre}» es de ${o.slot}: no va en ${r.label}`);
    const principal = eq.ranuras.principal && leerJson(CATALOGO, {})[eq.ranuras.principal.id];
    if (ranura === 'secundaria' && principal?.slot === 'Dos manos') throw new Error('Con un arma de dos manos no se puede llevar nada en la mano secundaria: quita primero el arma de dos manos');
    // Mismo objeto «Único» en las dos ranuras de anillo, abalorio o arma
    const pareja = { anillo1: 'anillo2', anillo2: 'anillo1', abalorio1: 'abalorio2', abalorio2: 'abalorio1', principal: 'secundaria', secundaria: 'principal' }[ranura];
    if (o.unico && pareja && eq.ranuras[pareja]?.id === id) throw new Error(`«${o.nombre}» es único: no se puede llevar dos veces`);
    const texto = typeof origen === 'string' ? origen.trim().slice(0, 300) : '';
    eq.ranuras[ranura] = { id, origen: texto };
    if (ranura === 'principal' && o.slot === 'Dos manos' && eq.ranuras.secundaria) {
      eq.ranuras.secundaria = null;
      aviso = 'Es de dos manos: se ha vaciado la mano secundaria.';
    }
    // Lo escrito en «Dónde se consigue» queda como sugerencia en el catálogo para la próxima vez
    if (texto) {
      const c = leerJson(CATALOGO, {});
      c[id].origen = texto;
      escribirJson(CATALOGO, c);
    }
  }
  eq.ranuras = Object.fromEntries(RANURAS.map((x) => [x.id, eq.ranuras[x.id] ?? null]));
  escribirJson(EQUIPO, todo);
  return aviso;
}

// ─── Publicar: (entrada opcional en changelog.json) → npm run build → commit SOLO de los archivos del editor
//     → abre publicar.bat en su propia ventana (push + IndexNow; Mishuko ve el progreso y el «Listo»).
const CHANGELOG = `${DATA}/changelog.json`;
let publicando = false;
const correr = (cmd, args) => new Promise((ok) => {
  const p = spawn(cmd, args, { shell: true, cwd: process.cwd() });
  let out = '';
  p.stdout.on('data', (d) => (out += d));
  p.stderr.on('data', (d) => (out += d));
  p.on('close', (code) => ok({ code, out: out.replace(/\x1b\[[0-9;]*m/g, '') }));
});
async function publicar(server, tab, nota) {
  if (publicando) throw new Error('Ya se está publicando');
  publicando = true;
  try {
    const hoy = new Date();
    const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    const ficheros = [...archivos(), COLORES, CATALOGO];
    const changelogAntes = fs.readFileSync(CHANGELOG, 'utf8');
    if (typeof nota === 'string' && nota.trim()) {
      const { TABS_FOREVER } = await server.ssrLoadModule('/src/lib/tabs.ts');
      const t = TABS_FOREVER.find((x) => x.id === tab);
      if (!t) throw new Error('Pestaña no válida para la lista de cambios');
      const entrada = { fecha, pestana: tab, texto: `${nota.trim().slice(0, 200)} en`, enlace: t.label.replace(/\s+1-60$/, ''), version: 'forever' };
      const txt = fs.readFileSync(CHANGELOG, 'utf8');
      const nl = txt.includes('\r\n') ? '\r\n' : '\n';
      const bloque = JSON.stringify(entrada, null, 2).split('\n').map((l) => '  ' + l).join(nl);
      fs.writeFileSync(CHANGELOG, txt.replace(/^\[\s*\r?\n/, `[${nl}${bloque},${nl}`));
      JSON.parse(fs.readFileSync(CHANGELOG, 'utf8')); // comprobación
      ficheros.push(CHANGELOG);
    }
    const build = await correr('npm', ['run', 'build']);
    if (build.code !== 0) fs.writeFileSync(CHANGELOG, changelogAntes); // sin publicar, sin entrada a medias
    if (build.code !== 0) throw new Error('La web tiene un error y NO se ha publicado. Pásale esto a Claude:\n\n' + build.out.split('\n').slice(-25).join('\n'));
    const estado = await correr('git', ['status', '--porcelain', '--', ...ficheros]);
    const cambiados = estado.out.split('\n').map((l) => l.slice(3).trim()).filter(Boolean);
    let hecho = 'No había cambios nuevos del editor';
    if (cambiados.length) {
      await correr('git', ['add', '--', ...cambiados]);
      const c = await correr('git', ['commit', '-m', `"Editor local: cambios de contenido de Forever (${fecha})"`, '--', ...cambiados]);
      if (c.code !== 0) throw new Error('No se pudo hacer el commit:\n' + c.out);
      hecho = `Commit hecho (${cambiados.length} archivo${cambiados.length > 1 ? 's' : ''})`;
    }
    spawn('cmd', ['/c', 'start', '"Publicar"', 'publicar.bat'], { shell: true, cwd: process.cwd(), detached: true, stdio: 'ignore' }).unref();
    return `${hecho}. Se ha abierto la ventana de publicar.bat: espera a que diga «Listo» y mira el tic verde en GitHub.`;
  } finally {
    publicando = false;
  }
}

const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
function permitido(req) {
  const ip = req.socket.remoteAddress ?? '';
  return (
    req.method === 'POST' &&
    ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip) &&
    LOCAL.test(req.headers.host ?? '') &&
    (!req.headers.origin || /^http:\/\//.test(req.headers.origin) && LOCAL.test(req.headers.origin.slice(7))) &&
    req.headers['x-editor-local'] === '1' &&
    (req.headers['content-type'] ?? '').startsWith('application/json')
  );
}

function cuerpo(req) {
  return new Promise((ok, mal) => {
    let s = '';
    req.on('data', (d) => { s += d; if (s.length > 200_000) { mal(new Error('Demasiado grande')); req.destroy(); } });
    req.on('end', () => { try { ok(JSON.parse(s)); } catch (e) { mal(e); } });
  });
}

export default function editorLocal() {
  return {
    name: 'editor-local',
    hooks: {
      'astro:config:setup': ({ command, injectScript }) => {
        if (command !== 'dev') return;
        injectScript('page', fs.readFileSync(new URL('./cliente.js', import.meta.url), 'utf8'));
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/__editor', async (req, res) => {
          const responder = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
          if (!permitido(req)) return responder(403, { error: 'Prohibido' });
          try {
            const b = await cuerpo(req);
            if (req.url === '/buscar') {
              const textos = (Array.isArray(b.textos) ? b.textos : []).filter((t) => typeof t === 'string' && t).slice(0, 6);
              const r = await buscar(server, textos);
              return responder(200, { ...r, coincidencias: r.coincidencias.map(({ file, ruta, raw }) => ({ file, ruta, raw })) });
            }
            if (req.url === '/guardar') {
              const lista = Array.isArray(b.lugares) ? b.lugares : [];
              for (const l of lista) guardar(l.file, l.ruta, l.antes, b.despues);
              return responder(200, { ok: true });
            }
            if (req.url === '/hechizos') {
              const { iconUrl } = await server.ssrLoadModule('/src/lib/spells.ts');
              const spells = JSON.parse(fs.readFileSync(`${DATA}/spells.json`, 'utf8'));
              const lista = Object.entries(spells).map(([n, s]) => ({ n, i: iconUrl(s.iconForever ?? s.icon) || '' }));
              return responder(200, { lista: lista.sort((a, b) => a.n.localeCompare(b.n, 'es')) });
            }
            if (req.url === '/publicar') return responder(200, { mensaje: await publicar(server, b.tab, b.nota) });
            if (req.url === '/catalogo') {
              const ranura = typeof b.ranura === 'string' ? b.ranura : '';
              const { iconUrl } = await server.ssrLoadModule('/src/lib/spells.ts');
              const lista = catalogo().filter((o) => !ranura || o.ranuras.includes(ranura)).map((o) => ({ ...o, img: iconUrl(o.icono) }));
              const fases = leerJson(EQUIPO, { fases: {} }).fases ?? {};
              return responder(200, { lista, equipo: fases[String(b.fase ?? '')]?.ranuras ?? {} });
            }
            if (req.url === '/objeto') {
              const { iconUrl } = await server.ssrLoadModule('/src/lib/spells.ts');
              const o = await anadirObjeto(String(b.texto ?? ''));
              return responder(200, { objeto: { ...o, img: iconUrl(o.icono) } });
            }
            if (req.url === '/bis') {
              const id = b.id == null ? null : Number(b.id);
              if (id !== null && !Number.isInteger(id)) throw new Error('ID no válido');
              return responder(200, { ok: true, aviso: guardarPieza(String(b.fase ?? ''), String(b.ranura ?? ''), id, b.origen) });
            }
            if (req.url === '/color') { guardarColor(b.tab, b.selector, b.color ?? null); return responder(200, { ok: true }); }
            responder(404, { error: 'No existe' });
          } catch (e) {
            responder(400, { error: e.message });
          }
        });
      },
    },
  };
}
