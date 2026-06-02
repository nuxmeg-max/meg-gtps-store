// ============================================================
//  main.js — GTPS Lock Store
// ============================================================

let testiData = [];
let gtpsData  = [];
let selectedGtps = null;

// Music state
let audioEl    = null;
let trackIdx   = 0;
let isPlaying  = false;
let widgetOpen = false;

// ─── BOOT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initCursor();
  buildSidebar();
  initBanner();
  buildStats();
  buildFAQ();
  buildOtherProducts();
  initMusicWidget();
  initModal();
  updateFooter();

  try {
    const [tRes, gRes] = await Promise.all([
      fetch(CONFIG.paths.testimonials),
      fetch(CONFIG.paths.gtps),
    ]);
    testiData = await tRes.json();
    gtpsData  = await gRes.json();
    buildGTPS();
    buildTestimonials();
  } catch (err) {
    console.error('[LockStore] Data load error:', err);
  }

  setTimeout(() => {
    const ld = document.getElementById('loading');
    ld.classList.add('out');
    setTimeout(() => ld.remove(), 500);
  }, 900);
});

// ─── CURSOR ──────────────────────────────────────────────────
function initCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const hoverSel = 'a, button, [data-hover], .gtps-card, .lock-card, .faq-q, .prod-card, .testi-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
  });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

// ─── SIDEBAR ─────────────────────────────────────────────────
function buildSidebar() {
  const nav  = document.getElementById('sb-nav');
  const waEl = document.getElementById('sb-wa');

  CONFIG.nav.forEach(item => {
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'sb-link';
    a.dataset.label = item.label;
    a.innerHTML = `<i class="${item.icon}"></i>`;
    nav.appendChild(a);
  });

  if (waEl) waEl.href = `https://wa.me/${CONFIG.store.waNumber}`;

  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.sb-link').forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id)
      );
    });
  }, { threshold: 0.35 });
  sections.forEach(s => io.observe(s));
}

// ─── BANNER ──────────────────────────────────────────────────
function initBanner() {
  const vid = document.getElementById('banner-video');
  if (vid) {
    vid.src = CONFIG.banner.videoPath;
    vid.muted = true;
    vid.loop = true;
    vid.autoplay = true;
    vid.playsInline = true;
    vid.play().catch(() => {});
  }
}

// ─── STATS ───────────────────────────────────────────────────
function buildStats() {
  const grid = document.getElementById('stats-grid');
  CONFIG.stats.forEach(s => {
    const el = document.createElement('div');
    el.className = 'stat-card';
    el.innerHTML = `
      <div class="stat-icon"><i class="${s.icon}"></i></div>
      <div class="stat-val">${s.value}</div>
      <div class="stat-lbl">${s.label}</div>`;
    grid.appendChild(el);
  });
}

// ─── GTPS ────────────────────────────────────────────────────
function buildGTPS() {
  const grid = document.getElementById('gtps-grid');
  grid.innerHTML = '';

  gtpsData.forEach(g => {
    const card = document.createElement('div');
    card.className = 'gtps-card';
    card.dataset.id = g.id;

    const spark = sparklineSVG(g.priceHistory.wl, 300, 44);

    const chips = g.locks.map(l =>
      `<span class="gc-chip"><i class="${l.icon}"></i>${shortLockName(l.name)}: ${fmtPrice(l.price, l.unit)}</span>`
    ).join('');

    card.innerHTML = `
      <div class="gc-img-wrap">
        <div class="gc-img-placeholder" id="gc-ph-${g.id}"><i class="fa-solid fa-server"></i></div>
      </div>
      <span class="gc-badge"><i class="fa-solid fa-users"></i> ${g.playerCount}</span>
      <div class="gc-body">
        <div class="gc-name">${g.name}</div>
        <div class="gc-owner">Owner: ${g.ownerName}</div>
        <div class="gc-chart">${spark}</div>
        <div class="gc-prices">${chips}</div>
      </div>`;

    loadImg(
      `${CONFIG.paths.assets}gtps/gtps${g.id}.jpg`,
      card.querySelector('.gc-img-wrap'),
      `gc-ph-${g.id}`
    );

    card.addEventListener('click', () => selectGtps(g.id));
    grid.appendChild(card);
  });
}

