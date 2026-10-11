/* =============================================================================
   PerfectlyRad commerce — product page behaviour.
   <pr-gallery>  (snippets/product-gallery.liquid): scroll-snap track, arrows, thumbnails, counter.
   <pr-buy-box>  (snippets/buy-box.liquid): option pickers -> variant, server re-render of price / pickers /
                 buttons through Section Rendering (?variant=), add to cart through PrCart (pr-cart.js).
   ========================================================================== */

(() => {
  const ADDED_MS = 2000;
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class PrGallery extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-track]');
      this.slides = [...this.track.children];
      this.index = 0;
      this.track.addEventListener('scroll', () => {
        const next = Math.round(this.track.scrollLeft / this.track.clientWidth);
        if (next !== this.index) this.mark(next);
      });
      this.addEventListener('click', (e) => {
        const arrow = e.target.closest('[data-go]');
        const thumb = e.target.closest('[data-thumb]');
        if (arrow) this.go(this.index + (arrow.dataset.go === 'next' ? 1 : -1));
        if (thumb) this.go(Number(thumb.dataset.thumb));
      });
      if (this.dataset.initial) this.goTo(this.dataset.initial, true);
      this.mark(this.index);
    }

    mark(index) {
      this.index = index;
      this.querySelector('[data-current]')?.replaceChildren(String(index + 1));
      this.querySelectorAll('[data-thumb]').forEach((thumb) => {
        thumb.toggleAttribute('aria-current', Number(thumb.dataset.thumb) === index);
      });
      const last = this.slides.length - 1;
      this.querySelector('[data-go="prev"]')?.toggleAttribute('disabled', index === 0);
      this.querySelector('[data-go="next"]')?.toggleAttribute('disabled', index === last);
    }

    go(index, instant = false) {
      const next = Math.min(this.slides.length - 1, Math.max(0, index));
      this.track.scrollTo({ left: next * this.track.clientWidth, behavior: instant || reduceMotion() ? 'auto' : 'smooth' });
      this.mark(next);
    }

    goTo(mediaId, instant = false) {
      const index = this.slides.findIndex((slide) => slide.dataset.mediaId === String(mediaId));
      if (index >= 0) this.go(index, instant);
    }
  }

  class PrBuyBox extends HTMLElement {
    connectedCallback() {
      this.variants = JSON.parse(this.querySelector('[data-pr-variants]').textContent);
      this.form = this.querySelector('[data-pr-form]');
      this.addEventListener('click', (e) => {
        const value = e.target.closest('[data-option-position]');
        if (value && !value.disabled) this.pick(value);
      });
      this.addEventListener('change', (e) => {
        if (e.target.matches('select[data-pr-option]')) this.update();
      });
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.add();
      });
    }

    pick(button) {
      const group = button.closest('[data-pr-option]');
      group.querySelectorAll('[data-option-position]').forEach((item) => {
        const on = item === button;
        item.setAttribute('aria-pressed', on);
        item.classList.toggle('is-selected', on);
      });
      group.querySelector('[data-pr-selected-value]').textContent = button.dataset.value;
      this.update();
    }

    chosen() {
      return [...this.querySelectorAll('[data-pr-option]')]
        .sort((a, b) => Number(a.dataset.prOption) - Number(b.dataset.prOption))
        .map((group) => {
          if (group.matches('select')) return group.value;
          return group.querySelector('[aria-pressed="true"]')?.dataset.value;
        });
    }

    async update() {
      const chosen = this.chosen();
      const variant = this.variants.find((v) => v.options.every((value, i) => value === chosen[i]));
      const add = this.querySelector('[data-pr-add]');
      if (!variant) {
        add.disabled = true;
        add.querySelector('.pr-type').textContent = 'No disponible';
        return;
      }
      this.querySelector('[data-pr-variant-id]').value = variant.id;
      const token = (this.token = (this.token || 0) + 1);
      this.setAttribute('aria-busy', 'true');
      try {
        const url = `${this.dataset.url}?variant=${variant.id}`;
        const html = await (await fetch(`${url}&section_id=${this.dataset.sectionId}`)).text();
        if (token !== this.token) return;
        const next = new DOMParser().parseFromString(html, 'text/html').querySelector('pr-buy-box');
        const quantity = this.querySelector('.pr-qty__input')?.value;
        ['price', 'pickers', 'actions'].forEach((name) => {
          const live = this.querySelector(`[data-pr-target="${name}"]`);
          const fresh = next.querySelector(`[data-pr-target="${name}"]`);
          if (live && fresh) live.innerHTML = fresh.innerHTML;
        });
        const input = this.querySelector('.pr-qty__input');
        if (input && quantity) input.value = quantity;
        input?.closest('pr-quantity')?.sync();
        window.history.replaceState({}, '', url);
        document.querySelector('pr-gallery')?.goTo(variant.featured_media?.id);
        window.Shopify?.PaymentButton?.init();
      } finally {
        this.removeAttribute('aria-busy');
      }
    }

    mark(label, state, template) {
      const add = this.querySelector('[data-pr-add]');
      add.disabled = state === 'loading';
      add.classList.toggle('is-loading', state === 'loading');
      add.setAttribute('aria-busy', state === 'loading');
      add.querySelector('.pr-spinner, .pr-icon')?.remove();
      if (template) add.prepend(this.querySelector(`template[data-pr-${template}]`).content.cloneNode(true));
      add.querySelector('.pr-type').textContent = label;
    }

    async add() {
      const add = this.querySelector('[data-pr-add]');
      if (add.disabled) return;
      const idle = add.querySelector('.pr-type').textContent;
      const error = this.querySelector('[data-pr-error]');
      error.hidden = true;
      this.mark('Agregando', 'loading', 'spinner');
      try {
        const id = Number(this.querySelector('[data-pr-variant-id]').value);
        const quantity = Number(this.querySelector('.pr-qty__input').value) || 1;
        await PrCart.add([{ id, quantity }]);
        this.mark('Agregado', 'added', 'added');
        PrCart.open();
        setTimeout(() => this.mark(idle, 'idle'), ADDED_MS);
      } catch {
        this.mark(idle, 'idle');
        error.hidden = false;
      }
    }
  }

  customElements.define('pr-gallery', PrGallery);
  customElements.define('pr-buy-box', PrBuyBox);
})();
