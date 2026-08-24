// Script para obtener la fecha del último commit y guardarla en public/git-date.json
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

try {
  const date = execSync('git log -1 --format=%cd --date=iso-strict').toString().trim();
  writeFileSync('public/git-date.json', JSON.stringify({ date }));
  console.log('Fecha del último commit guardada en public/git-date.json:', date);
} catch (e) {
  console.error('No se pudo obtener la fecha del commit:', e);
  process.exit(1);
}
