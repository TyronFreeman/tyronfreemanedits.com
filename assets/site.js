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
