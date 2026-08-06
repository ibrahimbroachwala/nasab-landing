# Nasab Landing Page

Marketing/waitlist site for **Nasab**, a living family archive app, hosted via
GitHub Pages at `nasab.tappstudio.in`.

## Status

**Phase 0 complete:** design tokens, brand assets, and a verified feature/pricing/copy
findings doc have been pulled from the [Nasab app repo](https://github.com/ibrahimbroachwala/nasab)
(`develop` branch) — see [`PHASE0_FINDINGS.md`](PHASE0_FINDINGS.md) for the full
write-up and [`css/tokens.css`](css/tokens.css) for the encoded design tokens.

**Phase 1 complete:** the page itself — hero, positioning statement, feature
showcase (Family Tree, Timeline, Memories, Elder Spotlight/nudges, Invite &
roles), pricing table (Nasab Roots vs Nasab Heritage), waitlist form, and
footer — all in `index.html` / `css/main.css` / `js/main.js`. Feature
imagery uses real App Store marketing screenshots (`assets/screenshots/`).

**Not yet wired up:** the waitlist form currently uses a stub submit handler
(`submitWaitlistEntry` in `js/main.js`) — no real Supabase call yet. That's
Phase 3, a separate follow-up task. Heritage plan pricing also isn't final —
the pricing table shows "Pricing coming soon" until real amounts are
confirmed from the RevenueCat dashboard.

## Structure

```
nasab-landing/
├── index.html
├── PHASE0_FINDINGS.md   — colors, fonts, spacing, shipped features, pricing tiers, copy tone — all sourced from the app repo
├── css/
│   ├── tokens.css        — CSS custom properties mirroring lib/styles/ in the app repo exactly
│   └── main.css           — page layout & components, built on tokens.css
├── js/
│   └── main.js             — waitlist form validation/stub-submit, footer year
└── assets/
    ├── brand/              — icon, plan illustrations, copied from the app repo
    └── screenshots/         — real App Store marketing screenshots used for feature imagery
```

## Design source of truth

Never invent a color, font, spacing value, feature claim, or price on this
site — pull it from the [Nasab app repo](https://github.com/ibrahimbroachwala/nasab)
the same way `PHASE0_FINDINGS.md` and `tokens.css` were built. If something
needed for the page (a screenshot, a real price, a new illustration) doesn't
exist there yet, flag it rather than guessing.

## Contact

tappstudio.in@gmail.com
