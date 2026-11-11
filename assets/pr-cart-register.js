/* =============================================================================
   PerfectlyRad commerce — <pr-cart-register> (snippets/pr-cart-drawer.liquid).
   Registration step of the cart drawer: before paying, the shopper fills the same GoHighLevel form as the
   Aliados page. "Finalizar compra" opens it instead of going to checkout until it has been submitted; the
   submission is remembered in this browser, so it is asked once. Submission is read from the form's postMessage
   (same detection as assets/tdm-analytics.js). It is a front-end gate: Shopify's checkout itself stays open.
   Turn it off by emptying "ID del formulario de registro" in the theme settings.
   On submit the form also posts the contact it saved (["set-sticky-contacts", "_ud", json]); with data-notify set,
   that contact and the cart go to the store by email through Shopify's contact form, so a sign-up that never pays
   still reaches the team ("Avisar por correo cada registro").
   ========================================================================== */

(() => {
  const STORAGE_KEY = 'tdm-registered';
  const VALID_DAYS = 30;
  const AUTO_CONTINUE_MS = 1500;
  const EMBED_SRC = 'https://link.msgsndr.com/js/form_embed.js';
  const FORM_HOSTS = /(leadconnectorhq\.com|msgsndr\.com|gohighlevel\.com)$/;
  const SUBMITTED = /form[-_ ]?submit|formsubmit|submitted|set-sticky-contacts/i;

  const isRegistered = () => {
    try {
      const at = Number(localStorage.getItem(STORAGE_KEY));
      return at > 0 && Date.now() - at < VALID_DAYS * 864e5;
    } catch {
      return false;
    }
  };

  const remember = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
  };

  const fromForm = (event) => {
    try {
      if (!FORM_HOSTS.test(new URL(event.origin).hostname)) return false;
      return SUBMITTED.test(typeof event.data === 'string' ? event.data : JSON.stringify(event.data));
    } catch {
      return false;
    }
  };

  // The contact GoHighLevel saved on submit: standard fields by name, custom fields by id.
  const contactFrom = (event) => {
    try {
      if (!FORM_HOSTS.test(new URL(event.origin).hostname)) return null;
      const [action, key, payload] = Array.isArray(event.data) ? event.data : [];
      if (action !== 'set-sticky-contacts' || key !== '_ud') return null;
      return JSON.parse(payload);
    } catch {
      return null;
    }
  };

  const money = (cents) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);

  const pick = (contact, ...keys) => keys.map((k) => contact[k]).find((v) => typeof v === 'string' && v.trim()) || '';

  class PrCartRegister extends HTMLElement {
    connectedCallback() {
      this.drawer = this.closest('pr-cart-drawer');
      this.frame = this.querySelector('[data-register-frame]');
      this.done = this.querySelector('[data-register-done]');
      this.next = this.querySelector('[data-register-continue]');

      this.drawer.addEventListener(
        'click',
        (e) => {
          if (!e.target.closest('[name="checkout"]') || isRegistered()) return;
          e.preventDefault();
          this.show();
        },
        true
      );
      this.querySelector('[data-register-back]').addEventListener('click', () => this.hide());
      this.next.addEventListener('click', () => this.proceed());
      this.drawer.querySelector('dialog').addEventListener('close', () => this.hide());
      window.addEventListener('message', (e) => {
        const contact = contactFrom(e);
        if (contact) this.notify(contact);
        if (fromForm(e)) this.registered();
      });
      this.sync();
    }

    get cart() {
      return this.drawer.querySelector('[data-cart-content]');
    }

    show() {
      this.cart.hidden = true;
      this.hidden = false;
      if (!this.frame.src) {
        this.frame.src = this.frame.dataset.src;
        const script = document.createElement('script');
        script.src = EMBED_SRC;
        document.head.append(script);
      }
      this.sync();
    }

    hide() {
      this.hidden = true;
      this.cart.hidden = false;
    }

    sync() {
      const registered = isRegistered();
      this.done.hidden = !registered;
      this.next.disabled = !registered;
      this.next.setAttribute('aria-disabled', !registered);
    }

    registered() {
      remember();
      this.sync();
      if (!this.hidden) setTimeout(() => this.proceed(), AUTO_CONTINUE_MS);
    }

    // Emails the sign-up and its cart to the store, once per page. The checkout waits for it (see proceed).
    notify(contact) {
      if (!this.dataset.notify || this.sending) return;
      this.sending = (async () => {
        const cart = await (await fetch(`${window.routes.cart_url}.js`, { headers: { Accept: 'application/json' } })).json();
        const fields = Object.entries(contact)
          .filter(([key, value]) => key !== 'traceId' && value !== '' && value != null)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
        const lines = cart.items.map((item) => `${item.quantity} × ${item.product_title}${item.variant_title ? ` (${item.variant_title})` : ''}: ${money(item.final_line_price)}`);
        const body = [
          'Nuevo registro de Aliado antes de pagar. Si no aparece un pedido con este correo, no pagó.',
          '',
          'Datos',
          ...fields,
          '',
          'Pedido',
          ...(lines.length ? lines : ['(carrito vacío)']),
          `Subtotal: ${money(cart.total_price)}`,
        ].join('\n');
        const form = new FormData();
        form.append('form_type', 'contact');
        form.append('utf8', '✓');
        form.append('contact[email]', pick(contact, 'email'));
        form.append('contact[name]', pick(contact, 'full_name', 'name', 'first_name'));
        form.append('contact[phone]', pick(contact, 'phone'));
        form.append('contact[body]', body);
        await fetch(this.dataset.notify, { method: 'POST', body: form, keepalive: true });
      })().catch(() => {});
    }

    async proceed() {
      if (this.sending) await Promise.race([this.sending, new Promise((r) => setTimeout(r, 3000))]);
      const checkout = this.cart.querySelector('[name="checkout"]');
      this.hide();
      if (checkout && !checkout.disabled) checkout.click();
    }
  }

  customElements.define('pr-cart-register', PrCartRegister);

  window.PrCartRegister = {
    needed: () => Boolean(document.querySelector('pr-cart-register')) && !isRegistered(),
    show: () => document.querySelector('pr-cart-register')?.show(),
  };
})();
