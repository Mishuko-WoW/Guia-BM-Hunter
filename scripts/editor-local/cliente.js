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
    <div id="ed-bar"><button data-m="texto">Editar texto</button><button data-m="color">Color de bloque</button><button data-p="1" title="Guarda todos los cambios en un commit y lanza publicar.bat">Publicar</button></div>`;
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

  // Al guardar, la página se recarga: se apunta qué ficha estaba abierta para volver a abrirla
  // Se apunta ANTES de guardar: el servidor de desarrollo puede recargar la página él solo al cambiar el archivo
  function apuntar() {
    try {
      const dlg = [...document.querySelectorAll('dialog[open]')].pop();
      const ficha = dlg && [...dlg.querySelectorAll('*')].find((f) => !f.hidden && Object.keys(f.dataset).some((k) => /Ficha$/.test(k)));
      const k = ficha && Object.keys(ficha.dataset).find((x) => /Ficha$/.test(x));
      sessionStorage.setItem('ed-volver', JSON.stringify({
        ruta: location.pathname, y: scrollY,
        ficha: k ? { k: k.replace(/Ficha$/, 'Abrir'), v: ficha.dataset[k], s: dlg.scrollTop } : null,
      }));
    } catch { /* sin sessionStorage: solo recarga */ }
  }
  const recargar = () => setTimeout(() => location.reload(), 300);
  addEventListener('load', () => setTimeout(() => {
    let d = null;
    try { d = JSON.parse(sessionStorage.getItem('ed-volver')); sessionStorage.removeItem('ed-volver'); } catch {}
    if (!d || d.ruta !== location.pathname) return;
    scrollTo(0, d.y);
    if (!d.ficha) return;
    const attr = 'data-' + d.ficha.k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
    const btn = [...document.querySelectorAll(`[${attr}]`)].find((b) => b.getAttribute(attr) === d.ficha.v);
    if (!btn) return;
    btn.click();
    const dlg = [...document.querySelectorAll('dialog[open]')].pop();
    if (dlg) dlg.scrollTop = d.ficha.s;
    scrollTo(0, d.y);
  }, 250));

  ui.querySelector('#ed-bar').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.p) return publicar();
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

  // Seleccionar texto arrastrando y soltar fuera del cuadro no debe cerrar la ficha ni abrir otro texto
  let pulsadoEnUi = false;
  document.addEventListener('mousedown', (e) => { pulsadoEnUi = ui.contains(e.target); }, true);
  document.addEventListener('click', (e) => {
    if (pulsadoEnUi && !ui.contains(e.target)) { e.preventDefault(); e.stopPropagation(); pulsadoEnUi = false; return; }
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
        <button data-f="l" title="Convierte el trozo seleccionado en un enlace">Enlace</button>
        <button data-f="h" title="Inserta una habilidad con su icono">Habilidad</button>
      </div>
      <div class="ed-hz" hidden>
        <div class="fila"><input type="search" placeholder="Buscar habilidad…" style="flex:1;min-height:32px;background:#0c0c0c;color:#eee;border:1px solid #444;padding:4px 8px">
        <label><input type="checkbox"> Icono grande</label></div>
        <div class="ed-hz-l" style="max-height:180px;overflow:auto"></div>
      </div>
      <textarea spellcheck="true" lang="es"></textarea>
      <small>Selecciona un trozo y pulsa un botón. Las habilidades se ven como <code>[[Nombre]]</code> y los enlaces como <code>[texto](dirección)</code>: no borres los corchetes.</small>
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
    // Reemplaza la selección (o inserta en el cursor)
    const poner = (t) => {
      const { selectionStart: s, selectionEnd: f, value: v } = ta;
      ta.value = v.slice(0, s) + t + v.slice(f);
      ta.setSelectionRange(s + t.length, s + t.length);
      ta.focus();
    };
    const enlace = () => {
      const { selectionStart: s, selectionEnd: f, value: v } = ta;
      if (s === f) return alert('Primero selecciona el texto que será el enlace.');
      let url = (prompt('Dirección del enlace (https://… o /forever/…):') || '').trim();
      if (!url) return;
      if (/^www\./.test(url)) url = 'https://' + url;
      if (!/^(https?:\/\/|\/)[^\s()<>"]*$/.test(url)) return alert('Dirección no válida: tiene que empezar por https:// o por /');
      poner(`[${v.slice(s, f).replace(/[\[\]]/g, '')}](${url})`);
    };
    const hz = pan.querySelector('.ed-hz');
    const hzIn = hz.querySelector('input[type=search]');
    const hzGrande = hz.querySelector('input[type=checkbox]');
    const hzL = hz.querySelector('.ed-hz-l');
    let hechizos = null;
    const pintarHz = () => {
      const q = hzIn.value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      const sin = (n) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      hzL.innerHTML = hechizos.filter((h) => sin(h.n).includes(q)).slice(0, 40).map((h) =>
        `<button data-n="${esc(h.n)}" style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;margin:2px 0">` +
        (h.i ? `<img src="${esc(h.i)}" width="22" height="22" alt="">` : '<span style="width:22px"></span>') + `${esc(h.n)}</button>`).join('') ||
        '<small>No hay ninguna con ese nombre. Si es nueva, pídele a Claude que la añada.</small>';
    };
    hzL.addEventListener('click', (e) => {
      const b = e.target.closest('[data-n]');
      if (!b) return;
      const n = b.dataset.n;
      const { selectionStart: s, selectionEnd: f, value: v } = ta;
      const sel = v.slice(s, f).trim();
      const [a, z] = hzGrande.checked ? ['{{', '}}'] : ['[[', ']]'];
      poner(`${a}${n}${sel && sel !== n ? '>' + sel.replace(/[\[\]{}|>]/g, '') : ''}${z}`);
      hz.hidden = true;
    });
    hzIn.addEventListener('input', pintarHz);
    hzIn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); hz.hidden = true; ta.focus(); }
      if (e.key === 'Enter') { e.preventDefault(); hzL.querySelector('[data-n]')?.click(); }
    });
    const habilidad = async () => {
      if (!hz.hidden) { hz.hidden = true; return; }
      hz.hidden = false;
      if (!hechizos) {
        hzL.innerHTML = '<small>Cargando…</small>';
        try { hechizos = (await api('hechizos', {})).lista; } catch (err) { hzL.innerHTML = `<small class="err">${esc(err.message)}</small>`; return; }
      }
      hzIn.value = ta.value.slice(ta.selectionStart, ta.selectionEnd).trim();
      pintarHz();
      hzIn.focus();
    };
    pan.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => ({
      b: () => envolver('**', '**'), i: () => envolver('*', '*'), q: quitar, l: enlace, h: habilidad,
    })[b.dataset.f]()));
    pan.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => envolver(`[c=${b.dataset.c}]`, '[/c]')));
    const msg = pan.querySelector('.msg');
    const guardar = async () => {
      if (ta.value === raw) return cerrar();
      msg.textContent = 'Guardando…';
      try {
        apuntar();
        await api('guardar', { despues: ta.value, lugares: iguales.map((c) => ({ file: c.file, ruta: c.ruta, antes: c.raw })) });
        msg.textContent = 'Guardado. Recargando…';
        recargar();
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

  // ── Publicar: build + commit de los cambios del editor + publicar.bat (ventana aparte) ──
  async function publicar() {
    modo = null;
    ui.querySelectorAll('#ed-bar button').forEach((x) => x.classList.remove('on'));
    quitarMarca();
    if (!confirm('Se comprobará la web, se guardarán todos los cambios en un commit y se abrirá publicar.bat para subirla. ¿Seguir?')) return;
    const nota = prompt('¿Qué ha cambiado para el visitante? Sale en la lista de cambios de la web, en esta pestaña.\nEj.: «Nuevo enlace al vídeo de Ta\'shkal»\n(Déjalo vacío para no añadir nada.)', '');
    if (nota === null) return;
    pan.hidden = false;
    pan.innerHTML = '<small>Comprobando la web (build)… puede tardar unos 20 segundos.</small>';
    try {
      const r = await api('publicar', { tab: document.documentElement.dataset.defaultTab, nota: nota.trim() });
      pan.innerHTML = `<small>${esc(r.mensaje)}</small><div class="fila"><button data-a="x">Cerrar</button></div>`;
    } catch (err) {
      pan.innerHTML = `<small class="err" style="white-space:pre-wrap">${esc(err.message)}</small><div class="fila"><button data-a="x">Cerrar</button></div>`;
    }
    pan.querySelector('[data-a="x"]').onclick = cerrar;
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
        apuntar();
        await api('color', { tab: document.documentElement.dataset.defaultTab, selector: sel, color: b.dataset.c || null });
        msg.textContent = 'Guardado. Recargando…';
        recargar();
      } catch (err) { msg.innerHTML = `<span class="err">${esc(err.message)}</span>`; }
    }));
  }
})();
