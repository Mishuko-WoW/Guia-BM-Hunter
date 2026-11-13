import fs from 'node:fs';
import path from 'node:path';
import spells from '../content/data/spells.json';

export type BadgeType = 'sp' | 'pr' | 'bf' | 'gold';

type SpellData = {
  icon: string;
  badge: BadgeType;
  type: string;
  desc: string;
  /** Icono en la guía Forever si es distinto (p. ej. Marca del cazador clásica) */
  iconForever?: string;
};

const catalog = spells as Record<string, SpellData>;

export function getSpell(name?: string): SpellData | undefined {
  return name ? catalog[name] : undefined;
}

// Iconos HD reescalados (scripts/icons-hd.mjs) en public/icons/<icono>.webp
const localIcons = new Set(
  (() => {
    try {
      return fs.readdirSync(path.join(process.cwd(), 'public', 'icons'));
    } catch {
      return [];
    }
  })()
    .filter((f) => f.endsWith('.webp'))
    .map((f) => f.slice(0, -5)),
);

// Acepta nombre de icono de Wowhead ("ability_hunter_barbedshot") o URL completa.
// Si hay versión HD local la usa; si no, la de wow.zamimg.com.
export function iconUrl(icon?: string): string | undefined {
  if (!icon) return undefined;
  if (icon.startsWith('http') || icon.startsWith('/')) return icon;
  return localIcons.has(icon) ? `/icons/${icon}.webp` : `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
}

/** Icono de un hechizo para la guía Forever (iconForever si existe) */
export function foreverIcon(name?: string): string | undefined {
  const sp = getSpell(name);
  return iconUrl(sp?.iconForever ?? sp?.icon);
}

// Icono explícito o, si no hay, el del primer [[hechizo]] del texto
export function resolveIcon(icon: string | undefined, text = ''): string | undefined {
  const first = text.match(/\[\[([^\]|>]+)/)?.[1]?.trim();
  return iconUrl(icon ?? getSpell(first)?.icon);
}
