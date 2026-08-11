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

**Phase 3 complete:** the waitlist form (`submitWaitlistEntry` in
`js/main.js`) now inserts into a `waitlist` table via the Supabase JS client,
reusing the same Supabase project as the Nasab app — see
[`supabase/waitlist_migration.sql`](supabase/waitlist_migration.sql) for the
table + RLS policy (anon insert-only). Credentials are left as placeholders
(`SUPABASE_URL` / `SUPABASE_ANON_KEY` in `js/main.js`) — see "Going live
checklist" below. Heritage plan pricing still isn't final — the pricing
table shows "Pricing coming soon" until real amounts are confirmed from the
RevenueCat dashboard (Phase 2, deferred).

**Phase 4 complete:** `/f/` is the ChottuLink invite-link fallback page —
shown in-browser when someone taps a `nasab.chottu.link/f/<code>` invite
link and doesn't have the app installed (the `link` destination set on
`ChottuLink.createDynamicLink(...)` in the app repo's `InviteShareScreen`
points here, as `/f/?code=<code>`). It fetches the inviting family's name
via a new anon-callable Supabase RPC (`preview_family_invite_public`, see
[`supabase/invite_preview_migration.sql`](supabase/invite_preview_migration.sql))
and shows App Store / Google Play download buttons. Those buttons are
**placeholders** (`APP_STORE_URL` / `PLAY_STORE_URL` in `js/invite.js`,
both `'#'`) until Nasab is actually published — same TODO as the app
repo's `settings_screen.dart` `_appStoreId` placeholder.

## Going live checklist

1. Run [`supabase/waitlist_migration.sql`](supabase/waitlist_migration.sql)
   in the Supabase SQL editor of the app's existing Supabase project.
2. Fill in `SUPABASE_URL` / `SUPABASE_ANON_KEY` near the top of
   `js/main.js` with that project's URL and anon public key
   (Project Settings → API). Never use the service role key here.
3. Test the waitlist form end-to-end against the real table (including a
   repeat signup, which should still show a friendly "already on the list"
   message rather than an error).
4. When ready, push `develop` → `release` — only `release` is connected to
   GitHub Pages / the live `nasab.tappstudio.in` domain. Do this only on
   explicit confirmation, never as a side effect of routine `develop` work.
5. Run [`supabase/invite_preview_migration.sql`](supabase/invite_preview_migration.sql)
   in the same SQL editor (needed for `/f/` to show the real family name
   instead of falling back to generic copy).
6. Once Nasab is published, fill in `APP_STORE_URL` / `PLAY_STORE_URL` near
   the top of `js/invite.js` with the real listing URLs.

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
│   ├── main.js             — waitlist form validation/stub-submit, footer year
│   └── invite.js           — /f/ page: reads ?code=, fetches family name, store button placeholders
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
