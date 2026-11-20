// SEO y rutas de cada pestaña. Una pestaña = una página real:
//   /midnight/            → General (mecanicas)      /midnight/talentos/, /midnight/bis/…
//   /forever/             → General (mecanicas)      /forever/talentos/, /forever/mascotas/…
// "opener" no tiene página propia: vive en la página de Rotación (/<versión>/rotacion/#opener).
// Los enlaces antiguos con # (/#bis, /midnight/#bis) los redirige bm-guide.js a estas rutas.
import type { GuideRealm } from './tabs';
import faqMidnight from '../content/data/faq-midnight.json';
import faqForever from '../content/data/faq-forever.json';
import top5Mascotas from '../content/data/forever-mascotas-top5.json';
import fs from 'node:fs';
import path from 'node:path';

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
      description: 'Guía del Hunter BM (Maestro de bestias o Cazador de Bestias) en Midnight Temporada 2: talentos, rotación, opener, stats y BiS de Pack Leader y Dark Ranger.',
      h1sub: 'Maestro de bestias · Talentos, rotación y BiS',
    },
    talentos: {
      title: 'Talentos Hunter BM Midnight S2: builds de raid y M+',
      description: 'Builds de talentos del Cazador de Bestias en Midnight Temporada 2 para raid y Míticas+: Pack Leader y Dark Ranger, strings para copiar y talentos flexibles.',
      h1sub: 'Talentos del Maestro de bestias en Midnight',
    },
    estadisticas: {
      title: 'Stats Hunter BM Midnight S2: prioridad de estadísticas',
      description: 'Prioridad de estadísticas del Hunter BM (Cazador de Bestias) en Midnight Temporada 2 y por qué: qué subir primero en tu equipo.',
      h1sub: 'Estadísticas del Maestro de bestias en Midnight',
    },
    rotacion: {
      title: 'Rotación y opener Hunter BM Midnight S2: Cazador de Bestias',
      description: 'Rotación del Cazador de Bestias en Midnight Temporada 2 para un objetivo y AoE, y opener paso a paso con Pack Leader y Dark Ranger.',
      h1sub: 'Rotación y opener del Maestro de bestias',
    },
    bis: {
      title: 'BiS Hunter BM Midnight Temporada 2: equipo y consumibles',
      description: 'BiS del Hunter BM (Cazador de Bestias o Maestro de bestias) en Midnight Temporada 2: mejor equipo por ranura, encantamientos, gemas y consumibles.',
      h1sub: 'BiS y consumibles del Maestro de bestias',
    },
    mascotas: {
      title: 'Mejores mascotas Hunter BM Midnight: Cazador de Bestias',
      description: 'Mejores mascotas del Hunter BM (Cazador de Bestias) en Midnight Temporada 2: por qué la exótica Aqir, y Tenacidad en raid o Ferocidad en M+.',
      h1sub: 'Mascotas del Maestro de bestias en Midnight',
    },
    macros: {
      title: 'Macros Hunter BM Midnight: las imprescindibles',
      description: 'Macros del Hunter BM (Cazador de Bestias) en Midnight Temporada 2 para copiar: /petattack con Matar y Cólera de las bestias, y Contradisparo por foco.',
      h1sub: 'Macros del Maestro de bestias en Midnight',
    },
    simulacion: {
      title: 'Simular Hunter BM Midnight: Raidbots y Top Gear',
      description: 'Cómo simular tu Cazador de Bestias (Hunter BM) en Midnight con Raidbots paso a paso: Quick Sim, Top Gear, Droptimizer, Stat Weights y la Gran Cámara.',
      h1sub: 'Simulación del Maestro de bestias',
    },
    coaching: {
      title: 'Coaching Hunter BM Midnight: Cazador de Bestias con Mishuko',
      description: 'Coaching personalizado de Hunter BM (Cazador de Bestias) en Midnight con Mishuko: revisión de logs, rotación, talentos y plan de mejora.',
      h1sub: 'Coaching de Maestro de bestias',
    },
  },
  forever: {
    mecanicas: {
      title: 'Guía Hunter BM WoW Forever: Cazador de Bestias',
      description: 'Guía del Hunter BM (Cazador, Dominio de bestias) en WoW Forever: cambios frente a Classic, talentos 31/20/0, mascotas, razas y leveling 1-60.',
      h1sub: 'Cazador de Bestias en WoW Forever',
    },
    talentos: {
      title: 'Mejores talentos Hunter BM WoW Forever: build 31/20/0',
      description: 'Los mejores talentos del Cazador de Bestias en WoW Forever: build 31/20/0 para raid y mazmorras, orden del 10 al 60 y coste de cada rango.',
      h1sub: 'Talentos del Cazador de Bestias en WoW Forever',
    },
    estadisticas: {
      title: 'Stats Hunter BM WoW Forever: golpe al 8 % y prioridad',
      description: 'Prioridad de estadísticas del Cazador de Bestias (Hunter BM) en WoW Forever: daño de arma, golpe al 8 % con el pre-raid, agilidad y crítico.',
      h1sub: 'Estadísticas del Cazador de Bestias en WoW Forever',
    },
    rotacion: {
      title: 'Rotación Hunter BM WoW Forever: opener, un objetivo y AoE',
      description: 'Rotación del Cazador de Bestias (Hunter BM) en WoW Forever: cómo empezar el combate, prioridades para un objetivo y AoE, Invocar halcón y cooldowns.',
      h1sub: 'Rotación del Cazador de Bestias en WoW Forever',
    },
    bis: {
      title: 'BiS pre-raid Hunter BM WoW Forever: Cazador de Bestias',
      description: 'BiS pre-raid del Cazador de Bestias (Hunter BM) en WoW Forever: mejor equipo de nivel 60, dónde se consigue, munición, consumibles y encantamientos.',
      h1sub: 'BiS pre-raid del Cazador de Bestias en WoW Forever',
    },
    mascotas: {
      title: "Top 5 mascotas Hunter WoW Forever: Ta'shkal y dónde domarlas",
      description: "Top 5 pets del Hunter BM en WoW Forever y Ta'shkal, el gato secreto de Hyjal: dónde domesticarlas con mapa y coordenadas, y las 18 familias del Cazador.",
      h1sub: 'Mejores mascotas del Cazador en WoW Forever',
    },
    macros: {
      title: 'Macros Hunter WoW Forever: mascota y disparo automático',
      description: 'Macros del Cazador en WoW Forever para controlar a tu mascota y no perder Tiro automático, listas para copiar.',
      h1sub: 'Macros del Cazador en WoW Forever',
    },
    leveling: {
      title: 'Leveling Hunter WoW Forever 1-60 rápido: ruta y talentos',
      description: 'Sube tu Cazador de Bestias del 1 al 60 rápido en WoW Forever: ruta por niveles, talentos, qué comprar en el instructor, munición, carcaj y mejores pets.',
      h1sub: 'Leveling 1-60 del Cazador en WoW Forever',
    },
    coaching: {
      title: 'Coaching Hunter WoW Forever: Cazador de Bestias con Mishuko',
      description: 'Coaching personalizado de Cazador de Bestias en WoW Forever con Mishuko: rotación, mascota, talentos y plan de mejora.',
      h1sub: 'Coaching de Cazador en WoW Forever',
    },
  },
};

