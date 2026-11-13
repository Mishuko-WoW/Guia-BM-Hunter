---
tab: mecanicas
titulo: Visión General del Beast Mastery Hunter en WoW Forever
bloques:
  - caja: info
    titulo: Resumen
    texto: >-
      WoW Forever es una versión de nivel **1 a 60** con árboles de talentos clásicos (builds tipo **31/20/0**).
      El Beast Mastery es el especialista en mascotas: tu mascota es a la vez **tu mayor fuente de daño y tu tanque**,
      y tú disparas a distancia con [[Tiro automático]] y tus disparos. El recurso es el **maná**, no el enfoque.
      <br><br>
      Respecto al Classic original, Forever mantiene casi todo y añade dos cosas clave:
      **[[Invocar halcón]]** (un «segundo pet» rotacional que se desbloquea con talentos a nivel 25) y que
      **las mascotas ahora escalan con tus estadísticas**, así que el BM sigue creciendo con tu equipo hasta el final.

  - caja: warn
    titulo: Aviso sobre los datos de nivel 60
    texto: >-
      La beta de Forever estaba limitada a **nivel 30**. Todo lo que se refiere a nivel 60 (stats exactos, BiS, encantamientos)
      es una estimación y se irá confirmando. Cuando algo no esté claro lo marco como **pendiente**.

  - subtitulo: Qué cambia en Forever respecto al Classic original

  - tabla:
      cabecera: [Habilidad o talento, Cambio en Forever]
      filas:
        - ["{{Invocar halcón}}", "**Nuevo** (talento de Bestias, nivel 25). El halcón ataca 18 s y puedes tener **2 a la vez**. Comparte reutilización (6 s) con [[Tiro Arcano]]. Escala con tu poder de ataque a distancia y lo mejoran los talentos Ferocidad y Furia desatada. No tiene alcance mínimo."]
        - ["{{Fuego enfocado}}", "**Nuevo** talento: +2% a todo tu daño y el de tu mascota mientras la mascota está activa."]
        - ["{{Aspectos letales}}", "**Nuevo** talento: con [[Aspecto del halcón]], cada [[Tiro automático]] puede darte un 30% de velocidad de ataque a distancia durante 12 s."]
        - ["{{Afinar la puntería}}", "**Nuevo** talento de Puntería: el Intelecto te da poder de ataque 1 a 1."]
        - ["{{Tiro automático}}", "Tiene **0,5 s de lanzamiento**, pero ya **no se corta** al lanzar otras habilidades."]
        - ["{{Tiro de puntería}}", "Pasa a ser **habilidad base** (antes era talento) y comparte reutilización con [[Multidisparo]]."]
        - ["{{Multidisparo}}", "Golpea a un máximo de 3 objetivos y comparte reutilización con [[Tiro de puntería]]."]
        - ["{{Disciplina de bestias}}", "Ahora también deja que el **50% de tu regeneración de maná** siga mientras lanzas: es tu talento de maná."]
        - ["{{Intimidación}}", "El siguiente ataque de la mascota aturde 3 s y tiene +100% de probabilidad de crítico. Genera mucha amenaza."]
        - ["{{Entrenamiento en aguante}}", "Aumenta salud **y armadura** de la mascota (hasta un 15% con 5/5)."]
        - ["{{Domesticar bestia>Mascotas|Las mascotas escalan con tus estadísticas y cada familia tiene una habilidad única.}}", "**Escalan con tus estadísticas** y **cada familia tiene al menos una habilidad única** (por ejemplo [[Nube de polvo]] del zancaalta). Lo explico en la pestaña <a href=\"#mascotas\">Mascotas</a>."]

  - tarjeta: Qué hereda tu mascota de tus estadísticas
    icono: ability_hunter_beasttraining
    filas:
      - "**Poder de ataque:** el 10% de tu poder de ataque más alto (el de distancia, en BM)."
      - "**Probabilidad de crítico:** el **100%** de la tuya. Cada punto de crítico te mejora a ti y a tu mascota, y además alimenta [[Frenesí]]."
      - "**Armadura:** el 30% de tu armadura."
      - "**Aguante:** cada punto de tu aguante da **2 de vida** a la mascota."
      - "Las mascotas ahora tienen **evasión** y ya **no reciben los bufos de otras clases**. Lo puedes ver todo en el panel de mascota de la ventana de personaje."

  - subtitulo: Puntos fuertes y débiles

  - columnas:
      - titulo: Puntos fuertes
        color: blue
        filas:
          - "**El mejor para subir de nivel y hacer contenido en solitario:** la mascota tanquea y tú disparas desde lejos."
          - "**Burst muy alto** en la ventana de [[Ira de bestias]] (cada 2 min) junto a [[Fuego rápido]]."
          - "**Fácil de aprender:** la rotación es una lista de prioridades corta. Aun así tiene mucho margen de mejora (control de la mascota, mantener los 2 halcones, posicionamiento)."
          - "**Control y kiteo:** trampas, [[Cortar alas]], [[Disparo de concusión]] y [[Fingir muerte]] para soltar amenaza o salir de combate."
          - "**Mascotas con utilidad:** según la familia aportas reducción de armadura, debilitaciones o desarmes."
      - titulo: Puntos débiles
        color: orange
        filas:
          - "**Casi sin utilidad de grupo:** no aportas bufos importantes a la banda; te ganas el sitio con el daño."
          - "**Zona muerta:** si el enemigo está a menos de 8 m pero fuera de cuerpo a cuerpo, no puedes atacarle."
          - "**Dependes de la mascota:** si muere o no ataca al objetivo correcto pierdes gran parte de tu daño."
          - "**AoE limitado:** [[Multidisparo]], [[Trampa explosiva]] y [[Lluvia]] son tus únicas herramientas, y la mascota sostiene mal la amenaza contra varios enemigos."
          - "**Gestión de recursos:** maná, munición (ocupa una bolsa) y felicidad de la mascota."

  - subtitulo: Mecánicas clásicas que tienes que dominar

  - tarjeta: Zona muerta (deadzone)
    icono: ability_rogue_feint
    filas:
      - "Tus disparos tienen un alcance de **8 a 35 m**. Entre el cuerpo a cuerpo y los 8 m hay un hueco en el que **no puedes disparar ni golpear cuerpo a cuerpo**."
      - "Si un enemigo se te pega, **aléjate hasta pasar los 8 m** o acércate del todo para usar [[Cortar alas]] o [[Separación]]."
      - "[[Invocar halcón]] **no tiene alcance mínimo**, así que lo puedes seguir lanzando aunque el enemigo esté encima de ti."
      - "Lo ideal es que la mascota (o el tanque) mantenga la amenaza para que nunca tengas que pelear en esa distancia."

  - tarjeta: Munición y carcaj
    icono: inv_misc_quiver_10
    filas:
      - "Necesitas **flechas** (arcos y ballestas) o **balas** (armas de fuego). Sin munición no puedes atacar a distancia."
      - "El **carcaj** (flechas) o la **bolsa de munición** (balas) ocupa un hueco de bolsa (tendrás una bolsa menos que otras clases), pero aumenta tu velocidad de ataque a distancia. **Mejóralo** según subas de nivel."
      - "Compra munición siempre que pases por un pueblo o una ciudad. Por lo que se sabe, el sistema de munición no cambia en Forever."

  - tarjeta: Maná
    icono: spell_nature_abolishmagic
    filas:
      - "Todos tus disparos y aguijones cuestan **maná**. [[Tiro automático]] es gratis y es una parte enorme de tu daño."
      - "El Espíritu regenera maná fuera de lanzamientos: cada 2 s recuperas **(Espíritu / 5 + 15) / 2**, y empieza a contar 5 s después de tu último hechizo."
      - "[[Disciplina de bestias]] deja que el **50%** de esa regeneración continúe mientras lanzas. [[Eficacia]] (Puntería) reduce el coste de tus disparos si te falta maná en peleas largas."
      - "Si te quedas sin maná no está todo perdido: **la mascota sigue haciendo gran parte de tu daño** y tu [[Tiro automático]] sigue disparando."

  - tarjeta: Gestión de la mascota
    icono: ability_hunter_mendpet
    filas:
      - "**Asegúrate de que ataque al objetivo correcto** y **mándala primero** para que genere amenaza antes de empezar a disparar. Las <a href=\"#macros\">macros de ataque</a> lo hacen automático."
      - "**Felicidad:** dale de comer con [[Alimentar mascota]] (cada familia tiene su dieta). Si muere pierde felicidad y, con ella, daño."
      - "**Cúrala** con [[Sanar mascota]] y vigila su vida, sobre todo contra élites."
      - "[[Revivir mascota]] tiene un lanzamiento largo y caro: el talento [[Revivir mascota mejorado]] lo hace mucho más práctico."
      - "Cuidado en mazmorras: es muy fácil que la mascota se meta en otro grupo de enemigos. Usa *Quieta* / *Moverse a* y la macro de volver."
      - "[[Ira de bestias]] la vuelve **inmune a los efectos de control** durante 18 s."

  - subtitulo: Mejores razas

  - caja: info
    texto: >-
      Las diferencias entre razas son **pequeñas** (en torno a un 1%): elige la que más te guste. Te dejo lo que aporta cada una en Forever para que
      decidas según tu forma de jugar.

  - tabla:
      cabecera: [Raza, Facción, Qué aporta al BM]
      filas:
        - ["Orco", "Horda", "[[Ordenar]]: +5% de daño de las mascotas (pasiva). [[Furia sangrienta]]: +10% de poder de ataque 15 s, instantánea, 2 min. Úsala con [[Ira de bestias]]."]
        - ["Humano", "Alianza (nuevo como cazador)", "[[Crueldad]]: +1% de probabilidad de crítico con todo, y tu mascota lo hereda. [[Voluntad de supervivencia]] quita los aturdimientos (PvP)."]
        - ["Elfo de la noche", "Alianza", "[[Luz de Elune]]: +10% de crítico 15 s (3 min). Combínala con [[Ira de bestias]] y [[Fuego rápido]]. La mascota también hereda ese crítico."]
        - ["Skyborne", "Ambas", "[[Bendición del viento]]: +2% de celeridad. [[Perspicacia elemental]]: +5% de daño contra elementales. Su habilidad de movilidad ([[Visión cielonata]] en la versión de la Horda) da velocidad y caída lenta."]
        - ["Enano", "Alianza", "[[Precisión de artesano]]: +1% de golpe. [[Caza mayor]]: +5% de daño contra bestias."]
        - ["Trol", "Horda", "[[Iracundia]]: +10% de velocidad de ataque 15 s (ya no depende de la vida que te falte). [[Matanza de bestias]]: +5% contra bestias."]
        - ["Tauren", "Horda", "Sin bonus ofensivo. Más vida, [[Pisotón de guerra]] (aturdimiento en área) y [[Correr planicies]] (velocidad al moverte sin el riesgo de [[Aspecto del guepardo]])."]

  - caja: tip
    titulo: Mi recomendación
    texto: >-
      En la **Horda**, **Orco** (el 5% de daño de mascota es justo lo que más aprovecha un BM).
      En la **Alianza**, **Humano** o **Elfo de la noche**, y **Skyborne** si te gusta. Todas son viables: no rehagas tu personaje por la raza.
---
