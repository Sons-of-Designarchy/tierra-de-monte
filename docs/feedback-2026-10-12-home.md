# Feedback home — 12 oct 2026 (tarde)

Lista de Dan revisando el home en el preview. Solo se junta; se aplica cuando Dan diga.

- [ ] Hero: la imagen **alineada arriba** (object-position top) para que no se corte lo de arriba (tractor, gente); que se corten las plantas de abajo. → Se lo pasé al agente de la ronda 2, que ya está tocando el encuadre compartido de los heroes (`pr-hero.css`): default arriba para home y Aliados, respetando el focal point de Shopify si está puesto.
- [x] Tabs de categorías (átomo `tabs`): texto **muy grande**. Bajar a body-sm medium como el Tabs de PerfectlyRad (hoy ~body-lg). La tab **seleccionada lleva fondo** (Dan): relleno suave (ej. lima de marca o action-light) con texto primary, sin depender solo del subrayado, que hoy casi no se ve (lima clara sobre crema). Las no seleccionadas sin fondo. Aplica a todas las instancias del átomo.
- [x] Eyebrow "Soluciones estratégicas, resultados excepcionales" (sobre "Innovación que siembra futuro"): **sin caja/chip**, igual que los eyebrows de Aliados (mono, mayúsculas, sin fondo). Revierte el "eyebrow en chip" del 11-oct. Revisar que ningún otro eyebrow del sitio quede en chip: todos por el section-header con el mismo estilo.
- [x] **Regresión: se mató el estilo secundario del ticker.** Antes ("Colaboración en campo"): texto grande en Inter light sobre crema, líneas de 1px arriba y abajo, logo de Tierra de Monte como separador. Hoy salió igual que el ticker con foto (mono mayúsculas sobre foto oscura). Regresarlo como **variante del componente ticker** ("Secundario: texto grande sobre fondo claro con líneas") y asignarla a esa instancia; el ticker con foto ("Alimentos más saludables") se queda como está.
- [x] Bloque ticker → logos → ticker se ve raro: tres bandas oscuras seguidas. Con el ticker secundario de regreso se rompe el sándwich. Además, el título "ALIANZAS QUE NUTREN LA TIERRA" quedó enorme y en negritas: regresarlo a eyebrow chico (mono regular, como antes). Comparar contra la captura "antes" que mandó Dan.
- [x] Ticker con foto: el ícono del logo entre frases casi no se ve (oscuro sobre foto oscura) → en blanco con la misma opacidad que el separador.
- [x] "Ciencia al servicio del campo" (ticker después de "¿Quiénes somos?"): en producción se ve mejor — texto grande Inter light sobre verde claro, logo como separador, línea abajo. Es el mismo ticker secundario: regresarlo con la variante y su color de fondo de producción. **Regla para esto**: antes de cambiar cualquier ticker o sección del home, comparar contra https://tierrademonte.com y conservar lo que ya funcionaba allá (las tres instancias de ticker del home tienen estilos distintos en producción; respetar cada una).

## Nosotros (http://127.0.0.1:9292/pages/nosotros)
- [x] **Sigue roto el radio** en la imagen con texto ("La ciencia… común con la tierra", foto a la izquierda + panel oscuro): la foto tiene radio en el lado que toca el panel. El arreglo del contenedor no llegó a esta instancia (puede ser otra sección: `image-with-text` vs `rich-text-with-logo`/`tdm-feature`). Verificar con captura en Nosotros, Impacto y Ciencia y home, ambas orientaciones; no marcar hecho sin captura.
- [x] Vacantes: el bloque debe tener **el mismo ancho y la misma orilla que la caja de arriba** (la imagen con texto verde/foto): mismo inset lateral, mismo radio, alineados. Hoy está más angosto, sin radio y desalineado. Usar el mismo contenedor/inset que image-with-text.
- [x] Orden de Nosotros: mover **Equipo antes de Vacantes** (hoy Vacantes va antes). Reordenar en templates/page.nosotros.json sin tocar copy.

## Footer
- [x] **Padding top**: sigue pegado arriba (~32px). Subir a `--pr-space-16`/64px (desktop), 48px móvil. Se marcó hecho hoy pero no se ve → verificar con captura.
- [x] De paso: el gap entre links sigue distinto (Mapa/Soluciones ~40px vs Declaratorias/Contacto ~36px) y los títulos de columna van en mono bold mientras "REDES SOCIALES" quedó mono regular chico → los 5 títulos iguales y el mismo gap en todas las columnas.

## Blog (http://127.0.0.1:9292/pages/blog)
- [x] Navegación del blog: "Explora nuestro blog" pasa de eyebrow chico a **título de la página** (display, como los títulos de página: arriba, solo), y abajo las categorías (Inicio, Agricultura, Ciencia, Soluciones biológicas, Tierra). Las categorías con el átomo `tabs` (mismo estilo que las tabs del home: sin cajas, seleccionada con fondo) en lugar de la fila de botones con borde.

## Navbar (ambos)
- [ ] El tamaño de texto de los links del navbar va **más chico en los dos navbars**: el del sitio (Home, Nosotros, Productos…) y el de Aliados (Beneficios, Productos…). Mismo tamaño en ambos (body o body-sm medium, como PerfectlyRad), misma altura de barra. (El agente de la ronda 2 ya está bajando el de Aliados; igualar el del sitio a ese.)

## Ejecución (12-oct, agente 3)
- Ticker: ajuste «Estilo» (Con foto / Secundario) en `sections/ticker.liquid`; «Ciencia al servicio del campo» (#c8e7c3) y «Colaboración en campo» (transparente) en secundario con los valores de producción; el ícono del ticker con foto va en blanco al 60%.
- Logo bar: título a eyebrow mono (sin regla); se quitaron sus ajustes de tamaño/fuente.
- Eyebrow: sin chip en ningún lado (opción borrada de heading, section-header y tdm-feature); los eyebrows de caption (multicolumn, rich-text, image-with-text) usan el mono por defecto.
- Tabs: body-sm medium, seleccionada con relleno lima, sin subrayado; modo enlaces (`hrefs`) para el blog.
- Radio: token `--pr-radius-container` compartido por imagen + texto y por Vacantes (verificado con captura en 390/768/1280 en Nosotros, Impacto y Ciencia, blog y home: un solo radio exterior, costura recta).
- Footer: el padding-top lo pisaba `.footer .page-width` (24px); ahora 64px escritorio / 48px móvil (medido); títulos iguales (eyebrow) y mismo paso de línea.
- Nosotros: Equipo antes de Vacantes.
- Pendientes (otro agente): hero arriba (item 1) y tamaño de texto del navbar.

