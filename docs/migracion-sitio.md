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
| `cart.json` | `main-cart-items`, `main-cart-footer`, `featured-collection` |
| `collection.enfermedades.json` | `main-collection-banner`, `grid-gallery`, `main-collection-product-grid` |
| `collection.json` | `main-collection-banner`, `main-collection-product-grid` |
| `collection.plagas.json` | `main-collection-banner`, `grid-gallery`, `main-collection-product-grid` |
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

Secciones sin ninguna plantilla ni referencia. **No se han borrado** (decisión de Dan). Las secciones de Dawn que Shopify pide por la API de secciones (`cart-drawer`, `cart-icon-bubble`, `cart-live-region-text`, `cart-notification-*`, `predictive-search`, `pickup-availability`, `main-password-*`) NO son basura aunque no estén en un JSON.

- `sections/multirow`, `sections/collage` (solo el CSS se usa), `sections/collection-list` (el CSS lo usa `main-list-collections`), `sections/multicolumn-feature`, `sections/multicol-custom-feature`, `sections/multicol-row-list`, `sections/robin-pro-image-gallery-app`, `sections/soluciones-tabs`, `sections/newsletter`, `sections/page`, `sections/custom-article-nav` (+ `assets/section-tdm-article-nav.css`).
- Comercio sin uso, borrar al reemplazarlo: `sections/featured-product`, `sections/quick-order-list`, `sections/bulk-quick-order-list`.
- `blocks/ai_gen_block_8f6d7f6.liquid` (reemplazado por `team-grid`/`team-member`).
- `layout/aliados.liquid`, `snippets/mega-menu-plagas.liquid`, `snippets/quick-order-product-row.liquid`.

## 5. Backlog por sección (casillas)

### 1. Global (en todas las páginas)

- [ ] ⬜ **`announcement-bar`** (Barra de anuncios, 2 usos). Texto de anuncio con `typography` (variant `body-sm`, color según esquema), flechas con `icon-button`, quitar el `<style>` inline (mover a `assets/section-tdm-announcement.css`) y el script inline a custom element. Probar en `/`. ~1.5 h
- [ ] ⬜ **`header`** (Header, 2 usos). Enlaces del menú con `typography` (`body-sm`, medium); iconos (buscar, cuenta, carrito) con `icon-button`; mover el `<style>` inline a `assets/section-tdm-header.css`; quitar `!important`; arreglar desborde horizontal de 58 px a 768 (cajón del menú fuera de pantalla). Probar en `/` a 390, 768, 1280. ~4 h
- [ ] ⬜ **`footer`** (Footer, 2 usos). Encabezados de columna y enlaces con `typography`; campos del boletín con `input` + `button`; quitar el `!important`; unificar `section-footer.css`, `section-tdm-footer.css` y `footer-custom.css` en un solo `section-tdm-footer.css`. ~3 h

### 2. Home (`templates/index.json`)

- [ ] ⬜ **`hero-overlay-card`** (Hero overlay card, 1 usos). Eyebrow/título/cuerpo con `typography` (`eyebrow`, `display`, `body-lg`), botón con `button`, quitar los 2 hex y las variables `--tdm-*`. ~1.5 h
- [ ] ⬜ **`tabbed-collections`** (Colecciones con pestañas, 1 usos). Pestañas con el átomo `tabs` o `chip`; mover script inline a `assets/tdm-tabs.js` (custom element); quitar el `!important`. ~3 h
- [ ] ⬜ **`ticker`** (Ticker (cinta de texto), 18 usos). Es la sección más usada (18 usos). Texto con `typography`; quitar declaraciones de texto del CSS. ~1 h
- [ ] ⬜ **`tdm-feature`** (Feature (stats / tarjetas / filas), 11 usos). Números y textos con `typography`; tarjetas con el átomo `card`; botón con `button`. 11 usos: probar en Home, Impacto, product. ~2 h
- [ ] ⬜ **`multicolumn`** (Multicolumn, 5 usos). Títulos/textos con `typography`; tarjetas con `card`; fusionar `section-multicolumn.css` (Dawn) con `section-tdm-multicolumn.css`; quitar 4 `!important`. ~2.5 h
- [ ] ⬜ **`logo-bar`** (Barra de logos, 1 usos). Título con `typography`; borrar 8 declaraciones de texto del CSS. ~1 h
- [ ] ⬜ **`reviews`** (Reseñas, 1 usos). 2 `font-size` en px → `typography`; estrellas con `rating`; script inline → `assets/tdm-reviews.js` (ya existe, revisar). ~1.5 h

### 3. Aliados (`page.aliados.json`, `page.aliados-propuesta.json`)

