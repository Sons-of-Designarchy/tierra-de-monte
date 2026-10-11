# Tracking de lanzamiento (GA4)

Scorecard fila 16: "Instalar GA4 y eventos: vista, clic en 'Quiero ser Aliado', registro y compra". Fecha: 16 oct 2026.

Código: `assets/tdm-analytics.js` + `snippets/tdm-analytics.liquid` (una línea `{% render 'tdm-analytics' %}` en `layout/theme.liquid`). Sin scripts inline. Si no hay dónde mandar eventos, no hace nada y nunca lanza errores.

## Dependencia pendiente

TDEM debe dar acceso de administrador de la propiedad GA4 (pendiente al 14 oct). Sin eso no hay ID de medición ni se puede verificar en Realtime.

## Eventos

| Evento | Cuándo | Dónde se dispara | Parámetros |
|---|---|---|---|
| `aliados_view` | Se carga una página con plantilla `page.aliados` | `tdm-analytics.js` al cargar | `page_location` |
| `aliados_cta_click` | Clic en cualquier elemento con `data-track` | listener delegado en `document` | `cta_id` (valor del atributo), `link_text` |
| `aliados_registro` | Se envía el formulario de GoHighLevel (LeadConnector) | mensaje `postMessage` del iframe | `form: leadconnector` |
| `add_to_cart` | Respuesta correcta de `/cart/add(.js)` (quick-add, buy-box) | intercepta `fetch` | `currency`, `value`, `items[]` |
| `begin_checkout` | Clic en el botón `name="checkout"` o en un enlace a `/checkout` (carrito y cajón) | listener delegado; lee `/cart.js` | `currency`, `value`, `items[]` |
| `purchase` | Compra completada | NO está en el tema: pixel de Shopify (ver abajo) | |

### Atributo para el CTA (pendiente de agregar en Aliados)

Agregar `data-track="quiero-ser-aliado"` a cada botón/enlace "Quiero ser Aliado" (hero, navbar, cierre, etc.). Usa un valor distinto por ubicación si se quiere medir cuál convierte (`quiero-ser-aliado-hero`, `quiero-ser-aliado-footer`). Aplica a cualquier elemento; si el átomo `button` no acepta atributos extra, ponerlo en un `<a>` o contenedor que envuelva al botón. Esto lo agrega quien lleva la landing de Aliados (no se tocaron esas secciones).

### Supuesto sobre el formulario de GoHighLevel

El formulario va en un iframe de `api.leadconnectorhq.com` con `link.msgsndr.com/js/form_embed.js`. LeadConnector no documenta públicamente sus mensajes. Supuesto: el iframe manda `window.postMessage` al padre y, al enviar, el contenido (texto, arreglo u objeto) incluye algo como `form-submitted` / `set-sticky-contacts`. El código acepta mensajes solo de `leadconnectorhq.com`, `msgsndr.com` o `gohighlevel.com`, busca esas palabras sin distinguir mayúsculas y evita duplicados en 3 s. **Hay que verificarlo con un envío real**: abre `/pages/aliados?tdm_debug=1`, consola del navegador, envía el formulario y mira los `[tdm-analytics] lc message`. Si el texto es otro, ajusta la expresión regular en `tdm-analytics.js` (sección 3). Plan B sin código: en GoHighLevel, activar redirección a una página de gracias y medir esa vista.

## Configurar el ID de medición

1. GA4, Administrar, Flujos de datos, flujo web, copiar el ID `G-XXXXXXXXXX`.
2. Shopify admin, Tienda online, Temas, Personalizar, Configuración del tema, **Analítica**, pegar el ID, guardar.
3. Si ya se instaló la app **Google & YouTube** (que carga su propio gtag), deja el campo vacío: los eventos se mandan a ese gtag y no se duplica la carga. No pongas el mismo ID en los dos lados.

Vacío por defecto. Nunca hay un ID escrito en el código.

## Compra (`purchase`): pixel personalizado en Shopify

Las compras ocurren en el checkout, fuera del tema. Dos opciones, elige una:

A. App Google & YouTube conectada a la propiedad GA4 (manda `purchase` sola). Es lo más simple.

B. Pixel personalizado: Shopify admin, Configuración, Eventos de cliente, Agregar pixel personalizado, nombre "GA4 purchase", pegar y Conectar. Reemplaza `G-XXXXXXXXXX` (sin ID en el repositorio):

```js
const GA_ID = 'G-XXXXXXXXXX';
const s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
document.head.appendChild(s);
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA_ID, { send_page_view: false });

analytics.subscribe('checkout_completed', (event) => {
  const c = event.data.checkout;
  gtag('event', 'purchase', {
    transaction_id: c.order && c.order.id ? String(c.order.id) : c.token,
    currency: c.currencyCode,
    value: c.totalPrice.amount,
    tax: c.totalTax ? c.totalTax.amount : 0,
    shipping: c.shippingLine ? c.shippingLine.price.amount : 0,
    items: c.lineItems.map((i) => ({
      item_id: String(i.variant && i.variant.product ? i.variant.product.id : ''),
      item_variant: String(i.variant ? i.variant.id : ''),
      item_name: i.title,
      price: i.variant ? i.variant.price.amount : undefined,
      quantity: i.quantity,
    })),
  });
});
```

Nota: el pixel corre en un sandbox, separado del `dataLayer` de la tienda. Por eso `purchase` y los eventos del tema llegan por caminos distintos a la misma propiedad GA4.

## Verificar en GA4 Realtime

1. Con el ID guardado, abre la tienda con `?tdm_debug=1` al final de la URL: la consola muestra cada evento como `[tdm-analytics] nombre {...}`. En la consola, `dataLayer` lista lo enviado.
2. GA4, Informes, Tiempo real (o Administrar, DebugView). Recorre: abrir `/pages/aliados` (`aliados_view`), clic en "Quiero ser Aliado" (`aliados_cta_click`), enviar el formulario (`aliados_registro`), agregar un producto (`add_to_cart`), ir a pagar (`begin_checkout`), y una compra de prueba (`purchase`).
3. Marcar `aliados_registro` y `purchase` como eventos clave (conversiones) en Administrar, Eventos.
