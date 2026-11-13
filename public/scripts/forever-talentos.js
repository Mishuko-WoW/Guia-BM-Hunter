// Árbol de talentos de WoW Forever (CalculadoraTalentos.astro), SOLO LECTURA: muestra la build elegida
// y su tooltip por rango. Datos en window.FV_TALENTOS. La build de leveling se pinta hasta el nivel del deslizador.
(function () {
  const D = window.FV_TALENTOS;
  const root = document.getElementById('tc');
  if (!D || !root) return;

  const T = Object.fromEntries(D.talentos.map((t) => [t.id, t]));
  const prereq = Object.fromEntries(D.flechas.map((f) => [f.hasta, f.desde]));
  const nombreArbol = Object.fromEntries(D.arboles.map((a) => [a.id, a.nombre]));

  let puntos = {};
  let buildActual = D.builds[0];

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

  function render() {
    root.querySelectorAll('[data-tc-talent]').forEach((el) => {
      const t = T[el.dataset.tcTalent];
      const n = puntos[t.id] || 0;
      el.querySelector('[data-tc-rank]').textContent = `${n}/${t.max}`;
      el.classList.toggle('is-max', n === t.max);
      el.classList.toggle('is-partial', n > 0 && n < t.max);
      el.classList.toggle('is-locked', n === 0);
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
  }

  function cargarBuild(id, nivel) {
    const b = D.builds.find((x) => x.id === id);
    if (!b) return;
    buildActual = b;
    puntos = {};
    if (b.orden) b.orden.slice(0, (nivel || 60) - 9).forEach((tid) => (puntos[tid] = (puntos[tid] || 0) + 1));
    else puntos = { ...b.puntos };

    root.querySelectorAll('[data-tc-build]').forEach((x) => x.classList.toggle('active', x.dataset.tcBuild === id));
    root.querySelectorAll('[data-tc-desc]').forEach((x) => (x.hidden = x.dataset.tcDesc !== id));
    root.querySelectorAll('[data-tc-copy]').forEach((x) => (x.hidden = x.dataset.tcCopy !== id));
    root.querySelector('[data-tc-name]').textContent = b.nombre;
    const lev = root.querySelector('[data-tc-leveling]');
    if (lev) lev.hidden = !b.orden;
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

  cargarBuild(D.builds[0].id);
})();