function selectGtps(id) {
  const g = gtpsData.find(x => x.id === id);
  if (!g) return;
  selectedGtps = g;

  document.querySelectorAll('.gtps-card').forEach(c =>
    c.classList.toggle('active', +c.dataset.id === id)
  );

  const panel = document.getElementById('gtps-detail');
  panel.classList.remove('hidden');
  panel.innerHTML = `
    <div class="gd-head">
      <div class="gd-thumb" id="gd-thumb-${g.id}"><i class="fa-solid fa-server"></i></div>
      <div class="gd-info">
        <h2>${g.name}</h2>
        <p>
          <span><i class="fa-solid fa-user"></i> ${g.ownerName}</span>
          <span><i class="fa-solid fa-users"></i> ${g.playerCount} Players</span>
        </p>
        <p style="margin-top:4px;font-size:11px;color:var(--text-dim)">${g.description}</p>
      </div>
    </div>
    <div class="gd-body">
      <div class="catalog-label"><i class="fa-solid fa-tag"></i> Katalog Harga Lock</div>
      <div class="lock-grid" id="lock-grid"></div>
    </div>`;

  loadImg(`${CONFIG.paths.assets}gtps/gtps${g.id}.jpg`, document.getElementById(`gd-thumb-${g.id}`), null, true);
  buildLockGrid(g);

  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
}

function buildLockGrid(g) {
  const grid = document.getElementById('lock-grid');

  g.locks.forEach(lock => {
    const hist  = g.priceHistory[lock.key];
    const delta = hist[hist.length - 1] - hist[0];
    const pct   = ((Math.abs(delta) / hist[0]) * 100).toFixed(1);
    const isUp  = delta >= 0;
    const spark = sparklineSVG(hist, 200, 38, isUp ? 'up' : 'down');

    const card = document.createElement('div');
    card.className = 'lock-card';
    card.innerHTML = `
      <div class="lc-icon"><i class="${lock.icon}"></i></div>
      <div class="lc-name">${lock.name}</div>
      <div class="lc-price">${lock.unit} ${lock.price.toLocaleString('id-ID')}</div>
      <div class="lc-stock">
        <span><i class="fa-solid fa-box"></i> Stok: ${lock.stock}</span>
        <span class="lc-trend ${isUp ? 'up' : 'down'}">
          <i class="fa-solid fa-arrow-trend-${isUp ? 'up' : 'down'}"></i>${pct}%
        </span>
      </div>
      <div class="lc-spark">${spark}</div>
      <div class="lc-actions">
        <button class="lc-btn-buy">
          <i class="fa-brands fa-whatsapp"></i> Beli
        </button>
        <button class="lc-btn-testi" title="Lihat Testimoni">
          <i class="fa-solid fa-star"></i>
        </button>
      </div>`;

    card.querySelector('.lc-btn-buy').addEventListener('click', () =>
      openModal({
        name:  lock.name,
        price: `${lock.unit} ${lock.price.toLocaleString('id-ID')}`,
        icon:  lock.icon,
        gtps:  g.name,
      })
    );

    card.querySelector('.lc-btn-testi').addEventListener('click', () =>
      document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' })
    );

    grid.appendChild(card);
  });
}

