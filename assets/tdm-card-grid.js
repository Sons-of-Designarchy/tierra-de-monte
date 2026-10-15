if (!customElements.get('tdm-card-grid-titles')) {
  /**
   * Iguala la altura de los títulos de las cards que quedan en la misma fila
   * para que los párrafos empiecen a la misma altura, y la de los paneles de
   * vidrio de las cards con foto de fondo, en cualquier ancho de pantalla. Wraps sections/tdm-card-grid.liquid's grid; no-ops unless
   * data-active="true" (the section's "align_titles" setting).
   */
  class TdmCardGridTitles extends HTMLElement {
    connectedCallback() {
      if (this.dataset.active !== 'true') return;

      this.list = this.querySelector('.tdm-card-grid__grid');
      if (!this.list) return;

      this._lastWidth = -1;
      this._raf = 0;
      this._schedule = this._schedule.bind(this);
      this._equalize = this._equalize.bind(this);

      this._schedule();

      if ('ResizeObserver' in window) {
        this._resizeObserver = new ResizeObserver((entries) => {
          const width = Math.round(entries[0].contentRect.width);
          if (width === this._lastWidth) return;
          this._lastWidth = width;
          this._schedule();
        });
        this._resizeObserver.observe(this.list);
      } else {
        window.addEventListener('resize', this._schedule);
      }

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(this._schedule);
      }
      window.addEventListener('load', this._schedule);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      }
      window.removeEventListener('resize', this._schedule);
      window.removeEventListener('load', this._schedule);
    }

    _schedule() {
      cancelAnimationFrame(this._raf);
      this._raf = requestAnimationFrame(this._equalize);
    }

    _equalize() {
      if (!this.list) return;
      const titles = Array.prototype.slice.call(this.list.querySelectorAll('.mc-card__title'));
      titles.forEach((title) => {
        title.style.minHeight = '';
      });

      const rows = {};
      titles.forEach((title) => {
        const item = title.closest('.grid__item');
        if (!item) return;
        const key = String(Math.round(item.offsetTop));
        (rows[key] = rows[key] || []).push(title);
      });

      Object.keys(rows).forEach((key) => {
        const group = rows[key];
        if (group.length < 2) return;
        let max = 0;
        group.forEach((title) => {
          max = Math.max(max, title.getBoundingClientRect().height);
        });
        group.forEach((title) => {
          title.style.minHeight = Math.ceil(max) + 'px';
        });
      });

      const panels = Array.prototype.slice.call(this.list.querySelectorAll('.mc-card--glass .multicolumn-card__info'));
      panels.forEach((panel) => {
        panel.style.minHeight = '';
      });

      const panelRows = {};
      panels.forEach((panel) => {
        const item = panel.closest('.grid__item');
        if (!item) return;
        const key = String(Math.round(item.offsetTop));
        (panelRows[key] = panelRows[key] || []).push(panel);
      });

      Object.keys(panelRows).forEach((key) => {
        const group = panelRows[key];
        if (group.length < 2) return;
        let max = 0;
        group.forEach((panel) => {
          max = Math.max(max, panel.getBoundingClientRect().height);
        });
        group.forEach((panel) => {
          panel.style.minHeight = Math.ceil(max) + 'px';
        });
      });
    }
  }

  customElements.define('tdm-card-grid-titles', TdmCardGridTitles);
}
