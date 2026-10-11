# Refactor de octubre 2026: base de diseño

## Qué se cambió y por qué

El tema había crecido rápido (secciones de Aliados, nosotros, impacto) y acumuló deuda: secciones duplicadas, CSS y JS dentro de las secciones, colores escritos a mano y `!important` para ganarle a Dawn. El refactor lo ordena en dos pasos:

1. **Limpieza** (rama `refactor/foundations`, ya incluida en `main`): secciones duplicadas fusionadas (p. ej. `multicolumn-sept2026` pasó a ser una opción de `tdm-feature`), CSS inline movido a `assets/section-tdm-*.css`, JS inline movido a custom elements, hex reemplazados por tokens, `!important` eliminados, mono y padding unificados en una clase y un snippet.
2. **Base PerfectlyRad** (rama `perfectlyrad/foundations`): tokens (primitivos, roles, escalas), esquemas de Dawn conectados a los roles, componente `typography`, 22 átomos como snippets, catálogo en `?view=foundations`, y los átomos de Dawn (botón, campo, badge, acordeón, tarjeta, header, footer) apuntando a los mismos tokens. Documentación en `docs/sistema-de-diseno.md`.

Por qué: un solo sistema que se cambia en un lugar, texto con tamaños con nombre (sin números sueltos), y una base común con otros proyectos de Casa Soda.

## Antes / después

Medido con `grep` sobre `assets/*.css`, `sections`, `snippets`, `blocks`, `layout`. "Antes" = commit `93c53d4` (antes de la limpieza); "después" = esta rama.

| Métrica | Antes | Después |
|---|---|---|
| `!important` | 403 | 235 |
| Bloques `<style>` dentro de secciones/snippets/bloques | 14 | 8 |
| Bloques `<script>` inline | 15 | 10 |
| Secciones duplicadas (`multicolumn-sept2026`) | 1 | 0 |
| `font-size` en px en CSS | 17 | 4 |
| Hex fuera de `tdm-foundations.css` y del catálogo | 49 | 47 |
| Textos que pasan por el componente `typography` | 0 | 287 (catálogo y átomos) |
| Archivos CSS por sección (`section-/block-/component-tdm-*`) | 0 | 25 |

Qué queda: los 235 `!important` y los 47 hex están sobre todo en CSS de Dawn (`base.css`, `component-article-card.css`, `footer-custom.css`) y en `section-tdm-card-grid.css`. Se eliminan al rehacer cada sección sobre los átomos, no antes. El tema aún tiene pocos usos reales de `typography` fuera del catálogo porque las secciones existentes no se han reconstruido.

## Riesgos y qué revisar

- **Tipografía global**: `body` y los `h1`–`h6`, `.caption`, `.subtitle` ahora siguen la escala (16 px de cuerpo, interlineado 1.4). Revisar páginas con mucho texto (blog, impacto, nosotros) y el interlineado.
- **Esquinas**: botones, campos y tarjetas de Dawn siguen `--pr-radius-control` y `--pr-radius-surface` (hoy 0). Antes los botones eran píldora (40 px). Si se prefiere, una línea lo devuelve (ver `docs/sistema-de-diseno.md`).
- **Botones y campos de Dawn**: altura 44 px, texto 14 px medium; campos a 16 px.
- **Peso de títulos**: se quitó un `!important` que forzaba `lighter` en h1–h3; ahora usan el peso del tema (300).
- **Esquemas**: los colores de estado y `text-brand` se calculan por esquema; revisar secciones sobre fondos medios.
- Desbordamiento horizontal de 58 px a 768 px: viene del cajón del menú de Dawn (fuera de pantalla), ya existía.
- Verificado: `shopify theme check` sin ofensas nuevas (26 antes, 26 después), plantillas JSON válidas, estados HTTP 200 en inicio, Aliados (y propuesta), nosotros, impacto, producto, colección, carrito y catálogo.

## Cómo se publica

1. Rama `perfectlyrad/foundations` → revisión de Dan en el servidor de desarrollo o en un tema sin publicar (`shopify theme push --unpublished --theme "preview-perfectlyrad-foundations"`).
2. Aprobada, se hace merge a `main` (`git merge --no-ff`). `main` es el sitio vivo: lo que entra sale en un minuto.
3. Antes de empezar cualquier trabajo nuevo, `git pull` en `main` (el editor de Shopify también escribe ahí) y ramas nuevas desde `main`.
