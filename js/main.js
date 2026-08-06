// Nasab landing page — vanilla JS, no build step, no dependencies.

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Supabase client ----------
 * Reuses the same Supabase project as the Nasab app (see
 * supabase/waitlist_migration.sql for the table + RLS policy to run there
 * first). Fill in the two placeholders below with that project's URL and
 * anon public key (Project Settings → API) before going live — the anon
 * key is safe to ship client-side, RLS on the `waitlist` table only allows
 * inserts, nothing else. */
const SUPABASE_URL = 'https://oajrqdeknihhyhzwnswj.supabase.co"';
const SUPABASE_ANON_KEY = 'sb_publishable_TlUh-EwbEjekZMXYkiQPWQ_w939aGAU';
const supabaseConfigured =
  SUPABASE_URL !== 'https://oajrqdeknihhyhzwnswj.supabase.co"' &&
  SUPABASE_ANON_KEY !== 'sb_publishable_TlUh-EwbEjekZMXYkiQPWQ_w939aGAU';
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
