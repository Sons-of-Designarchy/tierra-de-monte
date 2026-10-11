# Migración del sitio a PerfectlyRad: inventario y pendientes

Documento vivo (octubre 2026). Rama `perfectlyrad/site`. Es el inventario de qué tiene el tema y **la lista de trabajo para quien continúe**: cada sección tiene una casilla, un estado y, si falta algo, una tarea concreta. Antes de empezar lee `docs/sistema-de-diseno.md` y abre el catálogo (`/pages/distribuidores?view=foundations`).

**Estados:** ✅ migrado · 🟡 parcial · ⬜ pendiente. Al terminar una sección: cambia el estado, actualiza sus números y agrega una línea a la bitácora del final. Un commit por sección.

## 1. Reglas de la migración (resumen)

- Todo texto visible: `{% render 'typography' %}` con una variante con nombre. Sin `font-size`, `font-weight`, `font-family` ni colores de texto escritos a mano.
- Botones, enlaces, campos, tarjetas, acordeones: con los átomos (`button`, `link`, `input`, `card`, `accordion`...).
- Colores solo con roles `--pr-*` (cambian con el esquema); espacios, radios y sombras con las escalas `--pr-*`.
- Sin hex, sin `!important`, sin `<style>`/`<script>` inline (CSS en `assets/section-tdm-*.css`, JS en custom elements).
- Bordes de 1 px; sin mayúsculas ni mono por defecto (solo con ajustes que ya existen).
- No cambiar el texto ni el contenido de `templates/*.json`; todo ajuste del editor debe seguir funcionando (si se quita o renombra uno, migrar el JSON).
- Comercio (compra, carrito, grilla de colección, precio, variantes): solo apuntar estilos a tokens; se reemplaza más adelante.

## 2. Plantillas y secciones que usan

Conteo = veces que aparece la sección en esa plantilla. `*-group.json` son los grupos de header/footer (se cargan en `layout/theme.liquid`).

| Plantilla | Secciones |
|---|---|
| `404.json` | `main-404` |
| `article.json` | `custom-breadcrumb-blog`, `main-article`, `featured-blog`, `featured-collection`, `image-with-text` |
| `blog.blog-tdm-template.json` | `blog-nav`, `main-blog`, `featured-collection` |
| `blog.json` | `blog-nav`, `main-blog`, `featured-collection` |
| `cart.json` | `main-cart`, `featured-collection` |
| `collection.enfermedades.json` | `main-collection-banner`, `grid-gallery`, `card-grid-product` |
| `collection.json` | `main-collection-banner`, `card-grid-product` |
| `collection.plagas.json` | `main-collection-banner`, `grid-gallery`, `card-grid-product` |
| `index.json` | `hero-overlay-card`, `tabbed-collections`, `ticker` ×4, `tdm-feature` ×2, `multicolumn`, `logo-bar`, `reviews` |
| `list-collections.json` | `main-list-collections` |
| `page.aliados-propuesta.json` | `hero-slider`, `tdm-detail-spotlight`, `ticker` ×3, `tdm-card-grid` ×2, `tdm-scroll-steps`, `tdm-impact`, `slide-gallery`, `comparison-table`, `rich-text`, `custom-liquid`, `collapsible-content` |
| `page.aliados.json` | `hero-slider`, `tdm-card-grid` ×2, `tdm-detail-spotlight`, `ticker` ×4, `slide-gallery`, `tdm-scroll-steps`, `comparison-table` ×2, `rich-text`, `custom-liquid`, `collapsible-content` |
| `page.buzon-de-sugerencias.json` | `main-page`, `rich-text`, `contact-form`, `apps` |
| `page.contact.json` | `main-page`, `rich-text`, `contact-form`, `apps` |
| `page.declaratorias.json` | `main-page`, `rich-text` ×2, `contact-form`, `apps`, `ticker` |
| `page.distribuidores.json` | `main-page`, `rich-text`, `contact-form`, `apps` |
| `page.foundations.json` | `tdm-catalog` |
| `page.impacto-y-ciencia.json` | `main-page`, `image-with-text` ×4, `tdm-feature` ×2, `multicolumn` ×2, `ticker`, `rich-text-with-logo` |
| `page.json` | `rich-text-with-logo` ×2, `main-page`, `tdm-feature` ×2, `image-with-text` ×2, `_blocks` |
| `page.nosotros.json` | `rich-text`, `multicolumn` ×2 |
| `page.tdm-blog.json` | `blog-nav`, `main-page`, `featured-blog` ×2, `image-with-text` |
| `page.test-about.json` | `main-page`, `image-with-text` ×3, `tdm-feature` ×3, `ticker`, `rich-text-with-logo` |
| `page.vacante.json` | `main-page`, `rich-text`, `contact-form`, `apps` |
| `password.json` | `email-signup-banner` |
| `product.json` | `main-product`, `rich-text`, `image-banner`, `slideshow`, `featured-collection`, `ticker` ×2, `tdm-feature`, `image-with-text`, `video`, `featured-blog`, `related-products` |
| `product.test.json` | `main-product`, `image-banner`, `slideshow`, `ticker` ×2, `tdm-feature`, `video`, `featured-blog`, `related-products` |
| `search.json` | `main-search` |
| `customers/account.json` | `main-account` |
| `customers/activate_account.json` | `main-activate-account` |
| `customers/addresses.json` | `main-addresses` |
| `customers/login.json` | `main-login` |
| `customers/order.json` | `main-order` |
| `customers/register.json` | `main-register` |
| `customers/reset_password.json` | `main-reset-password` |
| `footer-aliados-group.json` | `footer` |
| `footer-group.json` | `footer` |
| `header-aliados-group.json` | `announcement-bar`, `header` |
| `header-group.json` | `announcement-bar`, `header` |

