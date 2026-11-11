---
id: dr-aoe
orden: 4
boton: Dark Ranger — AoE / M+
heroe: dark-ranger
oculto: true
bloques:
  - cadena:
      - icono: ability_hunter_markedfordeath
        texto: Marca del cazador
        nota: Pre-pull
        tono: bf
      - icono: ability_hunter_misdirection
        texto: Redirección
        nota: Al tanque
        tono: sp
      - icono: inv_misc_enggizmos_18
        texto: Caja de puzles
        nota: "-2s pull"
        tono: gold
      - icono: inv_ability_darkrangerhunter_blackarrow
        texto: Flecha negra
        nota: Primera Flecha negra
        tono: gold
      - icono: ability_hunter_barbedshot
        texto: Disparo con púas ×1
        nota: Nuestra pet ya estará pegando al target.
        tono: sp
      - icono: ability_hunter_sickem
        texto: Paliza salvaje
        nota: Reactiva Tajo de la bestia
        tono: pr
      - icono: inv_12_profession_alchemy_lightpotion_yellow
        texto: Poción + Raciales
        nota: Trinkets activos
        tono: gold
      - icono: ability_druid_ferociousbite
        texto: Cólera de las bestias
        nota: Activa CD
        tono: sp
      - icono: ability_hunter_killcommand
        texto: Matar
        nota: Con Aliado de la naturaleza
        tono: sp
      - icono: ability_hunter_sickem
        texto: Paliza salvaje
        nota: Golpea mas fuerte gracias a Cólera de las bestias
        tono: pr
      - icono: ability_hunter_barbedshot
        texto: Disparo con púas
        nota: Objetivo prioritario
        tono: sp
      - icono: ability_theblackarrow
        texto: Flecha lastimera
        nota: Sin Disparo con púas / Matar
        tono: gold
      - icono: ability_hunter_cobrashot
        texto: Rotación AoE normal
        tono: sp
  - pasos:
      titulo: Pasos Detallados — Dark Ranger AoE/M+
      lista:
        - texto: Asegúrate de que [[Marca del cazador|Debe estar activa en el objetivo prioritario del pack.]] está activa en el objetivo prioritario.
        - texto: Pre-castea [[Caja de puzles de Algeth'ar|2s de casteo. Pre-castear exactamente 2 segundos antes del pull.]] exactamente **2 segundos antes del pull**.
        - pre: Pre-pull
          texto: Lanza [[Redirección|Redirige el agro de tu mascota al tanque.]] al tanque.
        - texto: Lanza [[Flecha negra|Primera Flecha negra dentro de Cólera de las bestias.]] Usamos la primera flecha Flecha negra.
        - texto: Lanza [[Disparo con púas>Disparo con púas x1|Posiciona la mascota en el objetivo y carga Aliado de la naturaleza.]] Nuestras pets ya deberian estar atacando.
        - texto: Lanza [[Paliza salvaje|Activa Tajo de la bestia en la mascota para el cleave AoE.]] para reactivar [[Tajo de la bestia|AoE de mascota. Mantenlo activo durante todo el pull.||bf]]. !!¡Mascota en el centro del pack!!!
        - icono: inv_12_profession_alchemy_lightpotion_yellow
          texto: Activa **poción**, **raciales** y **trinkets** (excepto Caja de puzles).
        - texto: Activa [[Cólera de las bestias|CD principal.]].
        - texto: Lanza [[Matar|Con Aliado de la naturaleza activo.]] con [[Aliado de la naturaleza|+30% daño.]] activo.
        - texto: Lanza [[Paliza salvaje|Segundo Paliza salvaje del opener.|Habilidad activa|sp]] Siempre y cuando no tengas disponible Flecha negra
        - texto: Lanza [[Disparo con púas|Al objetivo prioritario, nunca multi-dot.]] al objetivo prioritario.
        - icono: ability_theblackarrow
          texto: Cuando no tengas [[Disparo con púas|Al objetivo prioritario.]] ni [[Matar|On cooldown.]] disponibles, lanza [[Flecha lastimera|Relleno AoE potente.]].
        - icono: ability_hunter_cobrashot
          texto: Continúa con la rotación AoE normal.
---
