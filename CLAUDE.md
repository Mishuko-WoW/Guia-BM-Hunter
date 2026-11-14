# Guía Hunter BM — guiahunterbm.com

Guía en español de Beast Mastery Hunter: WoW Midnight S2 y WoW Forever. Autor: Mishuko. Responder siempre en español.

**Al empezar cada sesión, leer `CHANGELOG.md`** (historial técnico de la web) y añadir en él una entrada por cada cambio antes del commit. Es distinto de `changelog.json` (lista para visitantes).

## Stack y comandos
- Astro 6, sitio estático. **Una página por pestaña** (desde 2026-11-14, por SEO): `/midnight/` = General, `/midnight/<tab>/` el resto; igual en `/forever/`. Node ≥ 22.

## SEO y rutas (NO romper enlaces: hay mucho tráfico desde TikTok)
- `src/lib/seo.ts`: `tabPath()` (ruta de cada pestaña), `SEO` (título, descripción y subtítulo del H1 por versión y pestaña), `guideJsonLd()` / `PORTADA_JSONLD` (datos estructurados), `OG` (imagen para redes por versión).
- Páginas: `src/pages/{midnight,forever}/index.astro` (General) y `[tab].astro` (resto) → `src/components/guide/PaginaMidnight.astro` / `src/components/forever/PaginaForever.astro`. Cada página trae **solo su panel** (Rotación incluye Opener; General de Midnight incluye la oculta `errores`).
- Pestañas = enlaces `<a class="mk-tab" data-tab href>` (`TabBar.astro`). `opener` no tiene página: `/<versión>/rotacion/#opener`.
- Enlaces antiguos con `#` **siguen funcionando**: `/#bis` (portada) y `/<versión>/#bis` → `location.replace` a la página de la pestaña (`bm-guide.js`, bloque "PÁGINAS POR PESTAÑA"; alias `#mec`, `#rot`…). Anclas que no son pestañas (`#pf-charge`) no tocan las pestañas.
- Nunca borrar ni renombrar una ruta publicada. Pestañas sin contenido = página con `noindex` (no 404) y fuera del sitemap (`astro.config.mjs`).
- `public/robots.txt`; sitemap con `lastmod` desde `changelog.json`. Imagen de Forever: `node scripts/og-images.mjs` → `public/brand/og-forever.png`.
- Tras publicar páginas nuevas: `node scripts/indexnow.mjs` (avisa a Bing/Yandex con las URL del sitemap; clave en `public/<clave>.txt`, no borrarla) y, en Search Console, pedir indexación de las nuevas.
- Palabras clave: «guía hunter BM», «Cazador de Bestias» (lo más buscado en Search Console), «guía hunter forever», «guía hunter midnight».
- `npm run dev` → http://localhost:4321 (recarga en caliente)
- `npm run build` → valida contenido (`scripts/check-content.mjs`) + genera `dist/`. **Ejecutar siempre antes de commit.**
- Deploy: push a `main` → GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages (~40 s).
  Ver estado: `"/c/Program Files/GitHub CLI/gh.exe" run list -L 1` (gh no está en el PATH de bash).
- Se trabaja directamente en `main` salvo que el usuario pida rama.

