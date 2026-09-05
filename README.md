# Nasab Landing Page

Marketing site for **Nasab**, a living family archive app, hosted via
GitHub Pages at `nasab.tappstudio.in`.

## Status

**Phase 0 complete:** design tokens, brand assets, and a verified feature/pricing/copy
findings doc have been pulled from the [Nasab app repo](https://github.com/ibrahimbroachwala/nasab)
(`develop` branch) — see [`PHASE0_FINDINGS.md`](PHASE0_FINDINGS.md) for the full
write-up and [`css/tokens.css`](css/tokens.css) for the encoded design tokens.

**Phase 1 complete:** the page itself — hero, positioning statement, feature
showcase (Family Tree, Timeline, Memories, Elder Spotlight/nudges, Invite &
roles), pricing table (Nasab Roots vs Nasab Heritage), download CTAs, and
footer — all in `index.html` / `css/main.css` / `js/main.js`. Feature
imagery uses real App Store marketing screenshots (`assets/screenshots/`).

**Phase 3 (superseded):** the page originally ran a waitlist form
(`submitWaitlistEntry` in `js/main.js`) that inserted into a `waitlist`
table via the Supabase JS client — see
[`supabase/waitlist_migration.sql`](supabase/waitlist_migration.sql) for
the table + RLS policy (anon insert-only) that migration created. Now that
Nasab is published, the form has been removed in favor of direct App
Store / Google Play download links (see Phase 5 below); the migration file
is kept only as a historical record. Heritage plan pricing still isn't
final — the pricing table shows "Pricing coming soon" until real amounts
are confirmed from the RevenueCat dashboard (Phase 2, deferred).

**Phase 4 complete:** `/f/` is the ChottuLink invite-link fallback page —
shown in-browser when someone taps a `nasab.chottu.link/f/<code>` invite
link and doesn't have the app installed (the `link` destination set on
`ChottuLink.createDynamicLink(...)` in the app repo's `InviteShareScreen`
points here, as `/f/?code=<code>`). It fetches the inviting family's name
via a new anon-callable Supabase RPC (`preview_family_invite_public`, see
[`supabase/invite_preview_migration.sql`](supabase/invite_preview_migration.sql))
and shows the real App Store / Google Play download badges.

**Phase 5 complete:** Nasab is live on both stores. The waitlist funnel has
been retired everywhere — `index.html`'s hero and the (renamed)
`#download` section now link straight to the real store listings using the
official badge artwork (`assets/app-store-badge.svg`,
`assets/google-play-badge.png`), and every page's header CTA reads
"Download Nasab" → `/#download` instead of "Join the waitlist".

## Going live checklist

Historical — kept for reference; these steps have already been completed.

1. ~~Run `supabase/waitlist_migration.sql` in the Supabase SQL editor~~ —
   done; the waitlist table/form has since been retired from the site.
2. Run [`supabase/invite_preview_migration.sql`](supabase/invite_preview_migration.sql)
   in the Supabase SQL editor (needed for `/f/` to show the real family
   name instead of falling back to generic copy).
3. Push `develop` → `release` only on explicit confirmation — `release` is
   the branch connected to GitHub Pages / the live
   `nasab.tappstudio.in` domain.
4. `APP_STORE_URL` / `PLAY_STORE_URL` in `js/invite.js`, and the matching
   hrefs in `index.html` / `f/index.html`, are filled in with the real
   listing URLs.

## Structure

```
nasab-landing/
├── index.html
├── f/
│   └── index.html         — ChottuLink invite-link fallback page (nasab.tappstudio.in/f/?code=...)
├── PHASE0_FINDINGS.md   — colors, fonts, spacing, shipped features, pricing tiers, copy tone — all sourced from the app repo
├── css/
│   ├── tokens.css        — CSS custom properties mirroring lib/styles/ in the app repo exactly
│   └── main.css           — page layout & components, built on tokens.css
├── js/
│   ├── main.js             — scroll reveal, hero parallax, footer year
│   └── invite.js           — /f/ page: reads ?code=, fetches family name, real store badge links
└── assets/
    ├── brand/              — icon, plan illustrations, copied from the app repo
    ├── screenshots/         — real App Store marketing screenshots used for feature imagery
    ├── app-store-badge.svg — official "Download on the App Store" badge
    └── google-play-badge.png — official "Get it on Google Play" badge
```

## Design source of truth

Never invent a color, font, spacing value, feature claim, or price on this
site — pull it from the [Nasab app repo](https://github.com/ibrahimbroachwala/nasab)
the same way `PHASE0_FINDINGS.md` and `tokens.css` were built. If something
needed for the page (a screenshot, a real price, a new illustration) doesn't
exist there yet, flag it rather than guessing.

## Contact

tappstudio.in@gmail.com