Plantillas que parecen pruebas o duplicadas (confirmar con Dan antes de borrar, el admin puede tenerlas asignadas): `product.test.json`, `page.test-about.json`, `blog.blog-tdm-template.json` (≈ `blog.json`), `page.tdm-blog.json`, `page.aliados-propuesta.json` (propuesta de Aliados). `templates/article.json` tenía una coma final inválida en el JSON.

## 3. Métricas por sección en uso (antes de migrar)

Medidas sobre el `.liquid` de la sección más los CSS que carga. `hex` = colores `#...` en CSS/`<style>`; `px` = `font-size` en px; `!imp` = `!important`; `<style>`/`<script>` = bloques inline; `texto CSS` = declaraciones `font-*`, `line-height`, `letter-spacing`, `text-transform` escritas a mano; `h/p` = etiquetas `<h1-6>`/`<p>` escritas a mano; `typo` = renders de `typography`/`heading`; `btn` = botones/`.button` sin átomo; `inp` = `<input>/<select>/<textarea>`; `card` = clases `card` sin átomo.

| Sección | Usos | hex | px | !imp | `<style>` | `<script>` | texto CSS | h/p | typo | btn | inp | card |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `announcement-bar` | 2 | 0 | 0 | 0 | 1 | 1 | 0 | 4 | 0 | 4 | 0 | 0 |
| `header` | 2 | 0 | 0 | 5 | 1 | 1 | 21 | 4 | 0 | 0 | 0 | 0 |
| `footer` | 2 | 0 | 0 | 1 | 0 | 0 | 9 | 5 | 0 | 1 | 4 | 0 |
| `hero-overlay-card` | 1 | 2 | 0 | 0 | 0 | 0 | 5 | 3 | 0 | 1 | 0 | 0 |
| `tabbed-collections` | 1 | 0 | 0 | 1 | 0 | 1 | 7 | 3 | 0 | 2 | 0 | 0 |
| `ticker` | 18 | 0 | 0 | 0 | 0 | 0 | 13 | 0 | 0 | 0 | 0 | 0 |
| `tdm-feature` | 11 | 0 | 0 | 0 | 0 | 0 | 6 | 3 | 0 | 1 | 0 | 2 |
| `multicolumn` | 5 | 0 | 0 | 4 | 0 | 0 | 4 | 3 | 0 | 5 | 0 | 2 |
| `logo-bar` | 1 | 0 | 0 | 0 | 0 | 0 | 8 | 1 | 0 | 0 | 0 | 0 |
| `reviews` | 1 | 0 | 2 | 0 | 0 | 1 | 10 | 1 | 0 | 2 | 0 | 0 |
| `hero-slider` | 2 | 0 | 0 | 0 | 0 | 1 | 18 | 9 | 0 | 5 | 0 | 0 |
| `tdm-card-grid` | 4 | 0 | 0 | 11 | 0 | 1 | 11 | 4 | 0 | 5 | 0 | 6 |
| `tdm-detail-spotlight` | 2 | 1 | 0 | 0 | 0 | 1 | 0 | 7 | 0 | 0 | 0 | 0 |
| `slide-gallery` | 2 | 1 | 0 | 2 | 0 | 1 | 15 | 2 | 0 | 8 | 0 | 0 |
| `tdm-scroll-steps` | 2 | 1 | 0 | 0 | 0 | 1 | 9 | 8 | 0 | 1 | 0 | 0 |
| `comparison-table` | 3 | 0 | 0 | 0 | 0 | 1 | 44 | 23 | 0 | 3 | 0 | 0 |
| `tdm-impact` | 1 | 0 | 0 | 0 | 0 | 0 | 2 | 4 | 0 | 1 | 0 | 0 |
| `rich-text` | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 2 | 0 | 0 |
| `custom-liquid` | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `collapsible-content` | 2 | 0 | 0 | 0 | 0 | 0 | 1 | 3 | 0 | 0 | 0 | 1 |
| `image-with-text` | 12 | 0 | 0 | 1 | 0 | 0 | 1 | 2 | 0 | 1 | 0 | 0 |
| `rich-text-with-logo` | 4 | 0 | 0 | 0 | 0 | 0 | 12 | 1 | 0 | 1 | 0 | 0 |
| `main-page` | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| `contact-form` | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 0 | 2 | 4 | 0 |
| `apps` | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `blog-nav` | 3 | 0 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | 0 | 0 | 0 |
| `main-blog` | 2 | 1 | 0 | 40 | 0 | 0 | 8 | 1 | 0 | 0 | 0 | 0 |
| `main-article` | 1 | 0 | 0 | 0 | 0 | 0 | 2 | 6 | 0 | 1 | 4 | 0 |
| `custom-breadcrumb-blog` | 1 | 0 | 0 | 0 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | 0 |
| `featured-blog` | 5 | 1 | 0 | 40 | 0 | 0 | 8 | 5 | 0 | 5 | 0 | 3 |
| `grid-gallery` | 2 | 0 | 0 | 0 | 0 | 0 | 12 | 7 | 0 | 0 | 0 | 0 |
| `main-collection-banner` | 3 | 0 | 0 | 0 | 0 | 0 | 3 | 1 | 0 | 0 | 0 | 0 |
| `main-list-collections` | 1 | 0 | 0 | 4 | 0 | 0 | 5 | 1 | 0 | 0 | 0 | 0 |
| `main-search` | 1 | 0 | 0 | 4 | 1 | 2 | 41 | 7 | 0 | 2 | 3 | 2 |
| `main-404` | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 2 | 0 | 1 | 0 | 0 |
| `main-password-header` | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 2 | 0 | 4 | 1 | 0 |
| `main-password-footer` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `email-signup-banner` | 1 | 1 | 0 | 2 | 0 | 0 | 0 | 2 | 0 | 1 | 2 | 0 |
| `main-account` | 1 | 0 | 0 | 0 | 0 | 0 | 34 | 4 | 0 | 0 | 0 | 0 |
| `main-product` | 2 | 0 | 0 | 12 | 0 | 10 | 53 | 11 | 0 | 11 | 2 | 1 |
| `featured-collection` | 5 | 0 | 0 | 5 | 0 | 6 | 16 | 1 | 0 | 5 | 0 | 1 |
| `main-collection-product-grid` | 3 | 0 | 0 | 5 | 0 | 7 | 41 | 3 | 0 | 0 | 1 | 0 |
| `main-cart-items` | 1 | 0 | 0 | 0 | 0 | 2 | 34 | 8 | 0 | 10 | 1 | 0 |
| `main-cart-footer` | 1 | 0 | 0 | 0 | 0 | 0 | 20 | 2 | 0 | 2 | 1 | 0 |
| `related-products` | 2 | 0 | 0 | 4 | 0 | 0 | 16 | 1 | 0 | 0 | 0 | 0 |
| `image-banner` | 2 | 1 | 0 | 2 | 0 | 0 | 0 | 2 | 0 | 2 | 0 | 0 |
| `slideshow` | 2 | 1 | 0 | 2 | 1 | 1 | 0 | 2 | 0 | 15 | 0 | 0 |
| `video` | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 2 | 0 | 0 |

