// ============ THEME TOGGLE ============
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const STORAGE_KEY = 'portfolio-theme';

function applyTheme(theme){
  body.setAttribute('data-theme', theme);
}

// Muat preferensi tersimpan, atau ikuti preferensi sistem
(function initTheme(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved){
    applyTheme(saved);
  } else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }
})();

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
});

// ============ MOBILE MENU ============
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
  menuBtn.classList.toggle('open');
});

// Tutup menu saat salah satu link diklik (mobile)
document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuBtn.classList.remove('open');
  });
});

// ============ REVEAL ON SCROLL ============
const revealTargets = document.querySelectorAll(
  '.about-grid, .achievement-grid, .footer-title, .footer-desc, .social-row'
);
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));
} else {
  // Browser lama tanpa dukungan IntersectionObserver: langsung tampilkan semua
  revealTargets.forEach(el => el.classList.add('in-view'));
}

// ============ SCROLL PROGRESS BAR ============
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${percent}%`;
});

// ============ CURSOR SPOTLIGHT (HERO) ============
const hero = document.querySelector('.hero');
if (hero && window.matchMedia('(hover: hover)').matches){
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--spot-x', `${x}%`);
    hero.style.setProperty('--spot-y', `${y}%`);
  });
}

// ============ TYPING ROLE TEXT ============
const roles = ['Information Technology', 'President University Student', 'Batch 2026', 'Cyber Security'];
const roleEl = document.getElementById('role-text');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  if (!roleEl) return;
  const current = roles[roleIndex];

  if (!deleting){
    charIndex++;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
if (roleEl){
  roleEl.textContent = '';
  setTimeout(typeLoop, 500);
}

// ============ ANIMATED STAT COUNTERS ============
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      current += step;
      if (current >= target){
        el.textContent = target;
      } else {
        el.textContent = current;
        requestAnimationFrame(tick);
      }
    };
    tick();
    statObserver.unobserve(el);
  });
}, { threshold: 0.4 });
statNumbers.forEach(el => statObserver.observe(el));

// ============ 3D TILT ON ACHIEVEMENT CARDS ============
if (window.matchMedia('(hover: hover)').matches){
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============ NAVBAR ACTIVE STATE ON SCROLL ============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.menu-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top){
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});