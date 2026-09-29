/* =============================================================================
   Hero slider custom element (sections/hero-slider.liquid)
   Guarded define — safe to load once per page even with multiple instances.
   ========================================================================== */

if (!customElements.get('hero-slider')) {
  customElements.define(
    'hero-slider',
    class HeroSlider extends HTMLElement {
      connectedCallback() {
        this.track = this.querySelector('.hs__track');
        this.slides = Array.from(this.querySelectorAll('.hs__slide'));
        this.dots = Array.from(this.querySelectorAll('.hs__dot'));
        this.index = 0;
        this.userPaused = false;
        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.slides.length < 2) return;

        const pauseForGood = () => {
          this.userPaused = true;
          this.stop();
        };
        this.querySelector('.hs__prev')?.addEventListener('click', () => {
          pauseForGood();
          this.go(this.index - 1);
        });
        this.querySelector('.hs__next')?.addEventListener('click', () => {
          pauseForGood();
          this.go(this.index + 1);
        });
        this.dots.forEach((dot, i) =>
          dot.addEventListener('click', () => {
            pauseForGood();
            this.go(i);
          })
        );
        this.track.addEventListener('touchstart', pauseForGood, { passive: true });

        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) this.setActive(this.slides.indexOf(entry.target));
            });
          },
          { root: this.track, threshold: 0.6 }
        );
        this.slides.forEach((slide) => this.observer.observe(slide));

        if (this.dataset.autoplay === 'true' && !this.reduced) {
          this.delay = parseInt(this.dataset.speed, 10) || 5000;
          this.addEventListener('mouseenter', () => this.stop());
          this.addEventListener('mouseleave', () => this.start());
          this.addEventListener('focusin', () => this.stop());
          this.addEventListener('focusout', () => this.start());
          this.start();
        }

        // Personalizador: al seleccionar un slide en la barra lateral, se muestra ese slide
        this.addEventListener('shopify:block:select', (e) => {
          pauseForGood();
          const i = this.slides.indexOf(e.target);
          if (i > -1) this.go(i, true);
        });
      }

      disconnectedCallback() {
        this.stop();
        this.observer?.disconnect();
      }

      go(i, instant) {
        const n = this.slides.length;
        const target = ((i % n) + n) % n;
        this.track.scrollTo({
          left: this.slides[target].offsetLeft,
          behavior: instant || this.reduced ? 'auto' : 'smooth',
        });
      }

      setActive(i) {
        if (i < 0) return;
        this.index = i;
        this.dots.forEach((dot, j) => dot.setAttribute('aria-current', j === i ? 'true' : 'false'));
        this.slides.forEach((slide, j) => slide.toggleAttribute('inert', j !== i));
      }

      start() {
        if (this.userPaused || !this.delay) return;
        this.stop();
        this.timer = setInterval(() => {
          if (!document.hidden) this.go(this.index + 1);
        }, this.delay);
      }

      stop() {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  );
}
