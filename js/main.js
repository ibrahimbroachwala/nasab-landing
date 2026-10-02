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

/* ---------- Screenshot rail + lightbox ----------
 * Each .shot is a button that opens its image in a full-screen preview.
 * Focus moves to the close button while it's open and returns to the shot
 * afterwards. The desktop arrow buttons page the rail by one viewport. */
(function () {
  const rail = document.getElementById('rail');
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const close = document.getElementById('lightboxClose');
  if (!rail || !box || !img || !close) return;
  let last = null;

  function open(src, alt, trigger) {
    last = trigger;
    img.src = src;
    img.alt = alt || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function hide() {
    box.classList.remove('open');
    img.src = '';
    document.body.style.overflow = '';
    if (last) { last.focus(); last = null; }
  }

  rail.querySelectorAll('.shot').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const i = btn.querySelector('img');
      open(i.currentSrc || i.src, i.alt, btn);
    });
  });

  close.addEventListener('click', hide);
  box.addEventListener('click', function (e) { if (e.target === box) hide(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') hide();
    // Only the close button is focusable inside the dialog, so keep focus on it.
    if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
  });

  const buttons = document.querySelectorAll('[data-rail]');
  function syncButtons() {
    const max = rail.scrollWidth - rail.clientWidth - 2;
    buttons.forEach(function (b) {
      b.disabled = b.dataset.rail === '-1' ? rail.scrollLeft <= 2 : rail.scrollLeft >= max;
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      rail.scrollBy({ left: Number(b.dataset.rail) * rail.clientWidth * 0.8, behavior: 'smooth' });
    });
  });
  rail.addEventListener('scroll', syncButtons, { passive: true });
  window.addEventListener('resize', syncButtons);
  syncButtons();
})();
