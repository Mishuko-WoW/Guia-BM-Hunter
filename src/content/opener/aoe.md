---
id: aoe
orden: 2
boton: Pack Leader — AoE / M+
heroe: pack-leader
oculto: false
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
      - icono: ability_hunter_barbedshot
        texto: Disparo con púas ×2
        nota: Gastar todas las cargas
        tono: sp
      - icono: inv_12_profession_alchemy_lightpotion_yellow
        texto: Poción + Raciales
        nota: Trinkets activos
        tono: gold
      - icono: ability_hunter_sickem
        texto: Paliza salvaje
        nota: → Tajo de la bestia
        tono: pr
      - icono: ability_druid_ferociousbite
        texto: Cólera de las bestias
        nota: ¡Mascota en pack!
        tono: sp
      - icono: ability_hunter_killcommand
        texto: Matar
        nota: → ¡Estampida!
        tono: sp
      - icono: ability_hunter_cobrashot
        texto: Rotación AoE
        tono: sp
  - caja: warn
    titulo: ⚠️ Posición crítica en AoE
    texto: Posiciónate a la **misma altura** que los enemigos antes de entrar en la ventana de CD. [[¡Estampida!|Sin ajuste de altitud. Falla en terreno irregular.|Proc AoE]] no ajusta altura y la mayoría de animales fallarán si hay diferencia de plano.
  - pasos:
      titulo: 📋 Pasos Detallados — AoE
      lista:
        - pre: Pre-pull
          texto: Aplica [[Marca del cazador|Siempre al objetivo prioritario.]] al objetivo prioritario del pack.
        - pre: Pre-pull
          texto: Lanza [[Redirección|Redirige el agro de tu mascota al tanque.]] al tanque.
        - pre: Al hacer pull
          texto: Gasta **todas las cargas** de [[Disparo con púas|Tiene 2 cargas. Gástalas todas antes de Cólera de las bestias para posicionar la mascota y cargar Aliado de la naturaleza.]] — son 2 cargas. Esto posiciona la mascota y carga Aliado de la naturaleza antes del CD.
        - icono: inv_12_profession_alchemy_lightpotion_yellow
          texto: Activa **poción**, **raciales** y **trinkets**.
        - texto: Lanza [[Paliza salvaje|AoE instantáneo potente que activa Tajo de la bestia.]] — activa [[Tajo de la bestia|AoE de mascota activado por Paliza salvaje y por cada hit de Cólera de las bestias.|Habilidad activa de mascota]] en tu mascota. !!¡La mascota debe estar en el centro del pack!!!
        - texto: Lanza [[Cólera de las bestias|CD principal. La mascota debe estar atacando el objetivo central.]].
        - texto: Lanza [[Matar|Activa ¡Estampida!.]] → activa [[¡Estampida!|Línea de animales. Sin altura.]]
        - texto: Lanza [[Disparo con púas|Al objetivo prioritario.]] al objetivo prioritario y continúa con rotación AoE.
---
