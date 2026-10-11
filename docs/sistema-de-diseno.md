# Sistema de diseño de Tierra de Monte

Este tema usa el sistema **PerfectlyRad** de Casa Soda: los mismos valores, los mismos nombres y los mismos componentes que usamos en otros proyectos. Así cualquier persona que conozca el sistema entiende este tema, y un cambio de marca se hace en un solo lugar.

**Catálogo en vivo:** `/pages/distribuidores?view=foundations` (en la tienda y en el servidor de desarrollo). Ahí está cada color, cada tamaño de texto y cada componente con su código para copiar.

## 1. Cómo está armado: tres capas

| Capa | Qué es | Quién la usa |
|---|---|---|
| **Primitivos** | Valores crudos: grises, transparencias, colores de marca, colores de estado (`--pr-gray-dark`, `--pr-brand-primary`). | Nadie directamente. Solo alimentan a los roles. |
| **Roles** | Lo que significa cada color: `--pr-surface` (fondo), `--pr-text-primary`, `--pr-action` (botones), `--pr-border`, `--pr-input-bg`, `--pr-feedback-*`. | Todos los componentes. Nunca leen un primitivo ni un hex. |
| **Escalas** | Tamaños de texto, 8 espacios, 5 radios, 5 sombras, movimiento (`--pr-text-h2`, `--pr-space-4`, `--pr-elevation-lg`). | Todos los componentes. |

Archivo: `assets/tdm-foundations.css`. Todo lleva prefijo `--pr-`. Los nombres antiguos `--tdm-*` siguen existiendo como alias temporales y se irán borrando al rehacer cada sección.

## 2. Los 9 colores de marca y dónde se cambian

Son lo único del sistema que es propio de Tierra de Monte (más 3 fuentes):

| Primitivo | Valor | Uso |
|---|---|---|
| `--pr-brand-primary` / `-hover` / `-on-primary` | `#294E3F` / `#1F4D37` / `#F3EFCF` | Verde de marca, su hover y el texto sobre él (crema). |
| `--pr-brand-secondary` / `-hover` / `-on-secondary` | `#D8E35B` / `#C9D54A` / `#1A4330` | Lima y su texto verde oscuro. |
| `--pr-brand-tertiary` / `-hover` / `-on-tertiary` | `#F3EFCF` / `#E8E2BC` / `#1A4330` | Crema y su texto. |

Fuentes: `--pr-font-display` = Barlow Condensed (títulos), `--pr-font-body` = la fuente de cuerpo del tema (Inter), `--pr-font-mono` = IBM Plex Mono.

**Dónde cambiarlos**
- Los 9 primitivos y las fuentes: bloque `:root` de `assets/tdm-foundations.css`.
- Los colores de cada sección (fondo, texto, botón): **editor de temas → Configuración del tema → Colores** (se guardan en `config/settings_data.json`). Son los esquemas `scheme-*`.
- La fuente de cuerpo y la de títulos Aliados: editor de temas → Tipografía.
- Esquinas redondeadas: `--pr-radius-control` (botones, campos, chips) y `--pr-radius-surface` (tarjetas, fotos). Hoy son cuadradas (0). Para botones tipo píldora: `:root { --pr-radius-control: var(--pr-radius-full); }`.

## 3. Esquemas de color: cada sección cambia los roles, no los componentes

Cada sección elige un esquema (`color_scheme`). Shopify aplica la clase `.color-scheme-*` y el sistema re-apunta los roles desde los valores de ese esquema:

| Rol | Sale de |
|---|---|
| `--pr-surface` | fondo del esquema |
| `--pr-text-primary` / `--pr-surface-inverse` | texto del esquema |
| `--pr-action` / `--pr-text-on-action` | botón y etiqueta de botón del esquema |
| `--pr-text-secondary`, `--pr-border`, `--pr-input-*` | mezclas del texto del esquema con transparencia |
| `--pr-text-brand` y colores de estado | tono automático: versión clara sobre fondos oscuros, oscura sobre claros |

Un botón dentro de una sección oscura se ve bien sin tocar el botón. Para nuevos componentes también existen `data-scheme="light | dark | primary | secondary | tertiary | image"`.

## 4. Typography: todo texto pasa por aquí

```liquid
{% render 'typography', text: 'Título', variant: 'h2', as: 'h2', font: 'display', weight: 'bold', color: 'brand', align: 'balance' %}
```

Nunca se escribe a mano un tamaño, peso, familia ni color. Si el tamaño que necesitas no existe, se avisa; no se hardcodea.

| Prop | Valores | Por defecto |
|---|---|---|
| `variant` | display, h1, h2, h3, h4, h5, h6, body-lg, body, body-sm, label, eyebrow, xs, 2xs, 3xs | body |
| `font` | display, body, mono | body (eyebrow: mono) |
| `weight` | regular, medium, semibold, bold | regular |
| `color` | primary, secondary, disabled, brand, inverse, on-action, success, warning, danger, info, inherit | primary |
| `align` | left, center, right, balance | ninguno |
| `as` | cualquier etiqueta | según la variante |

