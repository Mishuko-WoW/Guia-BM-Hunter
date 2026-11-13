import raw from '../content/data/changelog.json';

// Una entrada = un cambio visible para el visitante (nunca cambios técnicos).
// fecha: AAAA-MM-DD · pestana: data-tab de src/lib/tabs.ts · enlace: texto del link a la pestaña
// version: guía a la que pertenece ("midnight" si se omite, o "forever")
import type { GuideRealm } from './tabs';

export type ChangelogEntry = {
  fecha: string;
  pestana: string;
  texto: string;
  enlace: string;
  version?: GuideRealm;
};

// Más recientes primero (a igual fecha, se respeta el orden del JSON)
const all: ChangelogEntry[] = [...(raw as ChangelogEntry[])].sort((a, b) =>
  b.fecha.localeCompare(a.fecha),
);

// Entradas de una guía concreta
export function changelogFor(realm: GuideRealm = 'midnight'): ChangelogEntry[] {
  return all.filter((e) => (e.version ?? 'midnight') === realm);
}

// Compatibilidad: `changelog` = entradas de Midnight
export const changelog = changelogFor('midnight');

// Mediodía UTC para que la zona horaria nunca cambie el día
const toDate = (fecha: string) => new Date(`${fecha}T12:00:00Z`);

// "14 Oct. 2026"
export function formatShort(fecha: string): string {
  const d = toDate(fecha);
  const month = new Intl.DateTimeFormat('es-ES', { month: 'short', timeZone: 'UTC' })
    .format(d)
    .replace('.', '');
  return `${d.getUTCDate()} ${month.charAt(0).toUpperCase()}${month.slice(1)}. ${d.getUTCFullYear()}`;
}

// "14 de octubre de 2026"
export function formatLong(fecha: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(toDate(fecha));
}

// Fecha (AAAA-MM-DD) del último cambio anotado para una pestaña, o de toda la guía
export function latestChangeDate(pestana?: string, realm: GuideRealm = 'midnight'): string | undefined {
  return changelogFor(realm).find((e) => !pestana || e.pestana === pestana)?.fecha;
}
