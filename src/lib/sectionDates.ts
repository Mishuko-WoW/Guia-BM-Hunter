import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

// Fecha de modificación en disco. Solo se usa como respaldo si git no está
// disponible: en GitHub Actions todos los archivos tienen la fecha del checkout.
function getLatestModifiedTime(filePath: string): Date {
  const stats = statSync(filePath);

  if (!stats.isDirectory()) {
    return stats.mtime;
  }

  return readdirSync(filePath).reduce((latest, entry) => {
    const entryTime = getLatestModifiedTime(resolve(filePath, entry));
    return entryTime > latest ? entryTime : latest;
  }, stats.mtime);
}

function git(args: string[]): string {
  return execFileSync('git', args, { cwd: process.cwd(), encoding: 'utf8' }).trim();
}

// Fecha del último commit que tocó alguna de las rutas. Si hay cambios sin
// commitear en ellas (trabajando en local), se usa la fecha actual.
function getLastCommitDate(sources: string[]): Date | null {
  try {
    if (git(['status', '--porcelain', '--', ...sources])) {
      return new Date();
    }
    const iso = git(['log', '-1', '--format=%cI', '--', ...sources]);
    return iso ? new Date(iso) : null;
  } catch {
    return null;
  }
}

export function getSectionReviewDate(sources: string[]): string {
  const date =
    getLastCommitDate(sources) ??
    sources
      .map((source) => getLatestModifiedTime(resolve(process.cwd(), source)))
      .reduce((latest, time) => (time > latest ? time : latest), new Date(0));

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date);
}
