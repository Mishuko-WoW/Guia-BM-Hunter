import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const spellsPath = path.join(root, 'src', 'content', 'data', 'spells.json');
const spells = JSON.parse(fs.readFileSync(spellsPath, 'utf8'));
const spellNames = new Set(Object.keys(spells));

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function readFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  // \r? para aceptar saltos de línea de Windows (CRLF)
  const match = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    console.warn(`Aviso: ${filePath} no tiene frontmatter, se omite`);
    return null;
  }
  return yaml.load(match[1]);
}

// Todos los textos de un valor YAML (recursivo)
function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

// Rotación, Opener y páginas de Forever: cada [[Hechizo]] debe existir en spells.json
function validatePaneles(errors) {
  for (const dir of ['rotacion', 'opener', 'forever']) {
    for (const filePath of walk(path.join(root, 'src', 'content', dir))) {
      const data = readFrontmatter(filePath);
      if (!data) continue;
      if (!Array.isArray(data.bloques)) errors.push(`${filePath}: falta bloques[]`);
      for (const text of strings([data.bloques, data.intro])) {
        // [[Hechizo]] (etiqueta) y {{Hechizo}} (icono grande con nombre)
        for (const m of text.matchAll(/\[\[([^\]|>]+)|\{\{([^}|>]+)/g)) {
          const name = (m[1] ?? m[2]).trim();
          if (!spellNames.has(name)) {
            errors.push(`${filePath}: hechizo desconocido [[${name}]] (añádelo a spells.json)`);
          }
        }
      }
    }
  }
}

// Pestañas válidas por versión = ids de TABS_MIDNIGHT / TABS_FOREVER en src/lib/tabs.ts
function getValidTabs() {
  const src = fs.readFileSync(path.join(root, 'src', 'lib', 'tabs.ts'), 'utf8');
  const byRealm = {};
  for (const [, realm, body] of src.matchAll(/export const TABS_([A-Z]+)[^=]*=\s*\[([\s\S]*?)\];/g)) {
    byRealm[realm.toLowerCase()] = new Set([...body.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]));
  }
  return byRealm;
}

function validateChangelog(errors) {
  const file = path.join(root, 'src', 'content', 'data', 'changelog.json');
  let entries;
  try {
    entries = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (exc) {
    errors.push(`${file}: JSON no válido (${exc.message})`);
    return;
  }
  if (!Array.isArray(entries) || entries.length === 0) {
    errors.push(`${file}: debe ser una lista con al menos una entrada`);
    return;
  }
  const tabsByRealm = getValidTabs();
  entries.forEach((e, i) => {
    const version = e?.version ?? 'midnight';
    const tabs = tabsByRealm[version];
    if (!tabs) {
      errors.push(`${file}: entrada ${i + 1}: version "${version}" no existe. Válidas: ${Object.keys(tabsByRealm).join(', ')}`);
      return;
    }
    const where = `${file}: entrada ${i + 1}`;
    const fecha = e?.fecha;
    const d = new Date(`${fecha}T12:00:00Z`);
    const valid =
      typeof fecha === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(fecha) &&
      !Number.isNaN(d.getTime()) &&
      d.toISOString().startsWith(fecha);
    if (!valid) errors.push(`${where}: fecha debe ser AAAA-MM-DD real (tiene "${fecha}")`);
    if (!tabs.has(e?.pestana)) {
      errors.push(`${where}: pestana "${e?.pestana}" no existe en ${version}. Válidas: ${[...tabs].join(', ')}`);
    }
    for (const campo of ['texto', 'enlace']) {
      if (typeof e?.[campo] !== 'string' || !e[campo].trim()) {
        errors.push(`${where}: falta "${campo}"`);
      }
    }
  });
}

const errors = [];
validatePaneles(errors);
validateChangelog(errors);

if (errors.length > 0) {
  console.error('Validacion de contenido fallida:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Validacion de contenido OK');