- [ ] ⬜ **`hero-slider`** (Hero slider, 2 usos). Texto con `typography`, botones con `button`, flechas con `icon-button`, script inline → `assets/tdm-hero-slider.js`. ~3 h
- [ ] ⬜ **`tdm-card-grid`** (Card grid, 4 usos). Tarjetas con el átomo `card`; quitar 11 `!important` de `section-tdm-card-grid.css`; script inline → `assets/tdm-card-grid.js`. ~4 h
- [ ] ⬜ **`tdm-detail-spotlight`** (Detail spotlight, 2 usos). 7 `<h*>/<p>` → `typography`; quitar hex; script inline → `assets/tdm-detail-spotlight.js`. ~2 h
- [ ] ⬜ **`slide-gallery`** (Slide gallery, 2 usos). Texto con `typography`; 8 botones con `icon-button`/`button`; fusionar CSS con `component-slideshow.css`; quitar hex y 2 `!important`; script inline → custom element. ~3 h
- [ ] ⬜ **`tdm-scroll-steps`** (Scroll steps, 2 usos). 8 `<h*>/<p>` → `typography`; quitar hex; script inline → `assets/tdm-scroll-steps.js`. ~2 h
- [ ] ⬜ **`comparison-table`** (Tabla comparativa, 3 usos). La más pesada: 44 declaraciones de texto en CSS y 23 `<h*>/<p>`. Todo con `typography`; botones con `button`; script inline → `assets/tdm-comparison-table.js`. ~4 h
- [ ] ⬜ **`tdm-impact`** (Impact (solo en la propuesta), 1 usos). Textos con `typography`, botón con `button`. ~1 h
- [ ] ⬜ **`rich-text`** (Rich text (10 usos), 10 usos). Título/cuerpo con `typography` y botones con `button`. ~1 h
- [ ] ⬜ **`custom-liquid`** (Custom liquid, 2 usos). Sección vacía de Shopify (HTML libre del editor). Sin cambios de código; revisar el HTML pegado en los templates de Aliados. ~0.5 h
- [ ] ⬜ **`collapsible-content`** (Collapsible content (FAQ), 2 usos). Usar el átomo `accordion`; fusionar `collapsible-content.css`, `component-accordion.css` y `section-tdm-faq.css`. ~2 h

### 4. Páginas de contenido (Nosotros, Impacto y ciencia, Distribuidores, Declaratorias, Contact, Buzón, Vacante)

- [ ] ⬜ **`image-with-text`** (Image with text, 12 usos). Título/texto con `typography`, botón con `button`. ~1.5 h
- [ ] ⬜ **`rich-text-with-logo`** (Rich text con logo, 4 usos). 12 declaraciones de texto en `section-tdm-rich-text.css`; todo con `typography`; fusionar con `rich-text`. ~2 h
- [ ] ⬜ **`main-page`** (Contenido de página, 9 usos). El título `h1` de página con `typography` (`h1`); el cuerpo del editor (`.rte`) hereda la escala. ~0.5 h
- [ ] ⬜ **`contact-form`** (Formulario de contacto, 5 usos). Campos con `input`/`textarea`/`select`, botón con `button`, mensajes con `alert`. Probar que el envío funcione. ~2 h
- [ ] ⬜ **`apps`** (Apps (bloques de aplicaciones), 5 usos). Contenedor de Shopify, sin estilos propios. Nada que migrar. ~0 h

### 5. Blog, colecciones de plagas/enfermedades, búsqueda, 404, contraseña, cuenta

- [ ] ⬜ **`blog-nav`** (Navegación del blog, 3 usos). 4 declaraciones de texto → `chip` o `link`. ~1 h
- [ ] ⬜ **`main-blog`** (Listado del blog, 2 usos). Tarjetas con `card` (artículo); quitar 40 `!important` de `component-article-card.css`. ~3 h
- [ ] ⬜ **`main-article`** (Artículo, 1 usos). Cuerpo y títulos con `typography` / `.rte`; compartir con `icon-button`. ~2 h
- [ ] ⬜ **`custom-breadcrumb-blog`** (Breadcrumb del blog, 1 usos). Usar el átomo `breadcrumb`; borrar `section-tdm-breadcrumb.css`. ~1 h
- [ ] ⬜ **`featured-blog`** (Blog destacado, 5 usos). Tarjetas con `card`; quitar 40 `!important`. ~2.5 h
- [ ] ⬜ **`grid-gallery`** (Galería de plagas/enfermedades, 2 usos). 12 declaraciones de texto y 7 `<h*>/<p>`; usar `card`/`image`. ~2.5 h
- [ ] ⬜ **`main-collection-banner`** (Banner de colección, 3 usos). Título/descripción con `typography`. ~1 h
- [ ] ⬜ **`main-list-collections`** (Lista de colecciones, 1 usos). Tarjetas con `card`. ~1.5 h
- [ ] ⬜ **`main-search`** (Búsqueda, 1 usos). Campo con `input`, resultados con `card`. Es página comercial: solo tokens si hay riesgo. ~2 h
- [ ] ⬜ **`main-404`** (Página 404, 1 usos). Texto con `typography`, botón con `button`, quitar `<style>` inline. ~0.5 h
- [ ] ⬜ **`main-password-header`** (Contraseña (cabecera), 0 usos). Quitar `<style>` inline; campo con `input`. ~1 h
- [ ] ⬜ **`main-password-footer`** (Contraseña (pie), 0 usos). Sin estilos propios. ~0.5 h
- [ ] ⬜ **`email-signup-banner`** (Banner de suscripción (contraseña), 1 usos). Campo con `input`, botón con `button`. ~1 h
- [ ] ⬜ **`main-account`** (Cuenta, 1 usos). Todo `customer.css`: 34 declaraciones de texto; títulos con `typography`, campos con `input`. ~3 h para las 7 plantillas de cliente

