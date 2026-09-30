/* Proceso con scroll — desktop pinned frame.
   The section pins until the last step has reached the reading line (or the list has
   fully scrolled, whichever is later), plus a short hold so the last image is seen with
   the frame still pinned. Within it the step list translates 1:1 with the page scroll. The step nearest the reading line
   becomes current and the image cross-fades to it. Mobile: normal flow, image on step 1. */
const READING_LINE = 0.35; // fraction of the list window height
const LAST_STEP_HOLD = 0.25; // extra pinned scroll after the last step, fraction of the window height

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
        const windowHeight = this.window.clientHeight;
        const overflow = this.list.scrollHeight - windowHeight;
        const lastStepToLine = this.steps[this.steps.length - 1].offsetTop - windowHeight * READING_LINE;
        this.maxOffset = Math.max(0, overflow, lastStepToLine);
        this.travel = this.maxOffset + windowHeight * LAST_STEP_HOLD;
        this.style.height = `${this.frame.offsetHeight + this.travel}px`;
        this.update();
      }

      update() {
        if (!this.desktop.matches) return;
        const start = this.getBoundingClientRect().top;
        const scrolled = Math.min(this.travel, Math.max(0, -start));
        const offset = Math.min(scrolled, this.maxOffset);
        this.list.style.transform = `translate3d(0, ${-offset}px, 0)`;

        // Current step: the last one whose top has passed the reading line
        const line = offset + this.window.clientHeight * READING_LINE;
        let current = 0;
        this.steps.forEach((step, index) => {
          if (step.offsetTop <= line) current = index;
        });
        if (scrolled >= this.maxOffset) current = this.steps.length - 1;
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
