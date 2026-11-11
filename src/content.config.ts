import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const builds = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/builds' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    heroTalent: z.enum(['Pack Leader', 'Dark Ranger']),
    meta: z.boolean().default(false),
    header: z.string(),
    description: z.string(),
    copyString: z.string(),
    wowheadUrl: z.string().url().optional(),
    flexibleTalents: z.array(
      z.object({
        name: z.string(),
        note: z.string(),
      }),
    ).default([]),
    notes: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const jefes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/Bosses' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    difficulty: z.enum(['heroico', 'mitico']),
    image: z.string().url(),
    summary: z.string(),
    video: z.string().url().optional(),
    builds: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        rec: z.boolean(),
        heroTalent: z.enum(['Pack Leader', 'Dark Ranger']),
        string: z.string(),
        whUrl: z.string().url().optional(),
        wclUrl: z.string().url().optional(),
        lorrgsUrl: z.string().url().optional(),
        swaps: z.array(
          z.object({
            type: z.enum(['add', 'remove']),
            icon: z.string(),
            name: z.string(),
            badge: z.enum(['AÑADIR', 'QUITAR']),
            desc: z.string(),
          }),
        ).default([]),
        notes: z.array(
          z.object({
            type: z.enum(['crit', 'warn', 'tip', 'info']),
            text: z.string(),
          }),
        ).default([]),
      }),
    ).default([]),
    order: z.number().default(0),
  }),
});

// ─── Rotación y Opener: paneles formados por bloques ─────────────
// Texto con mini-formato: ver src/lib/markup.ts ([[Hechizo]], **negrita**…)
const texto = z.string();
const icono = z.string().optional(); // nombre de icono Wowhead o URL; si falta, el del primer [[hechizo]]

const bloque = z.union([
  z.object({ caja: z.enum(['info', 'warn', 'tip', 'crit']), titulo: texto.optional(), texto }),
  z.object({
    columnas: z.array(
      z.object({
        titulo: texto,
        color: z.string().optional(),
        pasos: z.array(z.object({ icono, texto })),
      }),
    ),
  }),
  z.object({
    cadena: z.array(
      z.object({ icono, texto, nota: texto.optional(), tono: z.enum(['sp', 'pr', 'bf', 'gold']).default('sp') }),
    ),
  }),
  z.object({
    pasos: z.object({
      titulo: texto,
      lista: z.array(z.object({ icono, pre: z.string().optional(), texto })),
    }),
  }),
  z.object({ filas: z.array(texto), compacto: z.boolean().optional() }),
  z.object({ subtitulo: texto }),
  z.object({ separador: z.literal(true) }),
]);

export type Bloque = z.infer<typeof bloque>;

const panel = z.object({
  id: z.string(),
  orden: z.number(),
  boton: z.string(),
  heroe: z.enum(['pack-leader', 'dark-ranger']),
  oculto: z.boolean().default(false), // true = botón visible, contenido "en desarrollo"
  bloques: z.array(bloque),
});

const rotacion = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rotacion' }),
  schema: panel,
});

const opener = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/opener' }),
  schema: panel,
});

export const collections = { builds, jefes, rotacion, opener };