Secciones de cuenta de cliente (`main-account`, `main-activate-account`, `main-addresses`, `main-login`, `main-order`, `main-register`, `main-reset-password`) comparten `customer.css` (34 declaraciones de texto, 7 colores de texto) y tienen 2 a 10 `<h*>/<p>` cada una; `main-addresses` tiene un `<script>` inline. `layout/theme.liquid`: 34 hex, 43 `!important` y 321 declaraciones de texto entre `base.css` y los CSS globales (Dawn); `layout/password.liquid`: 1 `<style>`/`<script>` inline.

### Fuera de las secciones: globales y copias

- `layout/aliados.liquid` (645 líneas) es una **copia de `layout/theme.liquid`** que ningún template usa (`theme.liquid` ya maneja el sufijo `aliados`). Candidato a borrar.
- `snippets/mega-menu-plagas.liquid` (1 `<style>` inline, 1 px) y `snippets/quick-order-product-row.liquid`: sin referencias.
- Fork histórico: `multicolumn` vs `tdm-feature` (ya fusionados en el refactor) y `rich-text` vs `rich-text-with-logo` (casi iguales; fusionar con un ajuste de logo).
- `section-main-blog.css`/`component-article-card.css`/`section-featured-blog.css` repiten el estilo de tarjeta de artículo (40 `!important` cada uno).

## 4. Sin uso: lista para borrar

Secciones sin ninguna plantilla ni referencia. **No se han borrado** (decisión de Dan). Las secciones de Dawn que Shopify pide por la API de secciones (`cart-drawer`, `cart-icon-bubble`, `cart-live-region-text`, `predictive-search`, `pickup-availability`, `main-password-*`) NO son basura aunque no estén en un JSON.

- `sections/multirow`, `sections/collage` (solo el CSS se usa), `sections/collection-list` (el CSS lo usa `main-list-collections`), `sections/multicolumn-feature`, `sections/multicol-custom-feature`, `sections/multicol-row-list`, `sections/robin-pro-image-gallery-app`, `sections/newsletter`, `sections/page`, `sections/custom-article-nav` (+ `assets/section-tdm-article-nav.css`).
- Comercio sin uso: ya borrado en la migración Commerce (`featured-product`, `quick-order-list`, `bulk-quick-order-list`, `soluciones-tabs`).
- `blocks/ai_gen_block_8f6d7f6.liquid` (reemplazado por `team-grid`/`team-member`).
- `layout/aliados.liquid`, `snippets/mega-menu-plagas.liquid`, `snippets/quick-order-product-row.liquid`.

## 5. Backlog por sección (casillas)

### 1. Global (en todas las páginas)

- [x] 🟡 **`announcement-bar`** (Barra de anuncios, 2 usos). Hecho: mensaje con `typography`, `<style>` de modo editor a `section-tdm-announcement.css`. Falta (junior): flechas con `icon-button` (el JS del slideshow depende de `.slider-button`) y el `<script>` del editor. La barra está desactivada en ambos grupos (se probó activándola a mano). Pendiente original: Texto de anuncio con `typography` (variant `body-sm`, color según esquema), flechas con `icon-button`, quitar el `<style>` inline (mover a `assets/section-tdm-announcement.css`) y el script inline a custom element. Probar en `/`. ~1.5 h
- [x] ✅ **`header`** (Header, 2 usos). Rehecho como el componente Navbar de PerfectlyRad (`snippets/navbar.liquid`, ver sistema-de-diseno.md): barra blanca flotante (`nav_style` floating/full), logo adentro, sin borde, elevación y radio por tokens, links con `typography`, iconos con `icon-button`, panel móvil sin cajón Dawn, JS en `assets/tdm-navbar.js` (el StickyHeader inline y la opción «ocultar al subir» se eliminaron; ahora `sticky` es un checkbox). Borrados: `header-drawer`, `header-dropdown-menu`, `header-mega-menu`, `component-menu-drawer.css`, `component-mega-menu.css`, `section-tdm-header-aliados.css`, ~600 líneas de header en `base.css`, 4 SVG de icono. Seguimiento: el logo propio de Aliados (acta del 17-sep) ya se puede poner en `logo_override` de `header-aliados-group`; faltan los enlaces sociales que traía el cajón móvil (decidir si se quieren).
- [x] ✅ **`footer`** (Footer, 2 usos). Hecho: `section-footer.css` eliminado, un solo `section-tdm-footer.css`; `footer-custom.css` NO se carga en el footer (solo lo usa `layout/aliados.liquid`, sin uso) y queda sin tocar. Original: Encabezados de columna y enlaces con `typography`; campos del boletín con `input` + `button`; quitar el `!important`; unificar `section-footer.css`, `section-tdm-footer.css` y `footer-custom.css` en un solo `section-tdm-footer.css`. ~3 h

