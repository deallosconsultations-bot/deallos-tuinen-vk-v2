/* ============ MAIN.JS — Lenis + GSAP + interactions ============ */
(function () {
  const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ============ Loader ============ */
  window.addEventListener('load', () => {
    const bar = document.getElementById('loader-bar');
    const loader = document.getElementById('loader');
    if (!loader) return;
    if (bar) gsap.to(bar, { width: '100%', duration: 1.2, ease: 'power2.inOut' });
    setTimeout(() => {
      gsap.to(loader, { opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => loader.remove() });
    }, 1400);
  });

  /* ============ Nav scroll state ============ */
  const nav = document.getElementById('nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 50)
    });
  }

  /* ============ Hero scroll-pinned crossfade ============ */
  const before = document.getElementById('hero-before');
  const after = document.getElementById('hero-after');
  const scrub = document.getElementById('hero-scrub');
  const heroVid = document.getElementById('hero-video');

  if (before && after && document.getElementById('hero')) {
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        after.style.opacity = self.progress;
        before.style.transform = `scale(${1 + self.progress * 0.08})`;
        after.style.transform = `scale(${1.08 - self.progress * 0.08})`;
        if (scrub) scrub.style.width = (self.progress * 100) + '%';
        if (heroVid && heroVid.duration) {
          heroVid.currentTime = self.progress * heroVid.duration;
        }
      }
    });
  }

  // Try to enable video version once it loads
  if (heroVid) {
    heroVid.addEventListener('loadedmetadata', () => {
      heroVid.classList.remove('hidden');
      heroVid.style.opacity = '1';
      before.style.opacity = '0';
      after.style.opacity = '0';
    });
  }

  /* ============ Fade-up entrances ============ */
  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ============ Stat counters ============ */
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseInt(el.dataset.counter, 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(obj, { v: target, duration: 2.2, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('nl-BE'); } });
      }
    });
  });

  /* ============ 3D tilt ============ */
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();
