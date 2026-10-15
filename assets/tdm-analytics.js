/* TdmAnalytics — launch tracking (scorecard row 16). Docs: docs/tracking.md.
   Never throws, never blocks. No-op if there is nowhere to send events.
   Events: aliados_view, aliados_cta_click, aliados_registro, add_to_cart, begin_checkout.
   Purchase is NOT here: it comes from Shopify Customer events (docs/tracking.md). */
(function () {
  'use strict';
  if (window.__tdmAnalytics) return;
  window.__tdmAnalytics = true;

  var host = document.querySelector('meta[name="tdm-analytics"]');
  var gaId = (host && host.dataset.gaId) || '';
  var template = (host && host.dataset.template) || '';
  var currency = (host && host.dataset.currency) || 'MXN';
  var isAliados = template.indexOf('aliados') !== -1;

  window.dataLayer = window.dataLayer || [];

  // Only when a measurement ID is set in theme settings and no gtag exists yet.
  if (gaId && !/^G-[A-Z0-9]+$/.test(gaId)) gaId = '';
  if (gaId && typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
    try {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
      document.head.appendChild(s);
      window.gtag('js', new Date());
      window.gtag('config', gaId);
    } catch (e) {}
  }

  function track(name, params) {
    try {
      params = params || {};
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      else window.dataLayer.push(Object.assign({ event: name }, params));
      if (/[?&]tdm_debug=1/.test(location.search)) console.info('[tdm-analytics]', name, params);
    } catch (e) {}
  }
  window.tdmTrack = track;

  function item(i) {
    var qty = i.quantity || 1;
    return {
      item_id: String(i.product_id || i.id || ''),
      item_variant: String(i.variant_id || i.id || ''),
      item_name: i.product_title || i.title || '',
      price: typeof i.final_price === 'number' ? i.final_price / 100 : undefined,
      quantity: qty,
    };
  }

  // 1. Aliados page view
  if (isAliados) track('aliados_view', { page_location: location.href });

  // 2. CTA clicks: any element with data-track="quiero-ser-aliado" (value goes in cta_id)
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (el) {
      track('aliados_cta_click', {
        cta_id: el.getAttribute('data-track'),
        link_text: (el.textContent || '').trim().slice(0, 80),
      });
    }
    // 4b. begin_checkout from a checkout link/button
    var co = e.target.closest && e.target.closest('[name="checkout"], a[href^="/checkout"]');
    if (co) beginCheckout();
  }, true);

  var lastCheckout = 0;
  function beginCheckout() {
    if (Date.now() - lastCheckout < 1500) return;
    lastCheckout = Date.now();
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        track('begin_checkout', {
          currency: c.currency || currency,
          value: (c.total_price || 0) / 100,
          items: (c.items || []).map(item),
        });
      })
      .catch(function () { track('begin_checkout', { currency: currency }); });
  }
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.matches && f.matches('form[action$="/cart"]') && (e.submitter && e.submitter.name === 'checkout')) beginCheckout();
  }, true);

  // 3. LeadConnector / GoHighLevel form submit. ASSUMPTION: form_embed.js iframe posts window
  // messages to the parent; on submit the payload mentions "form-submitted"/"set-sticky-contacts"
  // style keys (string, array or object). We match loosely and de-duplicate. Verify with ?tdm_debug=1.
  var lastReg = 0;
  window.addEventListener('message', function (e) {
    try {
      if (!/(leadconnectorhq\.com|msgsndr\.com|gohighlevel\.com)$/.test(new URL(e.origin).hostname)) return;
      var raw = typeof e.data === 'string' ? e.data : JSON.stringify(e.data);
      if (/[?&]tdm_debug=1/.test(location.search)) console.info('[tdm-analytics] lc message', raw.slice(0, 300));
      if (!/form[-_ ]?submit|formsubmit|submitted|set-sticky-contacts|booking[-_ ]?confirmed/i.test(raw)) return;
      if (Date.now() - lastReg < 3000) return;
      lastReg = Date.now();
      track('aliados_registro', { form: 'leadconnector' });
    } catch (err) {}
  });

  // 4a. add_to_cart: observe the theme's Ajax Cart calls (works for quick-add, buy-box, and Dawn-style forms)
  if (typeof window.fetch === 'function') {
    var nativeFetch = window.fetch;
    window.fetch = function (input, init) {
      var p = nativeFetch.apply(this, arguments);
      try {
        var url = typeof input === 'string' ? input : (input && input.url) || '';
        if (/\/cart\/add(\.js)?(\?|$)/.test(url)) {
          p.then(function (res) {
            if (!res.ok) return;
            res.clone().json().then(function (d) {
              var items = d.items || (d.variant_id ? [d] : []);
              if (!items.length) return;
              var mapped = items.map(item);
              track('add_to_cart', {
                currency: currency,
                value: mapped.reduce(function (t, i) { return t + (i.price || 0) * i.quantity; }, 0),
                items: mapped,
              });
            }).catch(function () {});
          }).catch(function () {});
        }
      } catch (err) {}
      return p;
    };
  }
})();
