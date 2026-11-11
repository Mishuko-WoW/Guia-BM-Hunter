import { execFileSync } from 'node:child_process';
import { formatLong, latestChangeDate } from './changelog';

// "Última revisión" de una sección = fecha de la última entrada de esa pestaña
// en src/content/data/changelog.json. Así los cambios técnicos no la mueven.
// Si la pestaña aún no tiene entradas, se usa el último commit de `fallbackSources`.
export function getSectionReviewDate(pestana: string, fallbackSources: string[] = []): string {
  const fecha = latestChangeDate(pestana) ?? lastCommitDay(fallbackSources);
  return fecha ? formatLong(fecha) : '—';
}

function lastCommitDay(sources: string[]): string | undefined {
  if (!sources.length) return undefined;
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], {
      encoding: 'utf8',
    }).trim();
    return iso || undefined;
  } catch {
    return undefined;
  }
}
