/* ============ MAIN.JS — anti-slop, IO-based, no GSAP weight ============ */
(function () {
  // ---- Lenis smooth scroll ----
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.5 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.__lenis = lenis;
  }

  // ---- Nav scroll state ----
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Active nav link ----
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // ---- Mobile menu ----
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  // ---- Reveals via IntersectionObserver ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  // ---- Stat counters ----
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.counter, 10);
        const dur = 1800, start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('nl-BE');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-counter]').forEach(el => cio.observe(el));

  // ---- Lazy autoplay videos (only when in viewport) ----
  const vio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) v.play().catch(()=>{});
      else v.pause();
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('video[autoplay], video[data-autoplay]').forEach(v => vio.observe(v));

  // ---- Tilt (subtle) ----
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();
