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

  // ---- HOW IT WORKS: scroll-pinned narrative sync ----
  // As the user scrolls, the step closest to the viewport center becomes "active",
  // and the matching sticky visual fades in. Uses IntersectionObserver rootMargin trick:
  // steps become active when their center crosses the middle 20% of the viewport.
  const steps = document.querySelectorAll('.hiw-step');
  const visuals = document.querySelectorAll('.hiw-visual');
  if (steps.length && visuals.length) {
    // Init: first step active so the section renders something before scroll
    const setActive = (n) => {
      steps.forEach(s => s.classList.toggle('active', s.dataset.step === n));
      visuals.forEach(v => v.classList.toggle('active', v.dataset.step === n));
    };
    setActive('1');

    const hio = new IntersectionObserver((entries) => {
      // Among all currently intersecting steps, pick the one whose center is closest to
      // the viewport center. This avoids the "two steps both active" flicker.
      const intersecting = entries.filter(e => e.isIntersecting);
      if (!intersecting.length) return;
      let best = null, bestDist = Infinity;
      intersecting.forEach(e => {
        const r = e.target.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(window.innerHeight / 2 - center);
        if (dist < bestDist) { bestDist = dist; best = e.target; }
      });
      if (best) setActive(best.dataset.step);
    }, {
      // Narrow band through the middle of the viewport — steps become "active" as they cross this line
      rootMargin: '-40% 0px -40% 0px',
      threshold: [0, 0.5, 1]
    });
    steps.forEach(s => hio.observe(s));

    // Also sync on direct scroll (smooth fallback when Lenis suppresses IO frames)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        let best = null, bestDist = Infinity;
        steps.forEach(s => {
          const r = s.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(window.innerHeight / 2 - center);
          if (dist < bestDist && r.top < window.innerHeight && r.bottom > 0) {
            bestDist = dist; best = s;
          }
        });
        if (best && best.dataset.step) setActive(best.dataset.step);
      });
    }, { passive: true });
  }
})();