// ─── SPARKLINE ───────────────────────────────────────────────
function sparklineSVG(data, w, h, cls = '') {
  if (!data || data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rng = max - min || 1;
  const pad = 4;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / rng) * (h - pad * 2);
    return [x, y];
  });

  const linePath = 'M ' + pts.map(p => p.join(',')).join(' L ');
  const areaPath = `M ${pts[0][0]},${h} ` + pts.map(p => `L ${p[0]},${p[1]}`).join(' ') + ` L ${pts[pts.length-1][0]},${h} Z`;

  const gid = 'sg' + Math.random().toString(36).slice(2, 7);
  const lastPt = pts[pts.length - 1];
  const strokeColor = cls === 'up' ? 'rgba(143,188,143,0.7)' : cls === 'down' ? 'rgba(188,143,143,0.65)' : 'rgba(255,255,255,0.55)';
  const areaColor   = cls === 'up' ? 'rgba(143,188,143,0.12)' : cls === 'down' ? 'rgba(188,143,143,0.1)' : 'rgba(255,255,255,0.06)';

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${areaColor}"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#${gid})"/>
    <path d="${linePath}" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="2.5" fill="${strokeColor}"/>
  </svg>`;
}

// ─── TESTIMONIALS ─────────────────────────────────────────────
function buildTestimonials() {
  const grid = document.getElementById('testi-grid');
  grid.innerHTML = '';

  testiData.forEach(t => {
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<i class="fa-solid fa-star${i < t.rating ? ' on' : ''}"></i>`
    ).join('');

    const card = document.createElement('div');
    card.className = 'testi-card';
    card.innerHTML = `
      <div class="tc-img-wrap">
        <div class="tc-img-placeholder" id="tc-ph-${t.id}"><i class="fa-solid fa-image"></i></div>
      </div>
      <div class="tc-body">
        <div class="tc-stars">${stars}</div>
        <div class="tc-quote">${t.comment}</div>
        <div class="tc-meta">
          <div>
            <div class="tc-nick">${t.buyerNick}</div>
            <div class="tc-detail">${t.gtpsName} · ${t.lockName}</div>
          </div>
          <span class="tc-price">${t.price}</span>
        </div>
      </div>`;

    loadImg(`${CONFIG.paths.assets}testi/testi${t.id}.jpg`, card.querySelector('.tc-img-wrap'), `tc-ph-${t.id}`);
    grid.appendChild(card);
  });
}

// ─── FAQ ─────────────────────────────────────────────────────
function buildFAQ() {
  const wrap = document.getElementById('faq-wrap');
  CONFIG.faq.forEach(item => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <button class="faq-q">
        <span>${item.q}</span>
        <div class="faq-icon"><i class="fa-solid fa-plus"></i></div>
      </button>
      <div class="faq-a"><div class="faq-a-inner">${item.a}</div></div>`;
    el.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = el.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
      if (!wasOpen) el.classList.add('open');
    });
    wrap.appendChild(el);
  });
}

// ─── OTHER PRODUCTS ───────────────────────────────────────────
function buildOtherProducts() {
  const grid = document.getElementById('products-grid');
  CONFIG.otherProducts.forEach(p => {
    const a = document.createElement('a');
    a.className = 'prod-card';
    a.href = p.link;
    a.innerHTML = `
      <div class="pc-top">
        <div class="pc-icon"><i class="${p.icon}"></i></div>
        ${p.badge ? `<span class="pc-badge ${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
      </div>
      <div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-desc">${p.desc}</div>
      </div>
      <div class="pc-arrow"><i class="fa-solid fa-arrow-right"></i></div>`;
    grid.appendChild(a);
  });
}

// ─── FOOTER ──────────────────────────────────────────────────
function updateFooter() {
  const el = document.getElementById('ft-brand');
  if (el) el.textContent = CONFIG.store.name;
  const wa = document.getElementById('sb-wa');
  if (wa) wa.href = `https://wa.me/${CONFIG.store.waNumber}`;
}

