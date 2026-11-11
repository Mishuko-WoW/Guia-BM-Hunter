# Guía Hunter BM — guiahunterbm.com

Guía en español de Beast Mastery Hunter (WoW Midnight S2). Autor: Mishuko. Responder siempre en español.

## Stack y comandos
- Astro 6, sitio estático de **una sola página** con pestañas. Node ≥ 22.
- `npm run dev` → http://localhost:4321 (recarga en caliente)
- `npm run build` → valida contenido (`scripts/check-content.mjs`) + genera `dist/`. **Ejecutar siempre antes de commit.**
- Deploy: push a `main` → GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages (~40 s).
  Ver estado: `"/c/Program Files/GitHub CLI/gh.exe" run list -L 1` (gh no está en el PATH de bash).
- Se trabaja directamente en `main` salvo que el usuario pida rama.

## Dónde está cada cosa
| Quiero cambiar… | Archivo |
|---|---|
| Título, banner de parche, changelog de cabecera | `src/components/Header.astro` |
| Botones de pestañas | `src/components/TabBar.astro` |
| Orden de secciones, footer (fecha del autor) | `src/components/guide/GuideContent.astro` |
| `<head>`, SEO, Analytics (GA4 con page_view por hash) | `src/layouts/MainLayout.astro` |
| Pestaña X | `src/components/Seccion<X>.astro` (`<div id="tab-<id>" class="tab-panel">`) |
| Builds de talentos (strings, notas) | `src/content/builds/*.md` → renderizado en JS (`renderBuilds`) |
| Opener / rotación | `src/content/openers-ui/*.md`, `src/content/rotaciones-ui/*.md` → `src/components/opener|rotacion/*Mode.astro` |
| Catálogo de habilidades (icono, badge, desc) | `src/content/data/spells.json` (helpers en `src/lib/spells.ts`) |
| Jefes de raid | `src/content/Bosses/*.md` (sección **oculta**: comentada en `SeccionTalentos.astro`) |
| BiS y consumibles | **HTML a mano** en `SeccionBiS.astro` (1700 líneas, estilos propios dentro). `bis.json` NO se usa para pintar, solo para la fecha de revisión |
| Esquemas de contenido (zod) | `src/content.config.ts` |
| CMS visual | `public/admin/config.yml` (Decap; `npm run cms:proxy` en local) |

Pestañas válidas (`data-tab`): mecanicas, talentos, estadisticas, rotacion, opener (oculta, va con rotacion), bis, mascotas, macros, simulacion, coaching, errores, examen-st, examen-aoe.

## JavaScript (`public/scripts/bm-guide.js`, ~1090 líneas, sin bundler)
Script clásico global (funciones llamadas desde `onclick` en el HTML). Secciones, buscar con `grep -n "// ───"`:
FECHA · TABS (`showTab`, `syncTabFromHash`) · TOGGLE (`setOpener`, `setRot`, `setBuild`) · TOOLTIP · QUIZ ENGINE + PREGUNTAS ST/AoE · BIS TRACKER (`bisCheck`, `BIS_TOTAL`) · TALENT COPY · BOSS DATA (`SPELL_REGISTRY`, `autoLink`) · BUILDS RENDERER · BOSS PANEL · REPORT MODAL (webhook Discord).
- Datos de Astro llegan vía `window.BM_BUILDS_DATA` / `window.BM_BOSS_DATA` (inyectados en `src/pages/index.astro`).
- Si un elemento puede no existir (secciones ocultas), proteger con `if (el)`: un error corta el resto del script.
- Navegación: `#<tab>` en la URL abre la pestaña (los enlaces internos deben ser `href="#bis"`, nunca URL absoluta).

## CSS (`src/styles/bm-guide.css`, ~3100 líneas)
Variables en `:root` (~línea 80: `--bg`, `--card`, `--accent`, `--gold`…). Bloques marcados `/* ─── NOMBRE ─── */`; localizar con `grep -n "/\* ───" src/styles/bm-guide.css` y leer solo ese rango. Reutilizar clases existentes: `.box .box-warn/.box-tip/.box-crit/.box-info`, `.card`, `.prio-list`, `.badge`, `.two-col`.

## Reglas para ahorrar contexto
- **No leer enteros** `SeccionBiS.astro`, `SeccionSimulacion.astro`, `bm-guide.css`, `bm-guide.js`: usar `grep -n` y leer con offset/limit.
- Ignorar: `node_modules/`, `dist/`, `.astro/`, `backups/`, `logs/`, `proyecto_completo.txt`, `package-lock.json`, `talent_strings.json`.
- Para cambiar contenido (textos, builds, opener) editar el `.md`/`.json`, no los componentes.

## Gotchas
- "Última revisión" (BiS, Talentos) = fecha del último commit de esas rutas (`src/lib/sectionDates.ts`); depende de `fetch-depth: 0` en el workflow.
- Archivos con CRLF (Windows); el validador lo acepta. Habilidades en openers/rotaciones deben existir en `spells.json` o el build falla.
- Tooltips de Wowhead (`power.js`) no cargan en localhost (CORS); en producción sí.
- Imágenes remotas permitidas: `wow.zamimg.com`, `assets.rpglogs.com` (`astro.config.mjs`).
- Al cambiar contenido visible, actualizar changelog de `Header.astro` y fecha del footer si el usuario lo pide.
