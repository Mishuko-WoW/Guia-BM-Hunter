import { getSpell } from './spells';

// Mini-formato del contenido (rotación, opener…):
//   [[Nombre]]                    hechizo del catálogo (spells.json): clase y tooltip automáticos
//   [[Nombre|desc]]               con descripción de tooltip propia para esa mención
//   [[Nombre|desc|tipo|clase]]    sobrescribe también tipo y clase (sp | pr | bf); campos vacíos = catálogo
//   [[Nombre>Texto visible]]      muestra otro texto con el tooltip de Nombre
//   **negrita**   *cursiva*   !!alerta en rojo!!
// Se permite HTML suelto para casos especiales.

const attr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function mention(raw: string): string {
  const [head, desc, type, badge] = raw.split('|');
  const [name, label = name] = head.split('>');
  const spell = getSpell(name.trim());
  const cls = badge || spell?.badge || 'sp';
  return (
    `<span class="${cls}" data-name="${attr(name.trim())}" data-type="${attr(type || spell?.type || '')}"` +
    ` data-desc="${attr(desc || spell?.desc || '')}">${label.trim()}</span>`
  );
}

export function md(text = ''): string {
  return text
    .replace(/\[\[([^\]]+)\]\]/g, (_, m) => mention(m))
    .replace(/!!(.+?)!!(?!!)/g, '<strong class="txt-alert">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
}

// Nombres de hechizo usados en un texto (para validar contra el catálogo)
export function mentionedSpells(text = ''): string[] {
  return [...text.matchAll(/\[\[([^\]|>]+)/g)].map((m) => m[1].trim());
}
