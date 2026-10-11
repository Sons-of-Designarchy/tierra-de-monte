# Master graphic Aliados — hoja de armado (jueves 15 oct 2026)

Objetivo: en un solo día (jue 15) construir el archivo maestro de Figma del Programa de Aliados de Tierra de Monte y mandarlo a revisión el viernes 16.
Alcance acordado: Casa Soda diseña UN master graphic con el copy de TDEM. TDEM (o su agencia) lo adapta a redes. Brochure, fichas, kits y PDFs por pieza son fase 2.

> **Regla de bloqueo.** Nada se construye antes de que Dan/TDEM aprueben la landing el **miércoles 14 oct**. Todo lo marcado con `[DEPENDE DE APROBACIÓN]` se confirma contra la landing aprobada antes de abrir Figma. Este documento no diseña nada en Figma ni toca el tema.
> **Copy:** siempre "Tierra de Monte", nunca "TDM" (ojo: la landing trae "Aliado TDEM" en el crédito del hero; en el master se escribe "Aliado Tierra de Monte").

## 0. Checklist de arranque (miércoles noche, 15 min)

1. La landing quedó aprobada. Anotar cambios de copy vs. este documento (sección 4) y corregir aquí primero.
2. Respuestas de TDEM sobre los assets que debe (sección 6) o decisión de usar placeholders marcados.
3. Abrir el kit de Figma (`Aliados`, nodo 556:112, ya tiene variables, tipografía, 3 plantillas) y duplicarlo como archivo nuevo "Aliados — Master" (ver `figma-estructura.md`).

## 1. Qué de la landing se vuelve master graphic

El master no es la landing en imagen. Es un sistema de piezas derivadas de ella: una pieza hero, una pieza por idea y una pieza de niveles. Origen en `templates/page.aliados.json`.

| # | Pieza maestra | Sección de la landing (id) | Elementos visuales a conservar | Prioridad |
|---|---|---|---|---|
| M1 | **Hero / idea central** | `hero_slider` slide 1 | Foto de aliado con scrim ink 70% desde la esquina del texto, display "Un negocio que crece necesita un buen Aliado.", eyebrow chip, crédito de foto, logo Aliados | Alta |
| M2 | **Niveles** | `hero_slider` slide 3 + `comparison_table_CjRhQt` | Titular "Entre más creces, más ganas.", 4 monedas/joyas (Bronce, Plata, Oro, Platino), "Desde $X" | Alta |
| M3 | **Beneficios** | `multicolumn_sept2026_cQktdB` | 4 tarjetas blancas con ícono (precio, acompañamiento, capacitación, crecimiento) sobre fondo verde claro | Alta |
| M4 | **Para quién** | `multicolumn_sept2026_AwmWPk` | 3 tarjetas de foto con panel blanco (profesionales de campo, asesores, puntos de venta) | Media |
| M5 | **Resultados / prueba** | `slide_gallery_aK44mg` | Cita + 3-5 cifras sobre foto de caso | Alta |
| M6 | **Proceso (4 pasos)** | `tdm_scroll_steps_aliados` | Pasos numerados, un icono por paso | Media |
| M7 | **Ticker / sello de frase** | `ticker_*` (4 frases) | Frase en mono mayúsculas sobre textura `ticker-1.jpg` | Media |
| M8 | **CTA de cierre** | `rich_text` "Registro" + botón | "Quiero ser Aliado" + QR/URL de registro | Alta |
| M9 | Productos | `tdm_detail_spotlight_aliados` | Solo si sobra tiempo: 4 puntos con ícono (↑ + ↻ ✦) | Baja |

Ritmo de color del master (misma regla de la landing): alternar blanco y crema, máximo UN verde a la vez, tarjetas SIEMPRE blancas con texto oscuro, nunca verde sobre verde.

## 2. Formatos a producir

| Formato | Tamaño | Cuántos | Plantilla de partida en el kit |
|---|---|---|---|
| Master (lienzo de sistema, todas las piezas M1-M8 en una vista) | 1440 de ancho, altura libre | 1 página | Nueva |
| Post base | 1080×1350 (4:5) | 3 (M1 idea, M2 niveles, M5 prueba) | `Pieza de nivel 4:5` |
| Story | 1080×1920 (9:16) | 2 (M1 idea, M8 CTA) | `Story 9:16` |
| PDF A4 portada | 210×297 mm = 2480×3508 px @300dpi (en Figma 595×842 pt) | 1 | Nueva |
| PDF A4 interior | igual | 2 (beneficios+niveles, proceso+CTA) | Nueva |