### 2. Home (`templates/index.json`)

- [x] ✅ **`hero-overlay-card`** (Hero overlay card, 1 usos). Eyebrow/título/cuerpo con `typography` (`eyebrow`, `display`, `body-lg`), botón con `button`, quitar los 2 hex y las variables `--tdm-*`. ~1.5 h
- [x] ✅ **`tabbed-collections`** (Colecciones con pestañas, 1 usos). Pestañas con el átomo `tabs` o `chip`; mover script inline a `assets/tdm-tabs.js` (custom element); quitar el `!important`. ~3 h Chips con `chip` (nuevo parámetro `lead`).
- [x] ✅ **`ticker`** (Ticker (cinta de texto), 18 usos). Es la sección más usada (18 usos). Texto con `typography`; quitar declaraciones de texto del CSS. ~1 h Tamaño en px del editor se mapea a la escala (>=63px = display).
- [x] ✅ **`tdm-feature`** (Feature (stats / tarjetas / filas), 11 usos). Números y textos con `typography`; tarjetas con el átomo `card`; botón con `button`. 11 usos: probar en Home, Impacto, product. ~2 h
- [x] ✅ **`multicolumn`** (Multicolumn, 5 usos). Títulos/textos con `typography`; tarjetas con `card`; fusionar `section-multicolumn.css` (Dawn) con `section-tdm-multicolumn.css`; quitar 4 `!important`. ~2.5 h Hecho: un solo CSS (`section-tdm-multicolumn.css`). `section-multicolumn.css` sigue en disco porque `tdm-card-grid` lo carga; borrarlo al migrar esa sección.
- [x] ✅ **`logo-bar`** (Barra de logos, 1 usos). Título con `typography`; borrar 8 declaraciones de texto del CSS. ~1 h
- [x] ✅ **`reviews`** (Reseñas, 1 usos). 2 `font-size` en px → `typography`; estrellas con `rating`; script inline → `assets/tdm-reviews.js` (ya existe, revisar). ~1.5 h Nuevo ajuste de bloque `rating` (estrellas, 0 = ocultas).

### 3. Aliados (`page.aliados.json`, `page.aliados-propuesta.json`)

- [x] ✅ **`hero-slider`** (Hero slider, 2 usos). Texto con `typography`, botones con `button`, flechas con `icon-button`. El ajuste «Tamaño del título» (px) pasó a una variante (`heading_variant`: display por defecto; migrado en los 2 JSON). Eyebrow del slide antes en mayúsculas fijas con `tdm-upper`, ahora variante `eyebrow` en fuente de cuerpo.
- [x] ✅ **`tdm-card-grid`** (Card grid, 4 usos). Reescrita: encabezado con `section-header` (átomo `heading`, eyebrow sin línea), cada tarjeta es el átomo `card` con parámetros: `icon_image` (tarjeta de ícono), `bg_image` (tarjeta de foto con panel de vidrio blanco), `image` + `image_ratio` (foto arriba), `text` + `list_icon` (lista con palomitas), `title_size`, `ratio`, `on_color`. Sin HTML paralelo, 0 `!important`, 0 hex, sin JS (se borró `tdm-card-grid.js`), CSS 446 → ~60 líneas (solo grilla). Los ajustes se simplificaron y los 4 usos se migraron en los JSON: se retiraron la línea del eyebrow, esquema/radio/relleno por tarjeta, vidrio y overlay por tarjeta (ahora el panel es siempre blanco), alineaciones sueltas, tamaños de imagen/ícono y el deslizador móvil (nadie lo usaba). Regla: sección con color → tarjetas blancas (`on_color`).
- [x] ✅ **`tdm-detail-spotlight`** (Detail spotlight, 2 usos). Título, párrafo y puntos con `typography`; hex a roles; el `<script>` ya era un archivo (`tdm-detail-spotlight.js`). `tdm-upper` se vuelve a declarar en el CSS de la sección porque `.pr-type` lo resetea.
- [x] ✅ **`slide-gallery`** (Slide gallery, 2 usos). Intro, cita, autor y datos con `typography`; flechas con `icon-button` (siguen siendo `.slider-button--prev/next` para el JS de Dawn); CTA con `button`; hex y 2 `!important` a 0. Las comillas de la cita son ahora SVG (antes el glifo Georgia). El CSS compartido (`component-slider/slideshow`, `section-image-banner`) no se tocó; se sobreescribe en `section-tdm-slide-gallery.css`. Pendiente menor: el botón de pausa/play del autoplay (`slideshow__autoplay`) no se usa en las plantillas de Aliados y sigue con el marcado de Dawn.
- [x] ✅ **`tdm-scroll-steps`** (Scroll steps, 2 usos). Título, párrafo, número, título y texto de cada paso con `typography`; botón con `button`; hex a roles. El ajuste «Tamaño del número» (px, 112) pasó a una variante (`number_variant`, display por defecto; migrado). Cambio visible: el número pasa de 112 px a 72 px (tope de `display`). **Actualización 11-oct:** número del paso `h4` y título del paso `h2` (el número ya no compite); encabezado con `section-header` dentro de la columna fija.
- [x] ✅ **`comparison-table`** (Tabla comparativa, 3 usos). CSS reescrito: 0 declaraciones de texto (antes 44), sin hex ni rgb. Todo el texto con `typography`; botones con `button`; título de columna con enlace con `link`. Los colores ya no se leen del esquema como valores sueltos: la tabla, la columna destacada y cada botón llevan la clase `color-<esquema>` y el CSS usa solo roles `--pr-*`. Ajuste «Tamaño del precio» (H4–H1) ahora mapea a variantes body / body-lg / h6 / h4. El JS ya era un archivo. **Actualización 11-oct:** sección con color ⇒ tabla blanca (`scheme-tdm-blanco`) automáticamente; encabezado con `section-header`; Bronce T1 «Desde $5,000».
- [x] ✅ **`tdm-impact`** (Impact (solo en la propuesta), 1 usos). Textos con `typography`, botón con `button`. Los ajustes de tamaño del número (px móvil/escritorio) pasaron a una variante (`stat_variant`, display por defecto; migrado).
- [x] ✅ **`rich-text`** (Rich text (10 usos), 10 usos). Eyebrow con `section-header` (sin línea; se retiró el ajuste `rule_color`). Título/cuerpo con `typography` y botones con `button`. ~1 h
- [x] ✅ **`custom-liquid`** (Custom liquid, 2 usos). Código de la sección intacto salvo el padding: el `{% style %}` se cambió por el snippet `section-padding`. HTML pegado en las plantillas de Aliados (iguales en las dos): un `<iframe>` del formulario de GoHighLevel (`api.leadconnectorhq.com/widget/form/PokFnUnhtj45vXhbVBBj`, «Form v.0 Aliados») más `<script src="https://link.msgsndr.com/js/form_embed.js">`. No lleva texto escrito a mano ni hex; solo un `style="width:100%;height:100%;border:none;border-radius:8px"` en el iframe. Es estilo de un embed de terceros; no se cambió (el radio de 8 px no sigue `--pr-radius-surface`, que hoy es 0). Si Dan quiere el formulario con esquinas cuadradas, quitar `border-radius:8px` del campo `custom_liquid` en ambas plantillas.
- [x] ✅ **`collapsible-content`** (Collapsible content (FAQ), 2 usos). Cada fila es el átomo `accordion`; `collapsible-content.css` y `section-tdm-faq.css` se fundieron en `section-tdm-collapsible-content.css` (los dos archivos viejos se borraron: solo los usaba esta sección; `component-accordion.css` sigue porque lo usan main-product y featured-product). El snippet `accordion` ganó dos parámetros opcionales: `title_variant` y `title_font`. La pregunta abierta del estilo editorial sigue invirtiéndose con el esquema «pregunta abierta». Cambio visible: las preguntas dejaron de ser `<h3>`, por lo que ya no salen en mayúsculas con el ajuste «Títulos en mayúsculas». **Actualización 11-oct:** reescrita como la Faq de PerfectlyRad (encabezado al lado/apilado con `section-header` + átomo `accordion` default, sin cajas, pregunta en fuente de cuerpo). Ajustes retirados: layout Dawn, esquemas por fila/contenedor, estilo editorial, imagen, íconos por fila.