## Páginas y versiones
- `/` → portada de elección (`src/pages/index.astro` + `src/styles/portada.css`). Redirige enlaces antiguos `/#tab` a `/midnight/#tab`.
- `/midnight/` → guía de Midnight (`src/pages/midnight/index.astro` + `[tab].astro`, todo lo que sigue en este documento).
- `/forever/` → guía de WoW Forever (en desarrollo, pestaña a pestaña). `src/pages/forever/index.astro` → `src/components/forever/GuideForever.astro`.
  - Contenido: **una página `.md` por pestaña** en `src/content/forever/paginas/<tab>.md` (`tab`, `titulo`, `fuentes`, `bloques`); colección `foreverPaginas`. Pestaña sin `.md` = aviso "en preparación".
  - Bloques extra (también válidos en Midnight): `tarjeta` (titulo + `icono` + `filas`), `tabla` (`cabecera` + `filas`), y `columnas` con `filas` (párrafos) además de `pasos`.
  - Iconos HD: `node scripts/icons-hd.mjs` baja de zamimg los iconos usados en `src/content/forever/`, los reescala x4 con Real-ESRGAN (el del proyecto TikTok) y los guarda a 128 px en `public/icons/<icono>.webp`; `iconUrl()` usa el local si existe. Ejecutarlo tras añadir hechizos nuevos y subir los .webp.
  - Texto de Forever más grande (bloque "FOREVER: texto más grande" en `marca.css`).
  - **Sin fuentes a la vista**: en Forever no se citan guías externas (ni cajas "Fuente" ni menciones en el texto); se escribe como de Mishuko. Al final de cada pestaña solo "Última revisión por Mishuko".
  - **Talentos**: árbol **solo lectura** (ver y copiar, no sumar/quitar) en `src/components/forever/CalculadoraTalentos.astro` + `public/scripts/forever-talentos.js`, y "Rangos entrenables" (`RangosEntrenables.astro`). Estilos en `src/styles/forever.css` (solo Forever). Árboles de 312 px fijos con el fondo original entero (300×331, `100% 100%`).
    - Datos de árboles/rangos/entrenables: `src/content/data/forever-talentos.json`, **generado** con `node scripts/gen-forever-talentos.mjs` (posiciones, IDs, coste de entrenamiento en cobre y habilidades de mascota dentro del script; textos es-ES de Wowhead). No editar a mano.
    - Builds: `src/content/data/forever-builds.json` (`nombre` = etiqueta, ids `<arbol>-<fila>-<col>`; `puntos` o `orden` por nivel desde el 10; `cadena` opcional = string de importación → botón "Copiar talentos"). A 13-11-2026 Forever no tiene strings de importación (árboles clásicos), así que no hay botón.
  - **Mascotas**: `src/components/forever/MascotasForever.astro` (18 familias con su habilidad propia, comunes + instructor, y "Dónde domesticar" con bestia de Alianza y de Horda para el rango más bajo y el más alto conocido, enlazadas a Wowhead es).
    - Datos: `src/content/data/forever-mascotas.json`, **generado** con `node scripts/gen-forever-mascotas.mjs` (lee Petopia Forever en vivo; nombres de bestias y zonas en es-ES de Wowhead; familias, nombres y descripciones de habilidades dentro del script, del vídeo 3 del proyecto TikTok). Volver a ejecutarlo cuando Petopia descubra más rangos.
    - Elección de bestia: zona de su facción > compartida > mazmorra; si solo existe en la otra facción se marca "Zona de la Horda/Alianza".
    - Rangos mostrados: el más bajo, uno intermedio (si la habilidad tiene más de 3 rangos) y el más alto con bestia conocida. Selector Alianza/Horda (recuerda la elección en `localStorage`). Comunes primero, luego las propias.
    - **"Carrerilla"** (Dash), no "Diligencia": así sale en el juego (confirmado por Mishuko). Las familias solo muestran su habilidad propia.
  - **Rotación**: datos en `src/content/data/forever-rotacion.json` (claves, antes del combate, prioridades `st`/`aoe`, inicio del combate, `ciclos` de 36 s, cooldowns, utilidad) → `src/components/forever/RotacionForever.astro`; la línea de tiempo animada de cada modo es `CicloForever.astro` (textos en `ciclos.st` / `ciclos.aoe`) (estilos "ROTACIÓN" en `forever.css`). El inicio del combate va dentro: Forever no tiene pestaña Opener. `iconForever` en `spells.json` = icono distinto en Forever.
  - **General** (`mecanicas`), **Talentos**, **Mascotas** (textos en `forever-mascotas-guia.json`) y **Leveling**: contenido en `src/content/data/forever-general.json`, `forever-talentos-guia.json` y `forever-leveling.json` (componentes `GeneralForever.astro` / `TalentosForever.astro` / `LevelingForever.astro`, estilos `lv-*`/`gn-*` en `forever.css`); sus `.md` solo dan el título (y en Leveling, las cajas). Índice de página: `IndiceForever.astro`.
  - Las páginas `.md` admiten `intro` (bloques antes de los componentes de la pestaña).
  - Hechizos de Forever con su **nombre oficial en español** (Wowhead Forever es-ES) en el mismo `spells.json`. Ej.: Invocar halcón, Ira de bestias, Tiro automático.
  - En Forever `renameLinks: false` en `whTooltips` (Wowhead no renombra los enlaces).
  - `obra.css` (antigua página "en construcción") ya no se usa.
