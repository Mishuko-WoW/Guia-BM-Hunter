# Pendientes y mejoras — guiahunterbm.com y TikTok

Lista viva de lo que queda por hacer. **Leer al empezar cada sesión.** Marcar `[x]` al terminar (con fecha) y mover a «Hecho» abajo.
Origen: análisis del 18-11-2026 → `informes/analisis-2026-11-18.pdf` (datos en `informes/datos-2026-11-18/`).
Quién: **M** = Mishuko · **C** = Claude (web) · **X** = Codex (vídeos).

---

## 1. Urgente (esta semana, mientras dura el tirón de Forever)

- [ ] **Marcar `afiliado_click` como evento clave en GA4** (C o M, 2 min) cuando aparezca el primer clic: Administrar → Eventos → Eventos recientes → estrella. Esperado 19-20 nov. (18-11, 17:00: aún no aparecía.)

## 2. Mejoras de la web (código, C)

- [ ] ❓ *Mishuko pidió explicación (18-11)* · **Títulos y descripciones de `/forever/mascotas/` y la portada** (30 min) en `src/lib/seo.ts`. Mascotas: 1.432 impresiones y 3,7 % de clics; portada: 6.587 y 3,1 %. Talentos, con un título concreto («build 31/20/0»), saca un 10 %. Meter al principio «dónde domar», «Top 5», «Ta'shkal»; portada: «Guía Hunter BM» + «Forever y Midnight».
- [ ] ❓ *Mishuko pidió explicación (18-11): no quiere pop-ups molestos* · **Ko-fi en el momento de utilidad** (1-2 h): tras «Copiar macro», tras abrir 3 fichas de mascota y al final de Leveling («¿Te he ahorrado oro? Invítame a un café»). Hoy: 1 clic de Ko-fi entre 821 personas.
- [ ] ⏸ *De momento no (Mishuko, 18-11)* · **Ampliar Mascotas** (2-4 h): mejor mascota para PvE, bestias raras por zona, tiempos de reaparición (lo preguntan en los comentarios de TikTok).

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

- [ ] Repetir el análisis hacia el **2-12-2026** (dos semanas) para medir: tráfico de TikTok con la etiqueta, clics de RestedXP por `lugar`, Ko-fi tras los cambios, posición en Google.
- [ ] Core Web Vitals: hoy «sin datos suficientes»; mirar cuando haya más tráfico.
- [ ] Robots en GA4 (≈40 usuarios de China y ≈30 de EE. UU./Reino Unido sin interacción): no hace falta filtrar por ahora.

---

## Hecho

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
