/* Israel Impermeabilizações — comportamento do site (sem dependências) */
(() => {
  'use strict';

  const WA = '5514997340000'; // WhatsApp (DDI+DDD+número). Para trocar o número, ver README.
  const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 800));

  $('#year').textContent = new Date().getFullYear();

  /* ---------- cabeçalho, progresso e menu ---------- */
  const header = $('.site-header');
  const prog = $('.progress i');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      document.body.classList.toggle('past-hero', y > innerHeight * 0.7);
      const h = document.documentElement.scrollHeight - innerHeight;
      prog.style.setProperty('--p', h > 0 ? Math.min(1, y / h) : 0);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('.burger');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- aparecer ao rolar ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.remove('pre');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add('pre'); io.observe(el); }
    });
  }

  /* ---------- contadores ---------- */
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = +(el.dataset.dec || 0);
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1500);
        el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace('.', ',');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
  });

  /* ---------- brilho que segue o cursor nos cards ---------- */
  $$('.card').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`);
      c.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- chuva do hero 3D ---------- */
  const rainBtns = $$('.rain-ctl [data-rain]');
  rainBtns.forEach((b) => b.addEventListener('click', () => {
    rainBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    window.dispatchEvent(new CustomEvent('israel:rain', { detail: +b.dataset.rain }));
  }));

  // o 3D carrega depois da primeira pintura, para o site abrir rápido
  const stage = $('[data-hero3d]');
  const c = navigator.connection;
  const lite = c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''));
  if (stage && !lite) {
    const load = () => {
      const s = document.createElement('script');
      s.src = '/assets/js/hero3d.js';
      s.async = true;
      document.head.appendChild(s);
    };
    document.readyState === 'complete' ? idle(load) : addEventListener('load', () => idle(load), { once: true });
  }

  /* ---------- sistemas: manta x argamassa ---------- */
  const SYS = {
    manta: {
      desc: 'Manta pré-fabricada de asfalto que forma uma barreira contínua e uniforme contra a água. É o sistema mais usado em áreas grandes e expostas.',
      list: [
        ['Ideal para', 'lajes de cobertura, terraços, sacadas e telhados.'],
        ['Ponto forte', 'espessura uniforme de fábrica e alta resistência, ótima para grandes áreas.'],
        ['Como é feita', 'superfície regularizada, manta aplicada em faixas com sobreposição e proteção por cima.'],
      ],
      above: [['Acabamento / piso', 'piso', '#cfd9df', '#0b1a28'], ['Proteção mecânica', 'argamassa', '#98a7b0', '#06131d']],
      rest: [['Manta asfáltica', 'barreira', '#0a0f14', '#fff', true], ['Primer asfáltico', 'preparo', '#38434b', '#fff'], ['Laje de concreto', 'estrutura', '#66767f', '#fff']],
    },
    arg: {
      desc: 'Argamassa com aditivo impermeabilizante, aplicada em demãos sobre a superfície. Veda poros e fissuras e bloqueia a umidade.',
      list: [
        ['Ideal para', 'paredes, alicerces, baldrames, piscinas e áreas pequenas e molhadas.'],
        ['Ponto forte', 'aplicação prática e ótima aderência ao concreto e à alvenaria.'],
        ['Como é feita', 'superfície limpa e preparada, demãos cruzadas e respeito ao tempo de cura.'],
      ],
      above: [['Revestimento / acabamento', 'acabamento', '#cfd9df', '#0b1a28']],
      rest: [['2ª demão', 'barreira', '#27c2f7', '#03131f', true], ['1ª demão', 'barreira', '#0a8cc6', '#fff'], ['Superfície preparada', 'preparo', '#98a7b0', '#06131d'], ['Alvenaria / concreto', 'estrutura', '#66767f', '#fff']],
    },
  };
  const panel = $('#panel-sys');
  const stack = $('[data-f="layers"]');
  const lay = ([name, sub, bg, fg, bar], i) =>
    `<div class="lay${bar ? ' barrier' : ''}" style="background:${bg};color:${fg};height:${bar ? 64 : 52}px;animation-delay:${i * 70}ms">${name}<small>${sub}</small></div>`;
  const renderSys = (key, animate) => {
    const d = SYS[key];
    $('[data-f="desc"]').textContent = d.desc;
    $('[data-f="list"]').innerHTML = d.list.map(([k, v]) => `<li><svg aria-hidden="true"><use href="#i-check"/></svg><span><b>${k}:</b> ${v}</span></li>`).join('');
    const seep = '<div class="seep"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
    stack.innerHTML = `<div class="above">${d.above.map((l, i) => lay(l, i)).join('')}${seep}</div>${d.rest.map((l, i) => lay(l, i + 2)).join('')}`;
    if (animate) { panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); }
  };
  const tabs = $$('[role="tab"]');
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      tabs.forEach((x) => { x.setAttribute('aria-selected', String(x === t)); x.tabIndex = x === t ? 0 : -1; });
      panel.setAttribute('aria-labelledby', t.id);
      renderSys(t.dataset.sys, true);
    });
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); n.click();
    });
  });
  renderSys('manta', false);

  /* ---------- antes e depois (ilustração) ---------- */
  const ba = $('#ba');
  if (ba) {
    const range = $('.ba-range', ba);
    const set = (v) => { range.value = v; ba.style.setProperty('--pos', `${v}%`); };
    range.addEventListener('input', () => set(range.value));

    // manchas de mofo
    const ns = 'http://www.w3.org/2000/svg';
    const mold = $('#mold');
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    [[120, 70, 95], [250, 330, 70], [700, 60, 110], [415, 470, 150], [90, 420, 50]].forEach(([cx, cy, r]) => {
      for (let i = 0; i < 62; i++) {
        const a = rnd() * 6.283, d = Math.sqrt(rnd()) * r;
        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', (cx + Math.cos(a) * d * 1.3).toFixed(1));
        dot.setAttribute('cy', (cy + Math.sin(a) * d * 0.8).toFixed(1));
        dot.setAttribute('r', (0.9 + rnd() * 5.6).toFixed(1));
        dot.setAttribute('opacity', (0.3 + rnd() * 0.6).toFixed(2));
        if (rnd() > 0.72) dot.setAttribute('fill', '#4d5f3a');
        mold.appendChild(dot);
      }
    });

    // um aceno para mostrar que dá para arrastar
    if (!reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const keys = [[0, 50], [650, 14], [1500, 86], [2300, 50]];
        const t0 = performance.now();
        const ease = (p) => p * p * (3 - 2 * p);
        const frame = (t) => {
          const el = t - t0;
          for (let k = 1; k < keys.length; k++) {
            if (el <= keys[k][0]) {
              const [a, va] = keys[k - 1], [b, vb] = keys[k];
              set(va + (vb - va) * ease((el - a) / (b - a)));
              break;
            }
          }
          if (el < keys[keys.length - 1][0] && document.activeElement !== range) requestAnimationFrame(frame);
        };
        setTimeout(() => requestAnimationFrame(frame), 500);
      }, { threshold: 0.6 });
      io.observe(ba);
    }
  }

  /* ---------- sinais -> WhatsApp ---------- */
  const checks = $$('.checks input');
  const sCta = $('#sinais-cta');
  const list = (a) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} e ${a[a.length - 1]}` : a[0]);
  const updSinais = () => {
    const sel = checks.filter((i) => i.checked).map((i) => i.value);
    const base = 'Olá! Estou com problema de infiltração e gostaria de um orçamento.';
    sCta.href = wa(sel.length ? `${base} Estou vendo: ${list(sel)}.` : base);
    $('span', sCta).textContent = sel.length ? `Enviar ${sel.length} ${sel.length > 1 ? 'sinais' : 'sinal'} no WhatsApp` : 'Enviar no WhatsApp';
  };
  checks.forEach((i) => i.addEventListener('change', updSinais));

  /* ---------- produtos: filtro ---------- */
  const fbtn = $$('.filters button');
  fbtn.forEach((b) => b.addEventListener('click', () => {
    fbtn.forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    $$('.prod').forEach((p) => { p.hidden = b.dataset.f !== 'all' && p.dataset.cat !== b.dataset.f; });
  }));

  /* ---------- formulário -> WhatsApp ---------- */
  const form = $('#form');
  const note = $('#form-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const nome = (f.get('nome') || '').toString().trim();
    const servico = (f.get('servico') || '').toString();
    const local = (f.get('local') || '').toString().trim();
    const msg = (f.get('msg') || '').toString().trim();
    let ok = true;
    [['nome', nome], ['servico', servico]].forEach(([n, v]) => {
      const field = form.elements[n].closest('.fld');
      field.classList.toggle('err', !v);
      if (!v) ok = false;
    });
    if (!ok) { note.textContent = 'Preencha seu nome e o que precisa impermeabilizar.'; note.style.color = '#d93f3f'; return; }
    note.style.color = '';
    note.textContent = 'Abrindo o WhatsApp…';
    const linhas = [`Olá! Meu nome é ${nome}.`, `Gostaria de um orçamento: ${servico}.`];
    if (local) linhas.push(`Local: ${local}.`);
    if (msg) linhas.push(msg);
    linhas.push('Vim pelo site.');
    // link clicado de verdade: abre nova aba sem ser barrado como pop-up
    const a = document.createElement('a');
    a.href = wa(linhas.join('\n'));
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
  form.addEventListener('input', (e) => e.target.closest('.fld')?.classList.remove('err'));

  /* ---------- mapa sob demanda ---------- */
  const map = $('#map');
  $('.map-btn', map).addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = map.dataset.src;
    f.title = 'Mapa: Israel Impermeabilizações, R. Paulo Francisco de Barros, Botucatu – SP';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.allowFullscreen = true;
    map.replaceChildren(f);
  });
})();