### 6. Producto, colección, carrito (solo tokens, sin reescribir la estructura)

- [x] ✅ **`main-product`** (Producto, 2 usos). Solo apuntar CSS a tokens (`--pr-*`); 12 `!important`. NO tocar precio/variantes/botón de compra: se reemplaza por los componentes comerciales. ~2 h CSS en tokens, 0 !important. Pendiente (comercio): texto en markup sigue con clases Dawn; se reemplaza por componentes comerciales.
- [x] ✅ **`featured-collection`** (Colección destacada, 5 usos). Solo tokens. ~1 h CSS en tokens. Markup comercial sin tocar.
- [x] ✅ **`main-collection-product-grid`** (Grilla de colección, 3 usos). Solo tokens. ~1 h CSS en tokens (facets, card). Markup sin tocar.
- [x] ✅ **`main-cart-items`** (Carrito (productos), 1 usos). Solo tokens. ~1 h CSS en tokens.
- [x] ✅ **`main-cart-footer`** (Carrito (totales), 1 usos). Solo tokens. ~0.5 h CSS en tokens.
- [x] ✅ **`related-products`** (Productos relacionados, 2 usos). Solo tokens. ~0.5 h CSS en tokens.
- [ ] 🟡 **`image-banner`** (Image banner, 2 usos). Texto con `typography`, botón con `button`. ~1 h CSS en tokens, 0 hex/!important. Pendiente junior: texto con `typography`, botón con `button`.
- [ ] 🟡 **`slideshow`** (Slideshow, 2 usos). Quitar `<style>` inline; texto con `typography`. ~1.5 h `<style>` inline movido a custom property + CSS. Pendiente junior: texto con `typography`.
- [ ] ⬜ **`video`** (Video, 2 usos). Quitar hex. ~0.5 h

### Shared (se hacen con el grupo 1)

- [ ] ⬜ **`snippets/section-padding`**. Ya es el único `<style>` permitido; revisar que use `--pr-section-y`. ~0.5 h
- [ ] ⬜ **`snippets/tdm-section-eyebrow`**. Eyebrow con `typography` variant `eyebrow`. ~0.5 h
- [ ] ⬜ **`snippets/tdm-section-background`**. Colores por roles. ~0.5 h
- [ ] ⬜ **`snippets/social-icons`**. Iconos con `icon-button`. ~1 h
- [ ] ⬜ **`snippets/pagination`**. Botones con `button`/`icon-button`. ~1 h
- [ ] ⬜ **`snippets/article-card`**. Reemplazar por el átomo `card`. ~1 h
- [ ] ⬜ **`snippets/header-drawer, header-search, header-dropdown-menu, header-mega-menu`**. Con el grupo del header. ~2 h

## 6. Bugs de contenido conocidos (NO se arreglan en esta migración)

Contenido del editor (JSON), de Karla/Dan; se listan para que alguien con permiso de contenido los corrija:

- Aliados: falta el título de la tarjeta/nivel **ORO** en la grilla de niveles.
- Aliados: **T2** muestra precios duplicados.
- (Se agregan aquí los que aparezcan durante la migración.)

## 7. Bitácora

- 2026-10-11 grupo 6 (producto/colección/carrito, solo tokens): todo rgb/rgba -> roles `--pr-*` con color-mix, hex 2->0, `!important` 12+ -> 0 (especificidad), font-size/weight/line-height -> `--pr-text-*`/`--pr-weight-*`/`--pr-leading-*`, letter-spacing y mayúsculas por defecto (cabecera carrito, caption de producto) eliminados, `<style>` de slideshow -> custom property.
Una línea por cambio: `fecha · rama · qué se migró · números antes → después`. Lo más nuevo arriba.

```
2026-10-11 · perfectlyrad/site · Inventario inicial (este documento). Ninguna sección migrada todavía.
```
