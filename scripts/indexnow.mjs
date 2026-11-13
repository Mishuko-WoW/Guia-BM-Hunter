// Avisa a Bing, Yandex y demás buscadores de IndexNow de las URL del sitemap publicado.
// Uso (después de que el deploy termine): node scripts/indexnow.mjs
// La clave está en public/<clave>.txt (debe estar publicada en https://guiahunterbm.com/<clave>.txt).
import fs from 'node:fs';

const HOST = 'guiahunterbm.com';
const KEY = fs.readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.slice(0, -4);
if (!KEY) throw new Error('No hay archivo de clave IndexNow en public/');

const xml = await (await fetch(`https://${HOST}/sitemap-0.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`${urlList.length} URL del sitemap`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: HTTP ${res.status} ${res.statusText}`); // 200 o 202 = aceptado