Nota: el kit ya trae un post 1:1 1080×1080. El acuerdo pide 1080×1350; el 1:1 queda como extra, no se hace salvo que sobre tiempo. `[DEPENDE DE APROBACIÓN]` Confirmar que el 4:5 es el post base.
Zona segura story: 250 px arriba y 340 px abajo sin texto crítico. Margen post: 72 px.

## 3. Tokens a usar (de `assets/tdm-foundations.css`)

### 3.1 Color
Marca (primitivos `--pr-brand-*`):

| Token | Valor | Uso en el master |
|---|---|---|
| brand/green `--pr-brand-primary` | `#294E3F` | Botones, texto de marca, único verde de fondo |
| brand/green-deep `-hover` | `#1F4D37` | Hover / sombras de verde |
| brand/cream `--pr-brand-tertiary` | `#F3EFCF` | Texto sobre verde, fondos crema de marca |
| brand/cream-hover | `#E8E2BC` | Estados |
| brand/lime `--pr-brand-secondary` | `#D8E35B` | Acento, chips, resaltes |
| brand/lime-hover | `#C9D54A` | Estados |
| brand/on-lime y on-cream | `#1A4330` | Texto sobre lima y crema |

Aliados (esquemas de la landing, `config/settings_data.json`), son los que realmente pinta la landing:

| Token Figma | Valor | Esquema | Uso |
|---|---|---|---|
| aliados/forest | `#164120` | oscuro | Fondo hero, texto sobre claro |
| aliados/leaf | `#3E8335` | medio / botón | Botón primario, banda media |
| aliados/sage | `#C3D890` | verde | Fondo sección beneficios, botón sobre oscuro |
| aliados/mist | `#E7EACE` | claro | Fondo claro de CTA |
| aliados/paper | `#FCF9F9` | base | Fondo base |
| crema de página | `#F7F3EE` | crema | Fondo alterno (texto `#003118`) |
| blanco | `#FFFFFF` | blanco | Fondo y tarjetas |

Neutros: white `#FFFFFF`, gray-lightest `#F8F8F7`, gray-lighter `#F2F2F0`, gray-light `#E6E6E2`, gray-dark `#5A5A54`, gray-darker `#2A2A27`, ink `#161614`.
Scrim de foto: ink `#161614` al 70%, degradado a 0 desde la esquina del texto.

