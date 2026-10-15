/* =============================================================================
   <tdm-tabs> — sections/tabbed-collections.liquid
   Delegated click on .tabs__tab toggles is-active/aria-selected and shows
   the matching .tabs__panel by its data-target id.
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
      const tab = event.target.closest('.tabs__tab');
      if (!tab || !this.contains(tab)) return;

      this.querySelectorAll('.tabs__tab').forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      this.querySelectorAll('.tabs__panel').forEach((panel) => {
        panel.classList.add('is-hidden');
      });

      const panelId = tab.getAttribute('data-target');
      if (!panelId) return;

      const panel = this.querySelector('#' + panelId);
      if (panel) panel.classList.remove('is-hidden');
    }
  }

  customElements.define('tdm-tabs', TdmTabs);
}
