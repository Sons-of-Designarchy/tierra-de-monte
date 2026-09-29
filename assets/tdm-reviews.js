/* =============================================================================
   <tdm-reviews> — centered testimonial carousel (sections/reviews.liquid)
   Wraps .reviews__track + .reviews__nav. Tracks the slide nearest the
   viewport center, centers on click/keyboard, and drives the prev/next
   buttons. Respects prefers-reduced-motion; hides nav when there's only
   one slide.
   ========================================================================== */

if (!customElements.get('tdm-reviews')) {
  class TdmReviews extends HTMLElement {
    connectedCallback() {
      const track = this.querySelector('.reviews__track');
      if (!track) return;

      const slides = Array.from(track.querySelectorAll('.review'));
      if (!slides.length) return;

      const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

      const center = (i) => {
        const el = slides[clamp(i, 0, slides.length - 1)];
        if (!el) return;
        el.scrollIntoView({ behavior: smooth, inline: 'center', block: 'nearest' });
      };

      const setActive = () => {
        const vw = track.getBoundingClientRect();
        const centerX = vw.left + vw.width / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        slides.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const mid = r.left + r.width / 2;
          const d = Math.abs(mid - centerX);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        });
        slides.forEach((s, i) => s.classList.toggle('is-active', i === bestIdx));
        return bestIdx;
      };

      let active;
      requestAnimationFrame(() => {
        active = setActive();
      });

      const onScroll = () => {
        active = setActive();
      };
      track.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);

      slides.forEach((s, i) => s.addEventListener('click', () => center(i)));
      slides.forEach((s, i) =>
        s.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            center(i);
          }
        })
      );

      const prevBtn = this.querySelector('.reviews__btn--prev');
      const nextBtn = this.querySelector('.reviews__btn--next');
      const nav = this.querySelector('.reviews__nav');

      if (slides.length <= 1 && nav) {
        nav.style.display = 'none';
      }

      if (prevBtn) prevBtn.addEventListener('click', () => center(clamp((active ?? 0) - 1, 0, slides.length - 1)));
      if (nextBtn) nextBtn.addEventListener('click', () => center(clamp((active ?? 0) + 1, 0, slides.length - 1)));

      this.addEventListener(
        'keydown',
        (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            center(clamp((active ?? 0) - 1, 0, slides.length - 1));
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            center(clamp((active ?? 0) + 1, 0, slides.length - 1));
          }
        },
        true
      );
    }
  }

  customElements.define('tdm-reviews', TdmReviews);
}
