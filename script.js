// ═══════════════ GAMES DATA ═══════════════
// To add a new game: append an object below. Only `name` is required.
// Provide `placeId` to auto-fetch the live thumbnail + build the Roblox link.
// Use `universeId` if you only have that. `image` and `link` override auto-values.
const games = [
  { name: "Mini Kingdoms",      placeId: "78934162817711",  tags: ["Roblox", "Luau", "Combat Systems"] },
  { name: "Connect Em",          placeId: "95925325067651",  tags: ["Roblox", "Luau", "MVC Architecture"] },
  { name: "Tag Frenzy",          placeId: "92434887837113",  tags: ["Roblox", "Luau", "Gameplay"] },
  { name: "CheckoutWars",        placeId: "134688789033331", tags: ["Roblox", "Luau", "Simulation"] },
  { name: "Arcane Lineage",      placeId: "10595058975",     tags: ["Roblox", "Luau", "RPG"] },
  { name: "Taco Empire",         placeId: "77421539130331",  tags: ["Roblox", "Luau", "Tycoon"] }
];

function buildLink(g) {
  if (g.link) return g.link;
  if (g.placeId) return `https://www.roblox.com/games/${g.placeId}`;
  return null;
}

function renderGames() {
  const host = document.getElementById('gamesList');
  if (!host) return;
  host.innerHTML = games.map((g, i) => {
    const tags = (g.tags || ["Roblox", "Luau"]).map(t => `<span>${t}</span>`).join('');
    const link = buildLink(g);
    const thumbClass = g.image ? 'proj-thumb img' : 'proj-thumb fallback';
    const inner = g.image
      ? `<img src="${g.image}" alt="${g.name}" loading="lazy">`
      : `<span class="fb-name">${g.name}</span>`;
    const wrapped = link
      ? `<a href="${link}" target="_blank" rel="noopener">${inner}</a>`
      : inner;
    return `
      <div class="proj-row reveal-scale" data-game-idx="${i}">
        <span class="proj-corner tl"></span>
        <span class="proj-corner tr"></span>
        <span class="proj-corner bl"></span>
        <span class="proj-corner br"></span>
        <div class="${thumbClass}" data-thumb-idx="${i}">${wrapped}</div>
        <div class="proj-info">
          <div class="proj-tags">${tags}</div>
          <h3>${g.name}</h3>
        </div>
      </div>`;
  }).join('');
}

function upgradeThumb(i, imageUrl) {
  const g = games[i];
  g.image = imageUrl;
  const host = document.querySelector(`[data-thumb-idx="${i}"]`);
  if (!host) return;
  const link = buildLink(g);
  const img = `<img src="${imageUrl}" alt="${g.name}" loading="lazy">`;
  host.className = 'proj-thumb img';
  host.innerHTML = link
    ? `<a href="${link}" target="_blank" rel="noopener">${img}</a>`
    : img;
}

// Roblox APIs don't allow browser CORS, so we use roproxy.com — a community
// mirror with CORS headers — the same pattern Rolimons and other Roblox tools use.
const API_HOSTS = [
  { universe: 'https://apis.roproxy.com', thumb: 'https://thumbnails.roproxy.com' },
  { universe: 'https://apis.roblox.com',  thumb: 'https://thumbnails.roblox.com'  }
];

async function fetchUniverseId(placeId) {
  for (const h of API_HOSTS) {
    try {
      const r = await fetch(`${h.universe}/universes/v1/places/${placeId}/universe`);
      if (!r.ok) continue;
      const j = await r.json();
      if (j.universeId) return j.universeId;
    } catch (_) {}
  }
  return null;
}

async function fetchThumbnail(universeId) {
  for (const h of API_HOSTS) {
    try {
      const r = await fetch(`${h.thumb}/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&countPerUniverse=1&defaults=true`);
      if (!r.ok) continue;
      const j = await r.json();
      const url = j?.data?.[0]?.thumbnails?.[0]?.imageUrl;
      if (url) return url;
    } catch (_) {}
  }
  return null;
}

async function loadThumbs() {
  await Promise.all(games.map(async (g, i) => {
    if (g.image) return;
    try {
      let uni = g.universeId;
      if (!uni && g.placeId) uni = await fetchUniverseId(g.placeId);
      if (!uni) return;
      const url = await fetchThumbnail(uni);
      if (url) upgradeThumb(i, url);
    } catch (_) { /* fallback stays */ }
  }));
}

renderGames();
loadThumbs();

// ═══════════════ VOUCHES DATA ═══════════════
// Add a new vouch: just append { quote, author } to the array.
const vouches = [
  { quote: "He did awesome. No bugs, delivered on time.", author: "verxile" },
  { quote: "Best scripter I've worked with. Fast and clean.", author: "vantfx" },
  { quote: "Paid for itself in a week. Worth it.", author: "futuredev" },
  { quote: "Delivered early. Game runs way smoother.", author: "imoneasystreet" }
];

function renderVouches() {
  const host = document.getElementById('vouchesList');
  if (!host) return;
  host.innerHTML = vouches.map(v => `
    <div class="vouch-card reveal-scale">
      <span class="vouch-corner tl"></span>
      <span class="vouch-corner tr"></span>
      <span class="vouch-corner bl"></span>
      <span class="vouch-corner br"></span>
      <div class="vouch-mark">&ldquo;</div>
      <p class="vouch-quote">${v.quote}</p>
      <div class="vouch-divider"></div>
      <div class="vouch-meta">
        <span class="vouch-author">${v.author}</span>
      </div>
    </div>`).join('');
}
renderVouches();

// ═══════════════ FLOATING GOLD PARTICLES ═══════════════
(function spawnParticles() {
  const host = document.getElementById('particles');
  if (!host) return;
  const count = 55;
  const sizes = ['small', 'small', '', '', '', 'big'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle ' + sizes[Math.floor(Math.random() * sizes.length)];
    p.style.left = (Math.random() * 100) + 'vw';
    p.style.animationDuration = (12 + Math.random() * 22) + 's';
    p.style.animationDelay = (-Math.random() * 35) + 's';
    frag.appendChild(p);
  }
  host.appendChild(frag);
})();

// ═══════════════ NAV SCROLL ═══════════════
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ═══════════════ MOBILE MENU ═══════════════
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ═══════════════ SMOOTH ANCHOR SCROLL ═══════════════
document.querySelectorAll('.nav-links a, a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
    const id = this.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    const navH = 80;
    const y = target.getBoundingClientRect().top + window.pageYOffset - navH;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ═══════════════ ACTIVE NAV HIGHLIGHT ═══════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  const scrollY = window.scrollY + 140;
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ═══════════════ SCROLL REVEAL ═══════════════
const reveals = document.querySelectorAll('.reveal, .reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('active'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

