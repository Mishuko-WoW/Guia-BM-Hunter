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
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return yaml.load(match[1]);
}

function validateSpell(name, filePath, field, errors) {
  if (!name) return;
  if (!spellNames.has(name)) {
    errors.push(`${filePath}: campo ${field} usa habilidad desconocida: ${name}`);
  }
}

function validateOpeners(errors) {
  const dir = path.join(root, 'src', 'content', 'openers-ui');
  for (const filePath of walk(dir)) {
    const data = readFrontmatter(filePath);
    if (!data) continue;
    if (!Array.isArray(data.steps)) {
      errors.push(`${filePath}: falta steps[]`);
      continue;
    }
    for (const step of data.steps) {
      validateSpell(step.spell, filePath, 'steps[].spell', errors);
      if (!step.text || typeof step.text !== 'string') {
        errors.push(`${filePath}: cada step necesita text`);
      }
    }
  }
}

function validateRotaciones(errors) {
  const dir = path.join(root, 'src', 'content', 'rotaciones-ui');
  for (const filePath of walk(dir)) {
    const data = readFrontmatter(filePath);
    if (!data) continue;
    for (const section of ['stItems', 'aoeItems']) {
      const arr = data[section];
      if (!Array.isArray(arr)) {
        errors.push(`${filePath}: falta ${section}[]`);
        continue;
      }
      for (const item of arr) {
        validateSpell(item.spell, filePath, `${section}[].spell`, errors);
        if (!item.text || typeof item.text !== 'string') {
          errors.push(`${filePath}: cada item en ${section} necesita text`);
        }
      }
    }
  }
}

const errors = [];
validateOpeners(errors);
validateRotaciones(errors);

if (errors.length > 0) {
  console.error('Validacion de contenido fallida:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Validacion de contenido OK');
