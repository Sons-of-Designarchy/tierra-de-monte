# Feedback ronda 3 — 12 oct 2026 (tarde)

Prueba final de Dan en local. Solo se junta; se aplica cuando Dan diga.

## Home
- [x] Tabs de categorías (Bio-estimulantes, Plagas y enfermedades, Tratamiento para semillas, Soluciones Acuícolas, Degradadores): **centradas** horizontalmente en la fila (hoy alineadas a la izquierda). Variante de alineación en el átomo `tabs` (izquierda/centro), centro en el home; en móvil sigue con scroll horizontal.

## Nosotros
- [x] Vacantes: le falta **padding bottom antes del footer** (hoy la caja oscura toca el footer). Margen inferior de sección (~64px desktop, 48px móvil) entre el bloque y el footer, sobre el fondo crema. Revisar cualquier última sección de página contenida (con inset/radio) para que nunca toque el footer.

## Colecciones (http://127.0.0.1:9292/collections/all)
- [x] Tarjetas de producto **con descripción**: extracto de 2–3 líneas debajo del nombre (como en producción y en "También te podría interesar"). Activar `show_excerpt` por defecto en `card-grid-product` (todas las colecciones, búsqueda, home).
- [x] **Bug (sigue)**: al hacer scroll, el navbar flotante tapa el título "Productos" y la barra "11 productos / Ordenar por" (se ven detrás del navbar). El título no debe quedar debajo de la barra: confirmar que el contenido arranca bajo el navbar en carga y revisar el `position: sticky` de la barra de orden (que su `top` sea el alto del navbar + aire, no 0). Probar con scroll, no solo en carga.

## Ficha de producto (http://127.0.0.1:9292/products/crecr)
- [x] Botón **"Compra" en primary** (relleno lima de marca, como el CTA principal del sitio). Hoy sale gris (secondary). "Ficha técnica" se queda como secundario (outline). En todas las PDPs.