### 4. Páginas de contenido (Nosotros, Impacto y ciencia, Distribuidores, Declaratorias, Contact, Buzón, Vacante)

- [x] ✅ **`image-with-text`** (Image with text, 12 usos). Título/texto con `typography`, botón con `button`. ~1.5 h
- [x] ✅ **`rich-text-with-logo`** (Rich text con logo, 4 usos). 12 declaraciones de texto en `section-tdm-rich-text.css`; todo con `typography`; fusionar con `rich-text`. ~2 h Hecho: fusionada en `rich-text` (ajustes logo/ancho/mono); sección y CSS viejos borrados, 4 usos migrados en los JSON.
- [x] ✅ **`main-page`** (Contenido de página, 9 usos). El título `h1` de página con `typography` (`h1`); el cuerpo del editor (`.rte`) hereda la escala. ~0.5 h
- [x] ✅ **`contact-form`** (Formulario de contacto, 5 usos). Campos con `input`/`textarea`/`select`, botón con `button`, mensajes con `alert`. Probar que el envío funcione. ~2 h
- [x] ✅ **`apps`** (Apps (bloques de aplicaciones), 5 usos). Contenedor de Shopify, sin estilos propios. Nada que migrar. ~0 h

### 5. Blog, colecciones de plagas/enfermedades, búsqueda, 404, contraseña, cuenta

