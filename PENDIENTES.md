# Pendientes y mejoras — guiahunterbm.com y TikTok

Lista viva de lo que queda por hacer. **Leer al empezar cada sesión.** Marcar `[x]` al terminar (con fecha) y mover a «Hecho» abajo.
Origen: análisis del 18-11-2026 → `informes/analisis-2026-11-18.pdf` (datos en `informes/datos-2026-11-18/`).
Quién: **M** = Mishuko · **C** = Claude (web) · **X** = Codex (vídeos).

---

## 1. Urgente (esta semana, mientras dura el tirón de Forever)

- [ ] **62 sesiones «(sin definir)» con 0 % de interacción en GA4 desde el 18-11** (C, 30 min): antes solo había 1. Comprobar si las causa el `gtag('set')` de `MainLayout.astro` (sesiones sin `session_start`/fuente). **20-11:** el `page_view` ya sale al cargar el HTML (`DOMContentLoaded`) y no en `load`; comprobar el 2-12 si bajan y, si no, mirar país y dispositivo de esas sesiones en GA4 (pueden ser robots).

## 2. Mejoras de la web (código, C)

- [ ] **Midnight con el diseño de Forever** (C, pedido por Mishuko el 20-11): cada pestaña a JSON + componente con clases `lv-*`/`gn-*` (como `guide/GeneralMidnight.astro`). Hechas: General, Mascotas, Macros (Stats se queda con su diseño de antes, decisión de Mishuko 20-11). Faltan: Talentos, Rotación/Opener, BiS (pasar `SeccionBiS.astro` a datos), Simulación y Coaching. Mishuko revisa en local antes de publicar.
- [ ] **Propuestas de la auditoría SEO del 20-11** (C, decide M): ver detalle en CHANGELOG.md (2026-11-20).
  - Portada: título de 64 caracteres y descripción de 192 (Google corta hacia 60/155). Tras medir el 2-12, pasar a «Guía Hunter BM Forever y Midnight: Cazador de Bestias» (53) y una descripción ≤155.
  - «Cazador de Bestias» no cabe en el título sin perder lo concreto en Talentos, Stats, BiS, Macros y Simulación de Midnight ni en Talentos, Stats, Rotación y Macros de Forever (Talentos de Forever saca un 10 % así). Se deja; revisar el CTR de cada una el 2-12.
  - Coaching (las dos versiones) sin «En resumen» ni preguntas frecuentes: es página de venta; añadirlas solo si Mishuko quiere (precio, cómo se reserva, qué incluye).
  - Simulación de Midnight lleva el único `<main>` de la web y solo envuelve su panel: mejor un `<main>` en `MainLayout` para todas las páginas y quitar ese.
- [ ] ⏸ *De momento no (Mishuko, 18-11)* · **Ampliar Mascotas** (2-4 h): mejor mascota para PvE, bestias raras por zona, tiempos de reaparición (lo preguntan en los comentarios de TikTok).

- [ ] **BiS de Forever: pre-raid rellena (18-11); falta la de raid** cuando abran las raids (M, con el editor local, botón «Objetos BiS»). Ya en Google (sin `noindex`, 18-11). Pedir indexación de `/forever/bis/` en Search Console tras publicar.
- [ ] **BiS de Forever: imagen central** (M pasa la imagen de los Hunters; C la pone en `imagen` de `forever-bis-equipo.json`). Hoy: emblema provisional.

## 3. SEO fuera de la web (M)

- [ ] ⏰ *Recordárselo a Mishuko más adelante (18-11)* · **Primeros enlaces externos** (2-3 h repartidas): perfil de TikTok/YouTube/Twitch, Discord de hermandades, Reddit en español, comentarios útiles en Wowhead, página del add-on. Hoy hay **0 enlaces externos**; es lo que falta para pasar del puesto 6-7 al top 3.

## 4. Cómo hacer los vídeos de TikTok (para Codex y Mishuko)

Aprobado por Mishuko el 18-11 y avisado a Codex en `EQUIPO.md`. Datos de TikTok Studio a 18-11-2026 (detalle en `informes/datos-2026-11-18/tiktok.json`).

**La fórmula que funciona** (Bramido: 48.070 vistas, 1.421 guardados, 917 compartidos, 159 seguidores):
1. **Pregunta-problema en el primer segundo** («¿Tu pet solo tiene Bramido?»). En todos los vídeos la mayoría se va en el segundo 1: la primera imagen y la primera frase lo deciden todo.
2. **Un solo truco o una sola idea** por vídeo.
3. **Entre 40 y 50 s.** Los vídeos cortos de Midnight (14-33 s) se veían enteros un 24-42 %; los de Forever de 2-3 min, solo un 3-5 %.
4. **Cerrar con algo que dé ganas de guardar** («guárdalo para cuando…»). Guardar es la mejor señal: Top 5 de mascotas, 1.142 guardados el primer día.
5. **Las listas «Top» funcionan** (Top 5 mascotas: 17.000 vistas en un día).

**Otras reglas:**
- **Los vídeos largos no se borran**: el 12-18 % de sus vistas llega por el buscador de TikTok (duran meses). De cada largo, sacar **3-4 cortos**.
- **No hacer vídeos que solo anuncian la web** («La guía… toda en una web»: 1.152 vistas, el peor). La web va al final de un vídeo útil: «la lista completa en mi web, enlace en la bio».
- **RestedXP en los vídeos de leveling**: «10 % de descuento en RestedXP, enlace en mi bio» (el vídeo del instructor y el oro tuvo 11.799 vistas).
- **Responder con vídeo a los comentarios**: casi todos son preguntas concretas (mejor mascota PvE, dónde está una bestia, reaparición de Diente Partido). Son guiones gratis.
- **Mascotas es el tema estrella** (los 2 vídeos más vistos y lo más usado de la web).
- **Palabras que busca la gente** (en TikTok y en Google): «hunter wow forever», «cazador wow forever», «talentos hunter wow forever», «mascotas wow forever». Usarlas en el texto del vídeo y en los rótulos.
- **Público**: hombres (83 %) de 25-44 años; España + Latinoamérica (los seguidores son más latinoamericanos: España solo el 19 %). Español neutro.
- **Horario**: las publicaciones de las 17:00 y las 20:00 funcionan; no hay datos para afinar más.
- **Frecuencia**: un vídeo al día mientras dure el tirón de Forever (semanas, no meses).

