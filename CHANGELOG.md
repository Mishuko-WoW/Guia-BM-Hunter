# Historial técnico — guiahunterbm.com

Registro **técnico** de lo que se ha hecho en la web (para quien la mantiene).
Es distinto de `src/content/data/changelog.json`, que es la lista de cambios para el visitante.

- Una entrada por día o por bloque de trabajo, la más reciente arriba.
- Formato: `## AAAA-MM-DD — título` + qué se hizo + archivos principales (+ commit si existe).
- Actualizar en cada cambio, antes del commit.

---

## ▶ PRÓXIMO TRABAJO (pedido por Mishuko el 2026-11-13)
**SEO a fondo, antes de seguir con las pestañas de Forever.** Primero investigar y **presentar el plan para que lo apruebe**; no tocar nada sin su visto bueno.
- Objetivo: posicionar arriba para **«guía hunter BM forever»** y **«guía hunter forever»** (prioridad máxima: que salga aunque busquen solo «hunter» sin «BM»), además de **«guía hunter midnight»** y mantener/mejorar **«guía hunter BM midnight»** y **«guía hunter BM»**.
- Hacer búsquedas (competencia, palabras clave en español, intención de búsqueda) y optimizar al máximo: `<title>`, metadescripciones, H1/H2, textos, datos estructurados (JSON-LD), Open Graph/imagen por versión, canonical, sitemap, enlaces internos entre portada/Midnight/Forever, rendimiento, etc.
- Hoy: la web está bien posicionada para «guía hunter BM midnight» y «guía hunter BM»; Forever acaba de publicarse (General, Talentos, Mascotas).
- Pendiente después: pestañas de Forever Stats, Rotación y Opener, BiS y Consumibles, Macros, Leveling 1-60 (y actualizar `estado` en `realms.ts`).

---

## 2026-11-13 — Forever disponible en la portada (publicado)
- `disponible: true` y nuevo campo `estado` en `src/lib/realms.ts` (texto de la tarjeta: "General, talentos y mascotas · se amplía cada día"); `src/pages/index.astro` lo usa.
- Publicado junto al commit `0cb0d04` (General, Talentos, Mascotas), deploy en success.

## 2026-11-13 — Partículas en toda la web y cabecera de Forever (sin publicar)
- Las brasas de la portada pasan a ser comunes: `src/components/Particulas.astro` en `MainLayout` (capa fija `z-index: -1`, `body { isolation: isolate }`), colores por versión en `marca.css` (portada violeta/turquesa como antes, Midnight violeta/lima, Forever turquesa/bronce). Fuera `.pt-ember` de la portada.
- Cabecera de Forever sin las tarjetas "Ira de bestias" / "Invocar halcón" (solo Midnight muestra talentos de héroe); fuera `.mk-chip--fv`.
- Archivos: `src/components/{Particulas,Header}.astro`, `src/layouts/MainLayout.astro`, `src/pages/index.astro`, `src/styles/{marca,portada}.css`.

## 2026-11-13 — Forever: rediseño de Mascotas (sin publicar)
- Aviso visual de exclusividad (un oso nunca podrá tener Embestir ni Aullido furioso).
- Familias: tarjeta más amplia con solo su habilidad propia (icono, descripción, "Solo X") y dieta; fuera los iconos de comunes.
- Dónde domesticar: selector Alianza/Horda (una columna en vez de dos), comunes arriba (+ instructor), rangos como pasos: más bajo, intermedio (si hay más de 3) y más alto conocido; aviso de rangos aún sin bestia.
- "Diligencia" → "Carrerilla" (generador, `spells.json`, texto).
- Archivos: `src/components/forever/MascotasForever.astro`, `src/styles/forever.css`, `scripts/gen-forever-mascotas.mjs`, `src/content/data/{forever-mascotas,spells}.json`, `src/content/forever/paginas/mascotas.md`, `CLAUDE.md`.

## 2026-11-13 — Forever: pestaña Mascotas (sin publicar)
- 18 familias con su habilidad propia (exclusiva, con candado), habilidades comunes (Mordedura, Zarpa, Diligencia, Lanzada, Pavor) e instructor (Bramido, Gran aguante, Armadura natural, resistencias), dieta de cada familia.
- "Dónde domesticar cada habilidad": 23 habilidades × rango más bajo y más alto con fuente × Alianza/Horda (80 bestias enlazadas a Wowhead es, con nivel y zona en español).
- Datos generados con `scripts/gen-forever-mascotas.mjs` (Petopia Forever + Wowhead es) → `forever-mascotas.json`; 22 habilidades de mascota en `spells.json`; 24 iconos HD más; tokens `--alianza`/`--horda`.
- Archivos: `src/components/forever/{MascotasForever,GuideForever}.astro`, `src/content/forever/paginas/mascotas.md`, `scripts/{gen-forever-mascotas,icons-hd}.mjs`, `src/content/data/{forever-mascotas,spells,changelog}.json`, `src/styles/{forever,tokens}.css`, `public/icons/`.

