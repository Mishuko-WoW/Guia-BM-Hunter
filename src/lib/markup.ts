import { getSpell, iconUrl } from './spells';

// Mini-formato del contenido (rotación, opener…):
//   [[Nombre]]                    hechizo del catálogo (spells.json): clase y tooltip automáticos
//   [[Nombre|desc]]               con descripción de tooltip propia para esa mención
//   [[Nombre|desc|tipo|clase]]    sobrescribe también tipo y clase (sp | pr | bf); campos vacíos = catálogo
//   [[Nombre>Texto visible]]      muestra otro texto con el tooltip de Nombre
//   **negrita**   *cursiva*   !!alerta en rojo!!
// Se permite HTML suelto para casos especiales.

const attr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Atributos del tooltip propio (lo pinta bm-guide.js)
function tipAttrs(name: string, desc?: string, type?: string, spell = getSpell(name)): string {
  return (
    `data-name="${attr(name)}" data-type="${attr(type || spell?.type || '')}"` +
    ` data-desc="${attr(desc || spell?.desc || '')}"`
  );
}

// [[Nombre]] → etiqueta con icono pequeño (el icono solo se ve en el tema Forever, ver marca.css)
function mention(raw: string): string {
  const [head, desc, type, badge] = raw.split('|');
  const [rawName, label = rawName] = head.split('>');
  const name = rawName.trim();
  const spell = getSpell(name);
  const cls = badge || spell?.badge || 'sp';
  const icon = iconUrl(spell?.iconForever ?? spell?.icon);
  const img = icon ? `<img class="sp-ico" src="${icon}" alt="" width="18" height="18" loading="lazy">` : '';
  return `<span class="${cls}" ${tipAttrs(name, desc, type, spell)}>${img}${label.trim()}</span>`;
}

// {{Nombre}} → icono grande con el nombre debajo (para tablas y listas de habilidades)
// {{Nombre>Texto}} muestra otro texto; {{Nombre|tooltip}} usa un tooltip propio
function tile(raw: string): string {
  const [head, desc] = raw.split('|');
  const [rawName, label = rawName] = head.split('>');
  const name = rawName.trim();
  const spell = getSpell(name);
  const icon = iconUrl(spell?.iconForever ?? spell?.icon);
  return (
    `<span class="spell-tile ${spell?.badge ?? 'sp'}-tile" ${tipAttrs(name, desc, undefined, spell)}>` +
    (icon ? `<img src="${icon}" alt="" width="56" height="56" loading="lazy">` : '') +
    `<span class="spell-tile__name">${label.trim()}</span></span>`
  );
}

export function md(text = ''): string {
  return text
    .replace(/\{\{([^}]+)\}\}/g, (_, m) => tile(m))
    .replace(/\[\[([^\]]+)\]\]/g, (_, m) => mention(m))
    .replace(/!!(.+?)!!(?!!)/g, '<strong class="txt-alert">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
}

// Nombres de hechizo usados en un texto (para validar contra el catálogo)
export function mentionedSpells(text = ''): string[] {
  return [...text.matchAll(/\[\[([^\]|>]+)|\{\{([^}|>]+)/g)].map((m) => (m[1] ?? m[2]).trim());
}
