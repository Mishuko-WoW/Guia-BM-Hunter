// Árbol de talentos de WoW Forever (CalculadoraTalentos.astro). Las builds son SOLO LECTURA: muestra la elegida
// y su tooltip por rango. Datos en window.FV_TALENTOS. La build de leveling se pinta hasta el nivel del deslizador.
// La build `editable` (botón "Calculadora", solo en la pestaña Talentos) empieza vacía y permite sumar/quitar
// puntos con las reglas clásicas: 5 puntos por fila, prerequisito al máximo y 51 puntos en total.
(function () {
  const D = window.FV_TALENTOS;
  const root = document.getElementById('tc');
  if (!D || !root) return;

  const T = Object.fromEntries(D.talentos.map((t) => [t.id, t]));
  const prereq = Object.fromEntries(D.flechas.map((f) => [f.hasta, f.desde]));
  const nombreArbol = Object.fromEntries(D.arboles.map((a) => [a.id, a.nombre]));

  const MAX_PUNTOS = 51;
  let puntos = {};
  let buildActual = D.builds[0];
  let calcPuntos = {}; // lo montado en la calculadora se conserva al cambiar de build y volver
  let modoQuitar = false;

  const total = () => Object.values(puntos).reduce((s, v) => s + v, 0);
  const ptsArbol = (arbol, fila = 99) =>
    Object.entries(puntos).reduce((s, [id, v]) => (T[id].arbol === arbol && T[id].fila < fila ? s + v : s), 0);
  const disponible = (t) => {
    if (ptsArbol(t.arbol, t.fila) < t.fila * 5) return false;
    const p = prereq[t.id];
    return !p || (puntos[p] || 0) === T[p].max;
  };

  function textoTooltip(t, n) {
    const tipo = [`Rango ${n}/${t.max}`, t.meta].filter(Boolean).join(' · ');
    let desc = t.rangos[Math.max(0, n - 1)] || '';
    if (n > 0 && n < t.max) desc += `\n\nSiguiente rango:\n${t.rangos[n]}`;
    if (n === 0) {
      const req = [];
      if (t.fila > 0) req.push(`Requiere ${t.fila * 5} puntos en ${nombreArbol[t.arbol]}`);
      if (prereq[t.id]) req.push(`Requiere ${T[prereq[t.id]].max} puntos en ${T[prereq[t.id]].nombre}`);
      if (req.length) desc += `\n\n${req.join('\n')}`;
    }
    return { tipo, desc };
  }

  // ─── Calculadora: sumar y quitar puntos ───
  // Tras quitar, todo talento con puntos debe seguir cumpliendo sus requisitos.
  function repartoValido() {
    return Object.entries(puntos).every(([id, n]) => {
      if (!n) return true;
      const t = T[id];
      if (ptsArbol(t.arbol, t.fila) < t.fila * 5) return false;
      const p = prereq[id];
      return !p || (puntos[p] || 0) === T[p].max;
    });
  }
  function sumar(id) {
    const t = T[id];
    const n = puntos[id] || 0;
    if (n >= t.max || total() >= MAX_PUNTOS || !disponible(t)) return;
    puntos[id] = n + 1;
    render();
  }
  function quitar(id) {
    const n = puntos[id] || 0;
    if (!n) return;
    puntos[id] = n - 1;
    if (!repartoValido()) puntos[id] = n;
    if (!puntos[id]) delete puntos[id];
    render();
  }
  const editable = () => !!buildActual.editable;
  // El tooltip (bm-guide.js) copia el texto al entrar: tras cambiar el rango se actualiza aquí
  function refrescarTip(el) {
    const tip = document.getElementById('tooltip');
    if (!tip || !tip.classList.contains('visible')) return;
    const ty = document.getElementById('tt-type');
    const de = document.getElementById('tt-desc');
    if (ty) ty.textContent = el.dataset.type || '';
    if (de) de.textContent = el.dataset.desc || '';
  }
  root.querySelectorAll('[data-tc-talent]').forEach((el) => {
    const id = el.dataset.tcTalent;
    // Móvil: bm-guide.js anula el click en touchstart (para su tooltip), así que tocar = sumar
    // (o quitar con el botón "Quitar puntos") y mantener pulsado medio segundo = quitar.
    let timer = null;
    let largo = false;
    let toque = 0;
    el.addEventListener('touchstart', () => {
      if (!editable()) return;
      largo = false;
      toque = Date.now();
      timer = setTimeout(() => { largo = true; quitar(id); refrescarTip(el); }, 500);
    }, { passive: true });
    el.addEventListener('touchmove', () => clearTimeout(timer), { passive: true });
    el.addEventListener('touchend', (e) => {
      if (!editable()) return;
      clearTimeout(timer);
      e.preventDefault();
      if (!largo) { if (modoQuitar) quitar(id); else sumar(id); refrescarTip(el); }
    });
    el.addEventListener('click', (e) => {
      if (!editable()) return;
      if (modoQuitar || e.shiftKey) quitar(id);
      else sumar(id);
      refrescarTip(el);
    });
    el.addEventListener('contextmenu', (e) => {
      if (!editable()) return;
      e.preventDefault();
      if (Date.now() - toque < 1500) return; // pulsación larga en Android: ya la gestiona touchstart
      quitar(id);
      refrescarTip(el);
    });
    el.addEventListener('keydown', (e) => {
      if (!editable()) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === '+') { e.preventDefault(); sumar(id); }
      else if (e.key === '-' || e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); quitar(id); }
    });
  });
  const btnMinus = root.querySelector('[data-tc-minus]');
  if (btnMinus) btnMinus.addEventListener('click', () => {
    modoQuitar = !modoQuitar;
    btnMinus.classList.toggle('active', modoQuitar);
    btnMinus.setAttribute('aria-pressed', String(modoQuitar));
  });
  const btnReset = root.querySelector('[data-tc-reset]');
  if (btnReset) btnReset.addEventListener('click', () => { puntos = {}; render(); });
  root.querySelectorAll('[data-tc-tree-reset]').forEach((btn) =>
    btn.addEventListener('click', () => {
      // Vaciar un árbol nunca rompe los otros (los requisitos son dentro del mismo árbol)
      Object.keys(puntos).forEach((id) => { if (T[id].arbol === btn.dataset.tcTreeReset) delete puntos[id]; });
      render();
    }),
  );

  function render() {
    root.querySelectorAll('[data-tc-talent]').forEach((el) => {
      const t = T[el.dataset.tcTalent];
      const n = puntos[t.id] || 0;
      el.querySelector('[data-tc-rank]').textContent = `${n}/${t.max}`;
      el.classList.toggle('is-max', n === t.max);
      el.classList.toggle('is-partial', n > 0 && n < t.max);
      el.classList.toggle('is-locked', n === 0);
      el.classList.toggle('is-avail', editable() && n === 0 && disponible(t) && total() < MAX_PUNTOS);
      const { tipo, desc } = textoTooltip(t, n);
      el.dataset.type = tipo;
      el.dataset.desc = desc;
      el.setAttribute('aria-label', `${t.nombre} ${n}/${t.max}`);
    });
    root.querySelectorAll('[data-tc-arrow]').forEach((el) => {
      el.classList.toggle('is-on', disponible(T[el.dataset.tcArrow]));
    });
    D.arboles.forEach((a) => {
      const b = root.querySelector(`[data-tc-tree-pts="${a.id}"]`);
      if (b) b.textContent = ptsArbol(a.id);
    });
    const tot = total();
    root.querySelector('[data-tc-split]').textContent = D.arboles.map((a) => ptsArbol(a.id)).join(' / ');
    root.querySelector('[data-tc-level]').textContent = tot ? tot + 9 : 10;
    const left = root.querySelector('[data-tc-left]');
    if (left) left.textContent = MAX_PUNTOS - tot;
    if (editable()) calcPuntos = { ...puntos };
  }

  function cargarBuild(id, nivel) {
    const b = D.builds.find((x) => x.id === id);
    if (!b) return;
    buildActual = b;
    puntos = {};
    if (b.editable) puntos = { ...calcPuntos };
    else if (b.orden) b.orden.slice(0, (nivel || 60) - 9).forEach((tid) => (puntos[tid] = (puntos[tid] || 0) + 1));
    else puntos = { ...b.puntos };

    root.querySelectorAll('[data-tc-build]').forEach((x) => x.classList.toggle('active', x.dataset.tcBuild === id));
    root.querySelectorAll('[data-tc-desc]').forEach((x) => (x.hidden = x.dataset.tcDesc !== id));
    root.querySelectorAll('[data-tc-copy]').forEach((x) => (x.hidden = x.dataset.tcCopy !== id));
    root.querySelector('[data-tc-name]').textContent = b.nombre;
    const lev = root.querySelector('[data-tc-leveling]');
    if (lev) lev.hidden = !b.orden;
    const ed = !!b.editable;
    root.classList.toggle('is-editable', ed);
    root.querySelectorAll('[data-tc-tools], [data-tc-tree-reset], [data-tc-help-calc]').forEach((x) => (x.hidden = !ed));
    root.querySelectorAll('[data-tc-help-ro]').forEach((x) => (x.hidden = ed));
    render();
    if (b.orden) pintarNivel(nivel || 60);
  }

  // ─── Leveling: deslizador de nivel y orden ───
  const slider = root.querySelector('[data-tc-slider]');
  const sliderOut = root.querySelector('[data-tc-slider-out]');
  function pintarNivel(nivel) {
    if (slider) slider.value = nivel;
    if (sliderOut) sliderOut.textContent = nivel;
    root.querySelectorAll('[data-tc-step]').forEach((li) => {
      const desde = Number(li.dataset.tcFrom);
      const hasta = Number(li.dataset.tcStep);
      li.classList.toggle('is-done', hasta <= nivel);
      li.classList.toggle('is-now', desde <= nivel && nivel < hasta);
    });
  }
  if (slider) slider.addEventListener('input', () => cargarBuild(buildActual.id, Number(slider.value)));
  root.querySelectorAll('[data-tc-step]').forEach((li) =>
    li.addEventListener('click', () => cargarBuild(buildActual.id, Number(li.dataset.tcStep))),
  );
  root.querySelectorAll('[data-tc-build]').forEach((btn) => btn.addEventListener('click', () => cargarBuild(btn.dataset.tcBuild)));

  // ─── IMAGEN: «Guardar imagen» de la build (Forever no tiene strings de importación) ───
  // Dibuja en un canvas los 3 árboles con el diseño de las stories de TikTok (IDENTIDAD.md del proyecto
  // TikTok: fondo negro verdoso, lima de marca, Barlow Condensed, esquinas cortadas) + logo y enlace a la web.
  // Colores de la marca Mishuko (los mismos que tokens.css en Midnight); el canvas no puede leer var().
  const C = {
    bg: '#0a0d09', card: '#121810', bar: '#161d13', border: '#243020', border2: '#34432d',
    lima: '#c4d70b', limaHi: '#dcef3a', text: '#eceee4', text2: '#a5ae9a', text3: '#6c7664',
    gold: '#e9c46a', green: '#6fbf4a', green2: '#a8db8a', off: '#4a5245',
  };
  const F = '"Barlow Condensed", "Arial Narrow", sans-serif';
  const FB = 'Barlow, system-ui, sans-serif';
  const LOGO = '/brand/mishuko-logo.webp';

  const cacheImg = {};
  function cargarImg(src) {
    if (!cacheImg[src]) {
      cacheImg[src] = new Promise((ok) => {
        const im = new Image();
        im.crossOrigin = 'anonymous'; // zamimg manda Access-Control-Allow-Origin: *
        im.onload = () => ok(im);
        im.onerror = () => ok(null); // sin icono se dibuja el hueco vacío
        im.src = src;
      });
    }
    return cacheImg[src];
  }
  // Rectángulo con esquinas cortadas en diagonal (arriba-izquierda y abajo-derecha), como --clip-card
  function corte(ctx, x, y, w, h, k) {
    ctx.beginPath();
    ctx.moveTo(x + k, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h - k);
    ctx.lineTo(x + w - k, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + k);
    ctx.closePath();
  }
  function redondo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function espaciado(ctx, txt, x, y, sp) { // texto con letras separadas (etiquetas)
    for (const ch of txt) { ctx.fillText(ch, x, y); x += ctx.measureText(ch).width + sp; }
    return x;
  }
  function anchoEspaciado(ctx, txt, sp) { return [...txt].reduce((s, ch) => s + ctx.measureText(ch).width + sp, 0) - sp; }

  async function dibujarImagen() {
    const W = 1080, PAD = 40, TW = 320, TG = 20;
    const CELL = 46, GX = 24, GY = 18, GPAD_T = 22, GPAD_B = 26, HEAD = 46;
    const GRID_H = GPAD_T + 7 * CELL + 6 * GY + GPAD_B;
    const TOP_TREES = 178, TREE_H = HEAD + GRID_H;
    const H = TOP_TREES + TREE_H + 130;
    const ESC = 2;

    await Promise.all([
      document.fonts ? document.fonts.load(`800 48px ${F}`) : null,
      document.fonts ? document.fonts.load(`italic 700 48px ${F}`) : null,
      document.fonts ? document.fonts.load(`700 20px ${F}`) : null,
      document.fonts ? document.fonts.load(`700 14px ${FB}`) : null,
    ].filter(Boolean)).catch(() => {});
    const imgs = {};
    const srcs = [LOGO, ...D.arboles.flatMap((a) => [a.icono, a.fondo]), ...D.talentos.map((t) => t.icono)];
    (await Promise.all(srcs.map(cargarImg))).forEach((im, i) => (imgs[srcs[i]] = im));

    const cv = document.createElement('canvas');
    cv.width = W * ESC; cv.height = H * ESC;
    const ctx = cv.getContext('2d');
    ctx.scale(ESC, ESC);
    const hayFiltro = 'filter' in ctx;

    // Fondo: negro verdoso, brillo oliva arriba a la izquierda, rayas lima suaves arriba a la derecha, logo difuminado
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    let g = ctx.createRadialGradient(120, 40, 0, 120, 40, 520);
    g.addColorStop(0, 'rgba(120,140,20,0.22)'); g.addColorStop(1, 'rgba(120,140,20,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath(); ctx.rect(W - 420, 0, 420, 260); ctx.clip();
    ctx.strokeStyle = 'rgba(196,215,11,0.07)'; ctx.lineWidth = 10;
    for (let i = -300; i < 700; i += 28) { ctx.beginPath(); ctx.moveTo(W - 420 + i, 0); ctx.lineTo(W - 420 + i + 260, 260); ctx.stroke(); }
    ctx.restore();
    if (imgs[LOGO]) {
      ctx.save(); ctx.globalAlpha = 0.07;
      if (hayFiltro) ctx.filter = 'blur(6px)';
      const L = 620; ctx.drawImage(imgs[LOGO], (W - L) / 2, (H - L) / 2 + 30, L, L);
      ctx.restore();
    }

    // Cabecera: logo + «WOW FOREVER · TALENTOS» / «GUÍA HUNTER BM» + subrayado lima
    if (imgs[LOGO]) ctx.drawImage(imgs[LOGO], PAD, 34, 96, 96);
    const hx = PAD + 112;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = C.text2; ctx.font = `700 17px ${F}`;
    espaciado(ctx, 'WOW FOREVER · TALENTOS', hx, 60, 3);
    ctx.fillStyle = C.text; ctx.font = `800 52px ${F}`;
    ctx.fillText('GUÍA HUNTER', hx, 108);
    const wGH = ctx.measureText('GUÍA HUNTER ').width;
    ctx.fillStyle = C.lima; ctx.font = `italic 700 52px ${F}`;
    ctx.fillText('BM', hx + wGH, 108);
    ctx.fillStyle = C.lima; ctx.fillRect(hx, 122, 64, 4);

    // Derecha: nombre de la build (chip oro), reparto grande y nivel
    const tot = total();
    const nivel = tot ? tot + 9 : 10;
    const reparto = D.arboles.map((a) => ptsArbol(a.id)).join(' / ');
    const xr = W - PAD;
    ctx.textAlign = 'right';
    ctx.font = `700 15px ${F}`;
    const chip = (buildActual.nombre || '').toUpperCase();
    const wc = anchoEspaciado(ctx, chip, 2.4) + 22;
    ctx.fillStyle = 'rgba(233,196,106,0.12)'; corte(ctx, xr - wc, 38, wc, 28, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(233,196,106,0.55)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.textAlign = 'left'; ctx.fillStyle = C.gold;
    espaciado(ctx, chip, xr - wc + 11, 58, 2.4);
    ctx.textAlign = 'right';
    ctx.fillStyle = C.text; ctx.font = `800 46px ${F}`;
    ctx.fillText(reparto, xr, 116);
    ctx.fillStyle = C.text2; ctx.font = `600 16px ${FB}`;
    ctx.fillText(`Nivel requerido ${nivel} · ${tot}/${MAX_PUNTOS} puntos`, xr, 142);
    ctx.textAlign = 'left';

    // Árboles
    const x0 = (W - (3 * TW + 2 * TG)) / 2;
    const gridW = 4 * CELL + 3 * GX;
    D.arboles.forEach((a, i) => {
      const tx = x0 + i * (TW + TG), ty = TOP_TREES;
      ctx.save();
      corte(ctx, tx, ty, TW, TREE_H, 14); ctx.clip();
      ctx.fillStyle = C.card; ctx.fillRect(tx, ty, TW, TREE_H);
      // cabecera del árbol
      ctx.fillStyle = C.bar; ctx.fillRect(tx, ty, TW, HEAD);
      ctx.fillStyle = C.border; ctx.fillRect(tx, ty + HEAD - 1, TW, 1);
      if (imgs[a.icono]) {
        ctx.save(); ctx.beginPath(); ctx.arc(tx + 30, ty + HEAD / 2, 15, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(imgs[a.icono], tx + 15, ty + HEAD / 2 - 15, 30, 30); ctx.restore();
      }
      ctx.fillStyle = C.text; ctx.font = `700 19px ${F}`;
      ctx.fillText(a.nombre, tx + 54, ty + 30);
      ctx.textAlign = 'right'; ctx.font = `700 18px ${F}`;
      const pa = ptsArbol(a.id);
      ctx.fillStyle = C.text2; ctx.fillText(' / 51', tx + TW - 14, ty + 30);
      const w51 = ctx.measureText(' / 51').width;
      ctx.fillStyle = pa ? C.lima : C.text; ctx.fillText(String(pa), tx + TW - 14 - w51, ty + 30);
      ctx.textAlign = 'left';
      // fondo original del árbol, oscurecido como en la web
      const gy0 = ty + HEAD;
      if (imgs[a.fondo]) ctx.drawImage(imgs[a.fondo], tx, gy0, TW, GRID_H);
      g = ctx.createLinearGradient(0, gy0, 0, gy0 + GRID_H);
      g.addColorStop(0, 'rgba(0,0,0,0.2)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = g; ctx.fillRect(tx, gy0, TW, GRID_H);

      const gx0 = tx + (TW - gridW) / 2, gyy = gy0 + GPAD_T;
      const pos = (t) => [gx0 + t.col * (CELL + GX), gyy + t.fila * (CELL + GY)];
      // flechas de requisito
      D.flechas.filter((f) => T[f.hasta].arbol === a.id).forEach((f) => {
        const d = T[f.desde], h = T[f.hasta];
        const [x, y1] = pos(d), [, y2] = pos(h);
        const cx = x + CELL / 2, top = y1 + CELL + 2, bot = y2 - 1;
        const col = disponible(h) ? C.gold : C.off;
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(cx - 3, top, 6, bot - 8 - top);
        ctx.fillStyle = col; ctx.fillRect(cx - 2, top, 4, bot - 8 - top);
        ctx.beginPath(); ctx.moveTo(cx - 7, bot - 8); ctx.lineTo(cx + 7, bot - 8); ctx.lineTo(cx, bot); ctx.closePath(); ctx.fill();
      });
      // talentos
      D.talentos.filter((t) => t.arbol === a.id).forEach((t) => {
        const [x, y] = pos(t);
        const n = puntos[t.id] || 0;
        const borde = n === t.max ? C.gold : n > 0 ? C.green : 'rgba(74,82,69,0.75)';
        if (n > 0) { ctx.save(); ctx.shadowColor = borde; ctx.shadowBlur = 12; ctx.fillStyle = borde; redondo(ctx, x, y, CELL, CELL, 5); ctx.fill(); ctx.restore(); }
        ctx.fillStyle = C.bg; redondo(ctx, x, y, CELL, CELL, 5); ctx.fill();
        const im = imgs[t.icono];
        if (im) {
          ctx.save(); redondo(ctx, x + 2, y + 2, CELL - 4, CELL - 4, 3); ctx.clip();
          if (n === 0 && hayFiltro) ctx.filter = 'grayscale(1) brightness(0.55)';
          ctx.drawImage(im, x + 2, y + 2, CELL - 4, CELL - 4);
          ctx.filter = 'none';
          if (n === 0 && !hayFiltro) { ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(x, y, CELL, CELL); }
          ctx.restore();
        }
        ctx.strokeStyle = borde; ctx.lineWidth = 2; redondo(ctx, x + 1, y + 1, CELL - 2, CELL - 2, 5); ctx.stroke();
        if (n > 0) { // rango, abajo a la derecha
          const txt = `${n}/${t.max}`;
          ctx.font = `700 12px ${FB}`;
          const bw = Math.max(30, ctx.measureText(txt).width + 8), bx = x + CELL + 10 - bw, by = y + CELL - 9;
          ctx.fillStyle = C.bg; redondo(ctx, bx, by, bw, 17, 3); ctx.fill();
          ctx.strokeStyle = C.border2; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = n === t.max ? C.gold : C.green2; ctx.textAlign = 'center';
          ctx.fillText(txt, bx + bw / 2, by + 13); ctx.textAlign = 'left';
        }
      });
      ctx.restore();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; corte(ctx, tx + 0.5, ty + 0.5, TW - 1, TREE_H - 1, 14); ctx.stroke();
    });

    // Pie: texto + botón lima con el enlace de la web y la cuenta de TikTok
    const fy = TOP_TREES + TREE_H + 36;
    const ruta = location.pathname.replace(/\/+$/, '') || '/forever/talentos';
    const enlace = ('guiahunterbm.com' + ruta).toUpperCase();
    ctx.font = `800 24px ${F}`;
    const bw = anchoEspaciado(ctx, enlace, 1.5) + 48, bh = 54, bx = W - PAD - bw;
    ctx.fillStyle = C.lima; corte(ctx, bx, fy, bw, bh, 12); ctx.fill();
    ctx.fillStyle = C.bg; espaciado(ctx, enlace, bx + 24, fy + 36, 1.5);
    ctx.fillStyle = C.text; ctx.font = `800 26px ${F}`;
    ctx.fillText('MONTA TU BUILD EN LA GUÍA', PAD, fy + 24);
    ctx.fillStyle = C.text2; ctx.font = `600 17px ${FB}`;
    ctx.fillText('Talentos, rotación, mascotas y leveling · TikTok @mishuko.wow', PAD, fy + 50);

    return cv;
  }

  const btnShot = root.querySelector('[data-tc-shot]');
  if (btnShot) btnShot.addEventListener('click', async () => {
    const lbl = btnShot.querySelector('[data-tc-shot-txt]') || btnShot;
    const txt = lbl.textContent;
    btnShot.disabled = true; lbl.textContent = 'Generando…';
    try {
      const cv = await dibujarImagen();
      const blob = await new Promise((ok) => cv.toBlob(ok, 'image/png'));
      const nombre = `talentos-forever-${buildActual.id}-${D.arboles.map((a) => ptsArbol(a.id)).join('-')}.png`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = nombre;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      if (typeof gtag === 'function') gtag('event', 'talentos_imagen', { build: buildActual.id });
      lbl.textContent = 'Imagen guardada';
    } catch (e) {
      console.error(e);
      lbl.textContent = 'No se pudo generar';
    }
    setTimeout(() => { lbl.textContent = txt; btnShot.disabled = false; }, 1800);
  });

  cargarBuild(root.dataset.tcInicial || D.builds[0].id);
})();
