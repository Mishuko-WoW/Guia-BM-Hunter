# Historial técnico — guiahunterbm.com

Registro **técnico** de lo que se ha hecho en la web (para quien la mantiene).
Es distinto de `src/content/data/changelog.json`, que es la lista de cambios para el visitante.

- Una entrada por día o por bloque de trabajo, la más reciente arriba.
- Formato: `## AAAA-MM-DD — título` + qué se hizo + archivos principales (+ commit si existe).
- Actualizar en cada cambio, antes del commit.

---

## ▶ PRÓXIMO TRABAJO
- **Ver `PENDIENTES.md`** (lista maestra tras el análisis del 18-11-2026: GA4, SEO, Ko-fi/RestedXP, normas de vídeo).
- **Antes de publicar el bloque Leveling/General/Talentos/Mascotas (sin commit aún):** Mishuko revisa en local y pasa los datos de bolsas de munición (origen) y la lista de armas por tramo (quitar «En construcción»).
- Forever BiS: rellenar la ventana de personaje con el editor local («Objetos BiS») y quitar `noindex: true` de `bis.md` (+ entrada en changelog.json y `estado` de realms.ts); cambiar el emblema por la imagen de Mishuko (`imagen` en forever-bis-equipo.json). Revisar Stats y BiS cuando haya datos de nivel 60 (raids, simulaciones) y volver a ejecutar `node scripts/gen-forever-objetos.mjs` al añadir objetos.
- Search Console: hecho el 18-11 (las de esa lista ya estaban indexadas; pedidas `/midnight/estadisticas/`, `/macros/`, `/simulacion/`, `/coaching/`).

---

## 2026-11-20 — BiS de Midnight: ranuras rotas por Wowhead
- `PaginaMidnight.astro`: en BiS, `renameLinks: false` (como en Forever). Con `true`, power.js cambiaba el interior de cada ranura (icono, ranura, origen) por el nombre del objeto y la ventana de personaje se deshacía. El resto de pestañas sigue igual. Quitado de `SeccionBiS.astro` el `tooltips.js` duplicado.

## 2026-11-20 — Midnight con el diseño de Forever (5): BiS y consumibles
- `SeccionBiS.astro` (1.746 líneas de HTML y CSS a mano) pasa a datos: `src/content/data/midnight-bis.json` (sacado del HTML con un script: 15 piezas + camisa y tabardo con sus enlaces de Wowhead y bonus, catalizador, encantamientos, 9 consumibles, 2 gemas, ranking S-D de abalorios y la guía de núcleos, fabricados y blasones) → `guide/BisMidnight.astro` con la ventana de personaje del BiS de Forever (`bf-*`), tabla desplegable con origen y encantamiento, consumibles y gemas en tarjetas `gn-cambio`, abalorios en `lv-table` y mejoras en `lv-card`.
- Fuera: el contador «Progreso BiS» con casillas (el código de `bm-guide.js` ya comprobaba si existe), la caja de fuentes y los estilos propios de la página.

## 2026-11-20 — Midnight con el diseño de Forever (4): Macros; iconos; Stats como antes
- Macros de Midnight en `midnight-macros.json` con el mismo componente que Forever (`forever/MacrosForever.astro`, nuevas props `data` y `realm`; sin selector de idioma cuando las macros solo tienen `es`): pasos para crearlas, índice, tarjetas con icono y botón «Copiar».
- `spells.json`: iconos de Colmillo de cobra (tier 4 S2), ¡Estampida! y Aullido de la manada (salían sin icono en General); Contradisparo, Disparo vinculante y «Mascota en pasivo».
- Stats de Midnight vuelve a su diseño anterior (lo prefiere Mishuko); se borran `StatsMidnight.astro` y `midnight-estadisticas.json`.

## 2026-11-20 — Midnight con el diseño de Forever (3): Mascotas
- Mascotas de Midnight en `midnight-mascotas.json` → `guide/MascotasMidnight.astro` (resumen con datos, «Lo esencial», índice, Aqir en raid/M+ en columnas ámbar/violeta, tabla de especializaciones `lv-table`, situaciones de M+ en tarjetas, macros del Pterrordáctilo). Fuera emojis y colores a mano.

## 2026-11-20 — Midnight con el diseño de Forever (2): Stats
- Stats de Midnight en `midnight-estadisticas.json` → `guide/StatsMidnight.astro` (resumen con datos, índice, prioridad ST y AoE en tarjetas numeradas `st-rank`, tabla de qué aporta cada secundaria, tabla de rendimientos decrecientes). Fuera emojis y barras a mano. `spells.json`: Ansia de sangre.

## 2026-11-20 — Midnight con el diseño de Forever (1): General
- Pestaña General de Midnight pasada al formato de Forever: datos en `src/content/data/midnight-general.json` → `src/components/guide/GeneralMidnight.astro` (clases `lv-*`/`gn-*`: resumen con datos, «Lo esencial», banner a Rotación, índice, secciones Season 2, Enfoque, héroes, cooldown y procs, vídeo). `SeccionMecanicas.astro` queda como en `SeccionForever` (+ «Última revisión por Mishuko»). Sin HTML ni colores a mano.
- `forever.css` se carga también en Midnight (`GuideContent.astro`) y el bloque «texto más grande» de `marca.css` vale para las dos versiones.
- `spells.json`: Pisotón y Escabechina.

## 2026-11-20 — GA4: page_view al cargar el HTML (sesiones «(sin definir)»)
- `MainLayout.astro`: `trackPageView` pasa de `load` a `DOMContentLoaded` (o al momento si el HTML ya está listo). `load` espera a todas las imágenes y scripts externos; en móvil y en el navegador de TikTok la visita podía mandar `user_engagement`/`scroll` sin `page_view`, y GA4 lo cuenta como sesión «(sin definir)» con 0 % de interacción (62 del 18 al 20-11, antes 1). Hipótesis sin confirmar: comprobar el 2-12 si bajan; si no, mirar en GA4 país y dispositivo de esas sesiones (pueden ser robots).

## 2026-11-20 — Títulos de Leveling y Stats de Forever
- `seo.ts`: Leveling «Leveling Hunter WoW Forever 1-60 rápido: ruta y talentos» (56; antes «Guía leveling… : Cazador de Bestias», 3,2 % de CTR con 498 impresiones) y descripción con «Cazador de Bestias», ruta e instructor (152). Stats «Stats Hunter BM WoW Forever: golpe al 8 % y prioridad» (53; antes 1,8 % con 114) y descripción con daño de arma y golpe con el pre-raid (140). Medir el CTR el 2-12.

## 2026-11-20 — RestedXP en cada tramo de Leveling
- `LevelingForever.astro`: enlace de afiliado en la cabecera de cada tramo de la hoja de ruta (donde mira quien escribe su nivel), «Misiones de estos niveles en orden…: RestedXP (10 % de descuento)», `rel="sponsored"`, GA4 `afiliado_click` con `lugar` `leveling-tramo`. Estilo `.lv-panel__rxp` en `forever.css`. El banner de arriba (`RecomendacionRestedXP.astro`) ya dice también el 10 % de descuento en Leveling. Motivo: 0 clics desde Leveling del 18 al 20-11 con 341 vistas.

## 2026-11-20 — Auditoría SEO de las páginas indexables
- **Títulos y descripciones** (`seo.ts`): Mascotas de Forever «Top 5 mascotas Hunter WoW Forever: Ta'shkal y dónde domarlas» (antes «Mejores mascotas…: Top 5 y Ta'shkal», 3,7 % de CTR) y descripción a 152 caracteres; BiS de Forever a 54/148 (antes 65/180); «Cazador de Bestias» en los títulos de Rotación, Mascotas y Coaching de Midnight y Coaching de Forever; descripciones más concretas (sacadas de la página) en Mascotas, Macros y Simulación de Midnight; Talentos de Forever y General de Midnight recortadas a ≤156. Portada sin tocar (se mide el 2-12).
- **«Sigue con la guía»** en todas las pestañas que no lo tenían: `SigueGuia.astro` (nuevo) + `relacionadas.json` (pestañas relacionadas por versión, con su ruta de `tabPath`; `realm` opcional para enlazar a la otra versión). En Midnight: todas menos Coaching; en Forever: Talentos, Rotación, Mascotas, Macros y Leveling (General, Stats y BiS ya tenían el suyo). Enlaces entre versiones: General de Midnight → `/forever/`, Mascotas de Midnight → `/forever/mascotas/` y General de Forever → `/midnight/` (`realm` en `forever-general.json`). Estilos `.gn-next` movidos de `forever.css` a `marca.css` (bloque «SIGUE CON LA GUÍA») para las dos versiones. `ICONO` de `TabBar.astro` pasa a `ICONO_TAB` en `tabs.ts`.
- **«En resumen» y preguntas frecuentes**: Simulación de Midnight (resumen + 4 preguntas) y Macros de Midnight (4 preguntas) → bloque visible + `FAQPage`. Simulación también entra en `/llms.txt`. Quitada una pregunta **duplicada** de Stats de Forever («¿Cuánto golpe necesita un cazador…?» salía dos veces en el `FAQPage`); su dato de leveling pasa a la primera.
- **Encabezados**: General de Forever, tarjetas de «Mecánicas clásicas» de `h5` a `h4` (saltaba de h3 a h5); Simulación, los `h4` dentro de los botones del índice pasan a `<span class="fb-t">` (un encabezado dentro de un botón no es válido y saltaba de h2 a h4). Mismo aspecto.
- `alt=""` en el icono de la barra lateral de BiS de Midnight (era la única imagen sin `alt`).
- Revisado sin cambios: un solo H1 por página, JSON-LD válido en las 19 páginas, sin enlaces internos rotos, sin `noindex` en el sitemap y sin textos de temporadas pasadas en Midnight.

