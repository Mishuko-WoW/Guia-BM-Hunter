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
| Título, banner de parche | `src/components/Header.astro` |
| Lista de cambios, fechas de revisión y del footer | `src/content/data/changelog.json` (lógica en `src/lib/changelog.ts`) |
| Botones de pestañas | `src/components/TabBar.astro` |
| Orden de secciones, footer | `src/components/guide/GuideContent.astro` |
| `<head>`, SEO, Analytics (GA4 con page_view por hash) | `src/layouts/MainLayout.astro` |
| Pestaña X | `src/components/Seccion<X>.astro` (`<div id="tab-<id>" class="tab-panel">`) |
| Builds de talentos (strings, notas) | `src/content/builds/*.md` → renderizado en JS (`renderBuilds`) |
| Opener / rotación | `src/content/openers-ui/*.md`, `src/content/rotaciones-ui/*.md` → `src/components/opener|rotacion/*Mode.astro` |
| Catálogo de habilidades (icono, badge, desc) | `src/content/data/spells.json` (helpers en `src/lib/spells.ts`) |
| Jefes de raid | `src/content/Bosses/*.md` (sección **oculta**: comentada en `SeccionTalentos.astro`) |
| BiS y consumibles | **HTML a mano** en `SeccionBiS.astro` (1700 líneas, estilos propios dentro). `bis.json` NO se usa (datos viejos) |
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
- "Última revisión" (BiS, Talentos) sale del changelog (`src/lib/sectionDates.ts`); solo si la pestaña no tiene entradas usa el último commit (por eso `fetch-depth: 0` en el workflow).
- Archivos con CRLF (Windows); el validador lo acepta. Habilidades en openers/rotaciones deben existir en `spells.json` o el build falla.
- Tooltips de Wowhead (`power.js`) no cargan en localhost (CORS); en producción sí.
- Imágenes remotas permitidas: `wow.zamimg.com`, `assets.rpglogs.com` (`astro.config.mjs`).
