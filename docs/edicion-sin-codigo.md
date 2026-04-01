# Guia de edicion sin codigo

## Objetivo

Editar openers, rotaciones, builds y bosses sin tocar componentes Astro ni JavaScript.

## Doble opcion de edicion

1. Archivos markdown en `src/content`
2. Editor visual en `/admin`

El CMS oculta campos sensibles como IDs y panel IDs para evitar cambios accidentales.

## Catalogo central de habilidades

Archivo: `src/content/data/spells.json`

- Aqui viven icono, tipo y tooltip de cada habilidad.
- En openers/rotaciones ahora el CMS muestra un desplegable en `spell`.
- Si falta una habilidad nueva en el desplegable, primero agrega su entrada en `spells.json`.

## Estructura minima de opener

- `chainSteps`: secuencia superior (texto corto)
- `steps`: lista de pasos detallados
- Cada paso usa:
  - `spell`: nombre de habilidad del catalogo
  - `text`: explicacion en texto plano

## Estructura minima de rotacion

- `stItems`: prioridades ST
- `aoeItems`: prioridades AoE
- Cada item usa:
  - `spell`: nombre de habilidad del catalogo
  - `text`: explicacion en texto plano

## Validacion automatica

Ejecuta:

`npm run check:content`

Te dira si hay nombres de habilidades invalidos o campos faltantes.

## Verificacion rapida (1 comando)

Ejecuta:

`npm run verify:quick`

Lanza validacion de contenido y build completo para confirmar que todo esta correcto antes de publicar.

## Backup rapido antes de editar

Ejecuta:

`npm run backup:content`

Genera una copia de `src/content` en `backups/AAAA-MM-DD_HH-MM-SS/content`.

## Build seguro

`npm run build`

Ahora incluye validacion de contenido antes de compilar.
