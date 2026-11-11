# Cómo editar el contenido

Todo el contenido editable está en `src/content`. El formato completo está en `CLAUDE.md`.

| Qué | Dónde |
|---|---|
| Lista de cambios (cabecera) y fechas de revisión | `src/content/data/changelog.json` |
| Rotación (un archivo por build) | `src/content/rotacion/*.md` |
| Opener (un archivo por build) | `src/content/opener/*.md` |
| Hechizos: icono, tooltip y color | `src/content/data/spells.json` |
| Builds de talentos | `src/content/builds/*.md` |
| Jefes (sección oculta) | `src/content/Bosses/*.md` |

Ejemplo de paso de rotación:

```yaml
- texto: "[[Matar]] — si [[Aullido de la manada]] está activo."
```

Antes de publicar: `npm run build` (valida fechas, pestañas y que cada `[[hechizo]]` exista en el catálogo).
Copia de seguridad del contenido: `npm run backup:content`.
