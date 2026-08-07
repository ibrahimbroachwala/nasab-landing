// Nasab landing page — vanilla JS, no build step, no dependencies.

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Scroll reveal for feature sections ----------
 * .reveal elements (see css/main.css) start visible by default so nothing
 * is hidden if this script fails to run. Only once IntersectionObserver is
 * confirmed available do we add .js-reveal-ready, which switches them to
 * hidden-until-scrolled-into-view — avoiding any flash of hidden content
 * for browsers without observer support. */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-reveal-ready');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(function (el) { observer.observe(el); });
})();

/* ---------- Positioning parallax ----------
 * Drifts the full-bleed photo in .positioning slower than the page scroll.
 * Skipped entirely under prefers-reduced-motion, and the scroll listener is
 * only attached while the section is actually in/near the viewport (via
 * IntersectionObserver) so it isn't running for the rest of the page's
 * scroll lifetime. rAF-throttled to avoid layout thrash. */
(function () {
  const section = document.querySelector('.positioning');
  const img = document.querySelector('[data-parallax]');
  if (!section || !img) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const MAX_OFFSET = 40; // px of travel in either direction
  let ticking = false;

  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const sectionCenter = rect.top + rect.height / 2;
    // Progress: 0 when the section's center is at the viewport's center,
    // ranging toward ±1 as it moves a full viewport-height away.
    const progress = (viewportCenter - sectionCenter) / window.innerHeight;
    const offset = Math.max(-1, Math.min(1, progress)) * MAX_OFFSET;
    img.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    });
  }, { rootMargin: '200px 0px' });

  observer.observe(section);
})();

/* ---------- Supabase client ----------
 * Reuses the same Supabase project as the Nasab app (see
 * supabase/waitlist_migration.sql for the table + RLS policy to run there
 * first). Fill in the two placeholders below with that project's URL and
 * anon public key (Project Settings → API) before going live — the anon
 * key is safe to ship client-side, RLS on the `waitlist` table only allows
 * inserts, nothing else. */
const SUPABASE_URL = 'https://oajrqdeknihhyhzwnswj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TlUh-EwbEjekZMXYkiQPWQ_w939aGAU';
const supabaseConfigured =
  SUPABASE_URL !== 'REPLACE_WITH_SUPABASE_URL' &&
  SUPABASE_ANON_KEY !== 'REPLACE_WITH_SUPABASE_ANON_KEY';
// Guarded rather than a direct call: if the CDN script above fails to load
// (ad-blocker, network hiccup), window.supabase won't exist — this must not
// throw and take the rest of the page's JS down with it.
let supabaseClient = null;
if (supabaseConfigured && window.supabase) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

/* ---------- Waitlist form ---------- */
(function () {
  const form = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('email');
  const honeypot = document.getElementById('company');
  const message = document.getElementById('waitlist-message');

  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showMessage(text, type) {
    message.textContent = text;
    message.className = 'form-message visible ' + type;
  }

  /**
   * Inserts the email into the `waitlist` table. A unique-constraint
   * violation (Postgres error code 23505 — already on the list) is treated
   * as a success, not an error, so repeat signups still see a friendly
   * message rather than a failure.
   */
  async function submitWaitlistEntry(email) {
    if (!supabaseClient) {
      console.warn('Supabase is not configured — fill in SUPABASE_URL / SUPABASE_ANON_KEY in js/main.js.');
      return { ok: false };
    }
    const { error } = await supabaseClient
      .from('waitlist')
      .insert({ email, source: 'landing_page' });
    if (!error) return { ok: true };
    if (error.code === '23505') return { ok: true, duplicate: true };
    return { ok: false };
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Honeypot: bots that fill hidden fields get a silent no-op success.
    if (honeypot && honeypot.value.trim() !== '') {
      showMessage("You're on the list.", 'success');
      form.reset();
      return;
    }

    const email = emailInput.value.trim();
    if (!EMAIL_RE.test(email)) {
      showMessage('That email address doesn’t look right — mind checking it?', 'error');
      emailInput.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const result = await submitWaitlistEntry(email);
      if (result.duplicate) {
        showMessage("You're already on the list — we'll be in touch.", 'success');
      } else if (result.ok) {
        showMessage("You're on the list. We'll be in touch.", 'success');
        form.reset();
      } else {
        showMessage('Something went wrong — please try again in a moment.', 'error');
      }
    } catch (err) {
      showMessage('Something went wrong — please try again in a moment.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