## 2026-11-19 — Stats de Forever: «Cómo llegar al 8 % de golpe»
- Tabla nueva en `StatsForever.astro` (`#st-golpe`, en el índice) con las piezas del BiS pre-raid que dan golpe y el total (9 %). Datos en `golpe` de `forever-estadisticas.json` (solo `id` + `%`, leídos de los tooltips de Wowhead Forever el 19-11); nombre, icono, ranura y origen salen del catálogo y de la lista pre-raid (el build falla si una pieza deja de estar en ella). Reutiliza `lv-table` y `bf-obj`, con la variante `lv-table--objetos` (`forever.css`): primera columna a la izquierda (en Leveling va centrada porque es el nivel) y la de % centrada.
- Pregunta frecuente «¿Cuánto golpe necesita un Cazador?» en `faq-forever.json` y frase en el «En resumen» de Stats.

## 2026-11-19 — GEO: «En resumen», /llms.txt y preguntas de Macros (Forever)
- **«En resumen»** (respuesta directa de 2-3 frases bajo el H2 de cada pestaña, para que Google y las IA la citen): textos en `src/content/data/resumen.json` (por versión y pestaña) → `src/components/EnResumen.astro` (caja `box-tip`). Puesto en `SeccionForever.astro` (todas las de Forever) y en `Seccion{Mecanicas,Talentos,Stats,Rotacion,BiS,Mascotas,Macros}.astro` de Midnight.
- **`/llms.txt`** generado en el build (`src/pages/llms.txt.ts`): título y descripción de `seo.ts` + el «En resumen» de cada página indexable (mismo criterio que el sitemap) y enlaces del autor.
- **Preguntas frecuentes de Macros de Forever** (5) en `faq-forever.json` → bloque visible + `FAQPage` automáticos. Leveling ya tenía las suyas (`forever-leveling.json`).

## 2026-11-18 — Botón «Sígueme en TikTok» en el footer
- `BotonTikTok.astro` (nuevo): píldora oscura con borde degradado cian→rosa, logo de TikTok y destello, a juego con Ko-fi/RestedXP (bloque «TIKTOK» en `marca.css`, tokens `--tt-*`). Evento GA4 `tiktok_click` con `lugar` `footer-midnight|footer-forever`.
- Footer de Midnight (`GuideContent.astro`) y Forever (`GuideForever.astro`): TikTok + Ko-fi juntos en `.mk-footer__redes`.
- Mascotas de Forever (`MascotasTop5.astro`): «¿Lo prefieres en vídeo? Míralo en mi TikTok» bajo la intro del Top 5, con el botón en bajito (`compacto`, `.mk-tt--mini`; props `href`/`texto`) al vídeo del Top 5; `lugar` `video-top5`.

