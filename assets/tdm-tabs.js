/* =============================================================================
   <tdm-tabs> — sections/tabbed-collections.liquid
   Chip buttons (.tdm-tabs__tab, aria-controls = panel id) show one panel
   (.tdm-tabs__panel) at a time.
   ========================================================================== */

if (!customElements.get('tdm-tabs')) {
  class TdmTabs extends HTMLElement {
    connectedCallback() {
      this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.handleClick);
    }

    handleClick(event) {
      const tab = event.target.closest('.tdm-tabs__tab');
      if (!tab || !this.contains(tab)) return;

      this.querySelectorAll('.tdm-tabs__tab').forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-selected', active);
        t.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      const panelId = tab.getAttribute('aria-controls');
      this.querySelectorAll('.tdm-tabs__panel').forEach((panel) => {
        panel.hidden = panel.id !== panelId;
      });
    }
  }

  customElements.define('tdm-tabs', TdmTabs);
}
