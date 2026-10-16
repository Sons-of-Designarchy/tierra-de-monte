/* Marks <html> while the theme editor is open (moved out of layout/theme.liquid). */
if (window.Shopify && Shopify.designMode) {
  document.documentElement.classList.add('shopify-design-mode');
}
