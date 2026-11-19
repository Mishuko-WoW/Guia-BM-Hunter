// /llms.txt: índice de la guía para asistentes de IA (formato llmstxt.org, en Markdown).
// Se genera en cada build con los títulos y descripciones de seo.ts y los «En resumen» de resumen.json,
// así nunca se queda desfasado. Solo entran las páginas que también van al sitemap (Forever: con .md y sin noindex).
import fs from 'node:fs';
import { SEO, SITE, tabPath } from '../lib/seo';
import { TABS, type GuideRealm } from '../lib/tabs';
import resumen from '../content/data/resumen.json';

const plano = (t = '') =>
  t.replace(/\[\[([^\]|>]+)(?:\|[^\]>]*)?(?:>([^\]]+))?\]\]/g, (_, n, l) => (l ?? n).trim()).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');

const DIR_FOREVER = './src/content/forever/paginas';
function foreverConContenido(tab: string) {
  if (tab === 'coaching') return true;
  const f = `${DIR_FOREVER}/${tab}.md`;
  return fs.existsSync(f) && !/^noindex:\s*true\s*$/m.test(fs.readFileSync(f, 'utf8'));
}

function seccion(realm: GuideRealm, nombre: string) {
  const lineas = [`## ${nombre}`, ''];
  for (const t of TABS[realm]) {
    if (t.hidden || !SEO[realm][t.id]) continue;
    if (realm === 'forever' && !foreverConContenido(t.id)) continue;
    const meta = SEO[realm][t.id];
    const extra = (resumen[realm] as Record<string, string>)[t.id];
    lineas.push(`- [${meta.title}](${SITE}${tabPath(realm, t.id)}): ${meta.description}${extra ? ` En resumen: ${plano(extra)}` : ''}`);
  }
  return lineas.join('\n');
}

export function GET() {
  const texto = [
    '# Guía Hunter BM',
    '',
    '> Guía en español del Hunter BM (Cazador de Bestias o Maestro de bestias) de World of Warcraft, escrita por Mishuko, jugador de la clase. Cubre WoW Forever (talentos 31/20/0, rotación, mascotas, BiS pre-raid, macros y leveling 1-60) y WoW Midnight Temporada 2 (Pack Leader y Dark Ranger: talentos, rotación, opener, estadísticas y BiS).',
    '',
    'Cada pestaña de la guía es una página propia. La fecha de la última revisión de cada página aparece al final de la misma.',
    '',
    seccion('forever', 'WoW Forever'),
    '',
    seccion('midnight', 'WoW Midnight Temporada 2'),
    '',
    '## Autor',
    '',
    '- [Mishuko en YouTube](https://www.youtube.com/@Mishuko-wow): vídeos de Hunter BM.',
    '- [Mishuko en TikTok](https://www.tiktok.com/@mishuko.wow): consejos cortos de Cazador.',
    '',
  ].join('\n');
  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
