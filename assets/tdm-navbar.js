/* Navbar (snippets/navbar.liquid). Ports PerfectlyRad Navbar behaviour: the shadow grows once the page scrolls,
   the mobile panel toggles with the menu button and closes on Escape, link click, outside click or when the
   viewport reaches the desktop breakpoint. Desktop disclosures (header-menu) also close on outside click. */
class TdmNavbar extends HTMLElement {
  connectedCallback() {
    this.bar = this.querySelector('.tdm-nav__bar');
    this.panel = document.getElementById(this.dataset.panel);
    this.toggles = Array.from(this.querySelectorAll('[data-nav-toggle]'));
    this.desktop = window.matchMedia('(min-width: 990px)');

    this.onScroll = () => this.bar.toggleAttribute('data-scrolled', window.scrollY > 8);
    this.onKeydown = (event) => event.key === 'Escape' && this.setOpen(false);
    this.onDocumentClick = (event) => {
      if (!this.contains(event.target)) {
        this.setOpen(false);
        this.closeDisclosures();
      }
    };
    this.onBreakpoint = () => this.desktop.matches && this.setOpen(false);

    this.onScroll();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('keydown', this.onKeydown);
    document.addEventListener('click', this.onDocumentClick);
    this.desktop.addEventListener('change', this.onBreakpoint);

    this.toggles.forEach((toggle) => {
      if (this.panel) toggle.setAttribute('aria-controls', this.panel.id);
      toggle.addEventListener('click', () => this.setOpen(this.panel.hidden));
    });
    this.panel?.addEventListener('click', (event) => event.target.closest('a') && this.setOpen(false));
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('click', this.onDocumentClick);
    this.desktop.removeEventListener('change', this.onBreakpoint);
  }

  setOpen(open) {
    if (!this.panel || this.panel.hidden === !open) return;
    this.panel.hidden = !open;
    this.bar.toggleAttribute('data-open', open);
    const [openToggle, closeToggle] = this.toggles;
    openToggle.hidden = open;
    closeToggle.hidden = !open;
    (open ? closeToggle : openToggle).focus({ preventScroll: true });
  }

  closeDisclosures() {
    this.querySelectorAll('header-menu').forEach((menu) => menu.close());
  }
}

customElements.define('tdm-navbar', TdmNavbar);