- [x] ✅ **`blog-nav`** (Navegación del blog, 3 usos). 4 declaraciones de texto → `chip` o `link`. ~1 h Hecho: `chip` atom (md) en fila; etiqueta con `typography` label. Cambio visual: ya no es control segmentado.
- [x] ✅ **`main-blog`** (Listado del blog, 2 usos). Tarjetas con `card` (artículo); quitar 40 `!important` de `component-article-card.css`. ~3 h Hecho: tarjetas con `snippets/article-card` sobre el átomo `card`; `component-article-card.css` ya no se carga (sin uso, borrable).
- [x] ✅ **`main-article`** (Artículo, 1 usos). Cuerpo y títulos con `typography` / `.rte`; compartir con `icon-button`. ~2 h Hecho: títulos, meta, comentarios (input/textarea/alert/button atoms). Sin script inline (solo el JSON-LD). `share-button` con `typography`.
- [x] ✅ **`custom-breadcrumb-blog`** (Breadcrumb del blog, 1 usos). Usar el átomo `breadcrumb`; borrar `section-tdm-breadcrumb.css`. ~1 h Hecho: `button` outline + átomo `breadcrumb` (títulos reales en vez de slugs).
- [x] ✅ **`featured-blog`** (Blog destacado, 5 usos). Tarjetas con `card`; quitar 40 `!important`. ~2.5 h Hecho: article-card, `link`/`button`/`icon-button` (flechas del slider conservan `.slider-button` y `name` para el JS).
- [x] ✅ **`grid-gallery`** (Galería de plagas/enfermedades, 2 usos). 12 declaraciones de texto y 7 `<h*>/<p>`; usar `card`/`image`. ~2.5 h Hecho: átomo `card` + `button` outline sm para el producto recomendado.
- [x] ✅ **`main-collection-banner`** (Banner de colección, 3 usos). Título/descripción con `typography`. ~1 h Hecho: `typography` h1 + descripción body-lg; el `<style>` pasó a la variable `--collection-hero-shadow-y`.
- [x] ✅ **`main-list-collections`** (Lista de colecciones, 1 usos). Tarjetas con `card`. ~1.5 h Hecho: `card` atom directo (no usa `card-collection`, que sigue en cart-drawer).
- [ ] 🟡 **`main-search`** (Búsqueda, 1 usos). Campo con `input`, resultados con `card`. Es página comercial: solo tokens si hay riesgo. ~2 h Hecho: formulario (`input` + `icon-button`), títulos, estado vacío, resultados de página con `card`, sin `<style>`. Falta (comercio): bloque de orden/conteo vertical y filtros (`facets`) con marcado Dawn, y tarjetas de producto.
- [x] ✅ **`main-404`** (Página 404, 1 usos). Texto con `typography`, botón con `button`, quitar `<style>` inline. ~0.5 h Hecho.
- [ ] 🟡 **`main-password-header`** (Contraseña (cabecera), 0 usos). Quitar `<style>` inline; campo con `input`. ~1 h Hecho en código (typography, `input`, `button`, `icon-button`; layout/password.liquid carga ahora los CSS pr-*). 🟡 No verificado a la vista: `/password` redirige si la tienda no tiene contraseña. Tarea: activar contraseña en una tienda de prueba y revisar modal, error y logo.
- [ ] 🟡 **`main-password-footer`** (Contraseña (pie), 0 usos). Sin estilos propios. ~0.5 h Hecho en código (`typography` xs). Mismo pendiente de verificación visual que la cabecera.
- [ ] 🟡 **`email-signup-banner`** (Banner de suscripción (contraseña), 1 usos). Campo con `input`, botón con `button`. ~1 h Hecho en código (`input` + `button`, `alert` de éxito, `typography`; `<style>` a variables). Verificar en `/password`; el CSS de `section-image-banner.css` (compartido) no se tocó.
- [ ] 🟡 **`main-account`** (Cuenta, 1 usos). Todo `customer.css`: 34 declaraciones de texto; títulos con `typography`, campos con `input`. ~3 h para las 7 plantillas de cliente Hecho en código para las 7 plantillas (login, registro, cuenta, pedido, direcciones, activar, restablecer) con `input`/`select`/`button`/`link`/`alert`/`typography`; `customer.css` sin texto ni !important; script de direcciones movido a `customer.js`. 🟡 No verificado a la vista (requieren sesión; la tienda usa cuentas nuevas y redirige). Tarea: probar con cuentas clásicas: login/recover, registro con errores, dirección nueva/editar/borrar (país/provincia), pedido. En la tabla de pedido las celdas de datos heredan el cuerpo sin `typography`.

### 6. Producto, colección, carrito: familia Commerce (puerto de PerfectlyRad `tdm-commerce`)

Reglas y firmas en `docs/sistema-de-diseno.md` §7. CSS `assets/pr-commerce.css`; JS `assets/pr-cart.js`, `pr-product.js`, `pr-grid.js`, `pr-pricing.js` (custom elements).

- [x] ✅ **`price-tag`** (snippet). Reemplaza `price` y `unit-price` (también en predictive-search y main-order). Precio 0 = no publicado: no se dibuja.
- [x] ✅ **`quantity-stepper`** (snippet). Reemplaza `quantity-input`, `quantity-popover` y el `QuantityInput` de global.js.
- [x] ✅ **`variant-picker`** (snippet). Un solo selector: reemplaza `product-variant-picker`, `product-variant-options`, `swatch`, `swatch-input` y `VariantSelects`.
- [x] ✅ **`product-card`** (snippet, `layout: vertical|horizontal`). Reemplaza `card-product` en el home (`tabbed-collections`), `featured-collection`, colecciones, búsqueda, `related-products` y `collage`; el cuerpo de producto del átomo `card` se borró. Tarjeta blanca, borde 1px, sin sombra; quick add abre el carrito.
- [x] ✅ **`card-grid-product`** (snippet + sección). Reemplaza `main-collection-product-grid`, `facets`, `price-facet` y `facets.js`: filtros y orden de Shopify (Search & Discovery), disponibilidad, columnas, estado vacío. `templates/collection*.json` y `main-search` lo usan.
- [x] ✅ **`featured-collection`** y **`related-products`** (secciones). Reescritas sobre `card-grid-product`; sin slider (ajustes `swipe_on_mobile`, `enable_desktop_slider`, `image_shape` y similares retirados y migrados en los JSON).
- [x] ✅ **`product-gallery`** + **`buy-box`** + **`main-product`**. La sección de 2,277 líneas ahora son ~250: galería y cuadro de compra. Metafields de `product-extras` (hoja de seguridad, ficha técnica, beneficios 1–3, ingredientes) dentro del acordeón del buy-box; pago rápido con `{{ form | payment_button }}`. Bloques nuevos: `benefits`, `detail`, `cta` (el botón de WhatsApp pasó de HTML con estilos inline a `cta`). Se borraron `product-media*`, `product-thumbnail`, `buy-buttons`, `product-extras*`, `icon-with-text`, `gift-card-recipient-form`, `featured-product`, `pickup-availability`, `quick-order-*` y los JS de Dawn (`product-info`, `product-form`, `media-gallery`, `product-modal`, `magnify`, `quick-add*`, etc.). Sin lightbox ni zoom (la galería de PerfectlyRad no los tiene).
- [x] ✅ **`minimum-progress`**, **`cart-line-item`**, **`cart-summary`**, **`cart-drawer`**, **`main-cart`**. Un solo cajón (reemplaza `cart-drawer` y `cart-notification` de Dawn; el ajuste `cart_type` desapareció) y una sola página de carrito (`main-cart` reemplaza `main-cart-items` y `main-cart-footer`). Ajax Cart API + Section Rendering. Compra mínima opcional: Configuración del tema → Carrito (`cart_minimum` MXN, apagada con 0).
- [x] ✅ **`aliados-pedido`** (sección, `sections/aliados-pedido.liquid` + `assets/pr-order.js`). Paso 1 del flujo compra primero de Aliados: `product-card` (una por variante disponible) con `quantity-stepper`, subtotal y barra con el look de `minimum-progress` hacia el mínimo (5,000 MXN), botón de pago (átomo `button`) habilitado al llegar; pagar vacía el carrito, agrega el pedido y va a `/checkout`. Bloques `level` (Bronce/Plata/Oro/Platino) para decir «Con este pedido estás en nivel X». Se usa en `page.aliados.json` (`#pedido`). La barra de `minimum-progress` estaba invisible por el `div:empty{display:none}` de Dawn (base.css): arreglado en `pr-commerce.css` (también el carrito). La mínima es solo del lado del cliente: para forzarla en el checkout hace falta una Shopify Function de validación.
- [x] ✅ **`pricing`** (sección, `sections/pricing.liquid`). Niveles con grupos T1/T2, umbral, beneficios, insignia; seleccionable con barra de avance. Disponible en el editor y en el catálogo; **no** se puso en Aliados porque la tabla comparativa de niveles es una matriz característica × nivel y las tarjetas de `pricing` no la reproducen sin perder contenido.
- [x] ✅ **`main-search`**. Los resultados usan `card-grid-product` (productos con `product-card`, artículos con `article-card`, páginas con `card`), con filtros y orden.

