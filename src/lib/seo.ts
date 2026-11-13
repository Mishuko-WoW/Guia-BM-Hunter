// SEO y rutas de cada pestaña. Una pestaña = una página real:
//   /midnight/            → General (mecanicas)      /midnight/talentos/, /midnight/bis/…
//   /forever/             → General (mecanicas)      /forever/talentos/, /forever/mascotas/…
// "opener" no tiene página propia: vive en la página de Rotación (/<versión>/rotacion/#opener).
// Los enlaces antiguos con # (/#bis, /midnight/#bis) los redirige bm-guide.js a estas rutas.
import type { GuideRealm } from './tabs';

export const SITE = 'https://guiahunterbm.com';

/** Pestañas que comparten página con otra (se muestran con un selector dentro) */
export const TAB_HOST: Record<string, string> = { opener: 'rotacion' };

export function tabPath(realm: GuideRealm, tab: string): string {
  const host = TAB_HOST[tab] ?? tab;
  const base = `/${realm}/`;
  const path = host === 'mecanicas' ? base : `${base}${host}/`;
  return TAB_HOST[tab] ? `${path}#${tab}` : path;
}

type Meta = { title: string; description: string; h1sub: string };

export const SEO: Record<GuideRealm, Record<string, Meta>> = {
  midnight: {
    mecanicas: {
      title: 'Guía Hunter BM Midnight S2 — Cazador de Bestias | Mishuko',
      description: 'Guía del Cazador de Bestias (Hunter BM) en WoW Midnight Temporada 2: talentos, rotación, opener, stats y BiS de Pack Leader y Dark Ranger.',
      h1sub: 'Cazador de Bestias · Talentos, rotación y BiS',
    },
    talentos: {
      title: 'Talentos Hunter BM Midnight S2: builds de raid y M+',
      description: 'Builds de talentos del Cazador de Bestias en Midnight Temporada 2 para raid y Míticas+: Pack Leader y Dark Ranger, strings para copiar y talentos flexibles.',
      h1sub: 'Talentos del Cazador de Bestias en Midnight',
    },
    estadisticas: {
      title: 'Stats Hunter BM Midnight S2: prioridad de estadísticas',
      description: 'Prioridad de estadísticas del Hunter BM (Cazador de Bestias) en Midnight Temporada 2 y por qué: qué subir primero en tu equipo.',
      h1sub: 'Estadísticas del Cazador de Bestias en Midnight',
    },
    rotacion: {
      title: 'Rotación y opener Hunter BM Midnight S2',
      description: 'Rotación del Cazador de Bestias en Midnight Temporada 2 para un objetivo y AoE, y opener paso a paso con Pack Leader y Dark Ranger.',
      h1sub: 'Rotación y opener del Cazador de Bestias',
    },
    bis: {
      title: 'BiS Hunter BM Midnight S2: equipo y consumibles',
      description: 'Equipo BiS del Cazador de Bestias (Hunter BM) en Midnight Temporada 2 por ranura, con encantamientos, gemas y consumibles.',
      h1sub: 'BiS y consumibles del Cazador de Bestias',
    },
    mascotas: {
      title: 'Mascotas Hunter BM Midnight: cuáles usar y para qué',
      description: 'Qué mascotas llevar como Cazador de Bestias (Hunter BM) en Midnight Temporada 2 y para qué situación.',
      h1sub: 'Mascotas del Cazador de Bestias en Midnight',
    },
    macros: {
      title: 'Macros Hunter BM Midnight: las imprescindibles',
      description: 'Macros útiles para el Hunter BM (Cazador de Bestias) en Midnight Temporada 2, listas para copiar y pegar.',
      h1sub: 'Macros del Cazador de Bestias en Midnight',
    },
    simulacion: {
      title: 'Simular Hunter BM Midnight: Raidbots y Top Gear',
      description: 'Cómo simular tu Cazador de Bestias (Hunter BM) en Midnight con Raidbots y Top Gear para elegir el mejor equipo.',
      h1sub: 'Simulación del Cazador de Bestias',
    },
    coaching: {
      title: 'Coaching Hunter BM Midnight con Mishuko',
      description: 'Coaching personalizado de Hunter BM (Cazador de Bestias) en Midnight con Mishuko: revisión de logs, rotación, talentos y plan de mejora.',
      h1sub: 'Coaching de Cazador de Bestias',
    },
  },
  forever: {
    mecanicas: {
      title: 'Guía Hunter WoW Forever: Cazador de Bestias (BM) | Mishuko',
      description: 'Guía del Hunter BM (Cazador, Dominio de bestias) en WoW Forever: cambios frente a Classic, talentos 31/20/0, mascotas, razas y leveling 1-60.',
      h1sub: 'Cazador de Bestias en WoW Forever',
    },
    talentos: {
      title: 'Talentos Hunter BM WoW Forever: build 31/20/0 y leveling',
      description: 'Árbol de talentos del Cazador de Bestias en WoW Forever: build de raid 31/20/0, orden de talentos para subir del 10 al 60 y coste de cada habilidad.',
      h1sub: 'Talentos del Cazador de Bestias en WoW Forever',
    },
    estadisticas: {
      title: 'Stats Hunter BM WoW Forever: prioridad de estadísticas',
      description: 'Prioridad de estadísticas del Cazador de Bestias (Hunter BM) en WoW Forever: golpe, agilidad, crítico y poder de ataque.',
      h1sub: 'Estadísticas del Cazador de Bestias en WoW Forever',
    },
    rotacion: {
      title: 'Rotación Hunter BM WoW Forever: un objetivo y AoE',
      description: 'Rotación y opener del Cazador de Bestias (Hunter BM) en WoW Forever con Invocar halcón, para un objetivo y para AoE.',
      h1sub: 'Rotación del Cazador de Bestias en WoW Forever',
    },
    bis: {
      title: 'BiS Hunter BM WoW Forever: equipo y consumibles',
      description: 'Equipo BiS y consumibles del Cazador de Bestias (Hunter BM) en WoW Forever por fase y ranura.',
      h1sub: 'BiS y consumibles del Cazador de Bestias',
    },
    mascotas: {
      title: 'Mascotas Hunter WoW Forever: familias y dónde domesticar',
      description: 'Las 18 familias de mascotas del Cazador en WoW Forever, su habilidad exclusiva y dónde domesticar cada rango para Alianza y Horda.',
      h1sub: 'Mascotas del Cazador en WoW Forever',
    },
    macros: {
      title: 'Macros Hunter WoW Forever: mascota y disparo automático',
      description: 'Macros del Cazador en WoW Forever para controlar a tu mascota y no perder Tiro automático, listas para copiar.',
      h1sub: 'Macros del Cazador en WoW Forever',
    },
    leveling: {
      title: 'Leveling Hunter WoW Forever 1-60: guía del Cazador',
      description: 'Cómo subir del 1 al 60 con el Cazador de Bestias en WoW Forever: hitos, habilidades, armas y consejos.',
      h1sub: 'Leveling 1-60 del Cazador en WoW Forever',
    },
    coaching: {
      title: 'Coaching Hunter WoW Forever con Mishuko',
      description: 'Coaching personalizado de Cazador de Bestias en WoW Forever con Mishuko: rotación, mascota, talentos y plan de mejora.',
      h1sub: 'Coaching de Cazador en WoW Forever',
    },
  },
};