export const PORTADA: Meta = {
  title: 'Guía Hunter BM Forever y Midnight: Cazador de Bestias en español',
  description: 'Guía en español del Hunter BM (Cazador de Bestias o Maestro de bestias) por Mishuko: WoW Forever (talentos 31/20/0, mascotas y leveling 1-60) y Midnight Temporada 2 (talentos, rotación y BiS).',
  h1sub: '',
};

const NOMBRE_VERSION: Record<GuideRealm, string> = { midnight: 'Midnight', forever: 'WoW Forever' };
// Autor con sus redes (sameAs): ayuda a Google a saber quién escribe la guía (E-E-A-T)
const AUTOR = {
  '@type': 'Person',
  name: 'Mishuko',
  url: `${SITE}/`,
  jobTitle: 'Jugador y creador de contenido de Hunter BM en World of Warcraft',
  sameAs: ['https://www.youtube.com/@Mishuko-wow', 'https://www.tiktok.com/@mishuko.wow'],
};
const SITIO = { '@type': 'WebSite', name: 'Guía Hunter BM', url: `${SITE}/` };

/** JSON-LD de una página de guía: artículo + migas de pan */
export function guideJsonLd(realm: GuideRealm, tab: string, label: string, dateModified?: string, datePublished?: string) {
  const meta = SEO[realm][tab];
  const url = `${SITE}${tabPath(realm, tab)}`;
  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'Guía Hunter BM', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: NOMBRE_VERSION[realm], item: `${SITE}/${realm}/` },
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
      image: ogImagenes(realm, tab).jsonld.map((i) => `${SITE}${i}`),
      author: AUTOR,
      publisher: AUTOR,
      isPartOf: SITIO,
      ...(datePublished ? { datePublished } : {}),
      ...(dateModified ? { dateModified } : {}),
      about: ['Hunter Beast Mastery', 'Cazador de Bestias', 'Maestro de bestias', `World of Warcraft ${NOMBRE_VERSION[realm]}`],
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs },
    ...(FAQ[realm][tab]?.length ? [faqJsonLd(FAQ[realm][tab])] : []),
    ...(realm === 'forever' && tab === 'mascotas' ? [top5JsonLd(url)] : []),
  ];
}

