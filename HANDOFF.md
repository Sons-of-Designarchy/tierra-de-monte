# Hand-off log

One line per hand-off, newest on top. Loop and rules: `/soda-tdm` skill (`~/projects/soda/skills/soda-tdm.md`).

```
date · from → to · branch · what changed / what's next
```

2026-10-11 · claude → dan · perfectlyrad/site · Aliados approval-ready: purchase-first flow (CTA → #pedido: products + steppers + live subtotal, pay enabled at $5,000 → Shopify checkout; GoHighLevel iframe is step 2 #registro), duplicate levels table removed ($10,000 gone), CTAs tracked, anchors same-page. Blockers for Dan: products are priced $0.00, page/redirect/menu steps in admin (see report).
2026-10-11 · claude → dan · perfectlyrad/site · QA of the whole site except Aliados (390/768/1280 + product → cart → checkout flow): animations.js cascade bug fixed (lost section CSS vars → giant icons), flat multicolumn contrast, display-font page titles, narrow reading widths, one ticker look on the home, tablet footer; shared-foundation issues listed in the report, see docs/migracion-sitio.md bitácora.
2026-10-11 · claude → dan · perfectlyrad/site · Commerce family ported to Liquid on the foundations (product-card everywhere incl. the home grid, card-grid-product with Shopify filters/sort, product-gallery + buy-box, one cart drawer + cart page, minimum-progress, pricing section); Dawn commerce pieces deleted. Single final review: docs/migracion-sitio.md §6, catalog ?view=foundations#commerce. Decisions for you listed in the report.
2026-10-11 · claude → dan · perfectlyrad/site · Whole site on the PerfectlyRad foundations (global, home, Aliados, content pages, blog, search, 404, password, customer pages; commerce tokens-only). Backlog + metrics in docs/migracion-sitio.md. Awaiting your review; junior continues from that doc. Main has newer admin commits: merge origin/main before shipping.
2026-10-11 · claude → dan · perfectlyrad/foundations · PerfectlyRad foundations (tokens, schemes, typography snippet, 22 atoms, catalog at ?view=foundations, docs/). Awaiting your review; it already contains the 93c53d4 revert (refactor/foundations is in main), so merging it to main is enough.
2026-09-29 · dan · refactor/foundations · ⚠️ Branch was merged to main by mistake (29cce5a) and reverted (93c53d4); live is unchanged. When this branch really ships: first run `git revert 93c53d4` on main, then merge, or the changes won't come back.
2026-09-29 · dan · refactor/foundations · Foundations layer: tdm-foundations.css tokens, Feature section (stats/cards/rows) replaces 3 forks, team grid blocks replace the AI block, footer + multicolumn + product extras cleaned. Merged Karla's Aliados work from main. Not live yet.
