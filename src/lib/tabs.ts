// Pestañas de cada guía. `id` = data-tab (y #ancla de la URL); debe existir <div id="tab-<id>">.
// El validador (scripts/check-content.mjs) lee estas listas para comprobar changelog.json.
export type Tab = { id: string; label: string; hidden?: boolean; cta?: boolean; nuevo?: boolean };

export const TABS_MIDNIGHT: Tab[] = [
  { id: 'mecanicas', label: 'General' },
  { id: 'talentos', label: 'Talentos' },
  { id: 'estadisticas', label: 'Stats' },
  { id: 'rotacion', label: 'Rotación y Opener' },
  { id: 'opener', label: 'Opener', hidden: true }, // comparte botón con Rotación
  { id: 'bis', label: 'BiS y Consumibles' },
  { id: 'mascotas', label: 'Mascotas' },
  { id: 'macros', label: 'Macros' },
  { id: 'simulacion', label: 'Simulación' },
  { id: 'coaching', label: 'Coaching', cta: true },
];

export const TABS_FOREVER: Tab[] = [
  { id: 'mecanicas', label: 'General' },
  { id: 'leveling', label: 'Leveling 1-60', nuevo: true },
  { id: 'talentos', label: 'Talentos' },
  { id: 'estadisticas', label: 'Stats' },
  { id: 'rotacion', label: 'Rotación y Opener' }, // incluye el inicio del combate (no hay pestaña Opener aparte)
  { id: 'bis', label: 'BiS y Consumibles' },
  { id: 'mascotas', label: 'Mascotas' },
  { id: 'macros', label: 'Macros' },
  { id: 'coaching', label: 'Coaching', cta: true },
];

export const TABS = { midnight: TABS_MIDNIGHT, forever: TABS_FOREVER } as const;
export type GuideRealm = keyof typeof TABS;

/** Icono del juego por pestaña (barra de pestañas y «Sigue con la guía») */
export const ICONO_TAB: Record<string, string> = {
  mecanicas: 'inv_scroll_03',
  leveling: 'inv_misc_map_01',
  talentos: 'ability_hunter_bestialdiscipline',
  estadisticas: 'spell_holy_blessingofagility',
  rotacion: 'ability_hunter_aimedshot',
  bis: 'inv_chest_leather_08',
  mascotas: 'ability_hunter_beasttaming',
  macros: 'inv_misc_note_01',
  simulacion: 'inv_misc_enggizmos_18',
  coaching: 'ability_hunter_eagleeye',
};
