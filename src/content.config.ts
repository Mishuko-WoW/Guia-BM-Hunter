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

const rotacionesUi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rotaciones-ui' }),
  schema: z.object({
    id: z.string(),
    panelId: z.string(),
    hidden: z.boolean().default(false),
    heroBoxTitle: z.string().optional(),
    heroBoxText: z.string().optional(),
    stTitle: z.string(),
    stItems: z.array(
      z.object({
        spell: z.string().optional(),
        icon: z.string().url().optional(),
        alt: z.string().optional(),
        text: z.string(),
      }),
    ).default([]),
    aoeTitle: z.string(),
    aoeItems: z.array(
      z.object({
        spell: z.string().optional(),
        icon: z.string().url().optional(),
        alt: z.string().optional(),
        text: z.string(),
      }),
    ).default([]),
    extraBoxes: z.array(
      z.object({
        className: z.string(),
        title: z.string(),
        text: z.string(),
      }),
    ).default([]),
    order: z.number().default(0),
  }),
});

const openersUi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/openers-ui' }),
  schema: z.object({
    id: z.string(),
    panelId: z.string(),
    hidden: z.boolean().default(false),
    chainSteps: z.array(
      z.object({
        text: z.string(),
        sub: z.string().optional(),
        tone: z.enum(['sp', 'pr', 'bf', 'gold']).default('sp'),
      }),
    ).default([]),
    warning: z
      .object({
        title: z.string(),
        text: z.string(),
      })
      .optional(),
    detailTitle: z.string(),
    steps: z.array(
      z.object({
        pre: z.string().optional(),
        spell: z.string().optional(),
        icon: z.string().url().optional(),
        alt: z.string().optional(),
        text: z.string(),
      }),
    ).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { builds, jefes, rotacionesUi, openersUi };