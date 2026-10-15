# Hand-off log

One line per hand-off, newest on top. Loop and rules: `/soda-tdm` skill (`~/projects/soda/skills/soda-tdm.md`).

```
date · from → to · branch · what changed / what's next
```

2026-09-29 · dan · refactor/foundations · ⚠️ Branch was merged to main by mistake (29cce5a) and reverted (93c53d4); live is unchanged. When this branch really ships: first run `git revert 93c53d4` on main, then merge, or the changes won't come back.
2026-09-29 · dan · refactor/foundations · Foundations layer: tdm-foundations.css tokens, Feature section (stats/cards/rows) replaces 3 forks, team grid blocks replace the AI block, footer + multicolumn + product extras cleaned. Merged Karla's Aliados work from main. Not live yet.
