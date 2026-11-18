// ─── EDITOR LOCAL: parte del navegador (solo se inyecta con `npm run dev`, ver integration.mjs) ───
(() => {
  if (!location.pathname.startsWith('/forever') || window.__edLocal) return;
  window.__edLocal = true;

  const COLORES = [
    ['marca', 'var(--brand)'], ['ambar', 'var(--pl)'], ['violeta', 'var(--dr)'],
    ['oro', 'var(--gold)'], ['verde', 'var(--green)'], ['rojo', 'var(--red)'],
  ];
  let modo = null; // null | 'texto' | 'color'
  let marcado = null;

  const css = document.createElement('style');
  css.textContent = `
    #ed-ui{position:fixed;left:12px;bottom:12px;z-index:99999;font:14px/1.4 system-ui,sans-serif;color:#eee}
    #ed-ui button{font:inherit;cursor:pointer;border:1px solid #555;background:#222;color:#eee;padding:6px 10px;border-radius:4px;min-height:34px}
    #ed-ui button.on{background:#c4d70b;color:#111;border-color:#c4d70b}
    #ed-bar{display:flex;gap:6px;background:#111d;padding:6px;border-radius:6px;box-shadow:0 2px 10px #0008}
    #ed-pan{margin-bottom:8px;background:#151515;border:1px solid #444;border-radius:6px;padding:10px;width:min(560px,calc(100vw - 24px));box-shadow:0 4px 20px #000a}
    #ed-pan textarea{width:100%;min-height:140px;box-sizing:border-box;background:#0c0c0c;color:#eee;border:1px solid #444;padding:8px;font:14px/1.45 ui-monospace,Consolas,monospace;resize:vertical}
    #ed-pan .fila{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;align-items:center}
    #ed-pan .sw{width:30px;min-height:30px!important;padding:0!important;border-radius:50%!important}
    #ed-pan small{color:#aaa;display:block}
    #ed-pan .err{color:#ff7b7b}
    .ed-hover{outline:2px dashed #c4d70b!important;outline-offset:2px;cursor:pointer!important}
    .ed-hover-c{outline:2px dashed #4fc4cf!important;outline-offset:3px;cursor:crosshair!important}
  `;
  document.head.append(css);

  const ui = document.createElement('div');
  ui.id = 'ed-ui';
  ui.innerHTML = `<div id="ed-pan" hidden></div>
    <div id="ed-bar"><button data-m="texto">Editar texto</button><button data-m="color">Color de bloque</button></div>`;
  document.body.append(ui);
  const pan = ui.querySelector('#ed-pan');

  // Las fichas (<dialog> con showModal) tapan todo lo demás: los botones se mueven dentro del dialog abierto
  const colocar = () => {
    const destino = [...document.querySelectorAll('dialog[open]')].pop() || document.body;
    if (ui.parentElement !== destino) destino.append(ui);
  };
  new MutationObserver(colocar).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  const enGuia = (el) => el.closest('[id^="tab-"], dialog');

  const api = async (ruta, datos) => {
    const r = await fetch('/__editor/' + ruta, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Editor-Local': '1' },
      body: JSON.stringify(datos),
    });
    const j = await r.json().catch(() => ({ error: 'Respuesta rara del servidor' }));
    if (!r.ok || j.error) throw new Error(j.error || 'Error');
    return j;
  };
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const cerrar = () => { pan.hidden = true; pan.innerHTML = ''; };

  ui.querySelector('#ed-bar').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    modo = modo === b.dataset.m ? null : b.dataset.m;
    ui.querySelectorAll('#ed-bar button').forEach((x) => x.classList.toggle('on', x.dataset.m === modo));
    quitarMarca();
    cerrar();
  });

  // Bloque de texto: el primer elemento no "inline" desde donde se pulsa
  function bloqueTexto(el) {
    while (el && el !== document.body && getComputedStyle(el).display.startsWith('inline')) el = el.parentElement;
    return el && el !== document.body && enGuia(el) ? el : null;
  }
  // Bloque con aspecto de caja: borde, fondo, recorte o tabla
  function bloqueColor(el) {
    for (; el && el !== document.body; el = el.parentElement) {
      if (!enGuia(el) || el.id?.startsWith('tab-') || el.tagName === 'DIALOG') return null;
      const cs = getComputedStyle(el);
      if (cs.display.startsWith('inline') && el.tagName !== 'TABLE') continue;
      const borde = parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftStyle !== 'none';
      const fondo = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
      if (borde || fondo || cs.clipPath !== 'none' || el.tagName === 'TABLE') return el;
    }
    return null;
  }
  function selector(el) {
    const partes = [];
    while (el && !(el.id && /^[A-Za-z][\w-]*$/.test(el.id))) {
      const p = el.parentElement;
      if (!p) return null;
      const mismos = [...p.children].filter((c) => c.tagName === el.tagName);
      partes.unshift(`${el.tagName.toLowerCase()}:nth-of-type(${mismos.indexOf(el) + 1})`);
      el = p;
    }
    return el ? `#${el.id}${partes.length ? ' > ' + partes.join(' > ') : ''}` : null;
  }

  const objetivo = (t) => (modo === 'texto' ? bloqueTexto(t) : bloqueColor(t));
  function quitarMarca() { marcado?.classList.remove('ed-hover', 'ed-hover-c'); marcado = null; }
  document.addEventListener('mouseover', (e) => {
    if (!modo || ui.contains(e.target)) return;
    const el = objetivo(e.target);
    if (el === marcado) return;
    quitarMarca();
    if (el) { marcado = el; el.classList.add(modo === 'texto' ? 'ed-hover' : 'ed-hover-c'); }
  }, true);

  document.addEventListener('click', (e) => {
    if (!modo || ui.contains(e.target)) return;
    const el = objetivo(e.target);
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    modo === 'texto' ? abrirTexto(el) : abrirColor(el);
  }, true);

  // ── Texto ──
  async function abrirTexto(el) {
    const textos = [];
    for (let x = el; x && textos.length < 4 && !x.id?.startsWith('tab-') && x.tagName !== 'DIALOG'; x = x.parentElement) {
      const t = norm(x.textContent || '');
      if (t && !textos.includes(t)) textos.push(t);
    }
    pan.hidden = false;
    pan.innerHTML = '<small>Buscando el texto en los archivos…</small>';
    let r;
    try { r = await api('buscar', { textos }); } catch (err) { pan.innerHTML = `<small class="err">${esc(err.message)}</small>`; return; }
    const cs = r.coincidencias;
    if (!cs.length) {
      pan.innerHTML = `<small class="err">No encuentro este texto en los archivos de contenido. Puede estar escrito en el código: pídeselo a Claude. Si es parte de un párrafo largo, prueba a pulsar en otra parte.</small><div class="fila"><button data-a="x">Cerrar</button></div>`;
      pan.querySelector('[data-a="x"]').onclick = cerrar;
      return;
    }
    // Si el mismo texto está en varias pestañas, solo se cambia en los archivos de esta
    const tab = document.documentElement.dataset.defaultTab;
    const clave = { mecanicas: 'general' }[tab] ?? tab;
    const deEsta = cs.filter((c) => c.file.includes(`forever-${clave}`) || c.file.endsWith(`/${tab}.md`));
    const lista = deEsta.length ? deEsta : cs;
    const raw = lista[0].raw;
    const iguales = lista.filter((c) => c.raw === raw);
    const donde = iguales.map((c) => c.file.split('/').pop()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
    pan.innerHTML = `
      <small>${esc(donde)}${iguales.length > 1 ? ` · aparece en ${iguales.length} sitios, se cambia en todos` : ''}${r.parcial ? ' · es parte de un texto más largo: se edita entero' : ''}</small>
      <div class="fila">
        <button data-f="b"><b>N</b></button><button data-f="i"><i>K</i></button>
        ${COLORES.map(([n, v]) => `<button class="sw" title="${n}" data-c="${n}" style="background:${v}"></button>`).join('')}
        <button data-f="q" title="Quita negrita, cursiva y color del trozo seleccionado">Quitar formato</button>
      </div>
      <textarea spellcheck="true" lang="es"></textarea>
      <small>Selecciona un trozo y pulsa un botón. <code>[[Hechizo]]</code> e iconos <code>{{…}}</code>: no tocar los corchetes.</small>
      <div class="fila"><button data-a="g" class="on">Guardar (Ctrl+Enter)</button><button data-a="x">Cancelar (Esc)</button><span class="msg"></span></div>`;
    const ta = pan.querySelector('textarea');
    ta.value = raw;
    ta.focus();
    const envolver = (a, b) => {
      const { selectionStart: s, selectionEnd: f, value: v } = ta;
      if (s === f) return;
      ta.value = v.slice(0, s) + a + v.slice(s, f) + b + v.slice(f);
      ta.setSelectionRange(s + a.length, f + a.length);
      ta.focus();
    };
    const quitar = () => {
      const { selectionStart: s, selectionEnd: f, value: v } = ta;
      if (s === f) return;
      const limpio = v.slice(s, f).replace(/\[c=\w+\]|\[\/c\]|\*\*|(?<!\*)\*(?!\*)/g, '');
      ta.value = v.slice(0, s) + limpio + v.slice(f);
      ta.setSelectionRange(s, s + limpio.length);
      ta.focus();
    };
    pan.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () =>
      b.dataset.f === 'b' ? envolver('**', '**') : b.dataset.f === 'i' ? envolver('*', '*') : quitar()));
    pan.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => envolver(`[c=${b.dataset.c}]`, '[/c]')));
    const msg = pan.querySelector('.msg');
    const guardar = async () => {
      if (ta.value === raw) return cerrar();
      msg.textContent = 'Guardando…';
      try {
        await api('guardar', { despues: ta.value, lugares: iguales.map((c) => ({ file: c.file, ruta: c.ruta, antes: c.raw })) });
        msg.textContent = 'Guardado. Recargando…';
        setTimeout(() => location.reload(), 400);
      } catch (err) { msg.innerHTML = `<span class="err">${esc(err.message)}</span>`; }
    };
    pan.querySelector('[data-a="g"]').onclick = guardar;
    pan.querySelector('[data-a="x"]').onclick = cerrar;
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); guardar(); }
      // Esc cierra solo el editor, no la ficha
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); }
    });
  }

  // ── Color de bloque ──
  function abrirColor(el) {
    const sel = selector(el);
    pan.hidden = false;
    if (!sel) { pan.innerHTML = '<small class="err">Este bloque no se puede colorear.</small>'; return; }
    pan.innerHTML = `<small>Color del bloque (borde y títulos). Solo colores de la marca.</small>
      <div class="fila">${COLORES.map(([n, v]) => `<button class="sw" title="${n}" data-c="${n}" style="background:${v}"></button>`).join('')}
      <button data-c="">Quitar color</button><button data-a="x">Cerrar</button></div><span class="msg"></span>`;
    const msg = pan.querySelector('.msg');
    pan.querySelector('[data-a="x"]').onclick = cerrar;
    pan.querySelectorAll('[data-c]').forEach((b) => (b.onclick = async () => {
      msg.textContent = 'Guardando…';
      try {
        await api('color', { tab: document.documentElement.dataset.defaultTab, selector: sel, color: b.dataset.c || null });
        msg.textContent = 'Guardado. Recargando…';
        setTimeout(() => location.reload(), 400);
      } catch (err) { msg.innerHTML = `<span class="err">${esc(err.message)}</span>`; }
    }));
  }
})();
