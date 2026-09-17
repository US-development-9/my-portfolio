/* ==========================================================================
   USMAN SHAH // PORTFOLIO FUNCTIONALITY SCRIPT (script.js)
   Features: Cyber Canvas • 3D Tilt • Skills Filter • Sound FX • Direct Contact
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initMouseAmbientGlow();
  initCyberAudio();
  initTypewriter();
  initNavbarScroll();
  initSkillsFilter();
  init3DTilt();
  initContactForm();
  initMobileMenu();
});

/* ================= 1. LIGHTWEIGHT CYBER CANVAS PARTICLES ================= */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let isMobile = width < 768;
  const particleCount = isMobile ? 20 : 50;
  const particles = [];
  let animFrameId = null;
  let isRunning = true;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    isMobile = width < 768;
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  const palette = ['#00f0ff', '#a855f7', '#38bdf8', '#10b981', '#818cf8'];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 1.6 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -(Math.random() * 0.45 + 0.2); // upward gentle drift
      this.swayPhase = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.008;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.baseAlpha = Math.random() * 0.4 + 0.2;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.025 + 0.012;
    }

    update() {
      this.swayPhase += this.swaySpeed;
      this.pulsePhase += this.pulseSpeed;
      this.x += this.speedX + Math.sin(this.swayPhase) * 0.25;
      this.y += this.speedY;

      // Wrap around edges softly
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) {
        this.reset(false);
      }
    }

    draw() {
      const currentAlpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.15;
      ctx.globalAlpha = Math.max(0.08, Math.min(0.8, currentAlpha));
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      if (!prefersReducedMotion) {
        particles[i].update();
      }
      particles[i].draw();
    }

    if (isRunning && !prefersReducedMotion) {
      animFrameId = requestAnimationFrame(render);
    }
  }

  // Auto-pause when tab is inactive to preserve 100% CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    } else {
      if (!isRunning) {
        isRunning = true;
        animFrameId = requestAnimationFrame(render);
      }
    }
  });

  render();
}

/* ================= 2. MOUSE AMBIENT GLOW TRACKER ================= */
function initMouseAmbientGlow() {
  const glowEl = document.getElementById('bg-cursor-glow');
  if (!glowEl) return;

  // Don't bind on touch/mobile devices
  if (window.matchMedia('(hover: none)').matches || window.innerWidth < 768) {
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMoving = false;
  let rafId = null;

  function updatePosition() {
    // Smooth easing
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    document.documentElement.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
    document.documentElement.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);

    if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
      rafId = requestAnimationFrame(updatePosition);
    } else {
      isMoving = false;
    }
  }

  window.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(updatePosition);
      }
    },
    { passive: true }
  );
}

/* ================= 2. CYBER AUDIO SYNTHESIS ================= */
let audioCtx = null;

function initCyberAudio() {
  function playBeep(freq = 600, duration = 0.04, type = 'sine') {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  document.querySelectorAll('a, button, .pillar-card, .skill-card-3d').forEach((el) => {
    el.addEventListener('mouseenter', () => playBeep(880, 0.03));
    el.addEventListener('click', () => playBeep(1200, 0.05, 'triangle'));
  });
}

/* ================= 3. DYNAMIC TYPEWRITER EFFECT ================= */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'Software Engineer',
    'Full-Stack Web Developer',
    'Android & Flutter App Engineer',
    'Python & Backend Architect',
    'Office & Productivity Specialist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 90;

    if (!isDeleting && charIdx === current.length) {
      speed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(tick, speed);
  }

  tick();
}

/* ================= 4. NAVBAR SCROLL HUD ================= */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach((s) => {
      const top = s.offsetTop - 120;
      if (window.scrollY >= top) {
        current = s.getAttribute('id');
      }
    });

    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}

/* ================= 5. SKILLS FILTER & SEARCH ================= */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.cat-tab');
  const pillarCards = document.querySelectorAll('.pillar-card');
  const searchInput = document.getElementById('skill-search');
  const categoryBlocks = document.querySelectorAll('.category-group-block');
  const skillCards = document.querySelectorAll('.skill-card-3d');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    categoryBlocks.forEach((block) => {
      const blockCat = block.dataset.category;
      const isCatMatch = activeCategory === 'all' || activeCategory === blockCat;
      
      let visibleCountInBlock = 0;
      const cardsInBlock = block.querySelectorAll('.skill-card-3d');

      cardsInBlock.forEach((card) => {
        const text = (card.innerText || '').toLowerCase();
        const matchesSearch = !searchQuery || text.includes(searchQuery);

        if (isCatMatch && matchesSearch) {
          card.style.display = 'flex';
          visibleCountInBlock++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCountInBlock > 0) {
        block.style.display = 'block';
      } else {
        block.style.display = 'none';
      }
    });

    // Update Tab UI
    tabs.forEach((tab) => {
      if (tab.dataset.filter === activeCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Pillar UI
    pillarCards.forEach((pillar) => {
      if (pillar.dataset.filter === activeCategory) {
        pillar.classList.add('active');
      } else {
        pillar.classList.remove('active');
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.dataset.filter;
      applyFilters();
    });
  });

  pillarCards.forEach((card) => {
    card.addEventListener('click', () => {
      activeCategory = card.dataset.filter;
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });
}

/* ================= 6. 3D TILT EFFECT ON CARDS ================= */
function init3DTilt() {
  const cards = document.querySelectorAll('.skill-card-3d, .project-card, .pillar-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      const rotX = -normY * 6;
      const rotY = normX * 6;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ================= 7. DIRECT CONTACT FORM HANDLER ================= */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim() || '';
    const email = document.getElementById('contact-email')?.value.trim() || '';
    const message = document.getElementById('contact-message')?.value.trim() || '';

    if (!name || !message) {
      alert('Please enter your name and message.');
      return;
    }

    // Direct WhatsApp message trigger
    const waText = encodeURIComponent(
      `Hello Usman Shah,\n\nMy name is ${name} (${email}).\n\nMessage:\n${message}`
    );
    const waUrl = `https://wa.me/923444257911?text=${waText}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');

    // Confirm submission
    alert(`Thank you, ${name}! Redirecting you directly to WhatsApp to send your message to Usman Shah.`);
    form.reset();
  });
}

/* ================= 8. MOBILE MENU DRAWER ================= */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    if (navLinks) {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '20px';
        navLinks.style.right = '20px';
        navLinks.style.background = 'rgba(6,9,22,0.98)';
        navLinks.style.padding = '20px';
        navLinks.style.borderRadius = '16px';
        navLinks.style.border = '1px solid var(--border-cyber)';
      }
    }
  });
}