## 6. Bugs de contenido conocidos (NO se arreglan en esta migración)

- Grupo 1: `base.css` tenía contorno punteado y fondo gris "temporary" de depuración sobre el logo de `/nosotros-hero` (selector con ID de sección); se quitaron. `snippets/mega-menu-plagas.liquid` sin uso. `assets/tdm-aliados.css` no se carga en ningún layout. En `theme.liquid` el `<script>` de `window.routes` va entre `</head>` y `<body>` (HTML heredado).

Contenido del editor (JSON), de Karla/Dan; se listan para que alguien con permiso de contenido los corrija:

- Aliados: falta el título de la tarjeta/nivel **ORO** en la grilla de niveles.
- Aliados: **T2** muestra precios duplicados.
- Botones sin enlace (aparecen como botón normal que no hace nada): `multicolumn` en nosotros/impacto ("Encuentra tu Solución"), `rich-text` en nosotros ("Acerca de nosotros"). 
- `multicolumn` de Nosotros trae el párrafo de relleno "Agrega aquí un párrafo introductorio para esta sección." en 2 bloques.
- `contact-form`, `reviews` y `multicolumn` del Home están desactivados (`disabled`) en los JSON; `reviews` usa texto de ejemplo ("Nombre Apellido").
- Aliados · `page.aliados.json` y `page.aliados-propuesta.json` (`comparison-table`): en los JSON el título «ORO» sí existe (columna 3) y en el servidor de desarrollo se ve junto a la medalla; no pude reproducir el faltante desde el código. Revisar en el sitio vivo (¿el editor guarda otra versión del JSON en `main`?). La segunda tabla de `page.aliados.json` (`comparison_table_oscuro`) repite los mismos precios que la primera (Desde $10,000 / $30,000 / $60,000 / $100,000) con otros nombres (Esmeralda, Rubí, Zafiro, Diamante): probablemente son los precios «duplicados» de «T2».
- Aliados propuesta · `tdm_impact_aliados`: tercera cifra con relleno «00%» y la nota visible «Cifra de ejemplo — pendiente de dato real».
- Aliados propuesta · `multicolumn_sept2026_cQktdB` (tarjetas de beneficios), 4.ª tarjeta: el texto termina en «…la relación con -----------» (relleno sin terminar). 1.ª tarjeta de `multicolumn_sept2026_AwmWPk`: «Recomiendas» suelto (viñeta cortada); en `page.aliados.json` dice «Recomiendas Productos».
- Aliados propuesta · `slide_gallery_aK44mg`: el párrafo de intro es el texto de relleno «Escribe aquí una descripción breve que acompañe a la galería.». En `page.aliados.json` la 3.ª diapositiva usa como «cita» el texto «RESULTADOS QUE HABLAN POR SÍ MISMOS» (es un titular, no una cita).
- Aliados propuesta · `tdm_scroll_steps_aliados`: los botones de los pasos 1 y 2 («Realizar tu primera compra», «Completa tu proceso de afiliación») no tienen enlace; en `page.aliados.json` sí lo tienen.
- Aliados · `page.aliados.json`, tarjetas `multicolumn_sept2026_AwmWPk`, 3.ª tarjeta («Dueños de punto de venta agrícola»): la 4.ª viñeta empieza en minúscula («acompañamiento técnico y comercial») y la 3.ª termina sin punto: parecen una sola frase partida.
- (Se agregan aquí los que aparezcan durante la migración.)

## 7. Bitácora