## 2026-11-18 — Ko-fi: texto y taza en crema suave
- Token `--kofi-text` (#eadfd4) en `tokens.css` en vez de `#fff` para el texto (también al pasar el ratón) y la taza de todos los botones Ko-fi (`BotonKofi.astro`, `ApoyoGuia.astro`): el blanco puro cansaba la vista.

## 2026-11-18 — «Apoya la guía» con el botón de Ko-fi y una vez por página
- `ApoyoGuia.astro`: el enlace de texto pasa a ser el botón `.mk-kofi` en bajito (`.mk-kofi--apoyo`, 34 px, en `marca.css`); final de Leveling igual con `BotonKofi`. Se muestra una vez por página y visita (`sessionStorage` `mk-apoyo:<ruta>`), no una sola vez en toda la web: antes, tras copiar una macro, las fichas de Mascotas ya no lo enseñaban.

## 2026-11-18 — Macros de Forever: la línea de Ko-fi ya no pisa el consejo
- `MacrosForever.astro`: el consejo va dentro de `.mf-card__pie` (4.ª fila de la rejilla `subgrid`) y `mkApoyo` añade la línea ahí. Antes era un 5.º hijo sin fila y se pintaba encima del consejo.

## 2026-11-18 — Título de la portada en Google
- `seo.ts` (`PORTADA`): «Guía Hunter BM Forever y Midnight: Cazador de Bestias en español» (Forever delante, que es lo que más se busca ahora; mantiene «Cazador de Bestias»). Descripción con «Maestro de bestias» y lo concreto de cada versión (31/20/0, mascotas, leveling 1-60; talentos, rotación, BiS). Antes: 6.587 impresiones y 3,1 % de clics en 3 meses.

## 2026-11-18 — BiS de Forever: SEO
- `seo.ts`: título «BiS pre-raid Hunter BM WoW Forever: equipo del Cazador de Bestias» (antes sin «Cazador de Bestias» ni «pre-raid»), descripción con nivel 60, dónde se consigue, arma, munición y carcaj, y H1 «BiS pre-raid del Cazador de Bestias en WoW Forever». Solo esta pestaña.
- `bis.md`: H2 con «pre-raid»; H3 «Equipo BiS del Cazador de Bestias por ranura» y entradilla con «Hunter BM» y «pre-raid».
- `faq-forever.json`: 4 preguntas de `bis` (BiS pre-raid, arma, qué armadura puede llevar, BiS de raid) → bloque visible + `FAQPage`.

## 2026-11-18 — BiS de Forever: lista pre-raid y selector «BiS pre-raid / BiS de raid»
- `forever-bis-equipo.json` pasa a `fases` (`preraid`, `raid`; cada una con `boton` y `ranuras`). `BisForever.astro` pinta una ventana de personaje por fase con selector arriba (`toggle-wrap`/`toggle-btn` de `marca.css`; script en línea, `#bf-raid` abre la de raid). Aviso «En construcción» (`construccion` de `forever-bis.json`) solo en la fase sin piezas.
- Pre-raid rellena (elegida por Mishuko entre las 3 listas encontradas el 18-11: wowforeverbislist.com, MythicSim y wow.gg; Icy Veins da 403 y Wowhead aún no tiene; nadie tiene BiS de raid): la de wowforeverbislist (BM, Alianza, 18-11), 18 piezas (Guja de legionita a dos manos, sin mano secundaria). Objetos añadidos al catálogo con `gen-forever-catalogo.mjs`. Sin fuentes a la vista (norma de Forever).
- Editor local: «Objetos BiS» guarda en la fase del panel pulsado (`fase` en `/__editor/catalogo` y `/bis`).
- Publicada en Google: fuera `noindex: true` de `bis.md` (entra en el sitemap y con JSON-LD), entrada en `changelog.json` y «BiS pre-raid» en el `estado` de Forever (`realms.ts`). Tras publicar: pedir indexación de `/forever/bis/` en Search Console (IndexNow lo hace `publicar.bat`).

## 2026-11-18 — BiS de Forever: ventana de personaje + «Objetos BiS» en el editor local (fases 3 y 4)
- **Página `/forever/bis/`** (`src/content/forever/paginas/bis.md`, nuevo): visible, pero con `noindex: true` (campo nuevo del esquema `foreverPaginas`): `PaginaForever.astro` pone `noindex` y sin JSON-LD, y `astro.config.mjs` la deja fuera del sitemap. Quitarlo cuando tenga objetos (y entonces añadir la entrada en `changelog.json`).
- **`BisForever.astro` rehecho**: ventana de personaje con el emblema del Cazador en el centro (aro de runas bronce que gira despacio, halo turquesa, «0 de 19 piezas elegidas», logo de Forever) y las 19 ranuras alrededor: 7 a la izquierda, 7 a la derecha (icono por fuera, como en el juego) y debajo armas (cuerpo a cuerpo, mano secundaria, a distancia, munición, carcaj/bolsa de munición). Ranura vacía = icono gris del juego (`inventoryslot_*` de zamimg) + «Por decidir». Con arma de dos manos, la mano secundaria sale «Ocupada por el arma de dos manos» y no cuenta. Debajo, «Ver el equipo en lista» (`<table>` plegada, para Google). Siguen arma a distancia por nivel, consumibles y encantamientos.
  - Responsive: 3 columnas ≥981 px; tableta: emblema arriba y 2 columnas; móvil ≤560: una columna. Sin animación con `prefers-reduced-motion`. Estilos `bf-*` en el bloque «BIS Y CONSUMIBLES» de `forever.css` (fuera los `.bf-slot-card` viejos); `--q-legendario` en `tokens.css`.
  - El contenedor era `class="bf"`, que choca con la clase de hechizos `bf` (inline + nowrap) y desbordaba la página: ahora `bf-pagina`.
  - Imagen central: emblema provisional (`classicon_hunter` en HD, `node scripts/icons-hd.mjs classicon_hunter`). Cuando Mishuko pase la imagen de los Hunters: ruta en `imagen` de `forever-bis-equipo.json`.
- **Datos**: `src/lib/ranuras-forever.mjs` (ranuras, qué texto de tooltip acepta cada una y qué puede llevar un Cazador: tela/cuero/malla, hachas, espadas, armas de asta, bastones, dagas, armas de puño, arcos, armas de fuego, ballestas, arrojadizas; fuera placas, mazas, escudos, varitas y objetos con «Clases:» sin Cazador). `forever-bis-equipo.json` (pieza por ranura: `{ id, origen }` o `null`). `forever-bis-catalogo.json` (objetos elegibles: nombre, calidad, icono, slot, tipo, nivel, ilvl, único, ranuras, origen sugerido), generado con `node scripts/gen-forever-catalogo.mjs [ids]` (lectura del tooltip en `scripts/editor-local/objeto-wowhead.mjs`). La lista pre-raid de nivel 60 que había en `forever-bis.json` (nunca publicada) pasa al catálogo como semilla, con su origen; `forever-bis.json` pierde `preraid`/`alternativas` y cambian `resumen` y `datos`.
- **Fuente de objetos**: la API de Blizzard necesita credenciales (no hay) y no está confirmado que tenga Forever; los listados de Wowhead bloquean descargas automáticas (403). Se usa el tooltip de un objeto concreto (`nether.wowhead.com/forever/tooltip/item/<id>?locale=6`, como `gen-forever-objetos.mjs`). Elegido por Mishuko: buscador en el catálogo + pegar ID/enlace de Wowhead.
- **Editor local**: botón «Objetos BiS» (solo si la página tiene `[data-bf-ranura]`). Pulsar una ranura → lista del catálogo filtrada a esa ranura (buscador sin tildes, del ilvl más alto al más bajo), campo «pega su enlace o ID de Wowhead Forever» (lo lee, comprueba que un Cazador lo pueda llevar y lo añade al catálogo), «Dónde se consigue» (se rellena con la sugerencia del catálogo), Guardar / Vaciar ranura. Endpoints nuevos `/__editor/catalogo`, `/objeto`, `/bis` (mismas protecciones). El servidor comprueba ranura, dos manos + mano secundaria y objetos únicos repetidos. «Publicar» incluye también el catálogo. El catálogo no se edita en modo texto.
- Tras la revisión de Mishuko: logo de Forever del centro nítido y más grande (`public/brand/realms/forever-360.webp`, 360 px sacado de `forever.webp`, mostrado a 180 px; antes el mini de 79 px a 120). Fuera «Arma a distancia para cada nivel» (`armas` de `forever-bis.json` y su entrada del índice; `gen-forever-objetos.mjs` lo tolera) y el grupo de consumibles «Subiendo de nivel». Todos los encantamientos con la etiqueta «Por confirmar». Caja «En construcción» dentro de «Equipo BiS por ranura» (texto en `construccion` de `forever-bis.json`; si se vacía, desaparece).

## 2026-11-18 — «Apoya la guía» (Ko-fi) en el momento de utilidad
- `ApoyoGuia.astro` (nuevo, en `PaginaForever`): define `window.mkApoyo(contenedor, lugar, intro, antes)` y `window.mkApoyoFicha(ficha, lugar)`. Inserta una línea de texto con enlace «Apoya la guía en Ko-fi» (sin pop-ups; Mishuko no quiere «invítame a un café»). Como mucho una vez por visita (`sessionStorage` `mk-apoyo`).
- Dónde: al copiar una macro (`MacrosForever.astro`, en esa tarjeta), al abrir la **2.ª** ficha de mascota (`MascotasTop5.astro` y `MascotasForever.astro`, al pie de la ficha, antes de Anterior/Siguiente) y una línea fija al final de Leveling (`LevelingForever.astro`).
- GA4: `kofi_click` con `lugar` = `apoyo-macro`, `apoyo-ficha-top5`, `apoyo-ficha-domesticar`, `apoyo-leveling`.
- Estilos `.mk-apoyo` al final de `marca.css` (bloque «APOYA LA GUÍA»): 15 px, `--text2`, enlace en `--kofi-hi`; aparición suave sin `prefers-reduced-motion`.

## 2026-11-18 — Midnight en Google, tiempo por página en GA4, TikTok y RestedXP en Talentos
- **Midnight**: título de `/midnight/bis/` «BiS Hunter BM Midnight Temporada 2: equipo y consumibles» y descripción con «Cazador de Bestias o Maestro de bestias» (`seo.ts`); la portada (`pages/index.astro`, bloque «Sobre la guía») enlaza a `/midnight/talentos/`, `/midnight/rotacion/` y `/midnight/bis/`. Motivo: «hunter bm bis» y similares, 234 impresiones y 0 clics.
- **GA4, tiempo por página** (`MainLayout.astro`): `gtag('set', {page_location, page_title, content_group})` antes del `page_view`, para que todos los eventos (user_engagement, scroll, kofi_click…) usen la misma ruta limpia `/<versión>/<pestaña>`. Antes el tiempo de lectura caía en la URL real con barra final y GA4 daba 0-20 s por página. Probado: `gtag('config')` repetido NO lo arregla; `set` sí.
- **GA4, navegador de la app de TikTok**: si el agente de usuario es de TikTok (`musical_ly|BytedanceWebview|TikTok|trill_`), no hay `utm_` y se llega desde fuera, se añade `utm_source=tiktok&utm_medium=social&utm_campaign=navegador-app` al `page_location`. Separa en GA4 la bio (`campaign=bio`) del resto de TikTok (`navegador-app`).
- **RestedXP en Talentos de Forever**: `RecomendacionRestedXP.astro` admite `seccion="talentos"` (texto propio con el 10 % de descuento; `lugar` = `talentos-banner`/`talentos-boton`); en `TalentosForever.astro`, bajo el aviso «¿Estás subiendo de nivel?».

## 2026-11-18 — Enlace corto /tiktok y etiquetas utm en GA4
- `public/tiktok/index.html`: redirección (meta refresh + `location.replace`) de `guiahunterbm.com/tiktok` a `/forever/?utm_source=tiktok&utm_medium=social&utm_campaign=bio`, para la bio de TikTok. `noindex` y fuera del sitemap (es un archivo de `public/`, no una página de Astro). Para cambiar el destino, editarlo ahí (dos sitios).
- `MainLayout.astro`: `page_location` del `page_view` ahora añade `location.search`. Antes se mandaba solo la ruta limpia y GA4 perdía las etiquetas `utm_*` (cualquier campaña salía como «directo»).
- `PENDIENTES.md` (nuevo): lista viva de tareas tras el análisis del 18-11 (`informes/analisis-2026-11-18.pdf`); enlazado desde `CLAUDE.md`.

## 2026-11-18 — Botón de RestedXP en la barra superior
- `BotonRestedXP.astro` (enlace de afiliado, `rel="sponsored"`, GA4 `afiliado_click` con `lugar`) en `RealmSwitch.astro`, antes del Ko-fi: en Midnight y Forever.
- Diseño propio: píldora azul noche con borde degradado cian→azul→violeta, logo de RestedXP (recortado con sharp de su banner de afiliado 728×90 → `public/brand/restedxp-logo.webp`, 64 px), «Rested**XP**» con XP en cian, etiqueta «Leveling» y un brillo que cruza cada 7 s (sin él con `prefers-reduced-motion`). Colores `--rxp*` en `tokens.css`; estilos en el bloque «RESTEDXP» de `marca.css`.
- Móvil: sin etiqueta ≤900 px, más pequeño ≤600 px y solo el logo ≤400 px.
- Ko-fi rediseñado a juego con RestedXP (en todos los sitios: barra superior, menú móvil, footers, portada, Coaching): píldora oscura `--kofi-deep` con borde degradado dorado→naranja→rojo (`--kofi-gold`, `--kofi`, `--kofi-heart`), brillo exterior y el mismo destello (`mk-rxp-brillo`) a los 5,5 s para no coincidir con el de RestedXP. Hueco del asa de la taza en `--kofi-deep`.
- Etiqueta del botón de la barra superior: «10% de descuento» en vez de «Leveling» (confirmado por Mishuko).
- Menú móvil (`TabBar.astro`): la fila de abajo se divide en dos (`.mk-sheet__apoyo`): RestedXP (logo + nombre) | Ko-fi «Apóyame» (nueva prop `texto` en `BotonKofi.astro`).
- Barra del menú móvil más visible: «Menú · <versión>» en vez de «Secciones · …» (en `text2`), fondo con un 9 % del color de marca y borde al 70 %. Primera visita: dos destellos a los 1,2 s (`.is-hint`, guardado en `localStorage` `mk-menu-visto`; sin animación con `prefers-reduced-motion`).
- Logo rehecho desde el banner reescalado x4 con Real-ESRGAN: 128 px (antes 64 px recortado del banner original).
- Leveling Forever: `RecomendacionRestedXP.astro` rehecho y subido arriba (tras los 4 hitos, antes de «Hoja de ruta»): banner oficial de afiliado 728×90 del dragón (`public/brand/rxp-rutas.webp`, reescalado x4 con Real-ESRGAN y guardado a 1456×180 para que no se vea pixelado; nombre y clase sin «banner» porque los bloqueadores de anuncios lo ocultaban), texto, botón «Ver RestedXP» y aviso de afiliado. GA4 `afiliado_click` con `lugar` `leveling-banner`/`leveling-boton`. Fuera el bloque antiguo (`.lv-addon*`) del final de Consejos; estilos nuevos `.lv-rxp*` en `forever.css`, colores `--rxp-text*` en `tokens.css`.

## 2026-11-18 — Editor local de Forever (fases 1 y 2) + RestedXP en Leveling
- **Editor local** (`scripts/editor-local/`): solo con `npm run dev`. `integration.mjs` (integración de Astro): inyecta `cliente.js` solo si `command === 'dev'` y crea `/__editor/buscar|guardar|color` en `astro:server:setup` (no existen en el build ni en la web). Solo POST desde 127.0.0.1/::1 con Host/Origin localhost, `X-Editor-Local: 1` y JSON; solo escribe en `forever-*.json`, `faq-forever.json` y `src/content/forever/paginas/*.md` (fuera los generados: talentos, mascotas, objetos).
  - Texto: el navegador manda el texto del bloque pulsado (y de sus padres); el servidor renderiza cada cadena con `md()` (vía `ssrLoadModule`) y busca la que coincide. Guarda cambiando solo ese literal del archivo (respeta formato, CRLF y números como `5.0`); si el texto sale varias veces cambia la aparición de esa ruta y comprueba que nada más cambie. En `.md` valida el YAML antes de escribir (si se rompería, avisa). Si el mismo texto está en varias pestañas, solo se cambia en los archivos de la pestaña abierta.
  - Color de palabra: nueva marca `[c=marca|ambar|violeta|oro|verde|rojo]texto[/c]` en `markup.ts` (clases `.txt-c--*` al final de `marca.css`).
  - Color de bloque: `src/content/data/forever-colores.json` (`{ tab: { selector: color } }`) → `ColoresForever.astro` (en `PaginaForever`) pinta borde izquierdo, títulos y `th` con la variable de la marca. Selectores validados con regex (`#id > tag:nth-of-type(n)…`), sin inyección. Si cambia la estructura de la página, un color puede dejar de aplicarse.
  - Fichas en `<dialog>` (mascotas, Top 5): `showModal()` las pone por encima de todo, así que los botones del editor se mueven dentro del dialog abierto (`MutationObserver` sobre `open`) y se pueden editar sus textos; Esc en el cuadro de texto no cierra la ficha.
  - Enlaces: `[texto](https://…)` o `[texto](/ruta/)` en `markup.ts` (externos con `target="_blank" rel="noopener"`; solo http(s) o rutas internas) y las URL sueltas se vuelven clicables. Botón «Enlace» en el editor.
  - Botón «Habilidad»: buscador (sin tildes) de `spells.json` con icono (`/__editor/hechizos`); inserta `[[Nombre]]` o `{{Nombre}}` (icono grande) y, si había texto seleccionado distinto, `[[Nombre>texto]]`.
  - Arrastrar para seleccionar y soltar fuera del cuadro ya no cierra la ficha (se anula ese clic). Al guardar se apunta en `sessionStorage` (`ed-volver`) la ficha abierta (`data-*-ficha` visible → pulsa su `data-*-abrir`), su scroll y el de la página, y se vuelve a abrir tras recargar.
  - Botón «Publicar»: `/__editor/publicar` → entrada opcional en `changelog.json` (texto del visitante + « en [pestaña]», `version: forever`) → `npm run build` (si falla, deshace la entrada y no publica) → `git commit` **solo** de los archivos del editor → abre `publicar.bat` en otra ventana. Esos commits («Editor local: cambios de contenido…») no llevan entrada en este historial.
- **Leveling Forever**: `RecomendacionRestedXP.astro` (enlace de afiliado, `rel="sponsored"`, evento GA4 `afiliado_click`) al final de la sección de tramos; estilos `.lv-addon*` en `forever.css`.

## 2026-11-18 — Forever: Ta'shkal como #0 del Top 5 de mascotas
- Gato secreto descubierto el 16-11-2026 (hilo de Petopia t=27409; Icy Veins). Datos de Wowhead Forever es-ES: PNJ **268231**, «Escaped Experiment», nivel 58 (Normal), felino, **Ataque más rápido VII** (vel. 1.00), Monte Hyjal (zona 616; coords 26.4-26.6, 64.4-65.4). Habilidades del PNJ en Wowhead: Acechar y Pavor (`viene`). Se invoca en el farol «Lonely Lantern» con la **Figurilla de gato corrupta** (objeto 276909, charcas de sangre vil de Felblood Scar). Al domarlo pasa a llamarse «Felino».
- `forever-mascotas-top5.json`: nueva entrada `puesto: 0` al principio (rareza «Secreto», `exclusivo`). Mapa: `classicplus/maps/eses/original/616.jpg` de zamimg (la ruta `classic` no tiene Hyjal; `mapa` admite URL).
- Retrato `public/pets/tashkal.webp`: cabeza ilustrada que pasó Mishuko (ChatGPT, fondo blanco 1254 px). Fondo quitado con relleno desde los bordes (no toca colmillos ni ojos), recortada en medallón de 284 px sobre fondo vil, con aro verde vil y filo naranja (sharp). Modelo 3D de Wowhead: displayId 9230.
- Trato especial del #0: rango y velocidad en verde de la marca, aura vil que late detrás del retrato (`t5-aura`, se quita con `prefers-reduced-motion`), ficha con brillo exterior y bloque de velocidad como el dorado de la #1 pero en verde. Roles: PvP, Mazmorras y Leveo.
- Rejilla del Top 5: 3 columnas fijas desde 901 px (6 tarjetas = 3 y 3).
- SEO: título «Mejores mascotas Hunter WoW Forever: Top 5 y Ta'shkal», descripción con «gato secreto de Hyjal» y 1,0 s, H3 e índice con Ta'shkal, 2 preguntas nuevas en `faq-forever.json` (cómo se consigue Ta'shkal, dónde está la Figurilla de gato corrupta) que salen en el bloque visible y en `FAQPage`. Enlace al TikTok: lo pone Mishuko.
- `MascotasTop5.astro`: texto de intro con el #0 e insignia `t5-badge--secreto`. `forever.css`: estilos `.t5-card--0`/`.t5-ficha--0` (verde de la marca, etiqueta «Nuevo · Secreto»). `seo.ts`: `ItemList` numera por orden (`i + 1`) porque schema.org empieza en 1. `faq-forever.json`: mención de Ta'shkal en «mejor mascota».

## 2026-11-17 — Coaching de Forever con precios públicos
- `SeccionCoaching.astro`: nuevo campo `precios` en `TEXTOS` (Midnight `null` = sigue «Consulta el precio conmigo en Discord»; Forever con precios). Forever enseña Sesión individual 25 € (≈ 27 USD) y Coaching Pro 79 €/mes (≈ 86 USD al mes), la etiqueta «Precio de lanzamiento · 5 plazas al mes» y los botones «Reservar por Discord». Estilos `.price-launch`, `.price-period`, `.price-usd`.
- No se menciona la pestaña oculta `errores`: solo existe en Midnight.

## 2026-11-16 — Forever: «Dónde domesticar cada habilidad» en fichas con mapa
- `#pf-domesticar` (`MascotasForever.astro`): las 23 tarjetas largas pasan a una cuadrícula de tarjetas pequeñas (icono, nombre, «Solo <familia>» con candado o «Todas las familias», nº de rangos) en «Habilidades comunes» y «Habilidades propias de cada familia». El bloque del instructor sigue igual, debajo de las comunes.
- Al pulsar, ficha en `<dialog>` como la del Top 5 (reusa `.t5-dlg`, `.t5-ficha__head/__nav`, `.t5-x`, `.t5-map`, `.t5-copy`): descripción, selector Alianza/Horda (uno por ficha, todos sincronizados, recuerda `fv-faccion` en `localStorage`), los rangos con sus bestias como antes y Anterior/Siguiente (también flechas; Esc cierra). Evento GA4 `domesticar_ficha`.
- SEO: las 23 fichas se pintan en el servidor (ocultas en el `<dialog>`), con nombres de bestias y zonas en el HTML. Solo el mapa se dibuja con JS, con los datos en `<script type="application/json" id="pf-mapas">` (avistamientos agrupados a 1 punto de mapa para pesar poco).
- Anclas: `#pf-<habilidad>` (ids en las tarjetas) abre su ficha al cargar, con `hashchange` y al pulsar enlaces internos (las tarjetas de familia); la ficha abierta pone su `#pf-<id>` en la URL (replaceState) y lo quita al cerrar.
- «Ver en el mapa» por bestia: mapa de zamimg classic es-ES con avistamientos (puntos) y hasta 3 pines; cada pin copia `/way <zona> x y <nombre>` para TomTom. Sin coordenadas (mazmorras, zonas sin imagen en zamimg) no sale el botón.
- `scripts/gen-forever-mascotas.mjs`: guarda por bestia `mapa` (id de zona de zamimg), `zonaMapa` (nombre es-ES del mapa: a veces no es la zona de Petopia, p. ej. Trabalomas → Alterac), `puntos` y `pines` (3 grupos por k-medias, ajustados al avistamiento real más cercano), todo del mismo tooltip de Wowhead Forever (`nether.wowhead.com/forever/tooltip/npc/<id>`, `map.zone`/`map.coords`). Comprueba con HEAD que zamimg tenga la imagen del mapa. Va despacio (0,6 s entre peticiones, caché por NPC y zona). Añadida Moonglade (493) a `ZONA_ID`; nombres sin traducir de Wowhead (`[Vale Screamer]`) se quedan sin corchetes. Fecha de `fuente` automática.
- Al regenerar, Petopia ya tenía más rangos descubiertos: cambian algunas bestias (rangos intermedios/máximos de Telaraña, Veneno de escórpido, Aliento de relámpagos, Desgarro salvaje, Desgarre de tendón, Desmembramiento, Nube de polvo, ¡Mío!, Chirrido desmoralizador, Mordedura, Zarpa, Pavor) y Explosión sónica (murciélago) ya tiene bestias.
- CSS: bloque «Dónde domesticar» en `forever.css` (`.pf-grid`, `.pf-card*`, `.pf-dlg`, `.pf-ficha*`, `.pf-mapbtn`, `.pf-mapa`); fuera `.pf-ab*` y `.pf-taming-top`. Móvil: cerrar, Anterior/Siguiente, «Ver en el mapa» y copiar ≥ 44 px.
- Arreglo (móvil): la X de la ficha no cerraba y enseñaba el tooltip de la habilidad. El `touchstart` del tooltip de `bm-guide.js` hace `preventDefault` en todo lo que tenga `data-name`, y la cabecera lo tenía. Ahora el tooltip va solo en icono y nombre (`.pf-ficha__id`); ningún botón de la ficha queda dentro de un `[data-name]`.

## 2026-11-16 — SEO: imagen propia por pestaña, datos estructurados y búsquedas de Leveling y Mascotas
- Análisis de Search Console (9-15 nov): Forever trae casi todos los clics; Mascotas con 1.014 impresiones y CTR 1,9 %; Leveling y Rotación de Forever sin impresiones (pendientes de indexar).
- Imágenes por pestaña: `scripts/og-images.mjs` (reescrito) genera en `public/og/<versión>/<pestaña>` el `.jpg` 1200×630 (og:image/twitter) y `-1x1`/`-4x3`/`-16x9.webp` (JSON-LD, las tres proporciones que pide Google), con todo centrado para que el recorte de la miniatura de Google no corte nada (antes el logo iba a la izquierda y el texto a la derecha). Mascotas de Forever lleva los 5 retratos del Top 5 (el #1 en el centro); Leveling, carcaj/armas; Forever usa iconos HD locales y Midnight el logo. Portada en `public/og/portada*`. `og-image.png`/`og-forever.png` se dejan (respaldo de `OG`).
- `seo.ts`: `ogImagenes(realm, tab)` (si falta la imagen usa la de la versión); `MainLayout` la usa con `defaultTab`. Article con `image` (3 proporciones), `datePublished` (primera entrada del changelog, `firstChangeDate` en `changelog.ts`), `isPartOf` y autor con `sameAs` (YouTube y TikTok). Mascotas de Forever: `ItemList` del Top 5. Robots: `max-snippet:-1, max-video-preview:-1`.
- General de Forever: título acortado a «Guía Hunter BM WoW Forever: Cazador de Bestias» (Google lo cortaba en «(B…»). Migas de pan: el 2.º nivel se llama solo «WoW Forever» / «Midnight» (antes «guía hunter bm › guía hunter bm wow forever»).
- Títulos/descripciones de Forever: Talentos («Mejores talentos…»), Rotación (opener), Mascotas («Mejores mascotas… Top 5 pets del Cazador»), Leveling (munición, flechas, carcaj, bolsa de munición, pets).
- Preguntas nuevas: Leveling (`forever-leveling.json`: dónde conseguir carcaj, bolsa de munición, para qué sirven, mejor munición, mejor pet para subir) y Mascotas (`faq-forever.json`: mejor mascota, mejor pet para subir, dónde domesticar a Diente partido).
- Encabezados: «Las 5 mejores mascotas para Hunter BM en WoW Forever» (`MascotasTop5.astro`), «Mejores mascotas para subir de nivel» y «Mejor munición, carcaj y bolsa de munición» (`LevelingForever.astro`); tarjeta de Mascotas en General.

## 2026-11-16 — Coaching: Ko-fi en «¿Te ha servido la guía?» y etiqueta de Coaching Pro
- `SeccionCoaching.astro` (Midnight y Forever): la tarjeta «¿Te ha servido la guía?» tiene un tercer punto (apoyar en Ko-fi) y el botón `BotonKofi` debajo de «Escríbeme por Discord» (`.coach-tier__acciones`, evento `kofi_click` con `lugar` = `coaching-<versión>`). Textos retocados a petición de Mishuko.
- Etiqueta «Popular» de Coaching Pro: ya no va en `position: absolute` con `top: -12px` (en Forever el `clip-path` de la tarjeta la cortaba y salía del recuadro dorado); ahora va dentro, arriba a la izquierda, antes del título.

## 2026-11-16 — Botón de apoyo en Ko-fi
- Botón discreto «Invítame a un café» → `https://ko-fi.com/mishuko` en el footer de Midnight y Forever (a la derecha; centrado debajo en móvil) y bajo la línea final de la portada. Sustituye a la franja descartada `ApoyoMishuko.astro` (Macros, 2026-11-15): Mishuko quería solo un botón.
- No se carga el widget de Ko-fi (`Widget_2.js`): enlace propio que copia el botón oficial de Ko-fi para que se reconozca (Mishuko: un botón con los colores de la web pasaba desapercibido). Píldora naranja (`--kofi` en `tokens.css`, igual en todas las versiones), taza blanca con corazón en SVG en línea, texto blanco en negrita sin mayúsculas. Al pasar el ratón se aclara, sube y la taza se inclina (sin movimiento con `prefers-reduced-motion`).
- También en la barra superior de las guías (versión pequeña «Apóyame» junto al selector Midnight | Forever; en móvil ≤600 px solo la taza) y a todo lo ancho en el menú móvil, debajo de Coaching y Cerrar.
- Evento GA4 `kofi_click` con `lugar` (`footer-midnight`, `footer-forever`, `portada`, `cabecera-<versión>`, `menu-movil-<versión>`) para ver cuál funciona.
- Archivos: `src/components/BotonKofi.astro`, `GuideContent.astro`, `GuideForever.astro`, `RealmSwitch.astro`, `TabBar.astro`, `src/pages/index.astro`, bloque «APOYO KO-FI» en `marca.css`, `--kofi*` en `tokens.css`.

## 2026-11-16 — Forever: retratos en medallón del Top 5 de mascotas
- Retratos = medallones con las cabezas ilustradas que pasó Mishuko (tira de 5 con aro dorado). Del original solo se toma la ilustración de dentro del aro (r 123,5 px); el aro se dibuja nuevo con SVG (degradado metálico, dorado en la #1 y verde de la marca en el resto, con borde oscuro y brillo interior) más una viñeta interior. Así no hay cortes donde el pelo tapaba el aro original. La tira venía achatada en vertical (aro 135 × 127,5 px): se corrige al recortar. 284 px con transparencia en `public/pets/<id>.webp`.
- Se probó dejar asomar por encima del aro orejas/melena, pero quedaban puntas sueltas: descartado.
- `.t5-port` solo da tamaño (`--s`: 132 px tarjeta, 100 px ficha, 80 px en pantallas bajas), sombra (brillo dorado en la #1) y salto al pasar el ratón. Ficha comprobada sin scroll a 1024×768.

## 2026-11-16 — Forever: Top 5 mascotas (estilo Pokédex) en Mascotas
- Sección `#pf-top5` al principio de `/forever/mascotas/` (primera del índice): 5 tarjetas (#1 → #5) con filtro por uso (Leveo, Mazmorras, PvP, Tanqueo AoE) y ficha en `<dialog>` con Anterior/Siguiente (también flechas del teclado): retrato (icono de familia), rareza y nivel, enlace al modelo 3D de Wowhead, mapa de la zona (zamimg classic es-ES) con todos los avistamientos en puntos y los principales como pines (pasar el ratón / tocar = coordenadas), reaparición y consejo, velocidad de ataque destacada (cifra grande, barra y golpes por minuto; sin salud/armadura/daño de familia, a petición de Mishuko), dieta, habilidad que enseña al domesticarla, qué enseñarle (sin repetir lo que ya trae), por qué es top y cuándo usarla. Evento GA4 `mascota_ficha`. El tooltip propio (`#tooltip`) se mueve dentro del modal mientras está abierto.
- Datos en `src/content/data/forever-mascotas-top5.json`. Nombres, nivel, zona y coordenadas de Wowhead Forever es-ES; velocidad y habilidad al domesticar de Petopia Forever. Nombres oficiales distintos de los del guion del vídeo: Broken Tooth = **Diente partido**, The Rake = **El Rastrillo**, Slavering Worg = **Lupo esclavizante**, Spiteflayer = **Escupetripas** (no «Despellejador»). Isla de Zephras no tiene mapa en Wowhead: Mishuko pasó una captura del juego, recortada a 3:2 en `public/maps/isla-de-zephras.webp` (`mapa` admite número de zamimg o ruta local). Melenaniebla en 60.0, 33.3 (RareScanner, Mishuko), bajo las Ruinas de Ban'Aethal; como el mapa está recortado, el pin lleva `mx`/`my` (posición en la imagen) además de las coordenadas del juego. Respawns aproximados (Wowhead no los da); Melenaniebla 15 min - 1 h (dato de Mishuko). Ficha en 2 columnas (izquierda: retrato, insignias, mapa y caza; derecha: velocidad, dieta, habilidades y análisis) con Anterior/Siguiente abajo. En escritorio cabe sin scroll: el mapa encoge con la altura de la pantalla (`max-width: calc((100dvh - 520px) * 1.5)`, centrado) y con `max-height: 720px` todo se compacta (comprobado de 1100×650 a 1920×950). Se probó una versión de 3 columnas y Mishuko prefirió esta. La ficha se centra con `position: fixed; inset: 0; margin: auto` (el reset global quitaba el margen del `<dialog>`).
- Retratos: miniatura del modelo de cada bestia (zamimg `modelviewer/classicplus/webthumbs/npc/<displayId % 256>/<displayId>.webp`, displayId sacado de la página de Wowhead Forever) guardada en `public/pets/<id>.webp`; sustituyen al icono de familia en tarjeta y ficha.
- Copiar al pulsar: `/tar <Nombre>` junto a «Ver modelo 3D» y cada coordenada copia `/way <Zona> <x> <y> <Nombre>` para TomTom (botones `.t5-copy[data-t5-copiar]`, aviso «Copiado»; `navigator.clipboard` con respaldo `execCommand`). Para que siga cabiendo sin scroll, el mapa en escritorio usa `calc((100dvh - 565px) * 1.5)` (comprobado 1024×768 y 1366×657).
- Archivos: `src/components/forever/MascotasTop5.astro`, `MascotasForever.astro`, bloque «TOP 5 MASCOTAS» en `forever.css`, `changelog.json`, `public/pets/`, `public/maps/`.

## 2026-11-15 — SEO on-page, menú móvil y lectura en móvil
- **Nombres:** títulos con «Cazador de Bestias» (lo más buscado); subtítulo del H1 de Midnight con «Maestro de bestias»; descripción de General y portada con ambos; `alternateName`/`about` del JSON-LD con los dos; `og:locale:alternate` es_MX. Forever mantiene «Dominio de bestias» (nombre del árbol en Classic) y sus títulos de pestaña pasan de «Beast Mastery Hunter» a «Hunter BM».
- **Preguntas frecuentes:** `src/components/Faq.astro` (`realm`, `tab`, `titulo`) al final de cada pestaña + `FAQPage` en `guideJsonLd` (seo.ts, `FAQ[realm][tab]`). Textos en `src/content/data/faq-midnight.json` y `faq-forever.json` (solo información que ya está en la guía). Leveling de Forever mantiene su propio FAQ.
- **Tablas:** Midnight: resumen de builds en Talentos (+ nota de que la rotación/opener de Dark Ranger están en desarrollo), BiS por ranura plegable, especializaciones de mascota como `<table>` real. Forever: `TablaForever.astro` (plegable «Ver en tabla», generada de los mismos JSON) en Talentos, Stats, Mascotas y Rotación.
- **Builds de Midnight en el HTML:** `SeccionTalentos.astro` las pinta en el servidor (para buscadores); `renderBuilds` de bm-guide.js las vuelve a pintar igual y añade los enlaces de Wowhead. Si cambias el marcado, cambia ambos.
- **Un solo H1 por página:** Coaching y Simulación pasan a H2 (`.mk-h-intro`, mismo aspecto).
- **Menú móvil (≤900 px):** `TabBar.astro` añade barra inferior (`.mk-dock`) que abre un panel desde abajo (`.mk-sheet`) con iconos del juego, cambio de versión, Coaching y botón «volver arriba»; la barra de pestañas superior se oculta en móvil. Estilos «MENÚ MÓVIL» en `marca.css`.
- **Cabecera compacta en móvil** y «Últimos cambios» plegable (`<details>`, se cierra en móvil antes de pintar). Aviso de Forever: «Recién lanzado» (sustituye los avisos de la beta a nivel 30 en cabecera, General, Stats, Talentos, BiS y Leveling).
- **Lectura en móvil:** bloque «LECTURA EN MÓVIL» al final de `marca.css` (texto 16 px, secundarios 14,5 px, etiquetas ≥12,5 px, tablas 15 px, botones ≥44 px). Entrada de página más rápida (`mk-rise-soft`).
- **Portada móvil:** las dos tarjetas lado a lado en una pantalla; se quita el enlace extra «O ve directo al leveling» de `realms.ts`.
- **Forever General:** bloque «Lo esencial en 30 segundos» (`esencial` en `forever-general.json`). Rotación con índice `IndiceForever`.
- **Arreglos:** orden de Stats AoE de Midnight (Versatilidad 5.ª, Celeridad 6.ª); «Perneras en espiral de víbora merodeadora» en BiS; alt descriptivos en BiS, consumibles, Simulación y Coaching.
- Pendiente: imagen de «Talentos por Boss» cargada desde `imgs.search.brave.com` (cambiarla por una propia).
- Arreglo (después del primer commit): la barra del menú móvil pasa a ir pegada al borde inferior y a todo el ancho; su entrada es solo de opacidad (antes subía 24 px y, si la animación no llegaba a ejecutarse —pestaña en segundo plano, navegador de TikTok/Instagram—, se quedaba medio fuera de la pantalla).

## 2026-11-15 — Forever: pestaña Stats (BiS preparada, sin publicar)
- `/forever/estadisticas/` con contenido (deja de ser `noindex` y entra en el sitemap al existir su `.md`). **BiS sigue «en preparación»** por decisión de Mishuko: el componente y los datos están hechos pero sin `src/content/forever/paginas/bis.md`; para publicarla basta con crear ese `.md` (`tab: bis`, `bloques: []`). Datos de guías de Forever (Icy Veins, wow.gg, Mobalytics, Timesaver, wowtbc.gg, WoWVendor), sin citarlas en la web. Se avisa de que son **provisionales** (beta hasta nivel 30).
- Stats: `StatsForever.astro` + `src/content/data/forever-estadisticas.json` (cabecera con datos, aviso, prioridad en 6 tarjetas numeradas `st-rank`, leveling / nivel 60 en columnas `gn-col`, notas de mascota y arma de melé, «Sigue con la guía»). Estilos «STATS» en `forever.css`.
- BiS: `BisForever.astro` + `src/content/data/forever-bis.json` (a mano: pre-raid 60 en tarjetas por ranura `bf-slot-card` con borde del color de calidad, arma a distancia por nivel Alianza/Horda, consumibles, encantamientos). Nombres es-ES, calidad e icono en `forever-objetos.json`, **generado** con `node scripts/gen-forever-objetos.mjs` (Wowhead Forever es → Classic es → nombre inglés si no hay traducción). Enlaces a Wowhead Forever es con icono propio (`data-wh-icon-added`). Estilos «BIS Y CONSUMIBLES» en `forever.css`; colores de calidad `--q-*` en `tokens.css`.
- `estado` de Forever en `realms.ts` incluye stats. Entrada en `changelog.json` (solo Stats).

## 2026-11-15 — Forever: pestaña Macros
- `/forever/macros/` con contenido (deja de ser `noindex` y entra en el sitemap al existir `macros.md`). 15 macros en 4 grupos (esenciales, daño, mascota, utilidad), sacadas de guías de Forever (Warcraft Tavern y RankedBoost; sin citarlas en la web, regla de Forever).
- Diseño del resto de Forever (`lv-*`/`gn-*` + bloque «MACROS» en `forever.css`, clases `mf-*`): cabecera con 4 datos, índice, «Cómo crear una macro» en 4 pasos con icono, caja de idioma y una sección por grupo con tarjetas de 2 columnas (icono de la habilidad con tooltip, etiqueta, código y botón «Copiar» con el estilo dorado de «Guardar imagen» de Talentos: reutiliza `.tc-shot`/`.tc-shot-wrap`; evento GA4 `macro_copiar`). Las tarjetas usan `subgrid` (4 filas: cabecera, texto, código, nota) para que el código quede a la misma altura en cada fila. Texto y nota de las tarjetas sin tooltips (`plano()`: `[[Hechizo]]` → negrita). No usa `.macro-card` de Midnight.
- Selector **Inglés / Español** del cliente: cada `pre` lleva `data-en` / `data-es` y el script cambia el código de todas (recuerda la elección en `localStorage` `fv-macro-idioma`). Por defecto inglés.
- Para añadir macros: un bloque más en `src/content/data/forever-macros.json` (`hechizo` = icono; `desc`/`tip` con `[[Hechizo]]` y `` `código` ``; el componente falla el build si un hechizo no está en `spells.json`).
- Se descarta la franja de donativo Ko-fi (`ApoyoMishuko.astro`, que estaba sin commit): Mishuko no la quiere.
- `estado` de Forever en `realms.ts` incluye macros. Entrada en `changelog.json`.
- Archivos: `src/components/forever/MacrosForever.astro`, `src/content/data/forever-macros.json`, `src/content/forever/paginas/macros.md`, `GuideForever.astro`.

## 2026-11-15 — Forever: «Guardar imagen» de los talentos
- Botón «Guardar imagen» en la barra de la calculadora (todas las builds: Raid, Leveling con su nivel del deslizador, Calculadora; también en la pestaña Leveling). Descarga un PNG 2160×~1660 (`talentos-forever-<build>-<reparto>.png`) dibujado en canvas (no captura del DOM): 3 árboles con fondos, flechas, iconos y rangos, y el diseño de las stories de TikTok (IDENTIDAD.md: fondo negro verdoso, lima, Barlow Condensed, esquinas cortadas, rayas y logo difuminado): cabecera con logo y «GUÍA HUNTER BM», chip con el nombre de la build, reparto y nivel, pie con botón lima «GUIAHUNTERBM.COM/<ruta>» y @mishuko.wow. Evento GA4 `talentos_imagen`. Botón destacado en dorado (como `.gn-banner__btn`): icono de cámara (SVG en línea), más grande, resplandor dorado (en `.tc-shot-wrap`, porque el `clip-path` recorta el `drop-shadow` del propio botón) y un brillo que lo recorre cada 3 s (sin animación con `prefers-reduced-motion`).
- En lima aunque Forever sea turquesa (las stories van en lima). Paleta fija en el JS (el canvas no lee `var()`). Iconos/fondos de zamimg con `crossOrigin` (mandan `Access-Control-Allow-Origin: *`).
- Archivos: `public/scripts/forever-talentos.js` (bloque «IMAGEN»), `src/components/forever/CalculadoraTalentos.astro` (iconos y fondos en `FV_TALENTOS`, `.tc-actions`), `src/styles/forever.css`.

## 2026-11-15 — Forever: calculadora de talentos editable (a9cf4b5)
- Pestaña Talentos: tercer botón «Calculadora» junto a «Raid y mazmorras» y «Leveling (con orden)». Árbol vacío donde se suman y quitan puntos con las reglas clásicas (5 puntos por fila, prerequisito al máximo, 51 máx.; no deja quitar un punto que rompa un talento superior). Clic +1, clic derecho / Mayús+clic −1; teclado Enter/+ y −/Supr; móvil: tocar +1, mantener pulsado −1 y botón «Quitar puntos». «Vaciar todo», × por árbol, puntos restantes. Lo montado se conserva al cambiar de build y volver.
- Solo en Talentos: prop `calculadora` de `CalculadoraTalentos.astro` (Leveling no la pasa). El JS trata la build `editable`; el resto siguen en solo lectura.
- Archivos: `src/components/forever/{CalculadoraTalentos,TalentosForever}.astro`, `public/scripts/forever-talentos.js`, `src/styles/forever.css`.

## 2026-11-14 — General de Forever rediseñada y Leveling destacado
- General (`/forever/`): el contenido pasa de `mecanicas.md` (queda solo con título) a `src/content/data/forever-general.json`, pintado por `GeneralForever.astro` con el diseño de Leveling (clases `lv-*` + bloque "GENERAL" en `forever.css`): resumen con 4 datos, banner a Leveling, índice, qué cambia (tarjetas con etiqueta Nuevo/Cambia), qué hereda la mascota (4 cifras), puntos fuertes/débiles, 4 mecánicas, razas en tarjetas (facción y «Recomendada») y «Sigue con la guía».
- Talentos (`/forever/talentos/`) con el mismo diseño: `TalentosForever.astro` + `src/content/data/forever-talentos-guia.json` (resumen con 4 datos, banner a la build de leveling, índice, calculadora, talentos clave en dos columnas con icono, puntos flexibles en tarjetas con etiqueta «Cuándo» y rangos entrenables). `talentos.md` queda solo con el título. «Rangos entrenables» ya **sin precios** (están en Leveling → Instructor).
- Mascotas (`/forever/mascotas/`) con el mismo diseño: cabecera con 4 datos, banner a «Mascotas para subir», índice, aviso, «Cómo enseñar» en 4 pasos con icono y secciones con separador (familias, dónde domesticar). Textos en `src/content/data/forever-mascotas-guia.json`; `mascotas.md` queda solo con el título; `MascotasForever.astro` pinta también la cabecera.
- Leveling: «Habilidades que debe tener» 2 por fila y «Consejos» 3 por fila (1 en móvil); «Armas» al final, oculta: solo se ve el aviso «En construcción» (`armas.enConstruccion: true` en el JSON; ponerlo a false para mostrar la tabla).
- Mascotas: selector Alianza/Horda con icono de estandarte y el color de cada facción.
- Coaching de Forever con el diseño nuevo: reglas `#tab-coaching` en `forever.css` (solo se carga en Forever; Midnight no cambia).
- Índice de página compartido: `IndiceForever.astro` (botones dorados, también en Leveling).
- Pestaña Leveling justo después de General con etiqueta «Nuevo» (`nuevo: true` en `tabs.ts`, `.mk-tab__new` en `marca.css`).
- Portada: la tarjeta pasa de `<a>` a `<div>` con enlace que la cubre (`.pt-card__link`) para poder llevar un enlace secundario (`extra` en `realms.ts`): Forever → «O ve directo al leveling 1-60».
- Archivos: `GeneralForever.astro`, `IndiceForever.astro`, `forever-general.json`, `mecanicas.md`, `GuideForever.astro`, `LevelingForever.astro`, `tabs.ts`, `TabBar.astro`, `marca.css`, `forever.css`, `realms.ts`, `index.astro`, `portada.css`.

## 2026-11-14 — Leveling 1-60 de Forever
- Nueva pestaña `/forever/leveling/`: índice (`INDICE` en el componente), 4 hitos (10/25/40/60), hoja de ruta por tramos (1-10 … 50-60) con selector y campo «¿Qué nivel eres?» (recuerda el nivel en `localStorage`), y en cada tramo talentos, munición y carcaj, mascota y claves. Después: «Instructor: qué comprar y qué no»: las 121 habilidades y rangos del instructor por nivel (lista y precios de Mishuko; iconos y descripciones de los tooltips de Wowhead Forever es-ES), clasificadas en Cómpralas / Opcionales / Sáltatelas con su motivo, filtro, totales (todo, recomendado y ahorro) y, en cada tramo, el coste de lo recomendado. Precios: un número suelto = cobre a nivel 1, plata hasta el 30 y oro desde el 32; dos números = plata y cobre hasta el 28, oro y plata desde el 40, la calculadora de talentos con la build de leveling ya elegida (`CalculadoraTalentos build="leveling" solo`: props nuevos, `solo` quita las demás builds y el selector; el JS lee `data-tc-inicial`), escalera de munición, tablas de munición especial y carcajes, mascotas recomendadas, habilidades de mascota, cuándo cambiarla y consejos.
- Datos en `src/content/data/forever-leveling.json`. Los talentos por tramo salen solos del `orden` de la build `leveling` (`forever-builds.json`); familias de `forever-mascotas.json`. Munición y carcajes: tooltips de Wowhead Forever es-ES (`nether.wowhead.com/forever/tooltip/item/<id>?locale=6`), enlaces a `wowhead.com/forever/es/item=<id>`.
- Nombres corregidos a mano (Wowhead es los trae mal o en inglés): «Flecha con punta de torio» (Wowhead: «Espada con punta de torio»), «Carcaj/Bandolera de Ribbly», «Balas de cañón en miniatura».
- Instructor en 2 columnas (`columns` en `.lv-ins-levels`), totales con texto claro y color legible. Filtros arreglados: `.lv [hidden] { display: none !important }` (las piezas con `display: grid` ignoraban `hidden`). Separador entre secciones (línea con rombo de la marca, `.lv-sec::before/::after`).
- Carcajes: selector centrado con icono «Carcaj (flechas)» / «Bolsa de munición (balas)» que cambia entre dos tablas (`data-q`), cada una con su lista (`municion.carcajes` y `municion.bolsas`, de la lista de carcajes de Wowhead Forever leída en el navegador, 2026-11-14): 13 carcajes y 8 bolsas con origen (vendedor, peletería, misión, botín, Valle de Alterac). Botón «Venta de NPC» → `#sold-by`. Faltriquera de munición pequeña y Faltriquera de pólvora fina fuera: en Forever no tienen fuente conocida. La faltriquera de cuero pesado es solo de peletería. En la hoja de ruta, carcaj y bolsa por separado.
- «Cómo pelear mientras subes» (`combate` en el JSON, **borrador de Claude** para que lo corrija Mishuko): selector Un enemigo / Se te pega / Varios a la vez / Entre combates, pasos numerados con icono y tooltip.
- «Armas a distancia para subir» (`armas`): tabla agrupada por tramo con DPS, origen y botón «Venta de NPC»; las «Mejor opción» resaltadas. Datos de los tooltips de Wowhead Forever es-ES (solo armas con nombre traducido).
- «Preguntas frecuentes» (`faq`): desplegables y JSON-LD `FAQPage` en la propia sección (texto plano, sin mini-formato).
- Orden de secciones: ruta → cómo pelear → instructor → talentos → mascotas → consejos → armas → munición y carcaj → preguntas frecuentes. Tablas en caja cerrada con cabecera dorada y filas alternas.
- «Orden de talentos» de la calculadora (también en Talentos) en columnas: de arriba abajo y luego la siguiente (`columns` en `.tc-order`).
- Estilos en el bloque "LEVELING" de `forever.css` (letra e iconos más grandes que en otras pestañas, a petición de Mishuko). SEO de la pestaña y `estado` de `realms.ts` actualizados.
- Archivos: `LevelingForever.astro`, `GuideForever.astro`, `forever-leveling.json`, `leveling.md`, `forever.css`, `seo.ts`, `realms.ts`, `changelog.json`, `CalculadoraTalentos.astro`, `public/scripts/forever-talentos.js`.

## 2026-11-14 — Ahorro de uso: publicar.bat
- `publicar.bat` (doble clic): `git push` + espera 60 s + `node scripts/indexnow.mjs`. El push lo hace Mishuko; Claude deja el commit hecho.
- `CLAUDE.md`: sección «Ahorro de uso» (revisa Mishuko en local, sin capturas de Claude; sin esperar al deploy).

## 2026-11-14 — Rotación de Forever
- Nueva pestaña Rotación de Forever (`/forever/rotacion/`): 3 ideas clave, lista antes del combate, selector Un objetivo / Área, escalera de prioridades con etiquetas por tipo, línea de tiempo de 36 s (relojes de 6 s, halcones, Aguijón, Tiro automático), inicio del combate en 7 pasos, tarjetas de cooldowns, «Júntalos con» y utilidad. Textos y errores frecuentes en `rotacion.md`.
- Datos en `src/content/data/forever-rotacion.json` (lo pinta `RotacionForever.astro`, que falla en el build si un hechizo no está en `spells.json`). Estilos en el bloque "ROTACIÓN" de `forever.css`.
- «Antes de empezar»: 3 tarjetas con icono grande y tooltip (`antes` en el JSON: `hechizo`, `cuando`, `texto`) y la mascota centrada debajo (`antesMascota`). Hover en iconos (sube y brilla con el color de su tipo) y tarjetas, número grande de fondo en las claves; sin movimiento con `prefers-reduced-motion`.
- Ciclo de 36 s animado (`CicloForever.astro`, uno por modo): reproducir/pausa, reiniciar, x1/x2/x4, reloj, cabezal, piezas que se iluminan al tocar, barras que se rellenan, carga de Puntería y panel «Ahora: pulsa / Siguiente en N s» con una nota por momento (`ciclos.<modo>.notas`). Clic en la línea = saltar a ese segundo. Arranca sola al verse (no con movimiento reducido) y se para fuera de pantalla o al cambiar de modo. Sin JS se ve estática. El script sigue en `RotacionForever.astro` (una sola vez para las dos).
- Área (2 a 7 enemigos): mismo ritmo, Multidisparo (instantáneo) en el reloj 2 y Trampa explosiva cada 30 s con su recarga. 8+ enemigos sin ciclo fijo (nota). Tiro automático cada 3 s (arma 3,0 de ejemplo, `ciclos.velocidadArma`) y **también durante Tiro de puntería** (notas de desarrollo de Blizzard, 16-10-2026: «still fire Auto Shot while casting… Aimed Shot»): esos disparos van en dorado (sin etiqueta, para no distraer) y lo explica una nota bajo la línea. Multidisparo en cuadradito como Puntería. Aguijón también en área (solo en enemigos que duren >15 s), con textura de veneno (rayas y burbujas lentas; quietas con movimiento reducido). Panel «Ahora» de altura fija (2 líneas de nota; en móvil, mínimo 304 px) para que la página no salte. En móvil, columna de nombres estrecha y fija.
- Forever ya no tiene pestaña Opener: el inicio del combate va dentro de Rotación (`TABS_FOREVER`).
- `spells.json`: hechizos nuevos (trampas, Golpe de raptor, Picadura de víbora, Llamar a mascota…) y campo opcional `iconForever` (icono distinto en Forever; lo usan `markup.ts` y `foreverIcon()` en `spells.ts`). `icons-hd.mjs` también lee `forever-rotacion.json`.
- Enlaces `#opener` desde otra página (`/forever/#opener`, `/midnight/#opener`) no redirigían (opener no tiene botón): ahora van a `/<versión>/rotacion/#opener` (`bm-guide.js`); en Forever la sección del inicio del combate lleva `id="opener"`.
- Fuentes: WoWTBC pone Multidisparo en un objetivo; se sigue la mayoría (solo Tiro de puntería, comparten reutilización).
- Archivos: `RotacionForever.astro`, `GuideForever.astro`, `forever-rotacion.json`, `rotacion.md`, `forever.css`, `spells.json`, `spells.ts`, `markup.ts`, `tabs.ts`, `realms.ts`, `changelog.json`, `scripts/icons-hd.mjs`.

## 2026-11-14 — Search Console e IndexNow
- Search Console: enviado `sitemap-index.xml` (estado Correcto) y reenviado `sitemap-0.xml`. Google no conocía `/forever/` ni `/midnight/talentos/`; el resto ya salía "Descubierta" por el sitemap.
- Indexación solicitada (cola prioritaria) el 2026-11-14: `/forever/`, `/forever/talentos/`, `/forever/mascotas/`, `/`, `/midnight/`, `/midnight/talentos/`. Límite diario alcanzado: **pendiente** `/forever/coaching/`, `/midnight/bis/`, `/midnight/rotacion/` (pedirlas otro día).
- IndexNow (Bing, Yandex…): clave en `public/<clave>.txt` y `scripts/indexnow.mjs`; enviadas las 14 URL del sitemap (HTTP 202).
- Archivos: `public/2bc3f289da037de495de3fd9daa2fbcf.txt`, `scripts/indexnow.mjs`, `CLAUDE.md`.

## 2026-11-14 — Coaching de Forever
- Nueva pestaña Coaching en Forever (`/forever/coaching/`, en `TABS_FOREVER` con `cta`). Mismo componente que Midnight: `SeccionCoaching.astro` con prop `version` y textos en `TEXTOS[version]` (Midnight sin cambios). En Forever fuera Raidbots/Top Gear/Optimizer, Gran Cámara y Archon; dentro rotación con Invocar halcón y maná, mascota, leveling y profesiones.
- Entrada en `changelog.json` (Forever, coaching).
- Archivos: `src/components/SeccionCoaching.astro`, `src/components/forever/GuideForever.astro`, `src/lib/tabs.ts`, `src/content/data/changelog.json`.

## 2026-11-14 — SEO: una página por pestaña, títulos, JSON-LD, robots y sitemap
- Search Console (28 días hasta 10-11): las consultas con más impresiones son «cazador bestias midnight» (64), «guia cazador bestias midnight» (51), «talentos cazador bestias midnight» (29); todas las impresiones iban a `/`. Ningún título decía «Cazador».
- **Una página por pestaña**: `/midnight/<tab>/` y `/forever/<tab>/` (`[tab].astro` + `PaginaMidnight`/`PaginaForever`), cada una solo con su panel, su título, descripción, H1 (subtítulo de la cabecera) y JSON-LD (Article + BreadcrumbList, autor Mishuko como Person, `dateModified` del changelog). General sigue en `/midnight/` y `/forever/`.
- **Sin romper enlaces**: `/#tab` y `/<versión>/#tab` (y alias `#mec`, `#rot`…) redirigen con `location.replace` a la página; `#opener` → `/<versión>/rotacion/#opener`. Pestañas = enlaces `<a>`. Comprobadas 26 URL (200) y todas las redirecciones en local.
- Pestañas de Forever sin contenido: página con `noindex` (no 404) y fuera del sitemap.
- `src/lib/seo.ts` (rutas, títulos con «Hunter» y «Cazador de Bestias», descripciones, JSON-LD, OG); portada con H1 de palabras clave, texto y enlaces; imagen para redes de Forever (`scripts/og-images.mjs`); `public/robots.txt`; sitemap con `lastmod` y filtro (`astro.config.mjs`); enlaces del pie entre guías; Analytics con la misma ruta limpia de siempre.
- Archivos: `src/lib/seo.ts`, `src/pages/{index,midnight/index,midnight/[tab],forever/index,forever/[tab]}.astro`, `src/components/guide/{GuideContent,PaginaMidnight}.astro`, `src/components/forever/{GuideForever,PaginaForever}.astro`, `src/components/{TabBar,Header,SeccionMecanicas,SeccionBiS}.astro`, `src/layouts/MainLayout.astro`, `public/scripts/bm-guide.js`, `public/robots.txt`, `public/brand/og-forever.png`, `scripts/og-images.mjs`, `astro.config.mjs`, `src/styles/{marca,portada}.css`, `CLAUDE.md`.

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
