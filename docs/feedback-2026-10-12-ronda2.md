# Feedback ronda 2 — 12 oct 2026 (tarde)

Lista de Dan sobre el preview después de los agentes. Solo se junta; no se aplica hasta que Dan diga.

## Aliados
- [x] Hero (slider): "mejor, pero la foto ahora se rompe" — con el navbar encima, la foto se recorta arriba (a Francisco se le corta la cabeza). Darle aire arriba: que el encuadre de la foto respete el punto focal de la imagen (focal point de Shopify; default arriba ~20%) en vez de centrar, y subir la altura (hoy 75svh → ~85–90svh; "puede ser un poco más alto sin pedos"). Revisar los 3 slides y móvil.
- [x] Links de secciones del navbar (Beneficios, Productos, Niveles, Resultados, Proceso, Preguntas): **muy grandes**. Bajarlos (body-lg → body o body-sm medium, como los links de PerfectlyRad), sin cambiar la altura de la barra.
- [x] Tarjetas con foto de "Para quién" (panel de vidrio): **menos espacio entre el panel y la orilla de la tarjeta** (hoy ~48px a los lados y abajo → ~16–24px), que el panel ocupe más ancho de la foto. Y **menos padding interno** del panel (hoy ~48px → ~24px).
- [x] Beneficios compartidos de Productos (Mayor rentabilidad, Más oportunidades de venta, Más recompra, Una propuesta diferenciada): a Dan le gustaba más **en un card flotante** (la banda de vidrio sobre la foto de la línea, como estaba antes de moverlos). Confirmar con Dan la posición: (a) card flotante sobre la foto grupal, arriba del carrusel; o (b) card flotante blanco sin foto, arriba del carrusel. Mantener: sin mayúsculas, títulos h4.
- [x] Preguntas frecuentes: las preguntas (trigger del acordeón) en **font-weight 500** (medium). Hoy regular 400. Cambiar en el átomo `accordion` para que aplique en todos los FAQ del sitio; la respuesta se queda en regular.

## Notas de ejecución
- Hero: foto alineada arriba (`50% 0%`) en los tres heroes (home, Nosotros, Aliados) salvo que la imagen tenga punto focal en Shopify; slider de Aliados a 88svh.
- Navbar: links de la barra (menú y anclas) en body medium, misma altura de barra.
- Tarjeta con foto: panel a 16px de la orilla; padding interno 16px en móvil, 24px desde tablet.
- Productos: decisión (a). Foto grupal arriba del carrusel con tarjeta de vidrio flotante con los 4 beneficios (h4, sin mayúsculas); en móvil la tarjeta va debajo de la foto.
- FAQ: el átomo accordion ya renderiza la pregunta en weight medium (500) con Inter; la respuesta queda regular.
