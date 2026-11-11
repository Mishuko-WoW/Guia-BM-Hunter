import spells from '../content/data/spells.json';

export type BadgeType = 'sp' | 'pr' | 'bf' | 'gold';

type SpellData = {
  icon: string;
  badge: BadgeType;
  type: string;
  desc: string;
};

const catalog = spells as Record<string, SpellData>;

export function getSpell(name?: string): SpellData | undefined {
  return name ? catalog[name] : undefined;
}

// Acepta nombre de icono de Wowhead ("ability_hunter_barbedshot") o URL completa
export function iconUrl(icon?: string): string | undefined {
  if (!icon) return undefined;
  return icon.startsWith('http') ? icon : `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
}

// Icono explícito o, si no hay, el del primer [[hechizo]] del texto
export function resolveIcon(icon: string | undefined, text = ''): string | undefined {
  const first = text.match(/\[\[([^\]|>]+)/)?.[1]?.trim();
  return iconUrl(icon ?? getSpell(first)?.icon);
}