## 2026-11-13 — Forever: retoques de Talentos (sin publicar)
- Selector de build movido debajo de la descripción y centrado (`.tc-builds`).
- Orden de talentos: el rango se cortaba con la esquina del recuadro y los nombres largos se montaban encima (`.bf` trae `white-space: nowrap`). Más padding derecho, nombre en `.tc-step__name` que parte en dos líneas, columnas de 300 px.
- Rangos entrenables: filtros Cazador (por defecto) · Mascota · Todas · Novedades; las de mascota salen ocultas ya en el HTML. Más padding derecho en las fichas.
- Costes verificados de nuevo en Wowhead (9 hechizos, coinciden).
- Archivos: `src/components/forever/{CalculadoraTalentos,RangosEntrenables}.astro`, `src/styles/forever.css`.

## 2026-11-13 — Forever: ajustes de Talentos y fuera las fuentes (sin publicar)
- Árbol: flechas que acababan 38 px dentro del talento destino (punta oculta) → ahora terminan en su borde; árboles de ancho fijo (312 px) y fondo original entero (300×331 con `100% 100%`) en vez de `cover` estirado, que recortaba los lados (se notaba en Supervivencia).
- Calculadora en solo lectura: sin sumar/quitar puntos ni "Vaciar árbol"; etiqueta con el nombre de la build ("Build estándar" / "Build de leveling"); soporte de `cadena` → botón "Copiar talentos" (Forever no tiene strings, así que no se muestra).
- Rangos entrenables: coste de entrenamiento en oro/plata/cobre (50 habilidades, dato de Wowhead), etiqueta y filtro "Mascota" (resistencias, Gran aguante, Armadura natural, Bramido, Pisotón de trueno), fuera Baile de timador. Colores de monedas como tokens en `tokens.css`.
- Sin fuentes en Forever: fuera cajas "Fuente", campo `fuentes` del esquema, menciones a guías en General/Talentos/builds y en el pie; "Puntos flexibles según la situación".
- Archivos: `src/components/forever/{CalculadoraTalentos,RangosEntrenables,SeccionForever,GuideForever}.astro`, `public/scripts/forever-talentos.js`, `scripts/{gen-forever-talentos,check-content}.mjs`, `src/content/data/{forever-talentos,forever-builds,changelog}.json`, `src/content/forever/paginas/{mecanicas,talentos}.md`, `src/content.config.ts`, `src/styles/{forever,tokens}.css`, `CLAUDE.md`.

## 2026-11-13 — Forever: pestaña Talentos con calculadora (sin publicar)
- Calculadora de talentos al estilo Wowhead: 3 árboles con fondos originales, flechas de requisitos, clic +1 / clic derecho −1 con reglas clásicas (5 puntos por fila, prerequisitos, 51 máx.), tooltip propio con rango actual y siguiente.
- Builds: Raid y mazmorras 31/20/0 (Wowhead) y Leveling 31/16/4 con orden por nivel, deslizador de nivel y lista de orden.
- "Rangos entrenables más altos a nivel 60" (62 habilidades por nivel, insignias Nueva / Cambia de nivel / Ahora entrenable, filtro de novedades).
- Datos generados con `scripts/gen-forever-talentos.mjs` (Wowhead Forever es-ES) → `forever-talentos.json`; builds en `forever-builds.json`; 39 talentos más en `spells.json`; 69 iconos HD más.
- `talentos.md` (intro, talentos clave, puntos flexibles por fuente); `SeccionForever` admite `intro` y slot; estilos nuevos en `src/styles/forever.css`.
- Archivos: `src/components/forever/{CalculadoraTalentos,RangosEntrenables,GuideForever,SeccionForever}.astro`, `public/scripts/forever-talentos.js`, `scripts/{gen-forever-talentos,icons-hd}.mjs`, `src/content/data/{forever-talentos,forever-builds,spells,changelog}.json`, `src/content/forever/paginas/talentos.md`, `src/content.config.ts`, `src/styles/forever.css`, `src/pages/forever/index.astro`, `public/icons/`.