## 5. Revisar más adelante

- [ ] Repetir el análisis hacia el **2-12-2026** (dos semanas) para medir: tráfico de TikTok con la etiqueta, clics de RestedXP por `lugar`, Ko-fi tras los cambios, posición en Google. Intermedio del 20-11 hecho: `informes/analisis-2026-11-20.md`. El 2-12, comparar también el CTR de Mascotas con el título nuevo (18-19-11: 6,7 % con +37 % de impresiones) y Talentos (−27 % de impresiones, misma posición).
- [ ] `tiktok_click` (botón del footer) y `utm_campaign=navegador-app`: 0 del 18 al 20-11. Si el 2-12 siguen a 0, revisar si funcionan. La etiqueta `bio` sí funciona (15 sesiones, 2 min 37 s de media).
- [ ] Core Web Vitals: hoy «sin datos suficientes»; mirar cuando haya más tráfico.
- [ ] Robots en GA4 (≈40 usuarios de China y ≈30 de EE. UU./Reino Unido sin interacción): no hace falta filtrar por ahora.

---

## Hecho

- [x] 2026-11-20 · RestedXP en cada tramo de Leveling de Forever (`lugar` leveling-tramo) y «10 % de descuento» en el banner. Medir clics por `lugar` el 2-12.
- [x] 2026-11-20 · Títulos y descripciones de Leveling («1-60 rápido: ruta y talentos») y Stats («golpe al 8 %») de Forever. Medir su CTR el 2-12.
- [x] 2026-11-20 · GA4: `afiliado_click` marcado como evento clave (3 clics del 18 al 20-11, todos desde `cabecera-forever`).
- [x] 2026-11-20 · Análisis intermedio (`informes/analisis-2026-11-20.md`, datos en `informes/datos-2026-11-20/`).
- [x] 2026-11-20 · Comprobado en GA4 que el tiempo por página ya da valores reales (Mascotas: 1 min 19 s; antes 5 s).
- [x] 2026-11-20 · Search Console: ya indexadas `/forever/bis/`, `/midnight/estadisticas/`, `/midnight/macros/`, `/midnight/simulacion/` y `/midnight/coaching/` (no hace falta mirar el 25-11).

- [x] 2026-11-20 · Auditoría SEO de las 19 páginas del sitemap: título de Mascotas de Forever con «Top 5» y «dónde domarlas» (medir CTR el 2-12, antes 3,7 %), títulos y descripciones recortados, «Sigue con la guía» en todas las pestañas (enlaces internos y entre versiones), resumen y preguntas en Simulación y Macros de Midnight, pregunta duplicada fuera en Stats de Forever, encabezados corregidos.
- [x] 2026-11-18 · Título y descripción de la portada en Google (`seo.ts`). Ver su CTR en la revisión del 2-12 (antes 3,1 %).
- [x] 2026-11-18 · «Apoya la guía» (Ko-fi) sin pop-ups: al copiar macro, en la 2.ª ficha de mascota y al final de Leveling; una vez por visita. Medir en GA4 `kofi_click` por `lugar` (apoyo-*) en la revisión del 2-12.
- [x] 2026-11-18 · Midnight: título de BiS y enlaces desde la portada a Talentos, Rotación y BiS de Midnight.
- [x] 2026-11-18 · GA4: tiempo por página arreglado con `gtag('set')` (comprobar en GA4 hacia el 20-11 que Páginas y pantallas ya da tiempos reales).
- [x] 2026-11-18 · GA4: detección del navegador de la app de TikTok (`utm_campaign=navegador-app`).
- [x] 2026-11-18 · RestedXP en Talentos de Forever (`lugar` talentos-banner / talentos-boton).
- [x] 2026-11-18 · Enlace corto `guiahunterbm.com/tiktok` (commit b25fb78) y GA4 conserva las `utm_*`; Mishuko lo pone en la bio de TikTok tras publicar.
- [x] 2026-11-18 · Search Console: revisadas una a una las 18 URL del sitemap. Ya estaban indexadas todas las de Forever y en Midnight `/`, `/midnight/`, talentos, bis, rotacion y mascotas (el informe de Páginas iba con retraso). Solicitada la indexación de las 4 que faltaban: `/midnight/estadisticas/`, `/midnight/macros/`, `/midnight/simulacion/`, `/midnight/coaching/`. Volver a mirar hacia el 25-11.
- [x] 2026-11-18 · GA4: la colección «Search Console» (Consultas y Tráfico de búsqueda orgánica) salió publicada sola al vincular; ya muestra datos.
- [x] 2026-11-18 · GA4: dimensiones de evento «Lugar del clic» (`lugar`) y «Tipo de afiliado» (`tipo`).
- [x] 2026-11-18 · GA4: `kofi_click` marcado como evento clave.
- [x] 2026-11-18 · GA4 vinculado con Search Console (`sc-domain:guiahunterbm.com` ↔ flujo «Guía Hunter BM»).
- [x] 2026-11-18 · Informe completo: `informes/analisis-2026-11-18.pdf`.
