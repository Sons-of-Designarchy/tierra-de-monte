# KPIs del Programa de Aliados

v1 · octubre 2026. Entrega a TDEM el 6 nov junto con la guía de mensajes.
Fuentes: **GA4** (comportamiento web), **Shopify** (compras), **GoHighLevel** (GHL, registros y etiquetas de nivel).

> Los eventos `aliados_view`, `aliados_cta_click`, `aliados_registro` y `purchase` los implementa otro agente. Esta tabla fija los nombres y definiciones; si la implementación cambia un nombre o parámetro, se corrige aquí.
> Las metas están como `[META]`: TDEM las define con la línea base de las primeras 4 semanas. Nada se compromete antes.
> `[DEPENDE DE APROBACIÓN]` Los CTA medidos se confirman contra la landing aprobada el miércoles 14 oct.

## 1. Eventos

| Evento | Cuándo se dispara | Parámetros sugeridos | Dónde |
|---|---|---|---|
| `aliados_view` | Carga de `/pages/aliados` | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` | GA4 |
| `aliados_cta_click` | Clic en cualquier CTA de la landing | `cta_label` (ej. "Quiero ser Aliado"), `cta_location` (hero, beneficios, niveles, proceso, registro), `cta_target` (anchor/WhatsApp/correo) | GA4 |
| `aliados_registro` | Envío exitoso del formulario "Form v.0 Aliados" (GHL) | `utm_*`, `segmento` si el formulario lo pide | GA4 + GHL |
| `purchase` | Compra en Shopify (estándar de GA4/Shopify) | `value`, `currency` (MXN), `items`, `aliado=true` cuando aplique | GA4 + Shopify |

## 2. Tabla de KPIs

| # | Métrica | Definición | Fuente | Evento / dato | Meta | Revisión |
|---|---|---|---|---|---|---|
| 1 | Visitas a la landing | Sesiones con `aliados_view`, por fuente y campaña | GA4 | `aliados_view` | `[META]` | Semanal |
| 2 | Clic en CTA (tasa) | `aliados_cta_click` ÷ `aliados_view` | GA4 | `aliados_cta_click` / `aliados_view` | `[META]` | Semanal |
| 3 | CTA que más convierte | Clics por `cta_label` y `cta_location` | GA4 | `aliados_cta_click` | Informativo | Quincenal |
| 4 | Registros de Aliado | Envíos del formulario "Form v.0 Aliados" por mes | GHL + GA4 | `aliados_registro` | `[META]` | Semanal |
| 5 | Conversión visita a registro | `aliados_registro` ÷ `aliados_view` | GA4 | `aliados_registro` / `aliados_view` | `[META]` | Semanal |
| 6 | Registros que hacen primer pedido | % de registros con `purchase` de $5,000 MXN o más en los 30 días siguientes | GHL + Shopify | `purchase` cruzado con contacto GHL por correo/teléfono | `[META]` | Mensual |
| 7 | Tiempo a primer pedido | Días entre `aliados_registro` y primer `purchase` | GHL + Shopify | Mediana | `[META]` | Mensual |
| 8 | Aliados activos por nivel | Aliados con compra en el bimestre, por Bronce, Plata, Oro, Platino | Shopify + GHL (etiqueta de nivel) | Compra bimestral vs. mínimo del nivel | `[META]` | Bimestral |
| 9 | Ascenso de nivel | % de Aliados que suben de nivel en el bimestre | Shopify + GHL | Cambio de etiqueta de nivel | `[META]` | Bimestral |
| 10 | Retención bimestral | % de Aliados que cumplen su mínimo en bimestres consecutivos | Shopify | `purchase` por Aliado | `[META]` | Bimestral |
| 11 | Ingreso por Aliado | Suma de `purchase.value` de Aliados ÷ Aliados activos, por nivel | Shopify | `purchase` | `[META]` | Mensual |
| 12 | Costo por registro | Inversión del canal ÷ `aliados_registro` atribuidos | Plataformas de ads + GA4 | UTM | `[META]` | Mensual |
| 13 | Origen del registro | Registros por `utm_source`/`utm_medium` (orgánico, redes, WhatsApp, correo, referido) | GA4 + GHL | `aliados_registro` | Informativo | Mensual |
| 14 | Uso del kit de redes | Piezas del master publicadas por TDEM/agencia y su CTR | Plataformas sociales | UTM de cada pieza | `[META]` | Mensual |
| 15 | Clic a WhatsApp | Clics en "Realiza tu primera compra aquí" | GA4 | `aliados_cta_click` con `cta_target=whatsapp` | `[META]` | Semanal |

## 3. Cadencia

| Frecuencia | Qué se revisa | Quién |
|---|---|---|
| Semanal (lunes) | 1, 2, 4, 5, 15; anomalías | Casa Soda con TDEM |
| Quincenal | 3: qué CTA y qué titular ganan | Casa Soda |
| Mensual | 6, 7, 11, 12, 13, 14 | TDEM comercial y Casa Soda |
| Bimestral | 8, 9, 10 (el nivel se mide por compra bimestral) | TDEM comercial |

## 4. Reglas de medición

- Cada pieza del master lleva su UTM: `utm_source` (instagram, facebook, whatsapp, correo), `utm_medium` (post, story, pdf), `utm_campaign=aliados`, `utm_content` (idea, niveles, prueba, cta).
- El registro **no** es una venta: se concreta con el primer pedido. Por eso 4 y 6 se reportan separados.
- El nivel lo asigna Shopify (compra) y GHL (etiqueta). Si no coinciden, manda Shopify.
- Antes de reportar, validar con una compra y un registro de prueba que los 4 eventos llegan a GA4.
- Las pruebas de titular (guía de mensajes, sección 5) usan `utm_content` y KPIs 2 y 5.

## 5. Pendientes

- Metas: TDEM define tras 4 semanas de línea base.
- Confirmar con el agente de implementación los nombres exactos de parámetros.
- Confirmar cómo se cruza el contacto GHL con el cliente Shopify (correo o teléfono).
- GA4 aún no estaba instalado en el tema al cierre de v0 (P0 #16): verificar.