## 2026-11-13 — Iconos HD en Forever, texto más grande y fuera los exámenes (sin publicar)
- Iconos HD: nuevo `scripts/icons-hd.mjs` (zamimg → Real-ESRGAN x4 del proyecto TikTok → 128 px WebP en `public/icons/`, 42 iconos). `iconUrl()` (`src/lib/spells.ts`) usa el local si existe.
- Mini-formato (`src/lib/markup.ts`): `[[Hechizo]]` lleva icono pequeño (`.sp-ico`, visible solo en el tema Forever) con el tooltip propio; nuevo `{{Hechizo}}` / `{{Hechizo>Texto}}` = icono grande con el nombre debajo. Validador y script de iconos reconocen `{{ }}`.
- General (Forever): iconos grandes en "Qué cambia en Forever", raciales y habilidades con `[[ ]]` (19 entradas nuevas en `spells.json`), nombres corregidos (Disparo de concusión, Lluvia).
- Texto de Forever más grande (cajas 17,5 px, filas 18 px; 16,5 px en móvil) en `marca.css`.
- Exámenes ST/AoE eliminados por completo: `SeccionExamenes.astro`, motor y preguntas en `bm-guide.js`, estilos `.quiz-*`/`.btn`/`.score-*` en `bm-guide.css`, alias `#qst`/`#qaoe`, punto de la lista de Coaching, README y CLAUDE.md.
- Archivos: `scripts/icons-hd.mjs`, `public/icons/*.webp`, `src/lib/{spells,markup}.ts`, `scripts/check-content.mjs`, `src/styles/{marca,bm-guide}.css`, `src/content/forever/paginas/mecanicas.md`, `src/content/data/spells.json`, `public/scripts/bm-guide.js`, `src/components/{SeccionCoaching,guide/GuideContent}.astro`, `README.md`, `CLAUDE.md`.

## 2026-11-13 — Guía de WoW Forever: estructura + pestaña General (sin publicar)
- Investigación de fuentes (Icy Veins, Wowhead, Warcraft Tavern, WoWTBC.gg, Method) e índice de pestañas aprobado.
- Nuevo `CHANGELOG.md` técnico (este archivo) y aviso en `CLAUDE.md` para leerlo al empezar cada sesión.
- Pestañas por versión en `src/lib/tabs.ts` (`TabBar.astro` recibe `realm`); `Header.astro` con textos por versión.
- `changelog.json`: campo opcional `version` (`forever`); `changelog.ts`/`sectionDates.ts` filtran por versión; validador comprueba pestañas por versión y revisa también `src/content/forever/`.
- Colección `foreverPaginas` (una `.md` por pestaña) y bloques nuevos `tarjeta`, `tabla` y `columnas.filas` en `Bloques.astro` (+ estilos `.blk-*` en `marca.css`).
- `/forever/` pasa de "en construcción" a la guía (`GuideForever.astro`, `SeccionForever.astro`); pestañas sin contenido muestran "en preparación".
- Pestaña General (`mecanicas.md`) y 24 hechizos de Forever en `spells.json` con nombre oficial es-ES de Wowhead.
- `bm-guide.js`: examen y contador BiS protegidos si no existen (en Forever cortaban el script).
- Archivos: `CHANGELOG.md`, `CLAUDE.md`, `src/lib/tabs.ts`, `src/lib/changelog.ts`, `src/lib/sectionDates.ts`, `src/components/{TabBar,Header,Bloques}.astro`, `src/components/forever/*`, `src/content.config.ts`, `src/content/forever/paginas/mecanicas.md`, `src/content/data/{spells,changelog}.json`, `src/pages/forever/index.astro`, `scripts/check-content.mjs`, `public/scripts/bm-guide.js`, `src/styles/marca.css`.

## 2026-11-12 — Portada Midnight/Forever (`4bf6cfe`)
- Nueva portada `/` para elegir versión (logos oficiales en WebP, tarjetas con inclinación 3D); redirige `/#tab` a `/midnight/#tab`.
- La guía pasa a `/midnight/`; `/forever/` queda "en construcción" con tema turquesa propio (`:root[data-realm="forever"]`).
- Analytics: `page_view` con ruta limpia y `content_group` por versión. Arreglo del guardado del progreso BiS. `favicon.ico` desde el logo.
- Archivos: `src/pages/index.astro`, `src/pages/midnight/index.astro`, `src/pages/forever/index.astro`, `src/lib/realms.ts`, `src/components/RealmSwitch.astro`, `src/layouts/MainLayout.astro`, `src/styles/portada.css`, `src/styles/obra.css`, `src/styles/tokens.css`, `public/brand/realms/`.

