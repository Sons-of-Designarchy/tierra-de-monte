/* Detalles con imagen — auto-rotating image stack (no arrows, dots or counter).
   Cycles .is-active through .tdm-spotlight__slide every data-interval ms.
   Pauses while off-screen and when the user prefers reduced motion. */
if (!customElements.get('tdm-spotlight-media')) {
  customElements.define(
    'tdm-spotlight-media',
    class TdmSpotlightMedia extends HTMLElement {
      connectedCallback() {
        this.slides = Array.from(this.querySelectorAll('.tdm-spotlight__slide'));
        if (this.slides.length < 2) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.interval = parseInt(this.dataset.interval, 10) || 4000;
        this.index = Math.max(0, this.slides.findIndex((slide) => slide.classList.contains('is-active')));

        // Later slides are lazy images: load them before they fade in
        this.slides.forEach((slide) => slide.querySelector('img')?.setAttribute('loading', 'eager'));

        this.observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? this.play() : this.pause()));
        this.observer.observe(this);
      }

      disconnectedCallback() {
        this.pause();
        this.observer?.disconnect();
      }

      play() {
        if (this.timer) return;
        this.timer = setInterval(() => this.next(), this.interval);
      }

      pause() {
        clearInterval(this.timer);
        this.timer = null;
      }

      next() {
        this.slides[this.index].classList.remove('is-active');
        this.index = (this.index + 1) % this.slides.length;
        this.slides[this.index].classList.add('is-active');
      }
    }
  );
}
