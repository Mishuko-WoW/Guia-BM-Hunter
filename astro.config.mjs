// @ts-check
import fs from 'node:fs';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
// Editor visual de Forever: solo existe con `npm run dev` (localhost), nunca en la web publicada
import editorLocal from './scripts/editor-local/integration.mjs';

// ─── Sitemap ───
// - Fuera las pestañas de Forever que aún no tienen contenido (llevan noindex): solo entran las que
//   tienen src/content/forever/paginas/<tab>.md o componente propio (FOREVER_CON_COMPONENTE).
// - lastmod = fecha del último cambio de esa pestaña en src/content/data/changelog.json.
const FOREVER_CON_COMPONENTE = ['coaching'];
const foreverConContenido = new Set([
  ...fs.readdirSync('./src/content/forever/paginas')
    .filter((f) => f.endsWith('.md'))
    // `noindex: true` en el .md (página visible pero aún no lista, p. ej. BiS sin objetos) → fuera del sitemap
    .filter((f) => !/^noindex:\s*true\s*$/m.test(fs.readFileSync(`./src/content/forever/paginas/${f}`, 'utf8')))
    .map((f) => f.slice(0, -3)),
  ...FOREVER_CON_COMPONENTE,
]);
const changelog = JSON.parse(fs.readFileSync('./src/content/data/changelog.json', 'utf8'));
const ultimaFecha = (realm, tab) =>
  changelog
    .filter((e) => (!realm || (e.version ?? 'midnight') === realm) && (!tab || e.pestana === tab))
    .map((e) => e.fecha)
    .sort()
    .at(-1);

/** /midnight/bis/ → ['midnight', 'bis'] · /forever/ → ['forever', 'mecanicas'] · / → [null, null] */
function partes(url) {
  const [realm, tab] = new URL(url).pathname.split('/').filter(Boolean);
  return realm ? [realm, tab ?? 'mecanicas'] : [null, null];
}

// https://astro.build/config
export default defineConfig({
  site: 'https://guiahunterbm.com/',
  base: '/',

  image: {
      domains: ['wow.zamimg.com', 'assets.rpglogs.com'],
	},

  integrations: [
    editorLocal(),
    sitemap({
      filter: (url) => {
        const [realm, tab] = partes(url);
        return realm !== 'forever' || foreverConContenido.has(tab);
      },
      serialize(item) {
        const [realm, tab] = partes(item.url);
        const fecha = realm ? ultimaFecha(realm, tab) ?? ultimaFecha(realm) : ultimaFecha();
        return fecha ? { ...item, lastmod: new Date(`${fecha}T12:00:00Z`).toISOString() } : item;
      },
    }),
  ],
});
