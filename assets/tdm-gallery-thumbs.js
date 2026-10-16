/* =============================================================================
   <tdm-gallery-thumbs> — thumbnail strip for the slide gallery "split" layout
   (sections/pr-slide-gallery.liquid). Sits right after <slideshow-component>: a click
   scrolls the slider to that slide, and the active thumb follows the slider
   (arrows, dots, swipe).
   ========================================================================== */
class TdmGalleryThumbs extends HTMLElement {
  connectedCallback() {
    this.slider = this.closest('.tdm-slide-gallery')?.querySelector('.slider');
    if (!this.slider) return;

    this.thumbs = Array.from(this.querySelectorAll('.tdm-slide-gallery__thumb'));
    this.thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => this.goTo(index)));
    this.slider.addEventListener('scroll', () => this.queueSync(), { passive: true });
  }

  goTo(index) {
    const slides = this.slider.querySelectorAll('.slider__slide');
    if (!slides[index]) return;
    this.slider.scrollTo({ left: slides[index].offsetLeft - slides[0].offsetLeft });
  }

  queueSync() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.sync());
  }

  sync() {
    const slideWidth = this.slider.querySelector('.slider__slide')?.offsetWidth;
    if (!slideWidth) return;

    const active = Math.round(this.slider.scrollLeft / slideWidth);
    this.thumbs.forEach((thumb, index) => {
      if (index === active) {
        thumb.setAttribute('aria-current', 'true');
        this.revealThumb(thumb);
      } else {
        thumb.removeAttribute('aria-current');
      }
    });
  }

  revealThumb(thumb) {
    if (this.scrollWidth <= this.clientWidth) return;
    this.scrollTo({ left: thumb.offsetLeft - (this.clientWidth - thumb.offsetWidth) / 2, behavior: 'smooth' });
  }
}

customElements.define('tdm-gallery-thumbs', TdmGalleryThumbs);
