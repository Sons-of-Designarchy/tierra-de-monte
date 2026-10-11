# Estructura propuesta del archivo Figma "Aliados — Master"

Para que el jueves 15 oct se empiece con cero decisiones. Es una propuesta de estructura: no se crea nada en Figma hasta que la landing esté aprobada (mié 14).
Punto de partida: el kit existente `Aliados` (https://www.figma.com/design/2Rq4y9Tz1u6gITrj30ynyg/Aliados?node-id=556-112). Se leyó solo con herramientas de lectura. Ya trae: portada, marca (logo, paleta, tipografía), mensajes, niveles, KPIs y plantillas 1:1, 9:16 y 4:5, con la colección de variables "Aliados".
Recomendación: **duplicar el archivo** como "Aliados — Master" y reorganizar, no empezar de cero. Así los estilos y variables ya existen.

## 1. Páginas

| # | Página | Contenido | Estado |
|---|---|---|---|
| 0 | `00 · Portada` | Nombre, versión, fecha, estado (borrador / en revisión), enlace a la landing, leyenda de colores de sticker | Nueva |
| 1 | `01 · Fundamentos` | Paleta, tipografía, espaciado, reglas (del kit actual, páginas "2 · Marca") | Del kit |
| 2 | `02 · Componentes` | Todos los componentes con variantes (sección 4) | Nueva |
| 3 | `03 · Master` | Lienzo maestro 1440: piezas M1-M8 en orden de la landing | Nueva |
| 4 | `04 · Social` | Posts 4:5 y stories 9:16 | Del kit (plantillas) |
| 5 | `05 · PDF A4` | Portada e interiores | Nueva |
| 6 | `06 · Assets` | Fotos, íconos, esporas, texturas, monedas, logos, con estado (listo / PLACEHOLDER) | Nueva |
| 7 | `07 · Para TDEM` | Cómo adaptar a redes: qué se puede cambiar (texto, foto) y qué no (logo, colores, tamaños) | Nueva |
| 8 | `99 · Archivo` | Versiones anteriores y pruebas. No se entrega | Nueva |

Los bloques "Mensajes", "Niveles" y "KPIs" del kit actual se mueven a `99 · Archivo` (viven en `guia-de-mensajes-v1.md` y `kpis.md`).

## 2. Frames por página

Convención: `Pieza / Formato / Versión`, sin espacios dobles, sin "Frame 123". Mayúscula inicial; separador `/`.

**03 · Master** (todos 1440 de ancho, altura según contenido, auto-layout vertical, gap 0)
- `M1 / Hero / 1440`
- `M2 / Niveles / 1440`
- `M3 / Beneficios / 1440`
- `M4 / Para quién / 1440`
- `M5 / Resultados / 1440`
- `M6 / Proceso / 1440`
- `M7 / Ticker / 1440` (4 variantes de frase dentro)
- `M8 / CTA registro / 1440`
- `M9 / Productos / 1440` (opcional)

**04 · Social**
- `Post / M1 Idea / 1080x1350`
- `Post / M2 Niveles / 1080x1350`
- `Post / M5 Prueba / 1080x1350`
- `Story / M1 Idea / 1080x1920`
- `Story / M8 CTA / 1080x1920`
- (extra, si hay tiempo) `Post / M3 Beneficios / 1080x1350`, `Post / M2 Niveles / 1080x1080`

**05 · PDF A4** (595×842, margen 40, retícula 12 columnas; exportar a 300 dpi)
- `PDF / Portada / A4`
- `PDF / Interior 1 Beneficios y niveles / A4`
- `PDF / Interior 2 Proceso y CTA / A4`

**06 · Assets**: una fila por tipo, nombre de capa = nombre de archivo de Shopify.
- `Assets / Fotos`, `Assets / Íconos`, `Assets / Niveles (monedas)`, `Assets / Esporas`, `Assets / Texturas`, `Assets / Logos`

**07 · Para TDEM**
- `Guía / Adaptar a redes` (qué cambiar, qué no)
- `Guía / Zonas seguras` (story: 250 arriba / 340 abajo; post: margen 72)

## 3. Variables (colección "Aliados", espejo de `--pr-*`)

Modos: `Claro` (por defecto) y `Oscuro`. Nombres con `/` en Figma; la columna de la derecha es el token del tema.

### 3.1 Primitivos (no se usan directo en componentes)

| Variable Figma | Valor | Token del tema |
|---|---|---|
| color/white | #FFFFFF | `--pr-white` |
| color/gray-lightest | #F8F8F7 | `--pr-gray-lightest` |
| color/gray-lighter | #F2F2F0 | `--pr-gray-lighter` |
| color/gray-light | #E6E6E2 | `--pr-gray-light` |
| color/gray-dark | #5A5A54 | `--pr-gray-dark` |
| color/gray-darker | #2A2A27 | `--pr-gray-darker` |
| color/ink | #161614 | `--pr-ink` |
| color/ink-70 (scrim) | #161614 al 70% | `--pr-scrim-strong` |
| color/ink-10, ink-5 | #161614 al 10% y 5% | `--pr-ink-10`, `--pr-ink-5` |
| color/white-50, white-25 | #FFFFFF al 50% y 25% | `--pr-white-50`, `--pr-white-25` |
| brand/green | #294E3F | `--pr-brand-primary` |
| brand/green-deep | #1F4D37 | `--pr-brand-primary-hover` |
| brand/cream | #F3EFCF | `--pr-brand-tertiary` / `-on-primary` |
| brand/cream-hover | #E8E2BC | `--pr-brand-tertiary-hover` |
| brand/lime | #D8E35B | `--pr-brand-secondary` |
| brand/lime-hover | #C9D54A | `--pr-brand-secondary-hover` |
| brand/on-lime | #1A4330 | `--pr-brand-on-secondary` / `-on-tertiary` |
| aliados/forest | #164120 | esquema `scheme-tdm-aliados-oscuro` (fondo) |
| aliados/leaf | #3E8335 | esquemas `aliados-medio`, `-claro`, `-base` (botón) |
| aliados/sage | #C3D890 | esquema `aliados-verde` (fondo) |
| aliados/mist | #E7EACE | esquema `aliados-claro` (fondo) |
| aliados/paper | #FCF9F9 | esquema `aliados-base` (fondo) |
| aliados/cream-page | #F7F3EE | esquema `scheme-tdm-crema` (fondo) |
| feedback/success-500, warning-500, error-500, info-500 | #4F7A45, #B58A2A, #A84A4A, #3D6E9E | `--pr-success-500`… (solo si se usan) |

### 3.2 Roles (los que usan los componentes)

| Variable Figma | Claro | Oscuro | Token |
|---|---|---|---|
| role/surface | color/white | aliados/forest | `--pr-surface` |
| role/surface-subtle | color/gray-lightest | aliados/forest | `--pr-surface-subtle` |
| role/surface-cream | aliados/cream-page | aliados/forest | (esquema crema) |
| role/surface-brand | aliados/forest | aliados/forest | (esquema oscuro) |
| role/surface-card | color/white | color/white | tarjeta SIEMPRE blanca |
| role/text-primary | aliados/forest | color/white | `--pr-text-primary` |
| role/text-secondary | color/gray-dark | color/gray-light | `--pr-text-secondary` |
| role/text-on-card | aliados/forest | aliados/forest | texto en tarjeta blanca |
| role/text-brand | aliados/leaf | aliados/sage | `--pr-text-brand` |
| role/action | aliados/leaf | aliados/sage | `--pr-action` |
| role/text-on-action | color/white | aliados/forest | `--pr-text-on-action` |
| role/border | color/gray-lighter | color/white-25 | `--pr-border` |
| role/border-strong | color/gray-light | color/white-50 | `--pr-border-strong` |
| role/scrim | color/ink-70 | color/ink-70 | `--pr-scrim-strong` |

Nota: el kit actual define `role/text-primary → color/ink` y `role/surface-brand → brand/green`. Cambiarlos a aliados/ **solo si Dan confirma** la decisión de paleta (brief, sección 3.1, pregunta abierta). `[DEPENDE DE APROBACIÓN]`

### 3.3 Escalas

| Grupo | Variables |
|---|---|
| space (número) | space/1 = 4, 2 = 8, 3 = 12, 4 = 16, 6 = 24, 8 = 32, 12 = 48, 16 = 64, 24 = 96 |
| radius | radius/none = 0, sm = 4, md = 8, lg = 12, full = 9999; `radius/control` = 0, `radius/surface` = 0 |
| control (alto) | control/xs = 28, sm = 36, md = 44, lg = 52, xl = 60 |
| icon | icon/xs 12, sm 16, md 20, lg 24, xl 32 |
| width | width/measure = 60 caracteres (~560), width/page = 1312 |
| social | social/margin = 72, social/story-safe-top = 250, social/story-safe-bottom = 340 |
| family (texto) | font/display = Barlow Condensed, font/body = Inter, font/mono = IBM Plex Mono |

### 3.4 Estilos de texto (ya existen en el kit; no crear otros)

`Display` (Barlow Condensed regular 65/110%), `H1` (54), `H2` (43), `H3` (36), `H4` (Inter 32), `Body L` (18), `Body M` (16), `Body S` (14), `Label` (13), `Eyebrow` (IBM Plex Mono 12, mayúsculas, +0.04em), `Mono`.
Para 1080 px: **no** hay estilos nuevos; se usan los mismos con el multiplicador x1.6 (propuesta de Dan pendiente). Opción limpia: crear una segunda familia de estilos `Social/Display`, `Social/H2`, `Social/Body L`, `Social/Eyebrow` con valores 104, 69, 29, 19. `[DEPENDE DE APROBACIÓN]`

### 3.5 Efectos
- `elevation/card` = 0 4 20 rgba(0,0,0,.07)
- `elevation/lg` = 0 8 32 rgba(0,0,0,.10)
- `blur/md` = 16 (panel de vidrio sobre foto)

## 4. Componentes

Nombre `Componente / Variante`. Todos con auto-layout, variables en lugar de valores, propiedades de componente para el texto.

| Componente | Variantes / propiedades | Se usa en |
|---|---|---|
| `Botón` | tamaño md, lg · estilo primario, secundario, sobre oscuro · estado normal, hover | M1, M3, M8, PDF |
| `Chip` | normal, activo · con/sin texto grande | Eyebrow M1, M4 |
| `Eyebrow` | texto mono mayúsculas · con/sin chip | todas |
| `Encabezado de sección` | eyebrow + título + intro · alineación izquierda/centro · esquema claro/oscuro | M2-M6 |
| `Tarjeta / Ícono` | ícono 64 + título + texto, siempre blanca | M3 |
| `Tarjeta / Foto` | foto de fondo + panel de vidrio blanco con lista de checks | M4 |
| `Tarjeta / Nivel` | moneda + nombre + "Desde $X" + lista de beneficios · nivel Bronce/Plata/Oro/Platino | M2, post de niveles |
| `Tarjeta / Cita` | foto con scrim + cita + autor + rol + cifras (1-5) | M5 |
| `Cifra` | número grande + etiqueta | M5, social |
| `Paso` | número + título + texto + foto | M6 |
| `Ticker` | frase mono mayúsculas sobre textura | M7 |
| `Banda CTA` | título + botón + QR/URL | M8 |
| `Crédito de foto` | nombre + detalle | M1 |
| `Logo / Aliados` | blanco, verde · horizontal, vertical | todas |
| `Logo / Tierra de Monte` | idem | pie |
| `Pie de pieza` | logo + URL + WhatsApp | social, PDF |
| `Marco de formato` | 1080x1350, 1080x1920, A4 con guías de margen y zona segura | 04, 05 |
| `Etiqueta PLACEHOLDER` | sticker rojo para assets que faltan | 06 |

## 5. Reglas de armado (para no decidir en caliente)

1. Tarjetas siempre blancas con texto oscuro; nunca verde sobre verde; máximo un verde de fondo por pieza.
2. Alternar fondos blanco y crema en el lienzo master.
3. Bordes de 1 px; sin negros.
4. Texto solo con estilos; colores solo con variables.
5. Las fotos con texto encima llevan scrim ink 70% desde la esquina del texto.
6. Botón: texto del tamaño del párrafo contiguo (Body S con Body M/S; Body L con Body L).
7. Capas con nombre; auto-layout en todo contenedor; sin capas ocultas.
8. Placeholders con la etiqueta `PLACEHOLDER` visible.
9. Nunca "TDM" en texto visible ni en nombres de capa que el cliente verá.
10. Cada pieza social deriva del master con el componente, no se redibuja.

## 6. Publicación de librería

Al terminar, publicar variables y estilos como librería interna "Aliados · Fundamentos" para que TDEM o su agencia adapten a redes con componentes y no con copias. `[DEPENDE DE APROBACIÓN]` de Dan si se publica o se comparte solo el archivo.

## 7. Pendiente antes de abrir Figma

- Decisión de paleta aliados vs. brand (brief, 3.1).
- Escala para 1080 (3.4).
- Confirmar 4:5 como post base.
- Landing aprobada (mié 14).