> **Discrepancia a resolver el miércoles (pregunta a Dan #1).** Hay dos verdes: los primitivos de marca (`#294E3F`) y los esquemas de la landing de Aliados (`#164120`/`#3E8335`/`#C3D890`). La landing renderiza los segundos. Propuesta: el master usa la paleta **aliados/** como principal (es lo que se aprueba) y `brand/` solo para logo Tierra de Monte y crema/lima de acento. El texto de los esquemas blanco/crema es `#003118`, que no está en ninguna de las dos paletas; en el master usar `#164120` como texto sobre claro.

### 3.2 Tipografía
Familias: `--pr-font-display` Barlow Condensed (títulos), `--pr-font-body` Inter (cuerpo), `--pr-font-mono` IBM Plex Mono (eyebrow y tickers, en mayúsculas). Display escalado 0.9 y con interlineado 1.1 (1.0 en display/h1 de una o dos líneas), peso regular. Sin mayúsculas en titulares.

Valores del sistema (máximo de escritorio, 1 rem = 16 px):

| Estilo | Fuente | Tamaño escritorio | Interlineado |
|---|---|---|---|
| Display | Barlow Condensed | 72 × 0.9 = **65** | 100-110% |
| H1 | Barlow Condensed | 60 × 0.9 = **54** | 100-110% |
| H2 | Barlow Condensed | 48 × 0.9 = **43** | 110% |
| H3 | Barlow Condensed | 40 × 0.9 = **36** | 110% |
| H4 | Inter | 32 | 120% |
| H5 | Inter | 24 | 120% |
| H6 | Inter | 22 | 120% |
| Body L | Inter | 18 | 140% |
| Body | Inter | 16 | 140% |
| Body S (botones, tarjetas) | Inter | 14 | 140% |
| Label | Inter | 13 | 140% |
| Eyebrow | IBM Plex Mono, mayúsculas | 12 | 140%, tracking +0.04em |
| Xs / 2xs | Inter | 12 / 11 | 140% |

Los estilos de texto ya existen en el kit (Estilo Display… Estilo Mono). **No crear tamaños nuevos.**
Tamaños para formatos de 1080 px (no están en los tokens, son propuesta de uso del mismo estilo a mayor escala; `[DEPENDE DE APROBACIÓN]` de Dan, ver pregunta #2): post/story x1.6 sobre el escritorio (Display 104, H2 69, Body L 29, Eyebrow 19); A4 impreso x1.0 en pt (Display 65 pt portada, H2 30 pt interior, cuerpo 10-11 pt).

### 3.3 Espaciado, forma, elevación
- Escala de espacio: 4, 8, 12, 16, 24, 32, 48, 64, 96 (`--pr-space-1…24`). Padding vertical de sección: 64 (escritorio).
- Radios: botones y chips **0** (cuadrados), tarjetas y fotos **0**, `--pr-radius-surface`/`-control` = 0. Las fotos grandes de la landing llevan 8-16 px de radio de sección (hero 8, imagen 16); para el master usar 8 en hero y 16 en fotos de tarjeta de proceso. Píldora solo en chips si Dan lo pide.
- Bordes: 1 px, `#E6E6E2` o ink al 10%. Nunca 2 px ni negros.
- Elevación de tarjeta: `0 4px 20px rgba(0,0,0,.07)`; navbar/elevada `0 8px 32px rgba(0,0,0,.10)`.
- Altura de control: botón md 44, lg 52. Botón: texto Body S (junto a Body L, botón lg con Body L).
- Gutter de página 16 en móvil; en el master 1440 usar margen de 64 (kit usa 1312 de contenido).

## 4. Bloques de copy (verbatim de la landing)

`[DEPENDE DE APROBACIÓN]` Todo este copy se re-verifica contra la landing aprobada. Si cambia, gana la landing.

**M1 Hero**
- Eyebrow: `Programa de Aliados · Tierra de Monte`
- Título: `Un negocio que crece necesita un buen Aliado.`
- Cuerpo: `Forma parte de una red que pone a tu alcance productos, beneficios y herramientas para impulsar tu negocio.`
- CTAs: `¿Cómo funciona?` · `Beneficios del Programa` · `Ver resultados` · `Quiero ser Aliado`
- Crédito de foto: `Francisco González` / `Productor de Berries y Aliado TDEM` (corregir a "Aliado Tierra de Monte" en el master y avisar a Dan)

**M2 Niveles**
- Eyebrow: `Niveles de Aliado`
- Título: `Entre más creces, más ganas.`
- Cuerpo: `Bronce, Plata, Oro y Platino. Tu nivel sube con tu volumen de compra y cada uno desbloquea más beneficios.`
- Sección de tabla: `NIVELES` / `Más beneficios a medida que creces` / `Avanza de nivel conforme aumenta tu volumen de compra y accede a nuevas herramientas, beneficios y oportunidades para hacer crecer tu negocio.`
- Precios: Bronce `Desde $5,000` · Plata `Desde $30,000` · Oro `Desde $60,000` · Platino `Desde $100,000`
- Filas (sí = incluido): Compra mínima bimestral (todos) · Kit de bienvenida (todos) · Tus clientes protegidos (todos) · Incluye todo lo del nivel anterior (Plata+) · Podcast técnicos exclusivos (Plata+) · Cursos de marketing y ventas (Plata+) · Herramientas de diseño (Plata+) · Grupo de WhatsApp con los ingenieros y con otros Aliados (Oro+) · Producto a crédito, según cómo te haya ido (Oro+) · Tu lugar en el **Encuentro Tierra de Monte** (Oro+) · Una videollamada al mes con un ingeniero, para ver tus casos (solo Platino)
- **No usar la tabla T2** (Esmeralda, Rubí, Zafiro, Diamante): son placeholder con precios repetidos. Fuera del master.

**M3 Beneficios**
- Título: `Como Aliado Tierra de Monte obtienes...`
- Intro: `Como Aliado Tierra de Monte, tu negocio crece.` / `Te damos las herramientas, el conocimiento y el acompañamiento para que puedas ofrecer más valor a tus clientes y construir relaciones comerciales de largo plazo.`
- Tarjeta 1: `Nuestros productos ofrecen importantes márgenes de utilidad y retorno de inversión` — `Accede a condiciones comerciales exclusivas que mejoran tu margen y hacen más competitiva tu oferta frente a tus clientes.`
- Tarjeta 2: `Acompañamiento de expertos` — `Cuenta con un equipo científico que te acompaña para resolver dudas, fortalecer tus recomendaciones y dar seguimiento a las necesidades de tus clientes.`
- Tarjeta 3: `Capacitación continua` — `Fortalece tus conocimientos técnicos y comerciales con capacitaciones, contenidos y herramientas que te ayudan a vender con mayor confianza.`
- Tarjeta 4: `Un programa que crece contigo` — `Crece con herramientas pensadas para tu negocio: materiales comerciales, recursos de publicidad y comunicación, beneficios exclusivos y oportunidades para fortalecer la relación con tus clientes.`
- CTA: `Quiero ser Aliado`

**M4 Para quién**
- Eyebrow: `A quién va dirigido`
- Título: `Para ti que recomiendas, asesoras o vendes; Amplía tu portafolio.` (nota: la "A" mayúscula tras el punto y coma parece error de la landing; marcar para Dan, el master se escribe "amplía")
- Profesionales de campo — `¡Tu recomendación vale!`: Cuentas con cartera de clientes o te interesa empezar tu propio negocio · Comparas productos por margen, rotación, demanda y facilidad de venta · Recomiendas Productos
- Asesores y agrónomos independientes: Influyes en decisiones técnicas. · Diseñas programas de manejo. · Te reconocen por tus resultados.
- Dueños de punto de venta agrícola: Tienes tu local y vendes agroinsumos. · Buscas productos diferenciados. · Te interesa destacar tu negocio · acompañamiento técnico y comercial. (la landing trae la última viñeta partida; confirmar redacción final)

**M5 Resultados**
- Eyebrow: `RESULTADOS` · Título: `Gente que ya trabaja con nosotros`
- Cita 1: `Soy representante de una forma de hacer las cosas distinta, porque creo en esto, y voy para adelante.` — José Manuel Ibarra “Chema”, Aliado destacado. Cifras: `+11,000 ha atendidas actualmente` · `Naranja · Papaya · Nogal · Limón` · `Manejo biológico integral con microorganismos e insectos.`
- Cita 2: `Nos han enseñado a sembrar mejor y a producir más.` — Fernando Mayorga, Productor - Aliado destacado. Cifras: `300% de incremento en producción` · `30% de reducción de costos` · `12 toneladas de CO₂ mitigadas`
- Caso 3: `RESULTADOS QUE HABLAN POR SÍ MISMOS` — `Datos correspondientes a Año 3 en proyecto de fresa regenerativo, Michoacán.` Cifras: `+13.6% rendimiento` · `23% fertilizante sintético` · `59% plaguicidas sintéticos` · `88% fungicidas sintéticos` · `32.2% huella de carbono` (en la landing las reducciones no llevan signo menos; en el master escribir "−23%" solo si TDEM confirma que son reducciones; si no, copiar tal cual)
- Regla: ninguna cifra sin su caso y su fuente en la misma pieza.

**M6 Proceso**
- Título: `Proceso`
- 1 `Ponte en contacto con nosotros` — `Envíanos tu información a través de:` Correo ventasmulticanal@tierrademonte.com · WhatsApp 442 374 1871 · `O llena el formulario al final de esta página.` Botón: `Realiza tu primera compra aquí`
- 2 `Conocemos tu negocio y te acompañamos` — `Una vez que recibamos tu información, la revisamos y uno de nuestros especialistas se pondrá en contacto contigo para concretar tu proceso de registro.` Botón: `Completa tu proceso de afiliación`
- 3 `Haz tu primer pedido` — `Tu registro como Aliado se concreta con tu primer pedido.` / `Uno de nuestros ejecutivos se pondrá en contacto contigo para acompañarte y explicarte todo lo que tiene el programa para ti.`
- 4 `¡Ya eres Aliado Tierra de Monte!` — `Bienvenido a una comunidad que está transformando la agricultura.` / `Ahora podrás desarrollar tu negocio con nuestras soluciones biológicas y contar con Tierra de Monte.`

**M7 Frases de ticker** (mono, mayúsculas, color `#FAF4EC`): `GANA MÁS EN CADA VENTA` · `Resultados que se ven en el campo` · `Sube de nivel, crece tu negocio` · `Únete al Programa de Aliados`

**M8 CTA / Registro**: título `Registro` · botón `Quiero ser Aliado` → `/pages/aliados#registro` (en piezas impresas y de redes: URL corta o QR; `[DEPENDE DE APROBACIÓN]` URL final con UTM, ver `kpis.md`).

**FAQ (para interior A4, opcional)**: ¿Los $5,000 son cuota de inscripción? `No. Los $5,000 corresponden a la compra mínima de producto para registrarte como Aliado. No cobramos cuota de inscripción.` + las otras 5 preguntas de `collapsible_content_wp3zF8`.

**Productos (M9)**: `Soluciones biológicas que resuelven lo que los químicos no.` · `Una línea que genera valor en el campo y en tu negocio, fáciles de aplicar, larga vida de anaquel y con resultados que se notan.` · Mayor rentabilidad / Más oportunidades de venta / Más recompra / Una propuesta diferenciada.

## 5. Dato duro: el monto de entrada es $5,000 MXN (Bronce)

Siempre "Desde $5,000" o "compra mínima de $5,000 MXN". Nunca "cuota", "inscripción" ni "membresía".

## 6. Lista de assets

### 6.1 Ya existen (en la landing / Shopify files)
| Asset | Archivo | Pieza |
|---|---|---|
| Foto hero aliado | `hero-aliado.jpg` | M1, M6 |
| Visita 02 (84, 37) | `Fotografias_TierradeMonte_Visita02_84.jpg`, `_37.jpg` | M1, M6 |
| Familia agro | `Agro_Familyshot_iso.jpg` | M2, M6, M9 |
| Fotos de segmento | `1.4.1_1.4.1.jpg`, `1.7.1_1.7.1.jpg`, `sandia.jpg` | M4 |
| Íconos de beneficio | `aliados-icon-precio.png`, `-acompanamiento.png`, `-capacitacion.png`, `-crecimiento.png` | M3 |
| Imágenes de nivel (provisionales) | `aliados-bronce.png`, `-plata.png`, `-oro.png`, `-platino.png` | M2 |
| Casos | `Cosecha_de_cebollas_ante_las_montanas.png`, `Sr_Mayorga.png`, `fresa_regenerativo_Michoacan.jpg` | M5 |
| Textura ticker | `ticker-1.jpg` | M7 |
| Logo Aliados (blanco) y logos | En el kit de Figma, página "2 · Marca" | todas |

### 6.2 Falta de TDEM (pedir YA; plan B = placeholder visible)
| Asset | Qué es | Para qué | Plan B si no llega a tiempo |
|---|---|---|---|
| **Esporas** | Ilustración o macro de esporas / microorganismos | Motivo gráfico de fondo y separadores | Patrón de puntos de las esporas del logo (el logo ya trae círculos) |
| **Texturas** | Texturas de marca (tierra, hoja, papel) en alta | Fondos de tickers, portada A4, story | Reusar `ticker-1.jpg` |
| **Monedas tipo joya** | Render o ilustración de 4 monedas/joyas de nivel (Bronce, Plata, Oro, Platino), mismo ángulo y luz | M2 y la pieza de nivel | Disco plano con degradado de color en Figma, rotulado `PLACEHOLDER` |
| **Fotos de casos** | Fotos con permiso de uso de Chema, Mayorga y el caso fresa; alta resolución, horizontales y verticales | M5 | Las que ya están en la landing (revisar resolución para 1080×1920) |
| Logo Tierra de Monte vectorial (SVG) | Marca madre | Pie de pieza | El del tema |
| Permisos de imagen | Autorización de nombre y foto de los Aliados | M1, M5 | Quitar nombre, dejar sólo cita |
| QR o URL corta de registro | | M8 | Generarlo con la URL final |

`[DEPENDE DE APROBACIÓN]` Si la landing aprobada cambia fotos, actualizar la tabla 6.1.

## 7. Plan de horas del jueves 15 oct (un día, 9 h netas)

| Hora | Bloque | Salida |
|---|---|---|
| 9:00-9:30 | Re-verificar copy contra la landing aprobada; anotar diferencias en sección 4. Confirmar qué assets llegaron. | Copy final congelado |
| 9:30-10:30 | Archivo base: duplicar kit, crear páginas, variables y estilos (según `figma-estructura.md`). Cero decisiones nuevas. | Archivo "Aliados — Master" listo |
| 10:30-12:00 | Componentes: botón, chip, tarjeta blanca, tarjeta de foto, tarjeta de nivel, cita+cifra, paso, ticker. | Componentes en página `Componentes` |
| 12:00-13:00 | **M1 Hero** y **M2 Niveles** en 1440 (lienzo master). Es la pieza con más peso: se revisa al mediodía. | 2 piezas master |
| 13:00-14:00 | Comida | |
| 14:00-15:30 | **M3, M5, M8** en master; M4, M6, M7 rápidos con componentes. | Master completo |
| 15:30-17:00 | Derivar formatos: 3 posts 4:5, 2 stories (tamaños de la sección 3.2 para 1080). | 5 piezas social |
| 17:00-18:00 | PDF A4: 1 portada y 2 interiores. | 3 páginas |
| 18:00-19:00 | Revisión interna con el checklist de abajo, exportar PNG de preview, preparar mensaje de entrega. | Archivo listo para enviar viernes |

Recorte si el día se aprieta (en este orden): M9, FAQ en A4, M4, M6, story 2. No se recorta M1, M2, M5, M8 ni el post de niveles.

## 8. Checklist de revisión del viernes 16 oct (antes de mandar)

Copy
- [ ] Todo el copy coincide con la landing aprobada (diff en sección 4 cerrado)
- [ ] Ninguna aparición de "TDM" (buscar en todo el archivo, incluidos nombres de capa visibles al cliente)
- [ ] Monto de entrada $5,000 MXN, sin "cuota/inscripción"
- [ ] Sin T2 (Esmeralda/Rubí/Zafiro/Diamante)
- [ ] Cada cifra lleva caso y fuente en la misma pieza
- [ ] Tuteo y frases cortas; sin titulares enteros en mayúsculas

Sistema
- [ ] Solo estilos de texto y variables del archivo; cero tamaños o hex sueltos
- [ ] Bordes de 1 px, ninguno negro; sin mayúsculas ni mono salvo eyebrow/ticker
- [ ] Tarjetas blancas con texto oscuro; nunca verde sobre verde; máximo un verde de fondo por pieza
- [ ] Contraste de texto sobre foto con scrim ink 70%
- [ ] Botón: texto del tamaño del párrafo contiguo

Formatos
- [ ] 1080×1350, 1080×1920 y A4 con las medidas exactas; zona segura de story respetada
- [ ] Márgenes de 72 px en social
- [ ] Capas nombradas según `figma-estructura.md`; sin capas ocultas ni "Frame 123"
- [ ] Placeholders rotulados `PLACEHOLDER` y listados en el mensaje de entrega

Entrega
- [ ] Link de Figma con permiso de comentar; sección "Para adaptar a redes" visible
- [ ] Previews PNG de cada formato
- [ ] Lista de pendientes de TDEM (sección 6.2) en el mensaje

## 9. Pendientes y dependencias de aprobación

| Pendiente | Quién | Cuándo |
|---|---|---|
| Aprobación de landing | Dan / TDEM | Mié 14 |
| Qué paleta manda (aliados vs brand), ver 3.1 | Dan | Mié 14 |
| Escala de tamaños para 1080 (3.2) | Dan | Mié 14 |
| Assets 6.2 | TDEM | Mié 14 o plan B |
| Permiso de nombre y foto de Aliados | TDEM | Mié 14 |
| URL final de registro con UTM | Dan / agente KPIs | Mié 14 |

Fuera de este brief (6 nov): kit de bienvenida y un PDF basado en el master, guía de mensajes (ver `guia-de-mensajes-v1.md`) y tabla de KPIs (ver `kpis.md`).
