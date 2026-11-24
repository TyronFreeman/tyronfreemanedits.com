// Tyron Freeman Edits: fade sections up once, and play the featured video in place on the real site.
(function () {
  // The fade is an extra. It only switches on when the page is really on screen and the browser can do it;
  // otherwise everything simply shows. A safety timer shows anything still hidden after 4 seconds on screen.
  var els = document.querySelectorAll('.reveal');
  var ok = ('IntersectionObserver' in window) && document.visibilityState === 'visible' &&
           !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ok) {
    document.documentElement.classList.add('anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      var vh = window.innerHeight;
      els.forEach(function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add('in'); });
    }, 4000);
  }
  var host = location.hostname;
  var canEmbed = /(^|\.)tyronfreemanedits\.com$/.test(host) || /\.github\.io$/.test(host) || host === 'localhost';
  document.querySelectorAll('a[data-yt]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      if (!canEmbed) return; // elsewhere the link simply opens YouTube
      ev.preventDefault();
      var still = a.querySelector('.still');
      if (!still || still.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + a.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.title = a.getAttribute('data-title') || 'Video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      still.innerHTML = '';
      still.appendChild(f);
    });
  });
})();

// Which email did this visitor come from? A link like /?ref=tae carries a short name. It is passed on to the Apply page
// so the application says where it came from. No cookies; it only lives in this tab.
(function () {
  try {
    var m = /[?&]ref=([A-Za-z0-9_-]{1,40})/.exec(location.search);
    var ref = m ? m[1] : (sessionStorage.getItem('tfe_ref') || '');
    if (m) sessionStorage.setItem('tfe_ref', ref);
    if (!ref) return;
    document.querySelectorAll('a[href$="apply/"]').forEach(function (a) { a.href = a.href + '?ref=' + encodeURIComponent(ref); });
  } catch (e) {}
})();

// "Watch a recent edit" (round 4): scroll to the video frame and start it. Uses the same click the frame already has.
(function () {
  document.querySelectorAll('a[data-play]').forEach(function (b) {
    b.addEventListener('click', function (ev) {
      var f = document.querySelector('a.frame[data-yt]');
      if (!f) return;
      ev.preventDefault();
      try { f.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      f.click();
    });
  });
})();

// Round 11 (ACQ, 24 Nov 2026): same as round 10; the new Apply row under the hero video is data-cta="hero".
// Round 10 (Tyron, 24 Nov 2026): same as round 9.
// Round 9 (Tyron, 24 Nov 2026): same as round 8.
// Round 8 (Tyron, 23 Nov 2026): same as round 7, the button in the offer box is data-cta="offerbox".
// Round 6 (ACQ, 20 Nov 2026): remember where a visitor came from (the fades are the site's .reveal, once each).
// Source, referral and campaign come from the link they arrived on (?source=, ?ref=, ?campaign=, or utm_source / utm_campaign);
// the CTA is which Apply button they pressed. All four go to the Apply page, which hands them to the form. No cookies: this tab only.
(function () {
  try {
    var q = new URLSearchParams(location.search), ok = /^[A-Za-z0-9_-]{1,40}$/;
    var s = JSON.parse(sessionStorage.getItem('tfe_src') || '{}');
    var pick = { source: q.get('source') || q.get('utm_source'), ref: q.get('ref'), campaign: q.get('campaign') || q.get('utm_campaign'), prospect: q.get('prospect') };
    Object.keys(pick).forEach(function (k) { if (pick[k] && ok.test(pick[k])) s[k] = pick[k]; });
    if (!s.source) s.source = document.referrer ? 'web' : 'direct';
    sessionStorage.setItem('tfe_src', JSON.stringify(s));
    document.querySelectorAll('a[data-cta]').forEach(function (a) {
      a.addEventListener('click', function () {
        var u = new URL(a.href, location.href);
        ['source', 'ref', 'campaign', 'prospect'].forEach(function (k) { if (s[k]) u.searchParams.set(k, s[k]); });
        u.searchParams.set('cta', a.getAttribute('data-cta'));
        a.href = u.toString();
      });
    });
  } catch (e) {}
})();

// Round 7 (Tyron, 23 Nov 2026): the case-study numbers count up once when they come into view (the real number is already in
// the page, so without the script, or with reduced motion, it simply shows).
(function () {
  var els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  els.forEach(function (b) {
    var end = +b.getAttribute('data-count'), done = false;
    var io = new IntersectionObserver(function (es) {
      if (done || !es[0].isIntersecting) return; done = true; io.disconnect();
      var t0 = null, dur = 1100;
      b.textContent = '+0%';
      function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        b.textContent = '+' + Math.round(end * e) + '%'; if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(b);
  });
})();
