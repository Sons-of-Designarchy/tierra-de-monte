/* <tdm-scroller> — arrows for a scroll-snap track (sections/tdm-bestsellers.liquid).
   The track scrolls natively (touch, wheel, keyboard arrows on the focused track); the buttons
   move it one card at a time and switch off at each end. */
if (!customElements.get('tdm-scroller')) {
  customElements.define(
    'tdm-scroller',
    class TdmScroller extends HTMLElement {
      connectedCallback() {
        this.track = this.querySelector('[data-scroller-track]');
        this.prev = this.querySelector('[data-scroller="prev"]');
        this.next = this.querySelector('[data-scroller="next"]');
        if (!this.track) return;
        this.prev?.addEventListener('click', () => this.move(-1));
        this.next?.addEventListener('click', () => this.move(1));
        this.track.addEventListener('scroll', () => this.sync(), { passive: true });
        this.track.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') this.move(1);
          else if (e.key === 'ArrowLeft') this.move(-1);
          else return;
          e.preventDefault();
        });
        window.addEventListener('resize', () => this.sync());
        this.sync();
      }

      move(direction) {
        const card = this.track.firstElementChild;
        const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(this.track).columnGap || 0) : this.track.clientWidth;
        this.track.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }

      sync() {
        const max = this.track.scrollWidth - this.track.clientWidth - 1;
        const set = (button, off) => {
          if (!button) return;
          button.disabled = off;
          button.setAttribute('aria-disabled', off);
        };
        set(this.prev, this.track.scrollLeft <= 0);
        set(this.next, this.track.scrollLeft >= max);
      }
    }
  );
}
