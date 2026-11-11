# Guía Hunter BM — guiahunterbm.com

Guía en español de Beast Mastery Hunter (WoW Midnight S2). Autor: Mishuko. Responder siempre en español.

## Stack y comandos
- Astro 6, sitio estático de **una sola página** con pestañas. Node ≥ 22.
- `npm run dev` → http://localhost:4321 (recarga en caliente)
- `npm run build` → valida contenido (`scripts/check-content.mjs`) + genera `dist/`. **Ejecutar siempre antes de commit.**
- Deploy: push a `main` → GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages (~40 s).
  Ver estado: `"/c/Program Files/GitHub CLI/gh.exe" run list -L 1` (gh no está en el PATH de bash).
- Se trabaja directamente en `main` salvo que el usuario pida rama.

## Flujo obligatorio antes de publicar (push)
1. `npm run build` sin errores.
2. Levantar la web en local (`npx astro preview --port 4321`, en segundo plano) y comprobarla en el navegador: la pestaña afectada se ve bien y no hay errores de consola nuevos (ignorar el CORS de Wowhead).
3. Dar al usuario el enlace **http://localhost:<puerto>/#<pestaña>** (usar el puerto que imprime astro; si 4321 está ocupado usa 4322…) para que la revise él mismo.
4. Hacer push **solo** cuando el usuario lo apruebe. Después, confirmar que el deploy termina en `success`.

