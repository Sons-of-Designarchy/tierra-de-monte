/* Proceso con scroll — desktop pinned frame.
   The section pins for (list height − window height) of extra scroll; within it the
   step list translates 1:1 with the page scroll. The step nearest the reading line
   becomes current and the image cross-fades to it. Mobile: normal flow, image on step 1. */
const READING_LINE = 0.35; // fraction of the list window height

if (!customElements.get('tdm-scroll-steps')) {
  customElements.define(
    'tdm-scroll-steps',
    class TdmScrollSteps extends HTMLElement {
      connectedCallback() {
        this.frame = this.querySelector('.tdm-steps__frame');
        this.window = this.querySelector('.tdm-steps__viewport');
        this.list = this.querySelector('.tdm-steps__list');
        this.steps = Array.from(this.querySelectorAll('.tdm-steps__step'));
        this.slides = Array.from(this.querySelectorAll('.tdm-steps__slide'));
        if (!this.list || this.steps.length < 1) return;

        this.slides.forEach((slide) => slide.querySelector('img')?.setAttribute('loading', 'eager'));

        this.desktop = window.matchMedia('(min-width: 990px)');
        this.measure = this.measure.bind(this);
        this.update = this.update.bind(this);
        this.onScroll = () => {
          if (this.ticking) return;
          this.ticking = true;
          requestAnimationFrame(() => {
            this.ticking = false;
            this.update();
          });
        };

        this.resizeObserver = new ResizeObserver(this.measure);
        this.resizeObserver.observe(this.list);
        this.resizeObserver.observe(this.frame);
        this.desktop.addEventListener('change', this.measure);
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.measure);
        this.measure();
      }

      disconnectedCallback() {
        this.resizeObserver?.disconnect();
        this.desktop?.removeEventListener('change', this.measure);
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.measure);
      }

      measure() {
        if (!this.desktop.matches) {
          this.style.height = '';
          this.list.style.transform = '';
          this.travel = 0;
          this.activate(0);
          return;
        }
        this.travel = Math.max(0, this.list.scrollHeight - this.window.clientHeight);
        this.style.height = `${this.frame.offsetHeight + this.travel}px`;
        this.update();
      }

      update() {
        if (!this.desktop.matches) return;
        const start = this.getBoundingClientRect().top;
        const progress = this.travel ? Math.min(1, Math.max(0, -start / this.travel)) : 0;
        const offset = progress * this.travel;
        this.list.style.transform = `translate3d(0, ${-offset}px, 0)`;

        // Current step: the last one whose top has passed the reading line
        const line = offset + this.window.clientHeight * READING_LINE;
        let current = 0;
        this.steps.forEach((step, index) => {
          if (step.offsetTop <= line) current = index;
        });
        if (progress >= 0.999) current = this.steps.length - 1;
        this.activate(current);
      }

      activate(index) {
        if (index === this.current) return;
        this.current = index;
        const key = String(index);
        this.steps.forEach((step) => step.classList.toggle('is-active', step.dataset.step === key));
        this.slides.forEach((slide) => slide.classList.toggle('is-active', slide.dataset.step === key));
      }
    }
  );
}
