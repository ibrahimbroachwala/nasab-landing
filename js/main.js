// Nasab landing page — vanilla JS, no build step, no dependencies.

document.getElementById('year').textContent = new Date().getFullYear();

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
   * Stub submit handler — simulates a successful signup without a network
   * call. Phase 3 (Supabase integration) replaces the body of this function
   * with a real `supabase.from('waitlist').insert({ email })` call, keeping
   * the same success/duplicate/error branches below.
   */
  function submitWaitlistEntry(email) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true }), 450);
    });
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