export const PORTADA: Meta = {
  title: 'Guía Hunter BM y Cazador de Bestias: Midnight y WoW Forever',
  description: 'Guías en español del Hunter BM (Cazador de Bestias) por Mishuko: Midnight Temporada 2 y WoW Forever. Talentos, rotación, mascotas, BiS y leveling.',
  h1sub: '',
};

const NOMBRE_VERSION: Record<GuideRealm, string> = { midnight: 'Midnight', forever: 'WoW Forever' };
const AUTOR = { '@type': 'Person', name: 'Mishuko', url: `${SITE}/` };

/** JSON-LD de una página de guía: artículo + migas de pan */
export function guideJsonLd(realm: GuideRealm, tab: string, label: string, dateModified?: string) {
  const meta = SEO[realm][tab];
  const url = `${SITE}${tabPath(realm, tab)}`;
  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'Guía Hunter BM', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: `Guía Hunter BM ${NOMBRE_VERSION[realm]}`, item: `${SITE}/${realm}/` },
  ];
  if (tab !== 'mecanicas') crumbs.push({ '@type': 'ListItem', position: 3, name: label, item: url });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title,
      description: meta.description,
      inLanguage: 'es',
      url,
      mainEntityOfPage: url,
      image: `${SITE}${OG[realm].image}`,
      author: AUTOR,
      publisher: AUTOR,
      ...(dateModified ? { dateModified } : {}),
      about: ['Hunter Beast Mastery', 'Cazador de Bestias', `World of Warcraft ${NOMBRE_VERSION[realm]}`],
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs },
  ];
}

/** JSON-LD de la portada */
export const PORTADA_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Guía Hunter BM',
    alternateName: ['Guía Cazador de Bestias', 'guiahunterbm.com'],
    url: `${SITE}/`,
    inLanguage: 'es',
    author: AUTOR,
    description: 'Guías en español del Hunter BM (Cazador de Bestias) para WoW Midnight y WoW Forever.',
  },
];

export const OG: Record<'portada' | GuideRealm, { image: string; alt: string }> = {
  portada: { image: '/brand/og-image.png', alt: 'Guía Hunter BM de Mishuko' },
  midnight: { image: '/brand/og-image.png', alt: 'Guía Hunter BM de Mishuko — Midnight Temporada 2' },
  forever: { image: '/brand/og-forever.png', alt: 'Guía Hunter BM de Mishuko — WoW Forever' },
};
