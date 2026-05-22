(function() {
  'use strict';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lenis;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const navShell = document.getElementById('navShell');
  function onScrollNav() {
    if (window.scrollY > 60) navShell.classList.add('scrolled');
    else navShell.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  const particleHost = document.getElementById('particles');
  if (particleHost && !prefersReducedMotion) {
    const COUNT = 8;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const startX = 5 + Math.random() * 90;
      const startY = 60 + Math.random() * 40;
      const size = 3 + Math.random() * 4;
      p.style.left = startX + '%';
      p.style.top = startY + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      particleHost.appendChild(p);
      gsap.to(p, {
        y: -(window.innerHeight * 0.6 + Math.random() * 200),
        x: (Math.random() - 0.5) * 90,
        opacity: 0,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 4,
        repeat: -1,
        ease: 'sine.out',
        onRepeat: () => { gsap.set(p, { y: 0, x: 0, opacity: 0.95 }); }
      });
    }
  }

  if (window.gsap && window.ScrollTrigger) {
    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1, y: 0,
        duration: 0.9, ease: 'power3.out',
      });
    });

    gsap.fromTo('.hero .reveal',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
    );

    ScrollTrigger.create({
      trigger: '.step-card', start: 'top 80%', once: true,
      onEnter: () => {
        document.querySelectorAll('[data-step-icon]').forEach((icon, i) => {
          setTimeout(() => {
            icon.classList.add('pulse');
            gsap.fromTo(icon, { scale: 1 }, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
          }, i * 180);
        });
      }
    });

    document.querySelectorAll('.match-row').forEach((row, i) => {
      gsap.fromTo(row,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.1,
          scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    if (!prefersReducedMotion) {
      gsap.to('[data-parallax="0.6"]', {
        yPercent: 22, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('[data-parallax="0.3"]', {
        yPercent: 14, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    document.querySelectorAll('.slash-deco').forEach((sl) => {
      ScrollTrigger.create({
        trigger: sl, start: 'top 88%', once: true,
        onEnter: () => sl.classList.add('slashes-in')
      });
    });
  }

  if (!prefersReducedMotion && window.gsap) {
    gsap.to('#nextMatchCard', {
      y: -8, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
    document.querySelectorAll('[data-float]').forEach((el, i) => {
      gsap.to(el, {
        y: -4, duration: 2.4 + i * 0.3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.4,
      });
    });
    document.querySelectorAll('[data-feature]').forEach((tile) => {
      const icon = tile.querySelector('[data-float]');
      tile.addEventListener('mouseenter', () => {
        if (icon && gsap.getTweensOf(icon)[0]) gsap.getTweensOf(icon)[0].pause();
      });
      tile.addEventListener('mouseleave', () => {
        if (icon && gsap.getTweensOf(icon)[0]) gsap.getTweensOf(icon)[0].resume();
        gsap.to(tile, { rotateX: 0, rotateY: 0, duration: 0.4 });
      });
      tile.addEventListener('mousemove', (e) => {
        const r = tile.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(tile, {
          rotateY: x * 4, rotateX: -y * 4,
          transformPerspective: 800, duration: 0.4, ease: 'power2.out'
        });
      });
    });
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '$';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 1.4, ease: 'power2.out',
      onUpdate: () => { el.textContent = prefix + Math.round(obj.val); }
    });
  }
  document.querySelectorAll('.count-target').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 70%', once: true,
      onEnter: () => animateCount(el),
    });
  });

  if (!prefersReducedMotion && window.gsap) {
    const cta = document.getElementById('ctaMagnetic');
    if (cta) {
      const radius = 60;
      cta.addEventListener('mousemove', (e) => {
        const r = cta.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < radius * 2) {
          const power = Math.min(1, 1 - dist / (radius * 2));
          gsap.to(cta, { x: dx * 0.15 * power, y: dy * 0.15 * power, duration: 0.4, ease: 'power3.out' });
        }
      });
      cta.addEventListener('mouseleave', () => {
        gsap.to(cta, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    }
  }

  if (!prefersReducedMotion && !('ontouchstart' in window)) {
    const dot = document.getElementById('cursorDot');
    window.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      const target = document.elementFromPoint(e.clientX, e.clientY);
      let dark = false;
      if (target) {
        if (target.closest('.hero') || target.closest('.footer') || target.closest('.closing-card')) dark = true;
        const sec = target.closest('section.section');
        if (sec && sec.id === 'schedule') dark = true;
      }
      dot.classList.toggle('show', dark);
    }, { passive: true });
  }
})();
