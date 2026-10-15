/* <pr-tabs>: roles and keyboard for snippets/tabs.liquid. Markup is server-rendered; this only switches state. */
if (!customElements.get('pr-tabs')) {
  customElements.define(
    'pr-tabs',
    class PrTabs extends HTMLElement {
      connectedCallback() {
        this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
        this.panels = this.tabs.map((tab) => this.querySelector('#' + tab.getAttribute('aria-controls')));
        this.tabs.forEach((tab, i) => {
          tab.addEventListener('click', () => this.select(i));
          tab.addEventListener('keydown', (event) => this.onKeydown(event, i));
        });
      }

      onKeydown(event, index) {
        const last = this.tabs.length - 1;
        const target = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
        if (target === undefined) return;
        event.preventDefault();
        this.select(target, true);
      }

      select(index, focus = false) {
        this.tabs.forEach((tab, i) => {
          const active = i === index;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
          this.panels[i].hidden = !active;
        });
        if (focus) this.tabs[index].focus();
      }
    }
  );
}
