/* TdmAnalytics — publishes CTA clicks as a Shopify customer event (`cta_click`).
   The GA4 custom pixel (Settings → Customer events) subscribes to it; nothing is sent to GA4 from the theme. */
(function () {
  'use strict';
  if (window.__tdmAnalytics) return;
  window.__tdmAnalytics = true;

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    if (window.Shopify && Shopify.analytics) Shopify.analytics.publish('cta_click', { track: el.getAttribute('data-track') });
  }, true);
})();