## Lista de cambios (changelog) — en cada actualización de contenido
- Añadir **al principio** de `src/content/data/changelog.json` una entrada por cambio visible:
  `{ "fecha": "AAAA-MM-DD", "pestana": "<data-tab>", "texto": "Actualización de", "enlace": "Nombre visible" }`
  → se pinta como «14 Oct. 2026: Actualización de [Nombre visible](#pestana)».
- Lenguaje para el visitante (qué cambia para él), **nunca** cambios técnicos (refactors, CSS, arreglos de código): esos no llevan entrada.
- La cabecera muestra las 2 más recientes (`CHANGELOG_VISIBLE` en `Header.astro`); el resto queda como historial.
- De aquí salen automáticamente: "Última revisión" de cada sección (última entrada de su pestaña) y la fecha del footer (última entrada global). No editar esas fechas a mano.
- El build valida fecha real, pestaña existente (data-tab de `TabBar.astro`) y campos no vacíos.
- Proponer el texto de la entrada al usuario junto con el enlace local, antes del push.

## Dónde está cada cosa
| Quiero cambiar… | Archivo |
|---|---|
| Cabecera, aviso de parche (`PARCHE`) | `src/components/Header.astro` |
| Lista de cambios, fechas de revisión y del footer | `src/content/data/changelog.json` (lógica en `src/lib/changelog.ts`) |
| Pestañas (lista `TABS`) | `src/components/TabBar.astro` |
| Orden de secciones, footer | `src/components/guide/GuideContent.astro` |
| `<head>`, SEO, Analytics (GA4 con page_view por hash) | `src/layouts/MainLayout.astro` |
| Pestaña X | `src/components/Seccion<X>.astro` (`<div id="tab-<id>" class="tab-panel">`) |
| Builds de talentos (strings, notas) | `src/content/builds/*.md` → renderizado en JS (`renderBuilds`) |
| Opener / rotación (un `.md` por build) | `src/content/opener/*.md`, `src/content/rotacion/*.md` → `PanelesHeroe.astro` + `Bloques.astro`. Intro y textos fijos de la pestaña en `SeccionOpener/Rotacion.astro` |
| Catálogo de hechizos (icono, clase sp/pr/bf, tipo, tooltip) | `src/content/data/spells.json` (helpers en `src/lib/spells.ts`) |
| Jefes de raid | `src/content/Bosses/*.md` (sección **oculta**: comentada en `SeccionTalentos.astro`) |
| BiS y consumibles | **HTML a mano** en `SeccionBiS.astro` (1700 líneas, estilos propios dentro). `bis.json` NO se usa (datos viejos) |
| Esquemas de contenido (zod) | `src/content.config.ts` |

Pestañas válidas (`data-tab`): mecanicas, talentos, estadisticas, rotacion, opener (oculta, va con rotacion), bis, mascotas, macros, simulacion, coaching, errores, examen-st, examen-aoe.

## Formato de Rotación y Opener
Cada `.md` = un botón del selector: `id`, `orden`, `boton`, `heroe` (pack-leader | dark-ranger), `oculto` (true = muestra "en desarrollo") y `bloques`, en orden:
`caja` (info|warn|tip|crit + titulo + texto) · `columnas` (titulo, color, pasos[{icono?, texto}]) · `cadena` (pasos del opener con tono sp|pr|bf|gold y nota) · `pasos` (titulo + lista[{icono?, pre?, texto}]) · `filas` (+ compacto) · `subtitulo` · `separador`. Esquema zod en `src/content.config.ts`.
Mini-formato de texto (`src/lib/markup.ts`): `[[Hechizo]]` (tooltip/clase del catálogo), `[[Hechizo|tooltip propio]]`, `[[Hechizo|tooltip|tipo|clase]]`, `[[Hechizo>Texto]]`, `**negrita**`, `*cursiva*`, `!!alerta roja!!`. `icono` = nombre de icono Wowhead (`ability_hunter_barbedshot`) o URL; si falta se usa el del primer `[[hechizo]]`. Todo `[[hechizo]]` debe existir en `spells.json` (lo valida el build).

## JavaScript (`public/scripts/bm-guide.js`, ~1090 líneas, sin bundler)
Script clásico global (funciones llamadas desde `onclick` en el HTML). Secciones, buscar con `grep -n "// ───"`:
TABS (`showTab`, `syncTabFromHash`) · TOGGLE (`setPanel` para Rotación/Opener, `setBuild` para Talentos) · TOOLTIP · QUIZ ENGINE + PREGUNTAS ST/AoE · BIS TRACKER (`bisCheck`, `BIS_TOTAL`) · TALENT COPY · BOSS DATA (`SPELL_REGISTRY`, `autoLink`) · BUILDS RENDERER · BOSS PANEL · REPORT MODAL (webhook Discord).
- Datos de Astro llegan vía `window.BM_BUILDS_DATA` / `window.BM_BOSS_DATA` (inyectados en `src/pages/index.astro`).
- Si un elemento puede no existir (secciones ocultas), proteger con `if (el)`: un error corta el resto del script.
- Navegación: `#<tab>` en la URL abre la pestaña (los enlaces internos deben ser `href="#bis"`, nunca URL absoluta).

## Estilos (marca Mishuko)
Orden de carga en `MainLayout.astro`: `tokens.css` → `bm-guide.css` (heredado) → `marca.css` (manda).
- `src/styles/tokens.css`: **única fuente** de colores, fuentes, esquinas cortadas (`--clip-card`, `--clip-btn`) y movimiento. Marca `--brand` #c4d70b (verde del logo), `--pl` ámbar (Pack Leader), `--dr` violeta (Dark Ranger). Los nombres antiguos (`--accent`, `--orange`…) son alias.
- `src/styles/marca.css`: cabecera (`.mk-header`), pestañas (`.mk-tabs`/`.mk-tab`), títulos, cajas, tarjetas, listas, selectores, hechizos, tooltip, footer, animaciones y móvil. Estilos nuevos van aquí.
- `src/styles/bm-guide.css` (~2.2k líneas): estilos heredados por sección; localizar con `grep -n "/\* ───"` y leer solo ese rango. No añadir colores fijos: usar variables.
- Nunca colores hex sueltos ni emojis en títulos (`.box-title`, `.card-header`, `.col-header`): las cajas ya llevan icono por tipo (`box-info|warn|tip|crit`).
- Logo y derivados en `public/brand/` (favicon, apple-touch, `og-image.png` 1200×630 para Discord/redes).
- Respetar `prefers-reduced-motion` (ya resuelto en tokens.css).

## Reglas para ahorrar contexto
- **No leer enteros** `SeccionBiS.astro`, `SeccionSimulacion.astro`, `bm-guide.css`, `marca.css`, `bm-guide.js`: usar `grep -n` y leer con offset/limit.
- Ignorar: `node_modules/`, `dist/`, `.astro/`, `backups/`, `logs/`, `proyecto_completo.txt`, `package-lock.json`, `talent_strings.json`.
- Para cambiar contenido (textos, builds, opener, rotación) editar el `.md`/`.json`, no los componentes.

## Gotchas
- "Última revisión" (BiS, Talentos) sale del changelog (`src/lib/sectionDates.ts`); solo si la pestaña no tiene entradas usa el último commit (por eso `fetch-depth: 0` en el workflow).
- Archivos con CRLF (Windows); el validador lo acepta. Habilidades en openers/rotaciones deben existir en `spells.json` o el build falla.
- Tooltips de Wowhead (`power.js`) no cargan en localhost (CORS); en producción sí.
- Imágenes remotas permitidas: `wow.zamimg.com`, `assets.rpglogs.com` (`astro.config.mjs`).
