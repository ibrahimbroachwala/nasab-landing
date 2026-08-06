# Nasab Landing Page

Marketing/waitlist site for **Nasab**, a living family archive app, hosted via
GitHub Pages at `nasab.tappstudio.in`.

## Status

**Phase 0 complete:** design tokens, brand assets, and a verified feature/pricing/copy
findings doc have been pulled from the [Nasab app repo](https://github.com/ibrahimbroachwala/nasab)
(`develop` branch) — see [`PHASE0_FINDINGS.md`](PHASE0_FINDINGS.md) for the full
write-up and [`css/tokens.css`](css/tokens.css) for the encoded design tokens.

**Not yet built:** the actual page (hero, feature showcase, pricing table,
waitlist form, footer) — that's Phase 1–3 of the landing page plan, a
separate follow-up task. This repo currently ships no `index.html`.

## Structure

```
nasab-landing/
├── PHASE0_FINDINGS.md   — colors, fonts, spacing, shipped features, pricing tiers, copy tone — all sourced from the app repo
├── css/
│   └── tokens.css        — CSS custom properties mirroring lib/styles/ in the app repo exactly
└── assets/
    └── brand/             — brand assets copied from the app repo (icon, hero art, plan illustrations)
```

## Design source of truth

Never invent a color, font, spacing value, feature claim, or price on this
site — pull it from the [Nasab app repo](https://github.com/ibrahimbroachwala/nasab)
the same way `PHASE0_FINDINGS.md` and `tokens.css` were built. If something
needed for the page (a screenshot, a real price, a new illustration) doesn't
exist there yet, flag it rather than guessing.

## Contact

tappstudio.in@gmail.com
