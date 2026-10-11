/* =============================================================================
   PerfectlyRad commerce — <pr-product-grid> (snippets/card-grid-product.liquid).
   Filters and sort are a plain GET form. On change it fetches the section (Section Rendering API),
   swaps the form and the results, and keeps the URL in sync so the page is shareable and the
   back button works. Without JS the form still submits normally.
   ========================================================================== */

(() => {
  const DEBOUNCE_MS = 450;

  class PrProductGrid extends HTMLElement {
    connectedCallback() {
      this.addEventListener('change', (e) => {
        if (e.target.closest('[data-pr-filters]')) this.submit();
      });
      this.addEventListener('input', (e) => {
        if (e.target.matches('input[type="number"]')) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => this.submit(), DEBOUNCE_MS);
        }
      });
      this.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submit();
      });
      this.addEventListener('click', (e) => {
        const toggle = e.target.closest('[data-pr-toggle]');
        if (toggle) {
          this.panelOpen = toggle.getAttribute('aria-expanded') !== 'true';
          this.applyPanel();
          return;
        }
        const link = e.target.closest('a[data-pr-link]');
        if (link) {
          e.preventDefault();
          this.load(link.href);
        }
      });
      this.popstate = () => this.load(window.location.href, false);
      window.addEventListener('popstate', this.popstate);
    }

    disconnectedCallback() {
      window.removeEventListener('popstate', this.popstate);
    }

    get form() {
      return this.querySelector('[data-pr-filters]');
    }

    applyPanel() {
      const toggle = this.querySelector('[data-pr-toggle]');
      const panel = this.querySelector('.pr-grid__panel');
      if (!toggle || !panel) return;
      toggle.setAttribute('aria-expanded', Boolean(this.panelOpen));
      panel.hidden = !this.panelOpen;
    }

    submit() {
      const form = this.form;
      const params = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (value !== '') params.append(key, value);
      });
      this.load(`${form.action}?${params.toString()}`);
    }

    async load(url, push = true) {
      const sectionId = this.dataset.sectionId;
      const target = new URL(url, window.location.href);
      const request = new URL(target);
      if (sectionId) request.searchParams.set('section_id', sectionId);
      this.setAttribute('aria-busy', 'true');
      const focusId = document.activeElement?.id;
      try {
        const html = await (await fetch(request)).text();
        const next = new DOMParser().parseFromString(html, 'text/html').querySelector('pr-product-grid');
        if (!next) throw new Error('grid');
        const results = this.querySelector('[data-pr-results]');
        results.innerHTML = next.querySelector('[data-pr-results]').innerHTML;
        const form = this.form;
        const nextForm = next.querySelector('[data-pr-filters]');
        if (form && nextForm) form.innerHTML = nextForm.innerHTML;
        this.applyPanel();
        if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
        if (push) window.history.pushState({}, '', target);
      } catch {
        window.location.href = target;
      } finally {
        this.removeAttribute('aria-busy');
      }
    }
  }

  customElements.define('pr-product-grid', PrProductGrid);
})();