/** Top 5 de mascotas de Forever como lista ordenada (ItemList): Google y su IA entienden el ranking */
function top5JsonLd(url: string) {
  const lista = [...top5Mascotas.mascotas].sort((a, b) => a.puesto - b.puesto);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Las mejores mascotas del Cazador (Hunter BM) en WoW Forever: Ta'shkal y el Top 5",
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: lista.length,
    itemListElement: lista.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1, // el #0 (Ta'shkal) va primero; schema.org cuenta desde 1
      name: `${m.nombre} (${m.familia}, nivel ${m.nivel}, ${m.zona})`,
      description: plano(m.porque),
      image: `${SITE}/pets/${m.id}.webp`,
      url: `${url}#pf-top5`,
    })),
  };
}

// ─── Preguntas frecuentes ───
// Textos en src/content/data/faq-<versión>.json. Se muestran al final de su pestaña con <Faq realm tab>
// y, aquí, como FAQPage (Google exige que las preguntas también se vean en la página).
// Leveling de Forever tiene su propio bloque de preguntas y su FAQPage (forever-leveling.json → LevelingForever.astro), por eso no está aquí.
export type FaqItem = { pregunta: string; respuesta: string };
export const FAQ: Record<GuideRealm, Record<string, FaqItem[]>> = {
  midnight: faqMidnight as Record<string, FaqItem[]>,
  forever: faqForever as Record<string, FaqItem[]>,
};

// Quita el mini-formato (**negrita**, [[Hechizo]]) para el texto plano del JSON-LD
const plano = (t: string) =>
  t.replace(/\[\[([^\]|>]+)(?:[|>][^\]]*)?\]\]/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');

function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'es',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: plano(it.respuesta) },
    })),
  };
}

/** JSON-LD de la portada */
export const PORTADA_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Guía Hunter BM',
    alternateName: ['Guía Cazador de Bestias', 'Guía Maestro de bestias', 'guiahunterbm.com'],
    url: `${SITE}/`,
    inLanguage: 'es',
    author: AUTOR,
    image: ['-1x1.webp', '-4x3.webp', '-16x9.webp'].map((x) => `${SITE}/og/portada${x}`),
    description: 'Guías en español del Hunter BM (Maestro de bestias o Cazador de Bestias) para WoW Midnight y WoW Forever.',
  },
];

export const OG: Record<'portada' | GuideRealm, { image: string; alt: string }> = {
  portada: { image: '/brand/og-image.png', alt: 'Guía Hunter BM de Mishuko' },
  midnight: { image: '/brand/og-image.png', alt: 'Guía Hunter BM de Mishuko — Midnight Temporada 2' },
  forever: { image: '/brand/og-forever.png', alt: 'Guía Hunter BM de Mishuko — WoW Forever' },
};

/**
 * Imágenes de una página (las genera scripts/og-images.mjs en public/og/, todo centrado para que el recorte
 * de la miniatura de Google no corte nada): og = 1200×630 para redes; jsonld = 1:1, 4:3 y 16:9 para Google.
 * Si falta la de una pestaña, se usa la general de la versión (OG).
 */
export function ogImagenes(realm: 'portada' | GuideRealm, tab = 'mecanicas') {
  const base = realm === 'portada' ? '/og/portada' : `/og/${realm}/${TAB_HOST[tab] ?? (tab || 'mecanicas')}`;
  const alt = realm === 'portada' ? OG.portada.alt : `${SEO[realm][TAB_HOST[tab] ?? tab]?.h1sub ?? OG[realm].alt} — Guía Hunter BM de Mishuko`;
  if (!fs.existsSync(path.join(process.cwd(), 'public', `${base}.jpg`))) {
    return { og: OG[realm].image, jsonld: [OG[realm].image], alt: OG[realm].alt, ancho: 1200, alto: 630 };
  }
  return { og: `${base}.jpg`, jsonld: ['-1x1.webp', '-4x3.webp', '-16x9.webp'].map((x) => `${base}${x}`), alt, ancho: 1200, alto: 630 };
}