- Datos de cada versión (nombre, enlace, logo, etiqueta, `disponible`) en `src/lib/realms.ts`; selector superior en `RealmSwitch.astro`.
- Logos oficiales de Midnight y Forever (Blizzard Press Center, blizzard.gamespress.com) reducidos a WebP en `public/brand/realms/`. Colores de versión: `--realm-midnight` violeta, `--realm-forever` turquesa (`tokens.css`).
- Forever ya es `disponible: true` (desde 2026-11-13). `estado` en `realms.ts` = texto de la tarjeta de portada; actualizarlo al completar pestañas (hoy: General, Talentos, Rotación y Mascotas).
- Tema por versión: `MainLayout` pone `<html data-realm="portada|midnight|forever">`; el tema Forever solo redefine variables en `tokens.css` (`:root[data-realm="forever"]`).
- Analytics (GA4 G-EJY55YHE6Q): `page_view` con ruta limpia `/<versión>/<pestaña>` (`/midnight/bis`, `/forever/mecanicas`, `/`) y `content_group` = versión; igual que antes de tener una página por pestaña. Al crear una página nueva pasar `realm` y `defaultTab` (= su pestaña) a `MainLayout`.

## Ahorro de uso (desde 2026-11-14, pedido por Mishuko)
- **Revisa Mishuko, no Claude**: nada de capturas ni navegador para comprobar cómo se ve. Claude solo mira errores de consola o el HTML si hace falta (texto, no imágenes).
- **Push y deploy los hace Mishuko** con doble clic en `publicar.bat` (push + IndexNow). Claude deja el commit hecho y no espera al deploy ni revisa la web publicada (Mishuko mira el tic verde en GitHub → Actions).
- Una sesión por tarea; todos los cambios en un solo mensaje; muestras/capturas solo si las pide.

## Flujo obligatorio antes de publicar (push)
1. `npm run build` sin errores.
2. Levantar la web en local (`npx astro preview --port 4321`, en segundo plano) y mirar solo que no haya errores nuevos de consola (sin capturas; ignorar el CORS de Wowhead).
3. Dar al usuario el enlace **http://localhost:<puerto>/<versión>/<pestaña>/** (usar el puerto que imprime astro; si 4321 está ocupado usa 4322…) para que la revise él mismo.
4. Con su visto bueno: commit (con su entrada en `CHANGELOG.md`). El push lo hace Mishuko con `publicar.bat`, salvo que pida que lo haga Claude.