- 2026-10-11 perfectlyrad/site · QA completo del sitio (sin Aliados) a 390/768/1280 + flujo de compra (producto → carrito → cajón → página de carrito → checkout de Shopify, sin pagar): sin errores Liquid, sin desborde horizontal, sin imágenes rotas. Arreglado: `animations.js` pisaba el atributo `style` de los elementos con `data-cascade` y borraba las variables CSS de la sección tras el scroll (íconos de 400px en `multicolumn` de Impacto); `multicolumn` plano ya no usa tarjeta blanca (textos oscuros sobre fondo oscuro); banda OMRI de Impacto a ancho completo; títulos de página (colecciones, blog, artículo, búsqueda, 404, galería, cliente, blog destacado) en fuente display; ancho de lectura de artículo, páginas y contacto (`.page-width--narrow` ya no se anula); tickers del home a un solo look (foto, mono, sin bordes); «Quiénes somos» de producto igual al del home; footer en tablet (logo en su fila, menús 2×2). Pestañas de categorías verificadas y cerradas.
- 2026-10-11 perfectlyrad/site · header → Navbar PerfectlyRad flotante (ver fila `header`): 6 archivos Dawn de header borrados, `base.css` -580 líneas, header con 1 implementación y 2 estilos.
- 2026-10-11 grupo 1 (global): desborde 768px 58 -> 0 en las 20 rutas (causa real: columnas `1fr` del footer en tablet con texto largo de contacto, arreglado con `minmax(0,1fr)`; el cajón del menú NO contribuía); footer 3 CSS -> 1 (`section-footer.css` borrado), boletín con átomos `input` + `icon-button`, hacks `custom_css` con `!important` del boletín y de search/cuenta del header eliminados (ajustes `show_search`/`show_account`); `theme.liquid` scripts inline 3 -> 1 (queda `window.routes`, necesita Liquid), botón WhatsApp inline -> `.tdm-whatsapp`; `base.css` hex 5 -> 0, `!important` 33 -> 14 (utilidades `.small-hide`, visually-hidden, autofill, `.focus-none`, `.card__link-overlay`); `component-menu-drawer/mega-menu/localization` rgba/hex -> roles, font-size/weight/line-height fuera.
- 2026-10-11 grupo 6 (producto/colección/carrito, solo tokens): todo rgb/rgba -> roles `--pr-*` con color-mix, hex 2->0, `!important` 12+ -> 0 (especificidad), font-size/weight/line-height -> `--pr-text-*`/`--pr-weight-*`/`--pr-leading-*`, letter-spacing y mayúsculas por defecto (cabecera carrito, caption de producto) eliminados, `<style>` de slideshow -> custom property.
Una línea por cambio: `fecha · rama · qué se migró · números antes → después`. Lo más nuevo arriba.

```
2026-10-11 · perfectlyrad/site · Grupo 3 (Aliados, 9 secciones): hero-slider, tdm-card-grid (🟡 sin átomo `card`), tdm-detail-spotlight, slide-gallery, tdm-scroll-steps, comparison-table, tdm-impact, collapsible-content (sobre `accordion`, 2 CSS fundidos en 1) y custom-liquid. `!important` 13→0 (card-grid 11, slide-gallery 2), hex 8→0, texto CSS comparison-table 44→0, hero-slider 18→0, scroll-steps 9→0, slide-gallery 15→0, impact 2→0, faq/collapsible 1→0, card-grid 11→4, `<style>` 3→0 (collapsible-content, custom-liquid), h/p a mano en las secciones ~60→0 (quedan solo los de los defaults del schema). Ajustes en px pasados a variantes: heading_variant (hero), number_variant (steps), stat_variant (impact); retirados los tamaños en px de card-grid.
2026-10-11 · perfectlyrad/site · Grupo 5 (blog, plagas/enfermedades, búsqueda, 404, contraseña, cuenta): article-card y 14 secciones sobre átomos; `!important` 90→0 (article-card 40+40, list 4, search 4, signup 2), hex 3→0, `<style>` 6→0, `<script>` inline 1→0, texto CSS en customer.css 34→0, grid-gallery 12→0, blog-nav 4→0, breadcrumb 5→0, h/p a mano ~55→0. Nuevos: snippets customer-form-errors y customer-address-fields; select acepta options_html.
2026-10-11 · perfectlyrad/site · Inventario inicial (este documento). Ninguna sección migrada todavía.
```

## 8. Resultado de la migración (medido el 2026-10-11)

Mismo método que `docs/refactor-2026-10.md` (grep sobre `assets/*.css`, `sections`, `snippets`, `blocks`, `layout`). "Después" excluye los archivos sin uso listados en la sección 4 (no se borraron). Los hex que quedan son valores por defecto de los esquemas (`"default": "#..."`) de ajustes del editor, y 1 en CSS.

| Métrica | Antes (foundations) | Después (site, solo archivos en uso) |
|---|---|---|
| `!important` | 235 | 20 (14 en utilidades de `base.css`) |
| Bloques `<style>` | 8 | 1 |
| `<script>` inline | 9 | 5 (JSON de rutas/strings con Liquid, `{% javascript %}` de Shopify) |
| `font-size` en px | 6 | 2 |
| Hex (CSS + liquid) | 47 | 17 (1 en CSS) |
| `<h*>/<p>` a mano en secciones | 222 | 99 (casi todos defaults de richtext en schemas, comercio y Dawn) |
| Declaraciones de texto en CSS de secciones | 339 | 108 (casi todo comercio y CSS de Dawn compartido) |
| Renders de `typography`/`heading` | 306 | 502 |
| Desborde horizontal a 768 | 58 px | 0 (causa: grid del footer, no el cajón) |

`shopify theme check`: 3 errores y 23 advertencias, igual que en `perfectlyrad/foundations` (26).

2026-10-11 · perfectlyrad/site · Aliados 100% PerfectlyRad: `tdm-card-grid` reescrita sobre el átomo `card` (nuevos params: `icon_image`, `bg_image`, `text`, `list_icon`, `title_size`, `ratio`, `on_color`), nuevo snippet `section-header` (heading atom), `assets/pr-atoms-extra.css`. Eyebrow sin línea en todo el tema (snippet `tdm-section-eyebrow` borrado, ajuste `rule_color` retirado en las secciones de Aliados y `tabbed-collections`). Tickers: sin bordes (ajustes retirados) y los de Aliados con el estilo del ticker con foto. Regla verde-sobre-verde + ritmo blanco/crema documentados en `sistema-de-diseno.md`.

2026-10-11 · perfectlyrad/site · Commerce: 12 piezas de PerfectlyRad en Liquid (price-tag, quantity-stepper, variant-picker, product-card, card-grid-product, product-gallery, buy-box, minimum-progress, cart-line-item, cart-summary, cart-drawer, pricing) sobre los átomos. Dawn: card-product, price, facets, quick-add, cart.js, cart-drawer.js, cart-notification, product-info, variant-selects, media gallery y ~40 archivos más, borrados.