## 2026-11-11 — Revisión general, changelog, refactor y nueva marca
- `2de850c` Nuevo diseño con la identidad de Mishuko: `tokens.css` (colores, fuentes, esquinas cortadas, movimiento), `marca.css` (cabecera, pestañas, cajas, tarjetas, footer), favicon/og-image, 369 colores fijos pasados a variables, pestañas desde lista en `TabBar.astro`.
- `09c26c3` Rotación y Opener generados desde `src/content/rotacion|opener/*.md` (bloques + `[[Hechizo]]`); validador de hechizos contra `spells.json`; fuera CMS Decap, `bis.json` y código muerto.
- `f6176a9` `src/content/data/changelog.json` como lista de cambios; "Última revisión" y fecha del footer automáticas (`src/lib/changelog.ts`, `sectionDates.ts`); validación en build.
- `09431cc` Añade `CLAUDE.md`; quita `<div id="tab-bis">` duplicado en `SeccionBiS.astro`.
- `ab64c06` Revisión general: fechas de revisión, SEO, validador (`scripts/check-content.mjs`), limpieza de archivos viejos (`index.html`, logs).

## 2026-10-14 — BiS (`9eb83a8`, `a50a6ca`)
- Actualización de la lista BiS. Archivos: `SeccionBiS.astro`, `Header.astro`, `GuideContent.astro`.

## 2026-09-18 — Ajustes de cabecera (`be88a2d`)
- Archivos: `Header.astro`, `GuideContent.astro`.

## 2026-09-14 — Recuperación y lista BiS
- Conflictos de merge y carpetas de copia (`Contenido/`, `Para Gemini/`); se revierte el proyecto a la versión estable `c9c858b` (`b52ef17`).
- Arreglo de `deploy.yml` y dependencias; `check-content` fuera del build temporalmente (`e0feb90`).
- Lista de BiS y fechas (`3192a25`, `750fed9`). Archivos: `SeccionBiS.astro`, `Header.astro`, `GuideContent.astro`.

## 2026-08-24 — Actualización 24 agosto (`8204f47`)
- Cambios en BiS y cabecera; se suben copias del proyecto para revisión externa (`Para Gemini/`, `proyecto_completo.txt`).

## 2026-08-12 — Actualización 12.1 (`c9c858b`)
- Builds, rotación, opener, talentos y BiS para el parche 12.1. Archivos: `src/content/builds/*.md`, `Seccion*.astro`, layouts, `index.astro`.

## 2026-05-01 / 05-03 — Analytics, reporte de errores, sitemap y BiS completa
- Analytics GA4 con seguimiento de pestañas por `#` (`MainLayout.astro`).
- Botón de reportar error (webhook Discord) en `bm-guide.js`.
- Favicon PNG, sitemap (`astro.config.mjs`), sección Coaching, vídeos de jefes.
- `2110cfc` Sección BiS completa; ajustes en Mascotas, Mecánicas, Rotación y Stats.

## 2026-04-25 / 04-27 — Builds y talentos por jefe
- Strings de builds (`src/content/builds/*.md`) y talentos de cada jefe (`src/content/Bosses/*.md`); vídeos en talentos (`content.config.ts`, `bm-guide.js`).

## 2026-04-17 / 04-23 — Opener, simulación
- Nueva versión de botones y opener (`SeccionOpener.astro`) y hotfixes.
- Sección Simulación con vídeo de Top Gear (`SeccionSimulacion.astro`, `TabBar.astro`).

## 2026-04-03 / 04-09 — Mejoras de UI y recuperación
- Mejoras de UI, animaciones, pestañas "próximamente", esquema opcional, sincronización de talentos (`6971864`).
- Jefes de raid en `src/content/Bosses/`, sección Coaching.
- Recuperación de BiS/CSS/opener tras un conflicto (`4887253`); arreglos de scroll al navegar por `#`.

## 2026-04-01 — Migración a Astro (`382dba1`)
- La guía pasa de un `index.html` único a un sitio Astro con componentes por sección, contenido en Markdown y deploy a GitHub Pages con GitHub Actions.
- Ajustes de rutas base, Node 24 en CI, macros con botón copiar, talentos flexibles.

## 2026-03-21 / 03-30 — Primera versión
- Repositorio creado y guía en un único `index.html` editado a mano; `README.md`.
