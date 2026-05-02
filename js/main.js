/* ============ MAIN.JS — Lenis + GSAP + interactions (v2.5 all-out) ============ */
(function () {
  // ---- Lenis smooth scroll ----
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.5 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    window.__lenis = lenis;
  }

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // ---- Loader ----
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const bar = document.getElementById('loader-bar');
    if (!loader) return;
    if (bar) bar.style.transition = 'width 1.2s cubic-bezier(.65,0,.35,1)', requestAnimationFrame(() => bar.style.width = '100%');
    setTimeout(() => {
      loader.style.transition = 'opacity 0.7s ease-out';
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }, 1300);
  });

  // ---- Nav scroll state ----
  const nav = document.getElementById('nav');
  if (nav) {
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 80);
      last = y;
    }, { passive: true });
  }

  // ---- Mobile menu ----
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  // ---- Reveals via IntersectionObserver (more reliable than ScrollTrigger for simple fades) ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  // ---- Hero scroll-pinned crossfade (image OR video) ----
  if (window.gsap && window.ScrollTrigger) {
    const heroSection = document.getElementById('hero');
    const before = document.getElementById('hero-before');
    const after = document.getElementById('hero-after');
    const heroVid = document.getElementById('hero-video');
    const scrub = document.getElementById('hero-scrub');

    if (heroSection && (before || heroVid)) {
      ScrollTrigger.create({
        trigger: heroSection, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (after) after.style.opacity = p;
          if (before) {
            before.style.transform = `scale(${1 + p * 0.06})`;
          }
          if (after) after.style.transform = `scale(${1.06 - p * 0.06})`;
          if (heroVid && heroVid.duration) heroVid.currentTime = p * heroVid.duration;
          if (scrub) scrub.style.width = (p * 100) + '%';
        }
      });
    }

    // ---- Generic scroll-bound video (any [data-scroll-vid] section) ----
    document.querySelectorAll('[data-scroll-vid]').forEach(section => {
      const vid = section.querySelector('video');
      if (!vid) return;
      vid.addEventListener('loadedmetadata', () => {
        ScrollTrigger.create({
          trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.5,
          onUpdate: (self) => { if (vid.duration) vid.currentTime = self.progress * vid.duration; }
        });
      });
      // fallback if metadata already loaded
      if (vid.readyState >= 1) vid.dispatchEvent(new Event('loadedmetadata'));
    });

    // ---- Parallax images ----
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      gsap.to(el, {
        yPercent: -speed * 30, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  // ---- Stat counters (IntersectionObserver, no GSAP dep) ----
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.counter, 10);
        const dur = 2200, start = performance.now();
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

  // ---- Tilt + magnetic ----
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
  document.querySelectorAll('.btn-magnetic').forEach((b) => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      b.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // ---- Lazy autoplay videos (only when in viewport, save bandwidth) ----
  const vio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) v.play().catch(()=>{});
      else v.pause();
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('video[data-autoplay]').forEach(v => vio.observe(v));
})();
