/* =============================================================================
   PerfectlyRad commerce — <pr-pricing> (sections/pricing.liquid), selectable mode.
   Choosing a plan points the progress bar at its threshold; the cart total (cents) comes from
   the server on load and from /cart.js after every cart change. Plans already reached are marked.
   ========================================================================== */

(() => {
  const money = (cents) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: Number.isInteger(cents / 100) ? 0 : 2,
    }).format(cents / 100);

  class PrPricing extends HTMLElement {
    connectedCallback() {
      this.total = Number(this.dataset.total) || 0;
      this.selected = null;
      this.addEventListener('click', (e) => {
        const plan = e.target.closest('[data-plan]');
        if (plan && !plan.disabled) this.select(plan);
      });
      this.onCart = async () => {
        this.total = (await (await fetch('/cart.js')).json()).total_price;
        this.render();
      };
      document.addEventListener('cart:updated', this.onCart);
    }

    disconnectedCallback() {
      document.removeEventListener('cart:updated', this.onCart);
    }

    select(plan) {
      this.selected = plan;
      this.querySelectorAll('[data-plan]').forEach((item) => {
        const on = item === plan;
        item.setAttribute('aria-pressed', on);
        item.classList.toggle('pr-btn--primary', on);
        item.classList.toggle('pr-btn--outline', !on);
      });
      this.render();
    }

    render() {
      this.querySelectorAll('[data-plan]').forEach((item) => {
        const reached = Number(item.dataset.threshold) > 0 && this.total >= Number(item.dataset.threshold);
        const flag = item.closest('.pr-pricing__plan').querySelector('[data-reached]');
        if (flag) flag.hidden = !reached;
      });
      const text = this.querySelector('[data-progress-text]');
      const bar = this.querySelector('[data-progress-bar]');
      const of = this.querySelector('[data-progress-of]');
      if (!text) return;
      if (!this.selected) {
        text.textContent = this.dataset.prompt;
        of.textContent = '';
        return;
      }
      const goal = Number(this.selected.dataset.threshold);
      const pct = goal > 0 ? Math.min(100, Math.round((this.total / goal) * 100)) : 100;
      const name = `${this.dataset.goal} ${this.selected.dataset.name}`.trim();
      text.textContent = this.total >= goal ? `Llegaste a ${name}` : `Te faltan ${money(goal - this.total)} para alcanzar ${name}`;
      bar.style.setProperty('--progress', `${pct}%`);
      bar.setAttribute('aria-valuenow', pct);
      of.textContent = `${money(this.total)} de ${money(goal)}`;
    }
  }

  customElements.define('pr-pricing', PrPricing);
})();
