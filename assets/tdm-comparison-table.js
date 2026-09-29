/* =============================================================================
   Comparison table scroll affordances (sections/comparison-table.liquid)
   Toggles is-scrollable / is-end / is-scrolled on the .ct-scroll wrapper so the
   CSS can show the edge gradient and the sticky-first-column shadow.
   Each section instance loads this file with its own <script> tag, so guard
   against wiring the same block twice when more than one instance is on the page.
   ========================================================================== */

document.querySelectorAll('[id^="CtBlock-"]').forEach(function (block) {
  if (block.dataset.ctInit) return;
  block.dataset.ctInit = 'true';

  var outer = block.querySelector('.ct-scroll');
  var wrap = block.querySelector('.ct-wrapper');
  if (!outer || !wrap) return;

  function update() {
    var scrollable = wrap.scrollWidth > wrap.clientWidth + 2;
    var atEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2;
    block.classList.toggle('is-scrollable', scrollable);
    outer.classList.toggle('is-scrollable', scrollable);
    outer.classList.toggle('is-end', atEnd);
    outer.classList.toggle('is-scrolled', wrap.scrollLeft > 2);
  }

  wrap.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(wrap);
  update();
});
