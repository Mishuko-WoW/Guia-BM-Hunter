import spells from '../content/data/spells.json';

type BadgeType = 'sp' | 'pr' | 'bf' | 'gold';

type SpellData = {
  icon: string;
  badge: BadgeType;
  type: string;
  desc: string;
};

const catalog = spells as Record<string, SpellData>;

export function getSpell(name?: string): SpellData | undefined {
  if (!name) return undefined;
  return catalog[name];
}

export function getBadgeClass(badge?: BadgeType): string {
  if (badge === 'pr') return 'pr';
  if (badge === 'bf') return 'bf';
  return 'sp';
}

export function getChainClass(tone?: BadgeType): string {
  if (tone === 'pr') return 'pr-step';
  if (tone === 'bf') return 'bf-step';
  if (tone === 'gold') return 'gold-step';
  return 'sp-step';
}

export function getSpellNames(): string[] {
  return Object.keys(catalog);
}
