# Phase 0 Findings — Pulled from the Nasab App Repo

Source: `ibrahimbroachwala/nasab`, `develop` branch (commit `24b2526`), not `main` —
`main` is 475 files behind and missing the current subscription/pricing model,
Memory Albums, Member Groups, and other shipped features. Everything below was
verified directly against app source (Dart files, SQL migrations), not
guessed or carried over from older notes.

## Design tokens

See [`css/tokens.css`](css/tokens.css) for the encoded values. Source files in
the app repo:
- `lib/styles/app_colors.dart` — exact hex colors
- `lib/styles/app_text_styles.dart` — Fraunces (headings) / Inter (body) / Lora (captions, italic), via `google_fonts`
- `lib/styles/app_spacing.dart` — 8pt grid (4/8/16/24/32/48)
- `lib/styles/app_radii.dart` — small 4px, large 12px (see note in tokens.css: the file's own doc-comment claims "18-24px everywhere" but the shipped constant is 12px; code wins)
- `lib/styles/app_motion.dart` — 150/300/600ms, easeOutCubic entrance
- Shadows are inlined per-widget (no dedicated `app_shadows.dart`): card `black@8%`, photo-frame treatment (`FramedMediaBox`: 3px vintage-white margin + `black@12% blur 4`), memory card `black@8% blur 8`
- Buttons and app bars are flat (elevation 0) in-app — the landing page should stay similarly restrained: no glassmorphism, no bright gradients, no drop-shadow-heavy chrome.

## Brand assets

Copied into [`assets/brand/`](assets/brand/):

| File | Source (nasab repo) | Notes |
|---|---|---|
| `icon-1024.png` | `assets/icons/icon.png` | App icon, 1024×1024. Best available brand mark. |
| `hero-welcome.png` | `assets/png/welcome.png` | Largest illustration in the app (auth/welcome screen hero art). Candidate for the landing hero section. |
| `roots.png` | `assets/png/roots.png` (develop-only) | 750×375, used in-app for the Roots plan in the paywall/plan-comparison UI. Candidate for the pricing section. |
| `heritage.png` | `assets/png/heritage.png` (develop-only) | 750×375, used in-app for the Heritage plan. Candidate for the pricing section. |

**No wordmark or logo SVG exists anywhere in the app repo.** `flutter_svg` is a
dependency but no `.svg` asset files exist — the app only ships PNGs. Phase 1
will need to typeset "Nasab" as a wordmark directly in Fraunces (bold/600,
`--color-primary`) rather than looking for a source logo file.

## Feature set — confirmed shipped on `develop`

| Feature | Status | Notes |
|---|---|---|
| Family Tree | ✅ Shipped | Unlimited generations (no depth cap in `family_tree_builder.dart`). Vertical, horizontal, and radial view modes — **radial is a Heritage-only feature**, gate it correctly if mentioned. |
| Patronymic naming | ✅ Shipped | `lib/core/utils/patronymic_name_formatter.dart` — Arabic-tradition "{first} bin/bint {father's first} {father's last}" naming, toggleable per user. Real, worth a feature line. |
| Timeline | ✅ Shipped, auto-only | Strictly `birth \| death \| marriage` events, no manual event creation exists in code (`TimelineRepository` has no `createEvent`). Safe to advertise as "auto-generated." |
| Memories | ✅ Shipped | Photo/video/voice notes, captions, member tagging, comments, likes, visibility controls (family-wide or restricted to selected members). |
| Memory Albums | ✅ Shipped (new) | User-created themed collections, cover color, rendered as a "leather-bound book." **Capped at 10 on Roots (free), unlimited on Heritage.** Frame as "organize memories into themed albums" — no AI curation, no nested albums, don't oversell it. |
| Elder Spotlight | ✅ Shipped | Walks the paternal line only, detects missing father/spouse and nudges to add them. User-facing framing already exists in-app (see copy below) — reuse that register, not an "engine name." |
| Home gap-detection nudges | ✅ Shipped | 11 rule types (missing birth date, no photo, no voice notes, etc.), max 3 shown at once, closeness-ranked. |
| Invite & roles | ✅ Shipped | Owner/Member only. Multi-use invite codes (max_uses 200). Note: hard cap of 1 owned + 1 joined family per user — worth a FAQ line, not hero copy. |
| Member Groups | ✅ Shipped | Private, per-user saved shortcuts for tagging/visibility — minor, supporting feature, not hero-worthy. |
| Subscription/paywall | ✅ Shipped | See Pricing below. |

**Out-of-scope list re-confirmed clean on `develop`:** no OCR/face recognition,
no GEDCOM/PDF export, no offline sync/queueing, no dark mode, no AI features,
no admin dashboard, no web app. Landing copy must not imply any of these
exist or are coming soon.

## Pricing / plans — confirmed shipped on `develop`

**Real tier names:** **"Nasab Roots"** (free) and **"Nasab Heritage"** (paid).
DB values `free` / `heritage`; RevenueCat entitlement id `heritage`.
**"Legacy" is not a real tier** — it appears once in a migration comment
(`allow_premium_compression_for_heritage.sql`) as a tier that was planned but
never built. Do not use "Legacy" anywhere in copy.

Feature-gating matrix (source: `plan_comparison_sheet.dart` + the `plan_limits`
DB table, migration `20260817060000_add_subscription_plan_and_limits.sql`):

| Feature | Nasab Roots (Free) | Nasab Heritage |
|---|---|---|
| Shared storage | 500 MB | 20 GB |
| Upload quality | Efficient only | Efficient / Standard / Premium |
| Member voice notes | ✗ | ✓ |
| Video memories | ✗ | ✓ |
| Radial Tree View | ✗ | ✓ |
| Memory Albums | Capped at 10 | Unlimited |
| Tree generations | Unlimited | Unlimited (never gated on either plan) |
| Family roles/collaboration | Owner/Member | Owner/Member (same on both) |

**⚠️ No real price ($/₹ amount) exists anywhere in the app repo.** Pricing is
entirely delegated to RevenueCat's dashboard-built paywall UI — the app's
`AppPaywall` screen just wraps RevenueCat's `PaywallView` with no custom
copy/pricing in Dart. Planned product IDs exist
(`heritage.monthly` / `.3month` / `.annual`, each with a 14-day trial, per
`PHASE2_REVENUECAT_SETUP.md`) but **no price amounts are configured yet**.

**Action needed before Phase 2 (pricing table) ships:** confirm real prices
from the RevenueCat dashboard directly — this repo cannot supply them. Until
confirmed, the pricing section should show tier names + the feature matrix
above only, or a "pricing coming soon" placeholder — do not invent numbers.

## Copy tone reference (verbatim, from the app)

- "Every story starts somewhere." — Elder Spotlight headline, no parents recorded
- "The roots go deeper than this." / "This branch still has more to tell." / "Somewhere further back, a story waits." / "The line doesn't end here." / "Every branch has a beginning too." — Elder Spotlight headline variants, ancestor gaps
- "Add {name}'s Father to extend the line." — Elder Spotlight body copy
- "Every family has a\nfirst page." — Memories empty state headline
- "Start with one photo, one video, one memory - the rest will follow." — Memories empty state body
- "Preserve {name}'s voice before it's too late." — home nudge card
- "Nothing has been preserved for {name} yet." — home nudge card
- "Plant your first branch" — family tree empty state
- "Invite Your Family" / "Build the archive together" — home invite card
- "Unlock Heritage" / "Preserve more of your family's story" — trial/upgrade nudge card

Register: premium, archival, prose-heavy emotional framing, no exclamation
points, no startup/social-media tone. Landing page copy should match this
voice, not a generic SaaS register.

## Open items for Phase 1–3

1. **Wordmark**: no source file — typeset "Nasab" in Fraunces per the tokens above.
2. **Pricing amounts**: confirm real $/₹ figures from the RevenueCat dashboard before finalizing the Phase 2 pricing table copy.
3. **Screenshots**: no real app screenshots exist in this pull (only the illustrations copied above) — Phase 1 may want actual in-app screenshots of the tree/timeline/memories views rather than relying solely on `hero-welcome.png`.
