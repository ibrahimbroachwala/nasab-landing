// Nasab invite fallback page (/f/) — vanilla JS, no build step.
//
// Reached when a ChottuLink invite short link (nasab.chottu.link/f/<code>)
// falls back to the browser because the app isn't installed (the `link`
// param set in the app's InviteShareScreen.createDynamicLink call — see
// the Nasab app repo). Reads ?code= off the URL, looks up the inviting
// family's name via a public Supabase RPC, and shows store download links.
//
// Same Supabase project/anon key the app itself uses — safe to ship
// client-side: RLS/grants restrict what the anon key can actually do (see
// supabase/preview_family_invite_public_migration.sql — grants EXECUTE on
// preview_family_invite_public to `anon` only, and that function returns
// nothing but a family name + validity flag).
const SUPABASE_URL = 'https://oajrqdeknihhyhzwnswj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TlUh-EwbEjekZMXYkiQPWQ_w939aGAU';

const APP_STORE_URL = 'https://apps.apple.com/us/app/nasab-the-family-archive/id6793519541';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.tappstudio.nasab';

const card = document.getElementById('invite-card');
const titleEl = document.getElementById('invite-title');
const bodyEl = document.getElementById('invite-body');
const openAppLink = document.getElementById('invite-open-app');
const appStoreBtn = document.getElementById('invite-app-store');
const playStoreBtn = document.getElementById('invite-play-store');

function showResult(title, body) {
  titleEl.textContent = title;
  bodyEl.textContent = body;
  card.classList.remove('is-loading');
}

/* ---------- Highlight the relevant store badge ----------
 * Both badges always show (the link may be opened on a desktop, or by
 * someone other than the invitee), but the platform actually being used
 * gets a subtle scale-up. Sniffing is best-effort only — defaults to
 * showing both badges equally weighted if inconclusive. The badge artwork
 * itself is never recolored or resized per Apple/Google brand guidelines;
 * only the wrapping link is emphasized (see .is-recommended in main.css). */
(function highlightPlatform() {
  const ua = window.navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) {
    appStoreBtn.classList.add('is-recommended');
  } else if (/Android/i.test(ua)) {
    playStoreBtn.classList.add('is-recommended');
  }
})();

const params = new URLSearchParams(window.location.search);
const code = (params.get('code') || '').trim().toUpperCase();

async function loadInvite() {
  if (!code) {
    showResult('Get the Nasab app', 'Download Nasab to create or join a family tree.');
    return;
  }

  // Lets someone who already has the app tap through directly instead of
  // going via the store — reopens the actual invite short link.
  openAppLink.href = 'https://nasab.chottu.link/f/' + encodeURIComponent(code);
  openAppLink.hidden = false;

  if (!window.supabase) {
    console.warn('Supabase JS failed to load — showing generic invite copy.');
    showResult("You're invited to join a family on Nasab", 'Download the app, then enter your invite code to join.');
    return;
  }

  let supabaseClient;
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    showResult("You're invited to join a family on Nasab", 'Download the app, then enter your invite code to join.');
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc('preview_family_invite_public', { p_token: code });
    const row = Array.isArray(data) ? data[0] : data;

    // No row at all — a genuinely unknown/malformed code, nothing more to
    // say about it.
    if (error || !row) {
      showResult('Invite not found', "This invite link isn't valid — ask your family member for a new one.");
      return;
    }

    // Row exists but is expired/exhausted — still show who it was from
    // (personalizes the ask-for-a-new-one nudge) when we have that data.
    if (!row.is_valid) {
      showResult(
        'This invite has expired',
        row.inviter_name
          ? 'Ask ' + row.inviter_name + ' to send you a new invite to the ' + row.family_name + ' family tree.'
          : 'Ask your family member to send you a new invite to the ' + row.family_name + ' family tree.'
      );
      return;
    }

    showResult(
      row.inviter_name
        ? row.inviter_name + ' invited you to the ' + row.family_name + ' family tree'
        : "You're invited to the " + row.family_name + ' family tree',
      "Nasab keeps your family's photos, memories, and story in one place — " +
        'built to grow for generations. Download the app, then use invite code ' +
        code +
        ' to join.'
    );
  } catch (err) {
    console.warn('Failed to load invite preview:', err);
    showResult("You're invited to join a family on Nasab", 'Download the app, then enter your invite code to join.');
  }
}

loadInvite();

document.getElementById('year').textContent = new Date().getFullYear();
