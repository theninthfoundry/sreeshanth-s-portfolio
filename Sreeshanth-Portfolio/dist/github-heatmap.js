/* GitHub heatmap, live. Usage:
     <div id="gh"></div>
     <script src="github-heatmap.js"></script>
     <script>GitHubHeatmap.mount('#gh', { endpoint: 'https://gh-activity.YOURNAME.workers.dev', user: 'theninthfoundry' });</script>
   Data shape from the worker: { user, total, weeks: [[{ d:'2026-11-04', c:3, w:3 }, ...], ...] }  (d date, c count, w weekday 0=Sun) */
(() => {
  const TTL = 10 * 60 * 1000;
  const store = {
    get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const level = (n, max) => { if (!n) return 0; const r = n / max; return r <= .25 ? 1 : r <= .5 ? 2 : r <= .75 ? 3 : 4; };
  const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });

  function stats(days) {
    let best = 0, run = 0;
    for (const x of days) { run = x.c ? run + 1 : 0; if (run > best) best = run; }
    let cur = 0, i = days.length - 1;
    if (i >= 0 && !days[i].c) i--;               // today may not have a commit yet
    for (; i >= 0 && days[i].c; i--) cur++;
    return { best, cur };
  }

  function sample() {
    let sd = 7; const r = () => (sd = sd * 16807 % 2147483647) / 2147483647;
    const end = new Date(), start = new Date(end);
    start.setDate(end.getDate() - 364); start.setDate(start.getDate() - start.getDay());
    const weeks = []; let w = [], total = 0;
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const v = Math.sin(weeks.length / 5.5) + Math.sin(weeks.length / 11 + d.getDay() / 2.5) + r() * 1.6 - .5;
      const c = v < .2 ? 0 : Math.round(v * 4); total += c;
      w.push({ d: d.toISOString().slice(0, 10), c, w: d.getDay() });
      if (d.getDay() === 6) { weeks.push(w); w = []; }
    }
    if (w.length) weeks.push(w);
    return { total, weeks };
  }

  async function load(o, force) {
    const key = 'ghh:' + o.user, hit = store.get(key);
    if (!force && hit && Date.now() - hit.t < TTL) return hit.d;
    const res = await fetch(`${o.endpoint}?user=${encodeURIComponent(o.user)}`);
    if (!res.ok) throw new Error('GitHub endpoint ' + res.status);
    const d = await res.json();
    store.set(key, { t: Date.now(), d });
    return d;
  }

  function render(el, d, live, animate) {
    if (!d || !Array.isArray(d.weeks) || !d.weeks.length) d = sample();
    const days = d.weeks.flat(), max = Math.max(1, ...days.map((x) => x.c)), s = stats(days);
    let months = '', lastWi = -9, prev = -1;
    d.weeks.forEach((wk, i) => {
      const m = new Date(wk[0].d + 'T00:00:00').getMonth();
      if (m !== prev && i - lastWi >= 3) { months += `<span style="grid-column:${i + 1}">${new Date(2000, m).toLocaleString('en', { month: 'short' })}</span>`; lastWi = i; }
      prev = m;
    });
    const cells = d.weeks.map((wk, i) => wk.map((x) =>
      `<i data-l="${level(x.c, max)}" data-d="${x.d}" data-c="${x.c}" style="grid-column:${i + 1};grid-row:${x.w + 1};--c:${i}"></i>`).join('')).join('');
    const was = el.classList.contains('in');
    el.className = 'ghh' + (live ? ' live' : '') + (was || !animate ? ' in' : '');
    el.style.setProperty('--ghh-weeks', d.weeks.length);
    el.innerHTML =
      `<div class="ghh-top"><div><b>${d.total.toLocaleString()}</b><span>contributions in the last year</span></div>` +
      `<div><b>${s.cur}</b><span>day streak</span></div><div><b>${s.best}</b><span>longest streak</span></div></div>` +
      `<div class="ghh-scroll"><div class="ghh-months" aria-hidden="true">${months}</div>` +
      `<div class="ghh-grid" role="img" aria-label="${d.total} contributions in the last year">${cells}</div></div>` +
      `<div class="ghh-foot"><span><i class="ghh-dot"></i>${live ? 'Live from GitHub' : 'Sample data (GitHub unreachable)'}</span>` +
      `<span class="ghh-legend">Less <i data-l="0"></i><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><i data-l="4"></i> More</span></div>` +
      `<div class="ghh-tip"></div>`;
    const tip = el.querySelector('.ghh-tip');
    el.querySelector('.ghh-grid').addEventListener('pointerover', (e) => {
      const c = e.target.closest('i'); if (!c) return tip.classList.remove('on');
      const b = c.getBoundingClientRect(), p = el.getBoundingClientRect(), n = +c.dataset.c;
      tip.textContent = `${n} contribution${n === 1 ? '' : 's'} on ${fmt(c.dataset.d)}`;
      tip.style.left = b.left - p.left + b.width / 2 + 'px'; tip.style.top = b.top - p.top + 'px';
      tip.classList.add('on');
    });
    el.addEventListener('pointerleave', () => tip.classList.remove('on'));
    if (!el.classList.contains('in')) {          // play the reveal when it scrolls into view
      const io = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) { el.classList.add('in'); io.disconnect(); }
      }, { threshold: .2 });
      io.observe(el);
    }
  }

  function mount(target, opts) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const o = { refreshMs: TTL, ...opts };
    let shown = false;
    const run = async (force) => {
      try { render(el, await load(o, force), true, !shown); }
      catch (err) { console.warn('[GitHubHeatmap]', err); if (!shown) render(el, sample(), false, true); }
      shown = true;
    };
    run(false);
    // "Real time": re-pull while the tab is visible.
    setInterval(() => { if (!document.hidden) run(true); }, o.refreshMs);
  }

  window.GitHubHeatmap = { mount };
})();
