/* =============================================================================
   PerfectlyRad commerce — <pr-order> (sections/aliados-pedido.liquid).
   Step 1 of the Aliados purchase-first flow (also listens for [data-order-add] buttons: addVariant): quantities live on the page, the subtotal and the progress toward the
   minimum update on every change, the pay button wakes up at the minimum. Paying replaces the cart with the order
   (/cart/clear.js, /cart/add.js) and goes to checkout.
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

  const json = (url, body) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) throw new Error('order');
      return response.json();
    });

  class PrOrder extends HTMLElement {
    connectedCallback() {
      this.minimum = Number(this.dataset.minimum) || 0;
      this.goal = this.dataset.goal;
      this.levels = [...this.querySelectorAll('[data-level]')]
        .map((el) => ({ name: el.dataset.name, threshold: Number(el.dataset.threshold) }))
        .sort((a, b) => a.threshold - b.threshold);
      this.button = this.querySelector('[data-checkout]');
      this.addEventListener('change', (e) => {
        if (e.target.closest('.pr-qty__input')) this.render();
      });
      this.button.addEventListener('click', () => this.checkout());
      this.render();
      this.watchFloating();
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
      this.button.disabled = !reached;
      this.button.setAttribute('aria-disabled', !reached);
      this.renderLevel(total);
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
        await json(this.dataset.clearUrl, {});
        await json(this.dataset.addUrl, { items: this.lines.map(({ id, quantity }) => ({ id, quantity })) });
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
