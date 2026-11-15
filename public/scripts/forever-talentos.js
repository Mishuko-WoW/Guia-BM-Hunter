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

  cargarBuild(root.dataset.tcInicial || D.builds[0].id);
})();
