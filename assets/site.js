// Tyron Freeman Edits: fade sections up once, and play the featured video in place on the real site.
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
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
