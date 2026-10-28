/* =============================================================================
   PerfectlyRad commerce — <pr-order> (sections/aliados-pedido.liquid).
   Step 1 of the Aliados purchase-first flow (also listens for [data-order-add] buttons: addVariant): quantities mirror the cart, the subtotal and the progress toward the
   minimum update on every change, the pay button wakes up at the minimum; above the maximum it becomes a WhatsApp link to an advisor with the order written out. The cart is the order (see pull / sync):
   paying goes to checkout, or opens the registration step of the drawer first when the shopper is not registered yet.
   ========================================================================== */

(() => {
  const money = (cents) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: Number.isInteger(cents / 100) ? 0 : 2,
    }).format(cents / 100);

  const FLOAT_OFFSET = 96;
  const SYNC_DELAY_MS = 400;

  class PrOrder extends HTMLElement {
    connectedCallback() {
      this.minimum = Number(this.dataset.minimum) || 0;
      this.maximum = Number(this.dataset.maximum) || 0;
      this.advisor = this.dataset.advisor;
      this.goal = this.dataset.goal;
      this.levels = [...this.querySelectorAll('[data-level]')]
        .map((el) => ({ name: el.dataset.name, threshold: Number(el.dataset.threshold) }))
        .sort((a, b) => a.threshold - b.threshold);
      this.button = this.querySelector('[data-checkout]');
      this.synced = new Map();
      this.addEventListener('change', (e) => {
        if (!e.target.closest('.pr-qty__input')) return;
        this.render();
        if (!this.applying && this.loaded) this.queueSync();
      });
      this.button.addEventListener('click', () => this.checkout());
      document.addEventListener('cart:updated', () => {
        if (this.loaded && !this.syncing && !this.timer) this.pull();
      });
      this.render();
      this.watchFloating();
      customElements.whenDefined('pr-quantity').then(() => this.pull());
    }

    // The cart is the order: the cards show what the cart holds, and every change here is sent to the cart a moment later,
    // so the drawer and the header bubble never disagree with the cards (and changes made in the drawer come back here).
    get steppers() {
      return [...this.querySelectorAll('.pr-qty__input[data-variant]')];
    }

    // pr-order.js loads before pr-cart.js (which defines <pr-quantity> and PrCart), so the first pull waits for it.
    // Nothing is sent to the cart before that first pull; taps made meanwhile are added on top of what the cart holds.
    async pull() {
      let early = false;
      try {
        const cart = await (await fetch(`${window.routes.cart_url}.js`, { headers: { Accept: 'application/json' } })).json();
        const first = !this.loaded;
        if (!first && (this.syncing || this.timer)) return;
        const quantities = new Map(cart.items.map((item) => [String(item.variant_id), item.quantity]));
        this.synced = quantities;
        this.applying = true;
        this.steppers.forEach((input) => {
          const tapped = first ? Number(input.value) : 0;
          if (tapped) early = true;
          input.closest('pr-quantity').set((quantities.get(input.dataset.variant) || 0) + tapped);
        });
      } catch {
        return;
      } finally {
        this.applying = false;
        this.loaded = true;
      }
      this.render();
      if (early) this.queueSync();
    }

    queueSync() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.sync(), SYNC_DELAY_MS);
    }

    async sync() {
      clearTimeout(this.timer);
      this.timer = null;
      if (this.syncing) {
        this.pending = true;
        return this.syncing;
      }
      const updates = {};
      this.steppers.forEach((input) => {
        if (Number(input.value) !== (this.synced.get(input.dataset.variant) || 0)) updates[input.dataset.variant] = Number(input.value);
      });
      if (!Object.keys(updates).length) return;
      this.syncing = window.PrCart.post(`${window.routes.cart_update_url}.js`, { updates })
        .then((data) => {
          Object.entries(updates).forEach(([variant, quantity]) => this.synced.set(variant, quantity));
          window.PrCart.render(data.sections);
        })
        .finally(() => {
          this.syncing = null;
        });
      await this.syncing;
      if (this.pending) {
        this.pending = false;
        await this.sync();
      }
    }

    // Desktop only: the summary starts in its slot beside the heading; once that slot scrolls under the navbar it floats as a compact bar, until the product grid ends.
    watchFloating() {
      const slot = this.querySelector('.pr-order__slot');
      const grid = this.querySelector('.pr-order__grid');
      const desktop = window.matchMedia('(min-width: 990px)');
      let frame;

      const measure = () => {
        if (!this.classList.contains('is-floating')) slot.style.setProperty('--po-slot-h', `${slot.firstElementChild.offsetHeight}px`);
      };
      const update = () => {
        frame = null;
        measure();
        const slotBottom = slot.getBoundingClientRect().bottom;
        const gridBottom = grid.getBoundingClientRect().bottom;
        this.classList.toggle('is-floating', desktop.matches && slotBottom < FLOAT_OFFSET && gridBottom > window.innerHeight / 2);
      };
      const queue = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };

      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
      update();
    }

    get lines() {
      return [...this.querySelectorAll('.pr-qty__input[data-variant]')]
        .map((input) => ({ id: Number(input.dataset.variant), quantity: Number(input.value), price: Number(input.dataset.price) }))
        .filter((line) => line.quantity > 0);
    }

    get total() {
      return this.lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
    }

    render() {
      const total = this.total;
      const reached = total >= this.minimum;
      const pct = this.minimum > 0 ? Math.min(100, Math.round((total / this.minimum) * 100)) : 100;
      const bar = this.querySelector('[data-progress-bar]');
      const text = this.querySelector('[data-progress-text]');
      this.querySelector('[data-subtotal]').textContent = money(total);
      this.querySelector('[data-progress-of]').textContent = `${money(total)} de ${money(this.minimum)}`;
      text.textContent = reached ? `Alcanzaste ${this.goal}` : `Te faltan ${money(this.minimum - total)} para alcanzar ${this.goal}`;
      text.classList.toggle('pr-color--success', reached);
      text.classList.toggle('pr-color--primary', !reached);
      bar.style.setProperty('--progress', `${pct}%`);
      bar.setAttribute('aria-valuenow', pct);
      this.querySelector('.pr-progress').classList.toggle('is-done', reached);
      const over = this.maximum > 0 && total > this.maximum;
      const notice = this.querySelector('[data-over-maximum]');
      const advisor = this.querySelector('[data-advisor-link]');
      const toAdvisor = over && Boolean(this.advisor);
      notice.hidden = !over;
      if (over) {
        notice.textContent = toAdvisor
          ? `Los pedidos mayores a ${money(this.maximum)} los atiende un asesor. Mándanos tu pedido por WhatsApp y te contactamos.`
          : `El pedido máximo es de ${money(this.maximum)}. Quita ${money(total - this.maximum)} para poder pagar.`;
      }
      advisor.hidden = !toAdvisor;
      this.button.hidden = toAdvisor;
      if (toAdvisor) advisor.href = this.advisorUrl(total);
      const ready = reached && !over;
      this.button.disabled = !ready;
      this.button.setAttribute('aria-disabled', !ready);
      this.renderLevel(total);
    }

    // wa.me link with the order written out: one line per product, then the subtotal.
    advisorUrl(total) {
      const items = [...this.querySelectorAll('.pr-qty__input[data-variant]')]
        .filter((input) => Number(input.value) > 0)
        .map((input) => `• ${input.value} × ${input.dataset.name}`);
      const text = ['Hola, quiero hacer un pedido de Aliado mayor a ' + money(this.maximum) + ':', ...items, `Subtotal: ${money(total)}`].join('\n');
      return `https://wa.me/${this.advisor}?text=${encodeURIComponent(text)}`;
    }

        renderLevel(total) {
      const label = this.querySelector('[data-level-text]');
      if (!label) return;
      const level = this.levels.filter((item) => total >= item.threshold).pop();
      label.hidden = !level;
      if (level) label.textContent = `Con este pedido estás en nivel ${level.name}`;
    }

    // Adds one unit of a variant, as if the shopper pressed + on its card. Returns false when that variant is not in the order.
    addVariant(variantId) {
      const input = this.querySelector(`.pr-qty__input[data-variant="${variantId}"]`);
      const plus = input?.closest('pr-quantity')?.querySelector('[data-qty="plus"]');
      if (!plus) return false;
      if (!plus.disabled) plus.click();
      this.dispatchEvent(new CustomEvent('pr-order:add', { bubbles: true, detail: { variant: variantId, quantity: Number(input.value) } }));
      return true;
    }

    async checkout() {
      const error = this.querySelector('[data-order-error]');
      error.hidden = true;
      this.button.disabled = true;
      this.button.classList.add('is-loading');
      this.button.setAttribute('aria-busy', 'true');
      try {
        await this.sync();
        if (window.PrCartRegister?.needed()) {
          window.PrCart.open();
          window.PrCartRegister.show();
          this.button.classList.remove('is-loading');
          this.button.removeAttribute('aria-busy');
          this.render();
          return;
        }
        window.location.href = this.dataset.checkoutUrl;
      } catch {
        error.hidden = false;
        this.button.classList.remove('is-loading');
        this.button.removeAttribute('aria-busy');
        this.render();
      }
    }
  }

  customElements.define('pr-order', PrOrder);

  // Any [data-order-add="<variant id>"] on the page (the Más vendidos cards) adds that variant to the order.
  // The link keeps its href (#pedido), so the browser still scrolls to the order section.
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-order-add]');
    if (!trigger) return;
    document.querySelector('pr-order')?.addVariant(Number(trigger.dataset.orderAdd));
  });
})();
