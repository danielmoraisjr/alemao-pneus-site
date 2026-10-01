(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  $('#ano').textContent = new Date().getFullYear();

  /* ---------- revelar ao rolar ---------- */
  const scenes = $('.scenes');
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          // nas cenas fixas quem controla é o scroll, não o observer
          if (e.target.classList.contains('rise') && scenes.classList.contains('is-pinned')) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
    : null;
  $$('.reveal, .rise').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  /* ---------- cenas fixas (desktop) ---------- */
  const sceneEls = $$('.scene', scenes);
  const dots = $$('.scenes__dots i', scenes);
  const mqPin = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
  let active = 0;

  const setActive = (i) => {
    active = i;
    scenes.dataset.active = i;
    sceneEls.forEach((s, n) => s.classList.toggle('is-active', n === i));
    dots.forEach((d, n) => d.classList.toggle('on', n === i));
  };
  const applyPinMode = () => {
    scenes.classList.toggle('is-pinned', mqPin.matches);
    $$('.rise', scenes).forEach((el) => el.classList.remove('in'));
    if (mqPin.matches) {
      setActive(0);
    } else {
      sceneEls.forEach((s, n) => s.classList.toggle('is-active', n === 0));
      $$('.rise', scenes).forEach((el) => io && io.observe(el));
    }
    onScroll();
  };
  mqPin.addEventListener('change', applyPinMode);

  /* ---------- parallax, cena fixa, faixa, bichos espiando ---------- */
  const parallax = $$('.parallax');
  const peek = $('.peek');
  const track = $('.marquee__track');
  const float = $('.wa-float');
  let lastY = scrollY, vel = 0, ticking = false;

  function frame() {
    ticking = false;
    const vh = innerHeight;

    if (scenes.classList.contains('is-pinned')) {
      const r = scenes.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh), 0, 0.9999);
      const i = Math.floor(p * sceneEls.length);
      if (i !== active) setActive(i);
    }

    if (!reduced.matches && innerWidth > 900) {
      parallax.forEach((el) => {
        const sp = parseFloat(el.dataset.speed || '0');
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) * sp;
        el.style.setProperty('--py', off.toFixed(1) + 'px');
      });
    } else {
      parallax.forEach((el) => el.style.removeProperty('--py'));
    }

    if (peek) {
      const r = peek.getBoundingClientRect();
      const p = clamp((vh - r.top) / (r.height + vh * 0.35), 0, 1);
      peek.style.setProperty('--p', ((1 - p) * 105).toFixed(1) + '%');
    }

    if (float) float.classList.toggle('show', scrollY > vh * 0.6);

    // faixa acelera um pouco conforme a rolagem
    vel += (Math.abs(scrollY - lastY) - vel) * 0.2;
    lastY = scrollY;
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  // acelera/desacelera a faixa suavemente
  if (track && track.getAnimations && !reduced.matches) {
    const tick = () => {
      const a = track.getAnimations()[0];
      if (a) a.playbackRate = 1 + Math.min(vel * 0.35, 5);
      vel *= 0.94;
      requestAnimationFrame(tick);
    };
    tick();
  }

  applyPinMode();
})();
