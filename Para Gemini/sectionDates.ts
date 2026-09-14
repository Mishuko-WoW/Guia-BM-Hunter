import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

function getLatestModifiedTime(filePath: string): Date {
  const stats = statSync(filePath);

  if (!stats.isDirectory()) {
    return stats.mtime;
  }

  return readdirSync(filePath).reduce((latest, entry) => {
    const entryPath = resolve(filePath, entry);
    const entryTime = getLatestModifiedTime(entryPath);

    return entryTime > latest ? entryTime : latest;
  }, stats.mtime);
}

export function getSectionReviewDate(sources: string[]): string {
  const latestModified = sources.map((source) => resolve(process.cwd(), source)).reduce(
    (latest, sourcePath) => {
      const sourceTime = getLatestModifiedTime(sourcePath);
      return sourceTime > latest ? sourceTime : latest;
    },
    new Date(0),
  );

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(latestModified);
}