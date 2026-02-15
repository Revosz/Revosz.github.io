// ═══════════════ ANIMATED BACKGROUND — DRIFTING GEOMETRY ═══════════════
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w, h, mouse = { x: -1000, y: -1000 }, time = 0;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

const shapes = [];
for (let i = 0; i < 70; i++) {
  const types = ['square', 'square', 'square', 'diamond', 'hex', 'tri'];
  shapes.push({
    x: Math.random() * 3000,
    y: Math.random() * 3000,
    size: 20 + Math.random() * 80,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.003,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.15,
    type: types[Math.floor(Math.random() * types.length)],
    isRed: Math.random() > 0.45,
    alpha: 0.02 + Math.random() * 0.04,
    phase: Math.random() * Math.PI * 2,
    lineWidth: 0.5 + Math.random() * 1
  });
}

function drawShape(s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rotation);
  const half = s.size / 2;
  ctx.beginPath();
  switch (s.type) {
    case 'tri':
      ctx.moveTo(0, -half);
      ctx.lineTo(-half * 0.866, half * 0.5);
      ctx.lineTo(half * 0.866, half * 0.5);
      ctx.closePath(); break;
    case 'diamond':
      ctx.moveTo(0, -half);
      ctx.lineTo(half * 0.6, 0);
      ctx.lineTo(0, half);
      ctx.lineTo(-half * 0.6, 0);
      ctx.closePath(); break;
    case 'hex':
      for (let a = 0; a < 6; a++) {
        const angle = (Math.PI / 3) * a - Math.PI / 6;
        const px = Math.cos(angle) * half;
        const py = Math.sin(angle) * half;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); break;
    case 'square':
      ctx.rect(-half * 0.7, -half * 0.7, half * 1.4, half * 1.4); break;
    case 'line':
      ctx.moveTo(-half, 0); ctx.lineTo(half, 0); break;
  }
  ctx.strokeStyle = s.isRed
    ? `rgba(229,62,62,${s.alpha})`
    : `rgba(236,201,75,${s.alpha})`;
  ctx.lineWidth = s.lineWidth;
  ctx.stroke();
  ctx.restore();
}

function drawBg() {
  time += 0.004;
  ctx.clearRect(0, 0, w, h);

  for (const s of shapes) {
    s.x += s.vx + Math.sin(time + s.phase) * 0.15;
    s.y += s.vy + Math.cos(time * 0.7 + s.phase) * 0.1;
    s.rotation += s.rotSpeed;
    const breathe = 1 + Math.sin(time * 0.6 + s.phase) * 0.08;
    const dx = s.x - mouse.x, dy = s.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mouseProx = Math.max(0, 1 - dist / 300);
    const origAlpha = s.alpha;
    s.alpha = origAlpha + mouseProx * 0.06;
    s.rotation += mouseProx * 0.005;
    if (dist < 250 && dist > 10) {
      s.x += dx / dist * mouseProx * 0.3;
      s.y += dy / dist * mouseProx * 0.3;
    }
    const saved = s.size;
    s.size = saved * breathe;
    drawShape(s);
    s.size = saved;
    s.alpha = origAlpha;
    const buf = s.size + 20;
    if (s.x < -buf) s.x = w + buf;
    if (s.x > w + buf) s.x = -buf;
    if (s.y < -buf) s.y = h + buf;
    if (s.y > h + buf) s.y = -buf;
  }

  const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
  g.addColorStop(0, 'rgba(229,62,62,0.012)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
  ctx.fill();

  requestAnimationFrame(drawBg);
}
drawBg();

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

// ═══════════════ SCROLL NAVIGATION ═══════════════
document.querySelectorAll('.nav-links a, a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    closeMenu();
    const id = this.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    const navH = 60;
    const y = target.getBoundingClientRect().top + window.pageYOffset - navH;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ═══════════════ ACTIVE NAV HIGHLIGHT ═══════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ═══════════════ SCROLL REVEAL ═══════════════
const reveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('active'), i * 50);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
reveals.forEach(el => revealObs.observe(el));

// ═══════════════ COUNTER ANIMATION ═══════════════
const statNums = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const inc = target / 50;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.floor(current);
      }, 30);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObs.observe(el));

// ═══════════════ TYPEWRITER ═══════════════
const tagline = document.getElementById('heroTagline');
const phrases = [
  "Scripter \u2022 Systems Engineer \u2022 Game Developer",
  "Let's Build Something Worth Playing",
  "Refactoring Expert \u2022 System Architect \u2022 Problem Solver",
  "Your Game Deserves Solid Engineering",
  "Clean Code \u2022 Fast Builds \u2022 Happy Players"
];
let pi = 0, ci = 0, del = false;
function typeLoop() {
  const cur = phrases[pi];
  if (!del) {
    tagline.textContent = cur.substring(0, ci + 1);
    ci++;
    if (ci === cur.length) { del = true; setTimeout(typeLoop, 2400); return; }
    setTimeout(typeLoop, 35);
  } else {
    tagline.textContent = cur.substring(0, ci - 1);
    ci--;
    if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 300); return; }
    setTimeout(typeLoop, 18);
  }
}
setTimeout(() => typeLoop(), 3500);

// ═══════════════ VIDEO CLICK-TO-PLAY ═══════════════
document.querySelectorAll('.video-embed[data-id]').forEach(el => {
  el.addEventListener('click', () => {
    const id = el.dataset.id;
    el.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" allowfullscreen allow="autoplay"></iframe>`;
  });
});

// ═══════════════ TILT EFFECT ═══════════════
document.querySelectorAll('.proj-row, .video-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x*3}deg) rotateX(${-y*3}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s';
    setTimeout(() => card.style.transition = 'all .4s', 500);
  });
});

// ═══════════════ GLITCH PULSE ═══════════════
const heroName = document.querySelector('.glitch-text');
setInterval(() => {
  heroName.style.textShadow = `
    ${(Math.random()-.5)*6}px ${(Math.random()-.5)*3}px rgba(229,62,62,0.6),
    ${(Math.random()-.5)*6}px ${(Math.random()-.5)*3}px rgba(236,201,75,0.4)
  `;
  setTimeout(() => {
    heroName.style.textShadow = '0 0 40px rgba(236,201,75,0.25), 0 0 80px rgba(229,62,62,0.1)';
  }, 120);
}, 4000);

// ═══════════════ HERO CORNER PULSE ═══════════════
const corners = document.querySelectorAll('.hero-corner');
setInterval(() => {
  corners.forEach(c => {
    c.style.borderColor = 'rgba(229,62,62,0.5)';
    setTimeout(() => { c.style.borderColor = 'rgba(229,62,62,0.2)'; }, 300);
  });
}, 3000);
