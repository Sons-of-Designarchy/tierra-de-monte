/* =============================================================================
   PerfectlyRad commerce — cart behaviour. Loaded on every page.
   Custom elements: <pr-quantity> (stepper), <pr-quick-add> (product card button),
   <pr-cart-drawer> (side panel), <pr-cart-lines> (lines: quantity + remove).
   Everything goes through Shopify's Ajax Cart API (/cart/add.js, /cart/change.js) and
   Section Rendering: the server re-renders the drawer, the header bubble and the cart page
   section, and PrCart swaps them in. No markup is built in JS.
   ========================================================================== */

(() => {
  const BUBBLE_ID = 'cart-icon-bubble';
  const DRAWER_SECTION = 'cart-drawer';
  const ADDED_MS = 1800;

  const PrCart = {
    sectionIds() {
      const page = [...document.querySelectorAll('[data-cart-section]')].map((el) => el.dataset.cartSection);
      return [DRAWER_SECTION, BUBBLE_ID, ...page];
    },

    async post(url, body) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...body,
          sections: this.sectionIds().join(','),
          sections_url: window.location.pathname,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.status) {
        throw new Error(data.description || data.message || 'cart');
      }
      return data;
    },

    async add(items) {
      const data = await this.post(window.routes.cart_add_url + '.js', { items });
      this.render(data.sections);
      return data;
    },

    async change(line, quantity) {
      const data = await this.post(window.routes.cart_change_url + '.js', { line, quantity });
      this.render(data.sections);
      return data;
    },

    parse(html) {
      return new DOMParser().parseFromString(html, 'text/html');
    },

    render(sections = {}) {
      Object.entries(sections).forEach(([id, html]) => {
        if (!html) return;
        const doc = this.parse(html);
        if (id === DRAWER_SECTION) {
          const live = document.querySelector('pr-cart-drawer [data-cart-content]');
          const next = doc.querySelector('[data-cart-content]');
          if (live && next) live.innerHTML = next.innerHTML;
        } else if (id === BUBBLE_ID) {
          document.querySelectorAll('#' + BUBBLE_ID).forEach((el) => {
            el.innerHTML = doc.body.firstElementChild ? doc.body.firstElementChild.innerHTML : doc.body.innerHTML;
          });
        } else {
          const live = document.querySelector(`[data-cart-section="${id}"]`);
          const next = doc.querySelector('[data-cart-section]');
          if (live && next) live.innerHTML = next.innerHTML;
        }
      });
      document.dispatchEvent(new CustomEvent('cart:updated'));
    },

    open() {
      const drawer = document.querySelector('pr-cart-drawer');
      if (drawer) drawer.open();
      return Boolean(drawer);
    },
  };

  window.PrCart = PrCart;

  class PrQuantity extends HTMLElement {
    connectedCallback() {
      this.input = this.querySelector('.pr-qty__input');
      this.minus = this.querySelector('[data-qty="minus"]');
      this.plus = this.querySelector('[data-qty="plus"]');
      this.addEventListener('click', (e) => {
        const button = e.target.closest('[data-qty]');
        if (!button || !this.contains(button)) return;
        this.set(Number(this.input.value) + (button.dataset.qty === 'plus' ? 1 : -1) * this.step);
      });
      this.input.addEventListener('keydown', (e) => {
        const moves = { ArrowUp: 1, ArrowDown: -1 };
        if (e.key in moves) {
          e.preventDefault();
          this.set(Number(this.input.value) + moves[e.key] * this.step);
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.set(this.min);
        } else if (e.key === 'End' && this.max !== Infinity) {
          e.preventDefault();
          this.set(this.max);
        }
      });
      this.input.addEventListener('change', () => this.sync());
      this.sync();
    }

    get min() {
      return this.input.min === '' ? 1 : Number(this.input.min);
    }

    get max() {
      return this.input.max === '' ? Infinity : Number(this.input.max);
    }

    get step() {
      return Number(this.input.step) || 1;
    }

    set(value) {
      const next = Math.min(this.max, Math.max(this.min, Number.isNaN(value) ? this.min : value));
      if (next === Number(this.input.value)) {
        this.sync();
        return;
      }
      this.input.value = next;
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    sync() {
      const value = Number(this.input.value);
      if (value < this.min || value > this.max) {
        this.input.value = Math.min(this.max, Math.max(this.min, value || this.min));
      }
      const blocked = this.input.disabled;
      this.minus.disabled = blocked || Number(this.input.value) <= this.min;
      this.plus.disabled = blocked || Number(this.input.value) >= this.max;
      this.minus.setAttribute('aria-disabled', this.minus.disabled);
      this.plus.setAttribute('aria-disabled', this.plus.disabled);
    }

    set busy(state) {
      this.toggleAttribute('aria-busy', state);
      this.input.disabled = state;
      this.sync();
    }
  }

  class PrQuickAdd extends HTMLElement {
    connectedCallback() {
      this.button = this.querySelector('[data-quick-add]');
      this.label = this.button.querySelector('.pr-type');
      this.idle = this.label.textContent;
      this.button.addEventListener('click', () => this.add());
    }

    mark(state, text, template) {
      this.button.disabled = state === 'loading';
      this.button.classList.toggle('is-loading', state === 'loading');
      this.button.setAttribute('aria-busy', state === 'loading');
      this.button.querySelector('.pr-spinner, .pr-icon')?.remove();
      if (template) this.button.prepend(this.querySelector(`template[data-${template}]`).content.cloneNode(true));
      this.label.textContent = text;
    }

    async add() {
      const error = this.querySelector('[data-quick-error]');
      error.hidden = true;
      this.mark('loading', 'Agregando', 'spinner');
      try {
        await PrCart.add([{ id: Number(this.dataset.variantId), quantity: 1 }]);
        this.mark('added', 'Agregado', 'added');
        PrCart.open();
        setTimeout(() => this.mark('idle', this.idle), ADDED_MS);
      } catch {
        this.mark('idle', this.idle);
        error.hidden = false;
      }
    }
  }

  class PrCartDrawer extends HTMLElement {
    connectedCallback() {
      this.dialog = this.querySelector('dialog');
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog || e.target.closest('[data-drawer-close]')) this.close();
      });
      this.dialog.addEventListener('close', () => document.documentElement.classList.remove('pr-scroll-lock'));
      document.addEventListener('click', (e) => {
        const bubble = e.target.closest('#' + BUBBLE_ID);
        if (!bubble || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        this.open();
      });
    }

    open() {
      if (!this.dialog.open) this.dialog.showModal();
      document.documentElement.classList.add('pr-scroll-lock');
    }

    close() {
      this.dialog.close();
    }
  }

  class PrCartLines extends HTMLElement {
    connectedCallback() {
      this.addEventListener('change', (e) => {
        const input = e.target.closest('.pr-qty__input[data-line]');
        if (input) this.update(input, Number(input.value));
      });
      this.addEventListener('click', (e) => {
        const remove = e.target.closest('[data-remove]');
        if (remove) this.update(remove, 0);
      });
    }

    async update(source, quantity) {
      const item = source.closest('.pr-product-card');
      const stepper = item.querySelector('pr-quantity');
      item.querySelector('[data-line-error]')?.remove();
      item.setAttribute('aria-busy', 'true');
      stepper.busy = true;
      try {
        await PrCart.change(Number(source.dataset.line), quantity);
      } catch (error) {
        item.removeAttribute('aria-busy');
        stepper.busy = false;
        const message = document.createElement('span');
        message.className = 'pr-type pr-type--label pr-font--body pr-weight--regular pr-color--danger';
        message.setAttribute('role', 'alert');
        message.setAttribute('data-line-error', '');
        message.textContent = error.message === 'cart' ? 'No se pudo actualizar el carrito.' : error.message;
        item.querySelector('.pr-product-card__info').append(message);
      }
    }
  }

  customElements.define('pr-quantity', PrQuantity);
  customElements.define('pr-quick-add', PrQuickAdd);
  customElements.define('pr-cart-drawer', PrCartDrawer);
  customElements.define('pr-cart-lines', PrCartLines);
})();
