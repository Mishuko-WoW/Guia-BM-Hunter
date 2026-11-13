    const tabButtons = Array.from(document.querySelectorAll('.mk-tab[data-tab]'));
    const validTabIds = new Set(tabButtons.map(btn => btn.dataset.tab));
    const tabAliases = {
      mec: 'mecanicas',
      tal: 'estadisticas',
      rot: 'rotacion',
      mac: 'macros',
      err: 'errores',
    };

    function getActiveTabId() {
      const activePanel = document.querySelector('.tab-panel.active');
      return activePanel ? activePanel.id.replace(/^tab-/, '') : 'mecanicas';
    }

    function getScrollStorageKey(tabId) {
      return `bm-guide:scroll:${tabId}`;
    }

    function restoreScrollPosition(tabId) {
      const savedScroll = sessionStorage.getItem(getScrollStorageKey(tabId));
      if (!savedScroll) return;

      const scrollY = Number(savedScroll);
      if (!Number.isFinite(scrollY)) return;

      requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'auto' }));
    }

    function syncTabFromHash() {
      const hashTab = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      const normalizedTab = tabAliases[hashTab] || hashTab;
      const tabId = validTabIds.has(normalizedTab) ? normalizedTab : 'mecanicas';
      const btn = document.querySelector(`.mk-tab[data-tab="${tabId}"]`);
      if (btn) showTab(tabId, btn, { updateHash: false, preserveScroll: true });
    }

    function refreshWowheadTooltips() {
      if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
        window.$WowheadPower.refreshLinks();
      }
    }

    function enhanceMacroCopyButtons() {
      document.querySelectorAll('.macro-card').forEach((card) => {
        const block = card.querySelector('pre.macro-code');
        const head = card.querySelector('.macro-head');
        const title = head ? head.querySelector('.macro-title') : null;
        if (!block || !head || !title) return;
        if (head.querySelector('.macro-copy-btn-head')) return;

        const titleGroup = document.createElement('div');
        titleGroup.className = 'macro-title-group';
        title.parentNode.insertBefore(titleGroup, title);
        titleGroup.appendChild(title);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'macro-copy-btn macro-copy-btn-head';
        btn.textContent = '📋 Copiar';

        btn.addEventListener('click', () => {
          const original = btn.textContent;
          const text = (block.textContent || '').trim();

          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = '✅ Copiado';
            btn.disabled = true;
            setTimeout(() => {
              btn.textContent = original;
              btn.disabled = false;
            }, 1400);
          }).catch(() => {
            btn.textContent = '❌ Error';
            setTimeout(() => {
              btn.textContent = original;
            }, 1400);
          });
        });

        titleGroup.appendChild(btn);
      });
    }

    // ─── TABS ─────────────────────────────────────────────────────────
    function showTab(id, btn, options = {}) {
      const { updateHash = true, preserveScroll = false } = options;
      const targetBtn = btn || document.querySelector(`.mk-tab[data-tab="${id}"]`);
      if (!targetBtn || !validTabIds.has(id)) return;
      const targetPanel = document.getElementById('tab-' + id);
      if (!targetPanel) return;

      // Opener comparte item de menu con Rotacion: al navegar a Opener,
      // mantenemos resaltado visual en Rotacion para no perder contexto.
      const highlightedTabId = id === 'opener' ? 'rotacion' : id;
      const highlightedBtn = document.querySelector(`.mk-tab[data-tab="${highlightedTabId}"]`);

      document.querySelectorAll('.tab-panel').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.mk-tab').forEach(b => b.classList.remove('active'));
      targetPanel.classList.add('active');
      (highlightedBtn || targetBtn).classList.add('active');

      if (updateHash && window.location.hash !== `#${id}`) {
        history.replaceState(null, '', `#${id}`);
        // Si el cambio viene de un hash (enlace changelog), hacer scroll al top absoluto de la página
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 0);
      }

      // Scroll active tab button into view en móvil
      targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      if (preserveScroll) {
        restoreScrollPosition(id);
      }

      // Rehidrata tooltips de Wowhead cuando cambia contenido visible.
      setTimeout(refreshWowheadTooltips, 0);
    }

    window.addEventListener('hashchange', syncTabFromHash);
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem(getScrollStorageKey(getActiveTabId()), String(window.scrollY));
    });

    enhanceMacroCopyButtons();
    syncTabFromHash();

    // ─── TOGGLE HELPERS ───────────────────────────────────────────────
    function activateToggle(scope, btn) {
      document.querySelectorAll(scope + ' .toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }


    // ─── TOOLTIP (mouse + touch) ───────────────────────────────────────
    const tooltip  = document.getElementById('tooltip');
    const ttName   = document.getElementById('tt-name');
    const ttType   = document.getElementById('tt-type');
    const ttDesc   = document.getElementById('tt-desc');

    document.addEventListener('mouseover', e => {
      const el = e.target.closest('[data-name]');
      if (!el) {
        tooltip.classList.remove('visible');
        return;
      }
      ttName.textContent = el.dataset.name || '';
      ttType.textContent = el.dataset.type || '';
      ttDesc.textContent = el.dataset.desc || '';
      tooltip.classList.add('visible');
      positionTooltip(e);
    });

    document.addEventListener('mousemove', e => {
      if (e.target.closest('[data-name]')) positionTooltip(e);
    });

    document.addEventListener('mouseout', e => {
      if (!e.relatedTarget || !e.relatedTarget.closest('[data-name]')) {
        tooltip.classList.remove('visible');
      }
    });

    // Touch support for tooltips on mobile
    document.addEventListener('touchstart', e => {
      const el = e.target.closest('[data-name]');
      if (!el) { tooltip.classList.remove('visible'); return; }
      ttName.textContent = el.dataset.name || '';
      ttType.textContent = el.dataset.type || '';
      ttDesc.textContent = el.dataset.desc || '';
      const rect = el.getBoundingClientRect();
      const width = 260;
      let x = rect.left;
      let y = rect.bottom + 8;
      if (x + width > window.innerWidth - 8) x = window.innerWidth - width - 8;
      if (x < 8) x = 8;
      if (y + 120 > window.innerHeight) y = rect.top - 120;
      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
      tooltip.classList.add('visible');
      e.preventDefault();
    }, { passive: false });

    function positionTooltip(e) {
      const width  = 280;
      const margin = 10;
      let x = e.clientX + 14;
      let y = e.clientY - 10;

      if (x + width > window.innerWidth - margin) x = e.clientX - width - 14;
      if (x < margin) x = margin;

      const height = tooltip.offsetHeight || 90;
      if (y + height > window.innerHeight - margin) y = e.clientY - height - 10;
      if (y < margin) y = margin;

      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    }

    // ─── BIS TRACKER ──────────────────────────────────────────────────
const BIS_TOTAL = 15;

function bisCheck(cb) {
  const checked = document.querySelectorAll('.bis-check:checked').length;
  document.getElementById('bis-count').textContent = checked + ' / ' + BIS_TOTAL;
  document.getElementById('bis-bar').style.width = (checked / BIS_TOTAL * 100) + '%';

  const state = {};
  document.querySelectorAll('[data-bis]').forEach(el => {
    // data-bis está en la propia casilla (o en su contenedor, según el slot)
    const cb = el.matches('.bis-check') ? el : el.querySelector('.bis-check');
    if (cb) state[el.dataset.bis] = cb.checked;
  });
  try { localStorage.setItem('bm_bis', JSON.stringify(state)); } catch (e) {}
}

// Restaurar estado al cargar
(function () {
  let state = {};
  try { state = JSON.parse(localStorage.getItem('bm_bis') || '{}'); } catch (e) {}

  document.querySelectorAll('[data-bis]').forEach(el => {
    const cb = el.matches('.bis-check') ? el : el.querySelector('.bis-check');
    if (cb && state[el.dataset.bis]) {
      cb.checked = true;
    }
  });

  const checked = document.querySelectorAll('.bis-check:checked').length;
  const count = document.getElementById('bis-count');
  const bar = document.getElementById('bis-bar');
  if (count) count.textContent = checked + ' / ' + BIS_TOTAL; // el contador solo existe en Midnight
  if (bar) bar.style.width = (checked / BIS_TOTAL * 100) + '%';
})();

    // ─── BUILD TOGGLE ─────────────────────────────────────────────────
    // Selector de build de Rotación/Opener (PanelesHeroe.astro)
    function setPanel(btn) {
      const group = btn.closest('[data-paneles]');
      if (!group) return;
      group.querySelectorAll('[data-panel]').forEach(b => b.classList.toggle('active', b === btn));
      group.querySelectorAll('[data-panel-id]').forEach(p => {
        p.hidden = p.dataset.panelId !== btn.dataset.panel;
      });
      setTimeout(refreshWowheadTooltips, 0);
    }

    function setBuild(id, btn) {
      document.querySelectorAll('[id^="build-"]').forEach(d => d.style.display = 'none');
      activateToggle('#tab-talentos', btn);
      document.getElementById('build-' + id).style.display = '';
    }

    // ─── TALENT COPY ──────────────────────────────────────────────────
    function copyTalent(btn, str) {
      const original = btn.textContent;
      navigator.clipboard.writeText(str).then(() => {
        btn.textContent  = '✅ ¡Copiado!';
        btn.style.opacity = '.7';
        setTimeout(() => {
          btn.textContent  = original;
          btn.style.opacity = '1';
        }, 2000);
      }).catch(() => {
        btn.textContent = '❌ Error al copiar';
        setTimeout(() => { btn.textContent = original; }, 2000);
      });
    }


// ─── BOSS DATA ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// SPELL REGISTRY
// ═══════════════════════════════════════════════════════════════════════════
const SPELL_REGISTRY = {
  // ── Habilidades activas ──────────────────────────────────────────────
  "Cólera de las bestias":           19574,
  "Matar":                           34026,
  "Disparo con púas":                217200,
  "Disparo de cobra":                193455,
  "Paliza salvaje":                  1264359,
  "Tajo de la bestia":               268877,
  "Carcaj de piel de serpiente":     468695,
  "Marca del cazador":               257284,
  "¡Estampida!":                     201430,
  "Disparo tranquilizante":          19801,
  "Intimidación":                    19577,
  "Separación":                      781,
  "Fingir muerte":                   5384,
  "Aspecto de la tortuga":          186265,
  "Excitación":                      109304,
  "Supervivencia del más fuerte":    264735,
  "Contradisparo":                   147362,
  // ── Talentos de clase ────────────────────────────────────────────────
  "Redirección":                     34477,
  "Disparo vinculante":              109248,
  "Encontrar camino":                378002,
  "Tranquilizante para kodos":       459983,
  "Tranquilizante para demosaurios": 459991,
  "Ungüento de emergencias":         459517,
  "Quemasendas":                     199921,
  "Reflejos felinos":                1258404,
  "Fingir muerte mejorado":          1258486,
  "Instintos salvajes":              378442,
  "Instintos Salvajes":              378442,
  "Frenesí sangriento":              407412,
  "Bestia temible":                  120679,
  // ── Buffs / Debuffs ──────────────────────────────────────────────────
  "Aliado de la naturaleza":         1273145,
  "Escabechina":                     1272099,
  "Fuego devastador":                466990,
  "Zancapuerco":                     472639,
  "Flecha negra":                    466930,
  "Flecha lastimera":                392060,
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-TOOLTIP ENGINE
// Convierte nombres de habilidades en links de Wowhead automáticamente.
// Solo se aplica a textos DENTRO del boss panel — no toca el resto de la guía.
// ═══════════════════════════════════════════════════════════════════════════
function autoLink(text) {
  // Ordenar por longitud descendente para evitar matches parciales
  const entries = Object.entries(SPELL_REGISTRY).sort((a, b) => b[0].length - a[0].length);
  let result = text;

  // Trabajamos con un placeholder para no re-procesar links ya generados
  const placeholders = [];

  entries.forEach(([name, id]) => {
    // Escapar caracteres especiales del nombre para la regex
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/¡/g, '¡');
    const regex = new RegExp(`(?<!href=[^>]*>)(${escaped})(?![^<]*<\/a>)`, 'g');
    result = result.replace(regex, (match) => {
      const ph = `\x00SPELL${placeholders.length}\x00`;
      placeholders.push(`<a href="https://www.wowhead.com/es/spell=${id}" target="_blank">${match}</a>`);
      return ph;
    });
  });

  // Restaurar placeholders
  placeholders.forEach((link, i) => {
    result = result.replace(`\x00SPELL${i}\x00`, link);
  });

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILDS DATA — Datos de la pestaña "Talentos".
// Edita aquí. Escribe texto plano; los nombres del SPELL_REGISTRY se
// convierten en tooltips de Wowhead automáticamente.
//
// Estructura de cada build:
// {
//   id:       "pl-raid",          // identificador del div toggle (sin "build-")
//   label:    "🎯 Pack Leader Raid", // texto del botón toggle
//   meta:     true,               // true = borde dorado "★ Meta"
//   header:   "🎯 Pack Leader — Single Target / Raid",
//   desc:     "Descripción del build.",
//   copyStr:  "STRING_DE_TALENTOS",
//   flexibles: [
//     { name: "Nombre del talento", note: "Explicación de cuándo quitarlo." },
//   ],
//   notes: [
//     "Texto de nota. Los hechizos se auto-linkean.",
//   ],
// }
// ═══════════════════════════════════════════════════════════════════════════

const buildsData = Array.isArray(window.BM_BUILDS_DATA) ? window.BM_BUILDS_DATA : [];

const HERO_TALENT_ICON_BY_NAME = {
  'Pack Leader': 'https://assets.rpglogs.com/img/warcraft/talents/hero/43_full.png',
  'Dark Ranger': 'https://assets.rpglogs.com/img/warcraft/talents/hero/44_full.png',
};

function replaceHeroEmojiWithIcon(text) {
  if (typeof text !== 'string') return text;

  const match = text.match(/^\s*(?:[^\p{L}\p{N}]\s*)*(Pack Leader|Dark Ranger)\b/u);
  if (!match) return text;

  const heroName = match[1];
  const iconUrl = HERO_TALENT_ICON_BY_NAME[heroName];
  if (!iconUrl) return text;

  const heroIndex = text.indexOf(heroName);
  const rest = heroIndex >= 0 ? text.slice(heroIndex + heroName.length) : '';
  return `<img class="hero-inline-icon" src="${iconUrl}" alt="${heroName}" loading="lazy" decoding="async">${heroName}${rest}`;
}

// ─── BUILDS RENDERER ──────────────────────────────────────────────────────
// Renderiza dinámicamente los builds en la pestaña de Talentos.
// No toques esta función — edita buildsData arriba.
function renderBuilds() {
  const toggleWrap = document.getElementById('builds-toggle-wrap');
  const buildsContainer = document.getElementById('builds-container');
  if (!toggleWrap || !buildsContainer) return;

  function forceTalentFlexibleStyles(scopeEl) {
    scopeEl.querySelectorAll('.ts-flex-content').forEach((el) => {
      el.style.setProperty('font-size', '16.5px', 'important');
      el.style.setProperty('color', 'var(--text)', 'important');
    });

    scopeEl.querySelectorAll('.ts-flex-note').forEach((el) => {
      el.style.setProperty('font-size', '16px', 'important');
      el.style.setProperty('color', 'var(--text)', 'important');
    });

    scopeEl.querySelectorAll('.ts-flex-content a, .ts-flex-content strong, .ts-flex-content strong a').forEach((el) => {
      el.style.setProperty('font-size', 'inherit', 'important');
    });

    scopeEl.querySelectorAll('.ts-flex-note a').forEach((el) => {
      el.style.setProperty('font-size', 'inherit', 'important');
    });
  }

  // Botones de toggle
  toggleWrap.innerHTML = buildsData.map((b, i) => `
    <button class="toggle-btn${b.meta ? ' meta' : ''}${i === 0 ? ' active' : ''}"
      onclick="setBuild('${b.id}', this)">
      ${replaceHeroEmojiWithIcon(b.label)}
    </button>`).join('');

  // Contenido de cada build
  buildsContainer.innerHTML = buildsData.map((b, i) => {
    const flexiblesHtml = b.flexibles.map((f, j) => `
      <div class="ts-flex-item">
        <span class="ts-flex-num">${j + 1}</span>
        <div class="ts-flex-content">
          <strong>${autoLink(f.name)}</strong>
          <span class="ts-flex-note">${autoLink(f.note)}</span>
        </div>
      </div>`).join('');

    const notesHtml = b.notes.map(n => `<li>${autoLink(n)}</li>`).join('');

    const copyBtnId = `copybtn-${b.id}`;

    return `
      <div id="build-${b.id}" ${i !== 0 ? 'style="display:none"' : ''}>
        <div class="card">
          <div class="card-header">${replaceHeroEmojiWithIcon(b.header)}</div>
          <p class="build-desc">${b.desc}</p>
          <div class="build-actions">
            <button id="${copyBtnId}" onclick="copyTalent(document.getElementById('${copyBtnId}'), '${b.copyStr}')" class="build-btn build-btn-copy">📋 Copiar string</button>
          </div>

          <div class="talent-showcase">
            <div class="ts-header">
              <span class="ts-title">🔧 Talentos Flexibles</span>
              <span class="ts-sub">Ajusta estos puntos según el encuentro — en orden de prioridad para quitar:</span>
            </div>
            <div class="ts-flexible">${flexiblesHtml}</div>
          </div>

          <div class="box box-tip" style="margin-top:0">
            <div class="box-title">Notas del build</div>
            <ul class="build-notes">${notesHtml}</ul>
          </div>
        </div>
      </div>`;
  }).join('');

  forceTalentFlexibleStyles(buildsContainer);
}

// ═══════════════════════════════════════════════════════════════════════════
// BOSS DATA — Edita aquí. Solo texto plano, sin HTML para los links.
// Los nombres de habilidades del SPELL_REGISTRY se convierten en tooltips
// automáticamente. Para negritas usa <strong>...</strong>.
//
// Estructura de cada boss:
// {
//   name:    "Nombre del boss",
//   imgUrl:  "URL de la imagen del selector",
//   diff:    "h" (heroico) | "m" (mítico),
//   summary: "Descripción del encuentro. Los nombres de habilidades se auto-linkean.",
//   builds: [
//     {
//       id:         "rec",             // identificador único
//       label:      "Recomendado",     // texto del botón toggle
//       rec:        true,              // ¿es el build por defecto?
//       heroTalent: "Pack Leader",     // "Pack Leader" o "Dark Ranger"
//       string:     "PASTE_STRING",    // string de importación de talentos
//       whUrl:      "https://...",     // URL de Wowhead
//       swaps: [
//         { type: "add"|"remove", icon: "nombre_icono_zamimg", name: "Nombre del talento", badge: "AÑADIR"|"QUITAR", desc: "Descripción." },
//       ],
//       notes: [
//         { type: "crit"|"warn"|"tip"|"info", text: "Texto de la nota. Los hechizos se auto-linkean." },
//       ]
//     }
//   ]
// }
// ═══════════════════════════════════════════════════════════════════════════

const bossData = Array.isArray(window.BM_BOSS_DATA) ? window.BM_BOSS_DATA : [];

// ─── BOSS PANEL RENDERER ──────────────────────────────────────
const activeBossBuilds = {};
const iconUrl = n => `https://wow.zamimg.com/images/wow/icons/medium/${n}.jpg`;

function selectBoss(i, btn) {
  document.querySelectorAll('.boss-sel-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeBossBuilds['current'] = i;
  if (activeBossBuilds[i] === undefined) {
    activeBossBuilds[i] = bossData[i].builds.findIndex(b => b.rec);
    if (activeBossBuilds[i] < 0) activeBossBuilds[i] = 0;
  }
  renderBossPanel(i);
}

function selectBossBuild(bossIdx, buildIdx) {
  activeBossBuilds[bossIdx] = buildIdx;
  renderBossPanel(bossIdx);
}

// ─── RENDER BOSS PANEL ────────────────────────────────────────────────────
function renderBossPanel(i) {
  const b = bossData[i];
  if (!b) return;

  const bi = activeBossBuilds[i] || 0;
  const build = b.builds[bi];

  // Hero Talent
  const heroTalent = build.heroTalent || "Pack Leader";
  const heroIcon = heroTalent === "Dark Ranger"
    ? "https://assets.rpglogs.com/img/warcraft/talents/hero/44_full.png"
    : "https://assets.rpglogs.com/img/warcraft/talents/hero/43_full.png";

  const togglesHtml = b.builds.length > 1 ? `
    <div class="toggle-wrap" style="margin: 18px 0 20px;">
      ${b.builds.map((bld, j) => `
        <button class="toggle-btn${bld.rec ? ' meta' : ''}${j === bi ? ' active' : ''}"
          onclick="selectBossBuild(${i}, ${j})">${bld.label}</button>
      `).join('')}
    </div>` : '';

  // Swaps — auto-linkear nombre y descripción
  const swapsHtml = build.swaps.map(s => {
    const nameLinked = autoLink(s.name);
    const descLinked = autoLink(s.desc);
    const isAdd    = s.type === 'add';
    const isRemove = s.type === 'remove';
    const accentColor = isAdd ? 'var(--green2)' : isRemove ? 'var(--red2)' : 'var(--accent)';
    const bgColor     = isAdd ? 'color-mix(in srgb, var(--green) 18%, transparent)' : isRemove ? 'color-mix(in srgb, var(--red) 15%, transparent)' : 'color-mix(in srgb, var(--accent) 14%, transparent)';
    const borderClass = isAdd ? 'error-tip' : isRemove ? 'error-warn' : 'error-info';
    return `
      <div class="error-item ${borderClass}">
        <div class="error-body">
          <h4 style="color:${accentColor}">
            <span class="hbadge" style="background:${bgColor};color:${accentColor};">${s.badge}</span>
            ${nameLinked}
          </h4>
          <p>${descLinked}</p>
        </div>
      </div>`;
  }).join('');

  // Notes — auto-linkear texto
  const noteTypes  = { crit: 'box-crit', warn: 'box-warn', tip: 'box-tip', info: 'box-info' };
  const noteTitles = { crit: 'Crítico', warn: 'Atención', tip: 'Consejo', info: 'Nota' };
  const notesHtml = build.notes.map(n => `
    <div class="box ${noteTypes[n.type]}" style="margin:8px 0">
      <div class="box-title">${noteTitles[n.type]}</div>
      ${autoLink(n.text)}
    </div>`).join('');

  const copyId = `bosscp-${i}-${bi}`;

  document.getElementById('boss-panels').innerHTML = `
    <div class="card" style="animation:fade .2s ease">
      <div style="display:flex; gap:22px; align-items:flex-start; margin-bottom:24px;">

        <!-- HERO TALENT (izquierda) -->
        <div style="flex-shrink:0; text-align:center;">
          <img src="${heroIcon}" width="78" height="78"
               style="border:3px solid var(--accent2); border-radius:50%; box-shadow:0 0 20px color-mix(in srgb, var(--accent) 45%, transparent);"
               alt="${heroTalent}">
          <div style="margin-top:10px; font-size:14.5px; font-weight:700; color:var(--accent);">
            ${heroTalent}
          </div>
        </div>

        <!-- Nombre del Boss -->
        <div style="flex:1; padding-top:8px;">
          <div style="font-family:var(--font-display); font-size:24px; font-weight:700; color:var(--gold); letter-spacing:1px;">
            ${b.name}
          </div>
          <div style="color:var(--text2); font-size:16px; margin-top:4px;">
            Esta guia de talentos está optimizada para el encuentro contra <strong>${b.name}</strong> en dificultad <strong>${b.diff === 'h' ? 'Mítico' : 'Heroico'}</strong> y será actualizada conforme se amplien los datos de Warcraft Logs.
          </div>
        </div>
      </div>

      <div class="box box-info" style="margin-bottom:22px;">
  <div class="box-title">Resumen</div>
  ${autoLink(b.summary)}
</div>

${togglesHtml}



      <div class="build-actions" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap;">
        <style>
          .build-btn {text-decoration:none;transition:transform .15s,box-shadow .15s;}
          .build-btn:hover {transform:scale(1.06);box-shadow:0 4px 16px #0003;}
        </style>
        <button id="${copyId}" onclick="copyBossStr('${copyId}','${build.string}')" class="build-btn build-btn-copy" style="text-decoration:none;">📋 Copiar string de talentos</button>
        <a href="${build.wclUrl || '#'}" target="_blank" class="build-btn build-btn-wcl" style="background:#232e4a;color:#fff;border:2px solid #3faaff;padding:8px 18px;border-radius:7px;font-weight:600;box-shadow:0 2px 8px #0002;transition:background .2s;text-decoration:none;">🔗 Warcraft Logs</a>
        <a href="${build.lorrgsUrl || '#'}" target="_blank" class="build-btn build-btn-lorrgs" style="background:#3a2323;color:#fff;border:2px solid #ff6a3f;padding:8px 18px;border-radius:7px;font-weight:600;box-shadow:0 2px 8px #0002;transition:background .2s;text-decoration:none;">🔗 Lorrgs</a>
         <button onclick="openReportModal(${i}, ${bi})" class="build-btn build-btn-report"
        style="background:#3a2f10;color:#fff;border:2px solid #f7b955;padding:8px 18px;border-radius:7px;font-weight:600;box-shadow:0 2px 8px #0002;transition:background .2s;text-decoration:none;">
        🪲 Reportar un error</button>
        </div>

      <div class="two-col">
        <div>
          <h3 style="margin-top:0; color:var(--gold);">Ajustes de Talentos</h3>
          ${swapsHtml}
        </div>
        <div>
          <h3 style="margin-top:0; color:var(--gold);">Notas del Encuentro</h3>
          ${notesHtml}
        </div>
      </div>

      ${b.video ? `
  <div style="margin-top:32px; text-align:center;">
    <div style="
      position:relative;
      width:100%;
      max-width:1100px;
      margin-inline:auto;
      padding-bottom:45%;
      height:0;
      overflow:hidden;
      border-radius:12px;
      box-shadow:0 0 18px rgba(0,0,0,0.45);
    ">
      <iframe
        src="${b.video}"
        frameborder="0"
        allowfullscreen
        style="
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          border-radius:12px;
        "
      ></iframe>
    </div>
  </div>
` : ''}


    </div>
  `;

  // Re-inicializar tooltips de Wowhead para el contenido recién renderizado
  if (window.$WowheadPower && window.$WowheadPower.refreshLinks) {
    window.$WowheadPower.refreshLinks();
  }
}



// ──────────────────────────────────────────────────────────────
// REPORTAR ERROR -> DISCORD WEBHOOK (MODAL + ENVÍO)
// ──────────────────────────────────────────────────────────────

const WEBHOOK_URL = "https://discord.com/api/webhooks/1499580702944137318/ab-F0IxfjRvNd9ZxTvxfZIgnXy9BJ8vv4G2lGLgFtUSEtRDSQoWfn3ceTi0lT91i7Vqe";

function ensureReportModalExists() {
  if (document.getElementById("report-modal")) return;

  const modal = document.createElement("div");
  modal.id = "report-modal";
  modal.style.cssText = "display:none;position:fixed;inset:0;background:#0008;z-index:9999;";

  modal.innerHTML = `
    <div style="background:#1e1e1e;color:#fff;max-width:520px;margin:10vh auto;padding:20px;border-radius:10px;">
      <h3 style="margin-top:0;">🪲 Reportar un error</h3>

      <label for="report-type">¿Qué ha fallado?</label>
      <select id="report-type" style="width:100%;margin:8px 0;padding:8px;border-radius:6px;">
        <option value="string">📋 String de talentos</option>
        <option value="wcl">🔗 Botón Warcraft Logs</option>
        <option value="lorrgs">🔗 Botón Lorrgs</option>
        <option value="otro">📝 Otro</option>
      </select>

      <textarea
        id="report-text"
        placeholder="Describe brevemente el problema (opcional)"
        rows="4"
        style="width:100%;margin-top:8px;padding:10px;border-radius:8px;resize:vertical;"></textarea>

      <input
        id="report-contact"
        placeholder="Tu Discord o TikTok (opcional, para avisarte)"
        type="text"
        style="width:100%;margin-top:10px;padding:10px;border-radius:8px;" />

      <div style="margin-top:14px;display:flex;gap:10px;justify-content:flex-end;">
        <button id="report-cancel" type="button" style="padding:8px 12px;border-radius:8px;">Cancelar</button>
        <button id="report-send" type="button"
          style="padding:8px 12px;border-radius:8px;background:#f7b955;border:none;font-weight:700;">
          Enviar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Cerrar al clicar fuera del cuadro
  modal.addEventListener("click", (e) => {
    if (e.target === modal) window.closeReportModal();
  });

  document.getElementById("report-cancel").addEventListener("click", () => window.closeReportModal());
  document.getElementById("report-send").addEventListener("click", () => window.sendReport());
}

let reportData = null;

// Para que onclick="openReportModal(...)" funcione, tiene que estar en window
window.openReportModal = function (bossIdx, buildIdx) {
  ensureReportModalExists();

  const boss = bossData[bossIdx];
  const build = boss?.builds?.[buildIdx];

  reportData = {
    bossName: boss?.name || "Desconocido",
    difficulty: boss?.diff === "m" ? "Mítico" : "Heroico",
    // ✅ Esto es lo que copia el botón de talentos:
    talentString: build?.string || "",
    pageUrl: window.location.href
  };

  document.getElementById("report-modal").style.display = "block";
};

window.closeReportModal = function () {
  const modal = document.getElementById("report-modal");
  if (modal) modal.style.display = "none";

  const t = document.getElementById("report-text");
  if (t) t.value = "";

  const c = document.getElementById("report-contact");
  if (c) c.value = "";
};

window.sendReport = async function () {
  const typeVal = document.getElementById("report-type")?.value || "otro";
  const text = document.getElementById("report-text")?.value?.trim() || "Sin descripción";
  const contact = document.getElementById("report-contact")?.value?.trim() || "No facilitado";

  const typeLabel =
    typeVal === "string" ? "📋 String de talentos" :
    typeVal === "wcl" ? "🔗 Botón Warcraft Logs" :
    typeVal === "lorrgs" ? "🔗 Botón Lorrgs" :
    "📝 Otro";

  if (!WEBHOOK_URL) {
    alert("⚠️ Falta pegar el WEBHOOK_URL en bm-guide.js");
    return;
  }

  const buildStringSafe = (reportData?.talentString || "?").slice(0, 1000);

  const payload = {
    embeds: [
      {
        title: "🪲 Nuevo reporte desde la web",
        color: 0xf7b955,
        fields: [
          { name: "Boss", value: reportData?.bossName || "?", inline: true },
          { name: "Build (string)", value: buildStringSafe, inline: false },
          { name: "Tipo de error", value: typeLabel, inline: false },
          { name: "Descripción", value: text, inline: false },
          { name: "Contacto", value: contact, inline: false },
          { name: "URL", value: reportData?.pageUrl || "", inline: false }
        ]
      }
    ]
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    window.closeReportModal();
    alert("✅ Gracias, el error se ha enviado");
  } catch (e) {
    alert("❌ No se pudo enviar el reporte (revisa consola / webhook)");
  }
};

function copyBossStr(id, str) {
  const btn = document.getElementById(id);
  const orig = btn.textContent;
  navigator.clipboard.writeText(str).then(() => {
    btn.textContent = '✅ ¡Copiado!';
    btn.style.opacity = '.7';
    setTimeout(() => { btn.textContent = orig; btn.style.opacity = '1'; }, 2000);
  }).catch(() => { btn.textContent = '❌ Error'; setTimeout(() => { btn.textContent = orig; }, 2000); });
}

// Init
(function () {
  renderBuilds();
  // La sección de jefes puede estar oculta (comentada en SeccionTalentos.astro)
  if (document.getElementById('boss-panels') && bossData.length) {
    activeBossBuilds[0] = bossData[0].builds.findIndex(b => b.rec);
    renderBossPanel(0);
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(refreshWowheadTooltips, 50);
      // Ocultar iconos de Wowhead en BIS y consumibles, agregar title con icono
      document.querySelectorAll('.bis-table a[href*="wowhead.com/es/item="], .cons-row a[href*="wowhead.com/es/item="]').forEach(link => {
        const match = link.href.match(/\/item=(\d+)/);
        if (match) {
          const itemId = match[1];
          // Ocultar cualquier icono que Wowhead haya agregado
          link.querySelectorAll('.whicon, img').forEach(el => {
            if (el.classList && el.classList.contains('whicon')) {
              el.style.display = 'none';
            }
          });
          // Agregar atributo title con imagen (funciona en navegadores modernos)
          link.title = `Item ${itemId}`;
        }
      });
    });