| Variante | Cuándo usarla | Etiqueta |
|---|---|---|
| display | Titular de portada, una vez por página | h1 |
| h1 – h6 | Jerarquía de títulos de sección y tarjetas | h1 – h6 |
| body-lg | Introducciones y citas | p |
| body | Texto corrido | p |
| body-sm | Texto de apoyo, botones, tarjetas densas | p |
| label | Etiquetas de campos, ayudas | span |
| eyebrow | Línea pequeña sobre un título (única en mayúsculas y mono) | span |
| xs, 2xs, 3xs | Notas, créditos, conteos | span |

El marcado antiguo de Dawn (`h1`–`h6`, `.h0`–`.h5`, `.caption`, `.subtitle`, `body`) ya hereda esta escala.

## 5. Átomos (snippets)

Cada snippet documenta sus parámetros en el comentario de su encabezado. CSS en `assets/pr-atoms.css`.

| Átomo | Render call mínimo |
|---|---|
| Button | `{% render 'button', label: 'Comprar', variant: 'primary', size: 'md', href: '' %}` |
| IconButton | `{% render 'icon-button', icon: 'close', label: 'Cerrar', variant: 'ghost' %}` |
| Link | `{% render 'link', text: 'Ver más', href: '/pages/nosotros' %}` |
| Heading | `{% render 'heading', eyebrow: 'Aliados', title: 'Título', size: 'h2', subtitle: '…' %}` |
| Chip | `{% render 'chip', label: 'Orgánico', selected: true, attrs: 'data-x' %}` |
| Alert | `{% render 'alert', tone: 'info', title: 'Aviso', text: 'Mensaje' %}` |
| Card | `{% render 'card', title: 'Título', description: '…', image: img, href: '/x' %}` |
| Image | `{% render 'image', image: img, alt: '', ratio: '4/3', sizes: '50vw' %}` |
| Input | `{% render 'input', label: 'Correo', name: 'email', type: 'email', error: '' %}` |
| Textarea | `{% render 'textarea', label: 'Mensaje', name: 'message' %}` |
| Select | `{% render 'select', label: 'País', name: 'c', options: 'mx\|México;gt\|Guatemala' %}` |
| Checkbox | `{% render 'checkbox', label: 'Acepto', name: 'terms' %}` |
| Radio | `{% render 'radio', label: 'Entrega', name: 'd', options: 'a\|Casa;b\|Tienda' %}` |
| Switch | `{% render 'switch', label: 'Avisos', name: 'n' %}` |
| Field | `{% render 'field', for_id: 'x', label: 'Campo', content: control %}` |
| Accordion | `{% render 'accordion', titles: 'A\|B', panels: panels %}` (paneles separados por `<!--pr-->`) |
| Tabs | `{% render 'tabs', id: 't', label: 'Secciones', tabs: 'A\|B', panels: panels %}` |
| Breadcrumb | `{% render 'breadcrumb', items: 'Inicio\|/;Blog\|/blogs/news;Artículo' %}` |
| Rating | `{% render 'rating', value: 4.8, show_value: true %}` |
| Avatar | `{% render 'avatar', name: 'Ana Ruiz' %}` |
| Spinner | `{% render 'spinner', size: 'md' %}` |
| SegmentedControl | `{% render 'segmented-control', label: 'Vista', name: 'v', options: 'l\|Lista;m\|Mapa' %}` |
| Icon | `{% render 'icon', name: 'check', size: 'md' %}` |

Todos traen sus estados: hover, foco con teclado, deshabilitado, error y cargando donde aplica.

## 6. Cómo agregar una sección nueva

1. Revisa el catálogo (`?view=foundations`). Si un átomo lo resuelve, úsalo; no copies una sección para cambiarle algo.
2. `sections/<nombre>.liquid` + `assets/section-tdm-<nombre>.css`, cargado con `stylesheet_tag`. Sin `<style>` en la sección (salvo el padding).
3. Todo texto con `{% render 'typography' %}`. Colores solo por roles (`var(--pr-surface)`, `var(--pr-text-primary)`, `var(--pr-action)`), espacios por `--pr-space-*`, radios por `--pr-radius-*`. Sin hex.
4. Valores del editor de temas → propiedades CSS (`style="--cosa: {{ section.settings.cosa }}px"`) y el CSS lee `var(--cosa)`. Nada más va en `style=""`.
5. Sin `!important`, bordes de 1px, mayúsculas y mono solo cuando se piden, padding con el snippet `section-padding`, JavaScript en `assets/` como custom element.
6. Revisa a 390, 768 y 1280 px y corre `shopify theme check`.

Las mismas reglas están en el skill `/soda-tdm`.