## Lista de cambios (changelog) — en cada actualización de contenido
- Añadir **al principio** de `src/content/data/changelog.json` una entrada por cambio visible:
  `{ "fecha": "AAAA-MM-DD", "pestana": "<data-tab>", "texto": "Actualización de", "enlace": "Nombre visible" }`
  → se pinta como «14 Oct. 2026: Actualización de [Nombre visible](#pestana)».
- Lenguaje para el visitante (qué cambia para él), **nunca** cambios técnicos (refactors, CSS, arreglos de código): esos no llevan entrada.
- La cabecera muestra las 2 más recientes (`CHANGELOG_VISIBLE` en `Header.astro`); el resto queda como historial.
- De aquí salen automáticamente: "Última revisión" de cada sección (última entrada de su pestaña) y la fecha del footer (última entrada global). No editar esas fechas a mano.
- Entradas de Forever llevan `"version": "forever"` (sin `version` = Midnight); cada cabecera solo muestra las suyas.
- El build valida fecha real, pestaña existente en su versión (`src/lib/tabs.ts`) y campos no vacíos.
- Proponer el texto de la entrada al usuario junto con el enlace local, antes del push.

## Dónde está cada cosa
| Quiero cambiar… | Archivo |
|---|---|
| Cabecera, aviso de parche (`PARCHE`) | `src/components/Header.astro` |
| Lista de cambios, fechas de revisión y del footer | `src/content/data/changelog.json` (lógica en `src/lib/changelog.ts`) |
| Pestañas (`TABS_MIDNIGHT`, `TABS_FOREVER`) | `src/lib/tabs.ts` (las pinta `TabBar.astro`) |
| Qué sección pinta cada página de Midnight, footer | `src/components/guide/GuideContent.astro` |
| Títulos, descripciones, H1, JSON-LD, imagen para redes | `src/lib/seo.ts` |
| `<head>`, robots, Analytics (GA4) | `src/layouts/MainLayout.astro` |
| Pestaña X | `src/components/Seccion<X>.astro` (`<div id="tab-<id>" class="tab-panel">`) |
| Builds de talentos (strings, notas) | `src/content/builds/*.md` → renderizado en JS (`renderBuilds`) |
| Opener / rotación (un `.md` por build) | `src/content/opener/*.md`, `src/content/rotacion/*.md` → `PanelesHeroe.astro` + `Bloques.astro`. Intro y textos fijos de la pestaña en `SeccionOpener/Rotacion.astro` |
| Catálogo de hechizos (icono, clase sp/pr/bf, tipo, tooltip) | `src/content/data/spells.json` (helpers en `src/lib/spells.ts`) |
| Jefes de raid | `src/content/Bosses/*.md` (sección **oculta**: comentada en `SeccionTalentos.astro`) |
| BiS y consumibles | **HTML a mano** en `SeccionBiS.astro` (1700 líneas, estilos propios dentro). `bis.json` NO se usa (datos viejos) |
| Esquemas de contenido (zod) | `src/content.config.ts` |

Pestañas Forever: mecanicas, talentos, estadisticas, rotacion, bis, mascotas, macros, leveling.
Pestañas válidas Midnight (`data-tab`): mecanicas, talentos, estadisticas, rotacion, opener (oculta, va con rotacion), bis, mascotas, macros, simulacion, coaching, errores.
**Oculta a propósito (sin botón):** `errores` — reservada a quien compra el coaching. Los exámenes ST/AoE se eliminaron (2026-11-13). No añadirles botón. Ojo: hoy tampoco abren con `#enlace` (showTab solo acepta pestañas con botón).

## Formato de Rotación y Opener
Cada `.md` = un botón del selector: `id`, `orden`, `boton`, `heroe` (pack-leader | dark-ranger), `oculto` (true = muestra "en desarrollo") y `bloques`, en orden:
`caja` (info|warn|tip|crit + titulo + texto) · `columnas` (titulo, color, pasos[{icono?, texto}]) · `cadena` (pasos del opener con tono sp|pr|bf|gold y nota) · `pasos` (titulo + lista[{icono?, pre?, texto}]) · `filas` (+ compacto) · `subtitulo` · `separador`. Esquema zod en `src/content.config.ts`.
Mini-formato de texto (`src/lib/markup.ts`): `[[Hechizo]]` (tooltip/clase del catálogo; en Forever lleva icono pequeño), `{{Hechizo}}` / `{{Hechizo>Texto}}` (icono grande con nombre debajo, tooltip propio), `[[Hechizo|tooltip propio]]`, `[[Hechizo|tooltip|tipo|clase]]`, `[[Hechizo>Texto]]`, `**negrita**`, `*cursiva*`, `!!alerta roja!!`. `icono` = nombre de icono Wowhead (`ability_hunter_barbedshot`) o URL; si falta se usa el del primer `[[hechizo]]`. Todo `[[hechizo]]` debe existir en `spells.json` (lo valida el build).

## JavaScript (`public/scripts/bm-guide.js`, ~1090 líneas, sin bundler)
Script clásico global (funciones llamadas desde `onclick` en el HTML). Secciones, buscar con `grep -n "// ───"`:
TABS (`showTab`, `syncTabFromHash`) · TOGGLE (`setPanel` para Rotación/Opener, `setBuild` para Talentos) · TOOLTIP · BIS TRACKER (`bisCheck`, `BIS_TOTAL`) · TALENT COPY · BOSS DATA (`SPELL_REGISTRY`, `autoLink`) · BUILDS RENDERER · BOSS PANEL · REPORT MODAL (webhook Discord).
- Datos de Astro llegan vía `window.BM_BUILDS_DATA` / `window.BM_BOSS_DATA` (inyectados en `src/components/guide/PaginaMidnight.astro`).
- Si un elemento puede no existir (secciones ocultas), proteger con `if (el)`: un error corta el resto del script.
- Navegación: cada pestaña es una página; los enlaces internos a otra pestaña van a su ruta (`href="/forever/mascotas/"`, ver `tabPath`). Un `#<tab>` sigue funcionando (redirige a su página), pero mejor la ruta real.
- La página trae `<html data-default-tab="<tab>">`: sin `#`, `bm-guide.js` muestra esa pestaña. Sin JS, `marca.css` muestra el primer panel (`html:not(.js-tabs)`).

## Estilos (marca Mishuko)
Orden de carga en `MainLayout.astro`: `tokens.css` → `bm-guide.css` (heredado) → `marca.css` (manda).
- `src/styles/tokens.css`: **única fuente** de colores, fuentes, esquinas cortadas (`--clip-card`, `--clip-btn`) y movimiento. Marca `--brand` #c4d70b (verde del logo), `--pl` ámbar (Pack Leader), `--dr` violeta (Dark Ranger). Los nombres antiguos (`--accent`, `--orange`…) son alias.
- Partículas de fondo (brasas) en todas las páginas: `src/components/Particulas.astro` (lo incluye `MainLayout`); colores por versión en el bloque "PARTÍCULAS" de `marca.css`.
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