// ─── MUSIC WIDGET ─────────────────────────────────────────────
function initMusicWidget() {
  const pl = CONFIG.music.playlist;
  const widget = document.getElementById('music-widget');
  if (!pl || pl.length === 0) { widget.classList.add('gone'); return; }

  audioEl = document.getElementById('music-audio');

  function loadTrack(idx) {
    const t = pl[idx];
    audioEl.src = t.src;
    document.querySelectorAll('.mw-cover-img').forEach(el => el.src = t.cover);
    document.querySelectorAll('.mw-title-txt').forEach(el => el.textContent = t.title);
    document.querySelectorAll('.mw-artist-txt').forEach(el => el.textContent = t.artist);
    if (isPlaying) audioEl.play().catch(() => {});
  }

  document.getElementById('mw-bar-btn').addEventListener('click', () => {
    widgetOpen = !widgetOpen;
    widget.classList.toggle('open', widgetOpen);
  });

  document.getElementById('mw-play').addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) { audioEl.play().catch(() => { isPlaying = false; syncPlayBtn(); }); }
    else audioEl.pause();
    syncPlayBtn();
  });

  function syncPlayBtn() {
    document.getElementById('mw-play').innerHTML = isPlaying
      ? '<i class="fa-solid fa-pause"></i>'
      : '<i class="fa-solid fa-play"></i>';
  }

  document.getElementById('mw-prev').addEventListener('click', () => {
    trackIdx = (trackIdx - 1 + pl.length) % pl.length;
    loadTrack(trackIdx);
  });
  document.getElementById('mw-next').addEventListener('click', () => {
    trackIdx = (trackIdx + 1) % pl.length;
    loadTrack(trackIdx);
  });

  audioEl.addEventListener('timeupdate', () => {
    if (!audioEl.duration) return;
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    document.getElementById('mw-prog-fill').style.width = pct + '%';
    document.getElementById('mw-time-cur').textContent  = fmtTime(audioEl.currentTime);
    document.getElementById('mw-time-tot').textContent  = fmtTime(audioEl.duration);
  });

  document.getElementById('mw-prog-track').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    audioEl.currentTime = ((e.clientX - rect.left) / rect.width) * audioEl.duration;
  });

  audioEl.addEventListener('ended', () => {
    trackIdx = (trackIdx + 1) % pl.length;
    loadTrack(trackIdx);
    isPlaying = true; syncPlayBtn();
    audioEl.play().catch(() => {});
  });

  loadTrack(0);
}

// ─── MODAL ───────────────────────────────────────────────────
function initModal() {
  document.getElementById('md-close').addEventListener('click', closeModal);
  document.getElementById('modal-bg').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-bg')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal({ name, price, icon, gtps }) {
  document.getElementById('md-lock-icon').innerHTML = `<i class="${icon}"></i>`;
  document.getElementById('md-lock-name').textContent = name;
  document.getElementById('md-gtps-name').textContent = `GTPS: ${gtps}`;
  document.getElementById('md-price-val').textContent  = price;
  document.getElementById('md-note').textContent =
    `Kamu akan membeli ${name} di ${gtps} seharga ${price}. Tap tombol di bawah untuk konfirmasi via WhatsApp.`;

  document.getElementById('md-wa-btn').onclick = () => {
    const msg = CONFIG.store.waMessage(name, gtps, price);
    window.open(`https://wa.me/${CONFIG.store.waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    closeModal();
  };
  document.getElementById('md-testi-btn').onclick = () => {
    closeModal();
    document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById('modal-bg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-bg').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── IMAGE HELPER ─────────────────────────────────────────────
function loadImg(src, container, placeholderId, thumb = false) {
  const img = new Image();
  img.src = src;
  img.style.cssText = thumb
    ? 'width:100%;height:100%;object-fit:cover;border-radius:inherit;'
    : 'width:100%;height:100%;object-fit:cover;display:block;';
  img.onload = () => {
    if (placeholderId) {
      const ph = document.getElementById(placeholderId);
      if (ph) ph.replaceWith(img);
    } else {
      container.innerHTML = '';
      container.appendChild(img);
    }
  };
}

// ─── HELPERS ─────────────────────────────────────────────────
function fmtPrice(price, unit = 'Rp') {
  return unit + ' ' + price.toLocaleString('id-ID');
}

function fmtTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

function shortLockName(name) {
  const map = { 'World Lock': 'WL', 'Diamond Lock': 'DL', 'Blue Gem Lock': 'BGL' };
  return map[name] || name.replace(' Lock', '');
      }
