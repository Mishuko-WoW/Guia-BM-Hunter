import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'src', 'content');
const backupsRoot = path.join(root, 'backups');

function pad(value) {
  return String(value).padStart(2, '0');
}

function makeTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

if (!fs.existsSync(source)) {
  console.error('No existe la carpeta src/content.');
  process.exit(1);
}

const target = path.join(backupsRoot, makeTimestamp(), 'content');
copyRecursive(source, target);
console.log(`Backup creado en: ${target}`);
