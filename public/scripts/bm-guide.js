// ─── FECHA ────────────────────────────────────────────────────────
    document.getElementById('footer-date').textContent =
      new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    const tabButtons = Array.from(document.querySelectorAll('.tab-btn[data-tab]'));
    const validTabIds = new Set(tabButtons.map(btn => btn.dataset.tab));
    const tabAliases = {
      mec: 'mecanicas',
      tal: 'estadisticas',
      rot: 'rotacion',
      mac: 'macros',
      err: 'errores',
      qst: 'examen-st',
      qaoe: 'examen-aoe',
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
      const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
      if (btn) showTab(tabId, btn, { updateHash: false, preserveScroll: true });
    }

    function refreshWowheadTooltips() {
      if (window.$WowheadPower && typeof window.$WowheadPower.refreshLinks === 'function') {
        window.$WowheadPower.refreshLinks();
      }
    }

    // ─── TABS ─────────────────────────────────────────────────────────
    function showTab(id, btn, options = {}) {
      const { updateHash = true, preserveScroll = false } = options;
      const targetBtn = btn || document.querySelector(`.tab-btn[data-tab="${id}"]`);
      if (!targetBtn || !validTabIds.has(id)) return;

      document.querySelectorAll('.tab-panel').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('tab-' + id).classList.add('active');
      targetBtn.classList.add('active');

      if (updateHash && window.location.hash !== `#${id}`) {
        history.replaceState(null, '', `#${id}`);
      }

      // Scroll active tab button into view on mobile
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

    syncTabFromHash();

    // ─── TOGGLE HELPERS ───────────────────────────────────────────────
    function activateToggle(scope, btn) {
      document.querySelectorAll(scope + ' .toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function setOpener(mode, btn) {
      activateToggle('#tab-opener', btn);
      ['st', 'aoe', 'dr-st', 'dr-aoe'].forEach(k => {
        document.getElementById('opener-' + k).style.display = mode === k ? '' : 'none';
      });
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

    // ─── QUIZ ENGINE ──────────────────────────────────────────────────
    const quizInstances = {};
    window.quizAnswer = (cid, idx) => quizInstances[cid] && quizInstances[cid].answer(idx);
    window.quizNext   = (cid)      => quizInstances[cid] && quizInstances[cid].next();
    window.quizReset  = (cid)      => quizInstances[cid] && quizInstances[cid].reset();

    function buildQuiz(containerId, questions) {
      const container = document.getElementById(containerId);
      let current = 0;
      let score   = 0;
      const results = new Array(questions.length).fill(null);

      function renderProgress() {
        return `<div class="quiz-progress">${
          questions.map((_, i) => {
            let cls = 'quiz-dot';
            if      (results[i] === true)  cls += ' done';
            else if (results[i] === false) cls += ' wrong';
            else if (i === current)        cls += ' current';
            return `<div class="${cls}"></div>`;
          }).join('')
        }</div>`;
      }

      function renderQuestion() {
        const q        = questions[current];
        const answered = results[current] !== null;
        const selected = q.selected;

        const optsHTML = q.opts.map((opt, idx) => {
          let cls = 'quiz-opt';
          if (answered && idx === q.correct)                    cls += ' correct';
          else if (answered && idx === selected && idx !== q.correct) cls += ' wrong';
          return `<button class="${cls}" ${answered ? 'disabled' : ''} onclick="quizAnswer('${containerId}', ${idx})">${opt}</button>`;
        }).join('');

        let feedbackHTML = '';
        if (answered) {
          const ok = selected === q.correct;
          feedbackHTML = `<div class="quiz-feedback ${ok ? 'ok' : 'fail'} show">${q.explanation}</div>`;
        }

        const atEnd = current === questions.length - 1;

        return `${renderProgress()}
          <div class="quiz-q">
            <div class="quiz-q-text">${current + 1}. ${q.q}</div>
            <div class="quiz-options">${optsHTML}</div>
            ${feedbackHTML}
          </div>
          <div class="quiz-nav">
            <button class="btn secondary" onclick="quizReset('${containerId}')">Reiniciar</button>
            <button class="btn" onclick="quizNext('${containerId}')" ${!answered ? 'disabled' : ''}>${atEnd ? 'Ver resultado' : 'Siguiente →'}</button>
          </div>`;
      }

      function renderScore() {
        const s = score;
        const msg =
          s === 5 ? '¡Perfecto! Dominas la rotación del BM Hunter.' :
          s >= 4  ? '¡Muy bien! Casi perfecto, repasa los fallos.'  :
          s >= 3  ? 'Bien, pero hay margen de mejora. Revisa la guía.' :
                    'Necesitas repasar la guía. ¡Dale otra vuelta!';

        container.innerHTML = `${renderProgress()}
          <div class="quiz-score show">
            <div class="score-num">${s}/${questions.length}</div>
            <div class="score-label">respuestas correctas</div>
            <div class="score-msg">${msg}</div>
            <button class="btn" onclick="quizReset('${containerId}')">Reiniciar examen</button>
          </div>`;
      }

      const api = {
        answer(idx) {
          const q = questions[current];
          if (results[current] !== null) return;
          q.selected = idx;
          const ok = idx === q.correct;
          results[current] = ok;
          if (ok) score++;
          container.innerHTML = renderQuestion();
        },
        next() {
          if (results[current] === null) return;
          if (current === questions.length - 1) {
            renderScore();
          } else {
            current++;
            container.innerHTML = renderQuestion();
          }
        },
        reset() {
          current = 0;
          score   = 0;
          questions.forEach(q => delete q.selected);
          results.fill(null);
          container.innerHTML = renderQuestion();
        }
      };

      quizInstances[containerId] = api;
      api.reset();
    }

    // ─── PREGUNTAS ST ─────────────────────────────────────────────────
    const stQuestions = [
      {
        q: '¿Cuándo sube Disparo con púas a prioridad #1 en la lista ST?',
        opts: [
          'Siempre que esté disponible',
          'Cuando Cólera de las bestias saldrá de CD en ≤3 segundos',
          'Solo durante la ventana de Cólera de las bestias',
          'Cuando tienes Aliado de la naturaleza activo'
        ],
        correct: 1,
        explanation: '✅ El objetivo es que tu mascota cargue al objetivo justo antes de Cólera de las bestias para que esté en posición. Si no usas Disparo con púas antes, la mascota puede llegar tarde y perderte el sangrado inicial.'
      },
      {
        q: '¿Cuándo tiene alta prioridad Matar en ST?',
        opts: [
          'Siempre que esté disponible, es prioridad #2',
          'Solo cuando tienes Aullido de la manada activo',
          'Cuando tienes Aullido de la manada O Aliado de la naturaleza activo',
          'Solo durante Cólera de las bestias'
        ],
        correct: 2,
        explanation: '✅ Matar sube a prioridad #3 si tienes cualquiera de los dos buffs activos. Ambas condiciones lo potencian significativamente. Fuera de ellas, baja en la lista.'
      },
      {
        q: '¿Qué activa ¡Estampida! en Pack Leader?',
        opts: [
          'Usar Cólera de las bestias directamente',
          'El primer Matar después de usar Cólera de las bestias',
          'Usar Disparo con púas durante Cólera de las bestias',
          'Tener Aliado de la naturaleza activo al mismo tiempo que Cólera de las bestias'
        ],
        correct: 1,
        explanation: '✅ En Pack Leader, es el primer Matar posterior a Cólera de las bestias el que activa ¡Estampida!. Por eso Matar tiene tanta prioridad durante esa ventana de CD.'
      },
      {
        q: '¿Qué pasa si tu mascota no ataca cuando usas Cólera de las bestias?',
        opts: [
          'Cólera de las bestias hace que la mascota empiece a atacar automáticamente',
          'Pierdes el efecto de Aliado de la naturaleza',
          'No aplicas el sangrado de Escabechina al objetivo',
          '¡Estampida! no se activa'
        ],
        correct: 2,
        explanation: '✅ Escabechina solo se aplica al objetivo que ataca tu mascota. Sin mascota activa, no hay sangrado y pierdes DPS significativo durante toda la ventana. Por eso los macros de petattack son imprescindibles.'
      },
      {
        q: '¿Cuándo es válido retrasar Cólera de las bestias?',
        opts: [
          'Cuando no tienes Enfoque máximo',
          'Cuando no tienes Aliado de la naturaleza activo',
          'En M+ cuando el pack va a morir antes de que puedas aprovechar el CD',
          'Nunca, siempre hay que usarla en cuanto esté disponible'
        ],
        correct: 2,
        explanation: '✅ La única excepción válida es en M+ cuando el pack morirá antes de que rentabilices el CD. En raid y ST, úsala siempre en cuanto esté disponible sin excepciones.'
      }
    ];

    // ─── PREGUNTAS AoE ────────────────────────────────────────────────
    const aoeQuestions = [
      {
        q: '¿Qué habilidad se añade como segunda prioridad en AoE que no existe en ST?',
        opts: [
          'Disparo de cobra adicional',
          'Paliza salvaje',
          'Flecha de veneno',
          'Trampa explosiva'
        ],
        correct: 1,
        explanation: '✅ Paliza salvaje es el principal añadido en AoE. Es instantánea, potente, y activa Tajo de la bestia en tu mascota, convirtiéndola en la segunda prioridad del loop AoE.'
      },
      {
        q: '¿Cuándo tiene prioridad Disparo de cobra gracias al buff de Zancapuerco?',
        opts: [
          'Siempre que Zancapuerco esté activo',
          'Cuando Zancapuerco está activo Y hay menos de 4 enemigos',
          'Solo si no tienes Cólera de las bestias disponible',
          'Cuando hay más de 4 enemigos y Zancapuerco activo'
        ],
        correct: 1,
        explanation: '✅ La condición es doble: buff de Zancapuerco activo Y menos de 4 enemigos. Con 4 o más enemigos otras habilidades tienen más valor relativo que Disparo de cobra.'
      },
      {
        q: '¿Cómo debes usar Disparo con púas en AoE?',
        opts: [
          'Multi-dotear todos los objetivos para maximizar el daño',
          'Solo al objetivo prioritario, nunca multi-dot',
          'Alternar entre dos objetivos para mantener el debuff',
          'No usarlo en AoE, es solo para ST'
        ],
        correct: 1,
        explanation: '✅ NUNCA hagas multi-dot de Disparo con púas en AoE. Siempre al objetivo prioritario. Multi-dotear es uno de los errores más comunes y costosos del BM Hunter.'
      },
      {
        q: '¿Por qué es crítico el posicionamiento en la ventana de CD en AoE M+?',
        opts: [
          'Para que Paliza salvaje golpee a más enemigos',
          'Para que tu mascota llegue más rápido al pack',
          '¡Estampida! no tiene ajuste de altura y falla si no estás al mismo nivel que los enemigos',
          'Para maximizar el rango de Tajo de la bestia'
        ],
        correct: 2,
        explanation: '✅ ¡Estampida! no ajusta la altura del terreno. Si estás elevado respecto a los enemigos, los animales pasan por debajo y casi todo el daño AoE del proc falla.'
      },
      {
        q: '¿Dónde debe estar tu mascota en AoE para maximizar el daño?',
        opts: [
          'En la parte delantera del pack, atacando al primer enemigo',
          'Lo más lejos posible del pack',
          'En el centro del pack para maximizar hits de Tajo de la bestia y Paliza salvaje',
          'Atacando al mismo objetivo que tú siempre'
        ],
        correct: 2,
        explanation: '✅ Tu mascota debe estar en el CENTRO del pack para que Tajo de la bestia y Paliza salvaje golpeen al máximo de enemigos posible. Posicionar la mascota bien en AoE es tan importante como la propia rotación.'
      }
    ];

    buildQuiz('quiz-st',  stQuestions);
    buildQuiz('quiz-aoe', aoeQuestions);

    // ─── BIS TRACKER ──────────────────────────────────────────────────
    const BIS_TOTAL = 15;

    function bisCheck(cb) {
      const row = cb.closest('tr');
      row.classList.toggle('collected', cb.checked);

      const checked = document.querySelectorAll('.bis-check:checked').length;
      document.getElementById('bis-count').textContent = checked + ' / ' + BIS_TOTAL;
      document.getElementById('bis-bar').style.width   = (checked / BIS_TOTAL * 100) + '%';

      const state = {};
      document.querySelectorAll('tr[data-bis]').forEach(r => {
        state[r.dataset.bis] = r.querySelector('.bis-check').checked;
      });
      try { localStorage.setItem('bm_bis', JSON.stringify(state)); } catch (e) {}
    }

    // Restaurar estado al cargar
    (function () {
      let state = {};
      try { state = JSON.parse(localStorage.getItem('bm_bis') || '{}'); } catch (e) {}

      document.querySelectorAll('tr[data-bis]').forEach(r => {
        const cb = r.querySelector('.bis-check');
        if (state[r.dataset.bis]) {
          cb.checked = true;
          r.classList.add('collected');
        }
      });

      const checked = document.querySelectorAll('.bis-check:checked').length;
      document.getElementById('bis-count').textContent = checked + ' / ' + BIS_TOTAL;
      document.getElementById('bis-bar').style.width   = (checked / BIS_TOTAL * 100) + '%';
    })();

    // ─── BUILD TOGGLE ─────────────────────────────────────────────────
    function setRot(mode, btn) {
      activateToggle('#tab-rotacion', btn);
      ['pl', 'dr'].forEach(k => {
        document.getElementById('rot-' + k).style.display = mode === k ? '' : 'none';
      });
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
//   whUrl:    "https://www.wowhead.com/...",
//   flexibles: [
//     { name: "Nombre del talento", note: "Explicación de cuándo quitarlo." },
//   ],
//   notes: [
//     "Texto de nota. Los hechizos se auto-linkean.",
//   ],
// }
// ═══════════════════════════════════════════════════════════════════════════

const buildsData = Array.isArray(window.BM_BUILDS_DATA) ? window.BM_BUILDS_DATA : [];

// ─── BUILDS RENDERER ──────────────────────────────────────────────────────
// Renderiza dinámicamente los builds en la pestaña de Talentos.
// No toques esta función — edita buildsData arriba.
function renderBuilds() {
  const toggleWrap = document.getElementById('builds-toggle-wrap');
  const buildsContainer = document.getElementById('builds-container');
  if (!toggleWrap || !buildsContainer) return;

  // Botones de toggle
  toggleWrap.innerHTML = buildsData.map((b, i) => `
    <button class="toggle-btn${b.meta ? ' meta' : ''}${i === 0 ? ' active' : ''}"
      onclick="setBuild('${b.id}', this)">
      ${b.label}
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
          <div class="card-header">${b.header}</div>
          <p class="build-desc">${b.desc}</p>
          <div class="build-actions">
            <button id="${copyBtnId}" onclick="copyTalent(document.getElementById('${copyBtnId}'), '${b.copyStr}')" class="build-btn build-btn-copy">📋 Copiar string</button>
            <a href="${b.whUrl}" target="_blank" class="build-btn build-btn-link">🔗 Abrir en Wowhead</a>
          </div>

          <div class="talent-showcase">
            <div class="ts-header">
              <span class="ts-title">🔧 Talentos Flexibles</span>
              <span class="ts-sub">Ajusta estos puntos según el encuentro — en orden de prioridad para quitar:</span>
            </div>
            <div class="ts-flexible">${flexiblesHtml}</div>
          </div>

          <div class="box box-tip" style="margin-top:0">
            <div class="box-title">💡 Notas del build</div>
            <ul class="build-notes">${notesHtml}</ul>
          </div>
        </div>
      </div>`;
  }).join('');
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
    const bgColor     = isAdd ? 'rgba(67,160,71,.18)' : isRemove ? 'rgba(229,57,53,.15)' : 'rgba(79,195,247,.14)';
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
  const noteTitles = { crit: '🚨 Crítico', warn: '⚠️ Atención', tip: '💡 Consejo', info: 'ℹ️ Nota' };
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
               style="border:3px solid var(--accent2); border-radius:50%; box-shadow:0 0 20px rgba(79,195,247,0.45);"
               alt="${heroTalent}">
          <div style="margin-top:10px; font-size:14.5px; font-weight:700; color:var(--accent);">
            ${heroTalent}
          </div>
        </div>

        <!-- Nombre del Boss -->
        <div style="flex:1; padding-top:8px;">
          <div style="font-family:'Cinzel',serif; font-size:24px; font-weight:700; color:var(--gold); letter-spacing:1px;">
            ${b.name}
          </div>
          <div style="color:var(--text2); font-size:16px; margin-top:4px;">
            Esta guia de talentos está optimizada para el encuentro contra <strong>${b.name}</strong> en dificultad <strong>${b.diff === 'h' ? 'Mítico' : 'Heroico'}</strong> y será actualizada conforme se amplien los datos de Warcraft Logs.
          </div>
        </div>
      </div>

      <div class="box box-info" style="margin-bottom:22px;">
        <div class="box-title">📖 Resumen</div>
        ${autoLink(b.summary)}
      </div>

      ${togglesHtml}

      <div class="build-actions" style="margin-bottom:20px;">
        <button id="${copyId}" onclick="copyBossStr('${copyId}','${build.string}')" class="build-btn build-btn-copy">📋 Copiar string de talentos</button>
        <a href="${build.whUrl}" target="_blank" class="build-btn build-btn-link">🔗 Abrir en Wowhead</a>
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
    </div>
  `;

  // Re-inicializar tooltips de Wowhead para el contenido recién renderizado
  if (window.$WowheadPower && window.$WowheadPower.refreshLinks) {
    window.$WowheadPower.refreshLinks();
  }
}

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
  activeBossBuilds[0] = bossData[0].builds.findIndex(b => b.rec);
  renderBossPanel(0);
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
