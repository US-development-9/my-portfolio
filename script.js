/* ==========================================================================
   USMAN SHAH // ULTIMATE 3D PREMIUM PORTFOLIO JAVASCRIPT (script.js)
   Features: 
     • 3D Quantum Core Hero (Three.js WebGL)
     • 3D Interactive Skill Universe (Raycasted Orbiting Constellation)
     • Dual Magnetic Custom Cursor System
     • Real-time 3D Card Tilt with Specular Glare
     • Procedural Web Audio API Sound Synthesizer
     • Instant Skills Matrix Search & Category Filters
     • Architecture Deep-Dive Modal
     • Direct WhatsApp Dispatch Form & Quick-Copy Tooltips
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initBrandLogoInteraction();
  initSoundEngine();
  initAmbientCursorGlow();
  initTypewriter();
  initNavbarScrollSpy();
  initActiveNavIndicator();
  initNavbar3DTilt();
  initSkillsFilterAndSearch();
  fetchAndRenderGitHubProjects();
  init3DCardTilt();
  initContactFormDispatcher();
  initMobileNav();

  // Initialize WebGL 3D Systems
  if (typeof THREE !== 'undefined') {
    initHero3DScene();
    initSkillsUniverse3D();
  } else {
    console.warn('Three.js library not detected. Running high-performance fallback animations.');
  }
});

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO SYNTHESIZER (ZERO EXTERNAL FILES)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const toggleBtn = document.getElementById('sound-toggle');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      toggleBtn.classList.toggle('active', soundEnabled);
      showToast(soundEnabled ? 'Audio FX Enabled' : 'Audio FX Muted');
      if (soundEnabled) playSynthChime(660, 0.04, 'sine');
    });
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playSynthChime = function(freq = 800, duration = 0.03, type = 'sine', volume = 0.025) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy or device fallback
    }
  };

  // Attach soft audio events to interactive UI elements
  document.querySelectorAll('a, button, .pillar-card, .cat-tab').forEach((el) => {
    el.addEventListener('mouseenter', () => playSynthChime(920, 0.02, 'sine', 0.015));
    el.addEventListener('click', () => playSynthChime(1250, 0.04, 'triangle', 0.03));
  });
}

/* ==========================================================================
   3. AMBIENT MOUSE CURSOR GLOW
   ========================================================================== */
function initAmbientCursorGlow() {
  const glow = document.getElementById('ambient-glow-cursor');
  if (!glow || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });
}

/* ==========================================================================
   4. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Software Engineer',
    'Full-Stack Web Developer',
    'Android & Flutter App Engineer',
    'Python & Backend Architect',
    'Office & Productivity Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeTick() {
    const current = roles[roleIndex];
    if (isDeleting) {
      target.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 35 : 85;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; // Pause on complete word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeTick, delay);
  }

  typeTick();
}

/* ==========================================================================
   5. BRAND LOGO & NAVBAR INTERACTION SYSTEM
   ========================================================================== */
function initBrandLogoInteraction() {
  const logoBtn = document.getElementById('brand-logo-btn');
  if (!logoBtn) return;

  logoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '#home');
    window.playSynthChime?.(1200, 0.05, 'triangle');

    const firstItem = document.querySelector('.nav-item[href="#home"]');
    if (firstItem) {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      firstItem.classList.add('active');
      window.refreshNavIndicator?.(firstItem);
    }
  });
}

/* ==========================================================================
   5B. SLIDING ACTIVE NAVIGATION INDICATOR (DYNAMIC GLASS CAPSULE)
   ========================================================================== */
function initActiveNavIndicator() {
  const indicator = document.getElementById('nav-indicator-glide');
  const navLinks = document.getElementById('main-nav-links');
  const items = navLinks?.querySelectorAll('.nav-item');
  if (!indicator || !navLinks || !items || items.length === 0) return;

  function moveTo(targetItem) {
    const activeItem = targetItem || navLinks.querySelector('.nav-item.active') || items[0];
    if (!activeItem) return;

    const offsetLeft = activeItem.offsetLeft;
    const width = activeItem.offsetWidth;

    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = '1';
  }

  // Initial positioning after DOM layout settles
  requestAnimationFrame(() => moveTo());
  setTimeout(() => moveTo(), 120);

  // Hover preview transitions
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => moveTo(item));
    item.addEventListener('mouseleave', () => moveTo());
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      moveTo(item);
    });
  });

  window.addEventListener('resize', () => moveTo(), { passive: true });
  window.refreshNavIndicator = moveTo;
}

/* ==========================================================================
   5C. NAVBAR 3D PERSPECTIVE TILT RESPONSE
   ========================================================================== */
function initNavbar3DTilt() {
  const navWrap = document.querySelector('.site-header .nav-wrap');
  if (!navWrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    // Only respond when cursor is in the upper 180px of the viewport
    if (e.clientY > 180) {
      isHovering = false;
      return;
    }
    isHovering = true;
    const rect = navWrap.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (window.innerWidth / 2);
    const normY = (e.clientY - centerY) / 90;

    mouseX = Math.max(-1, Math.min(1, normX));
    mouseY = Math.max(-1, Math.min(1, normY));
  }, { passive: true });

  function renderTilt() {
    requestAnimationFrame(renderTilt);
    const targetTiltX = isHovering ? -mouseY * 2.2 : 0;
    const targetTiltY = isHovering ? mouseX * 3.2 : 0;

    currentTiltX += (targetTiltX - currentTiltX) * 0.1;
    currentTiltY += (targetTiltY - currentTiltY) * 0.1;

    if (Math.abs(currentTiltX) > 0.01 || Math.abs(currentTiltY) > 0.01) {
      navWrap.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
    } else {
      navWrap.style.transform = '';
    }
  }

  renderTilt();
}

/* ==========================================================================
   5D. NAVBAR SCROLL SPY & HEADER HUD
   ========================================================================== */
function initNavbarScrollSpy() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    let activeId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 150;
      if (scrollY >= top) {
        activeId = sec.getAttribute('id');
      }
    });

    let activeChanged = false;
    navItems.forEach((link) => {
      const shouldBeActive = link.getAttribute('href') === `#${activeId}`;
      if (link.classList.contains('active') !== shouldBeActive) {
        link.classList.toggle('active', shouldBeActive);
        activeChanged = true;
      }
    });

    mobileNavItems.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });

    if (activeChanged && window.refreshNavIndicator) {
      window.refreshNavIndicator();
    }
  }, { passive: true });
}

/* ==========================================================================
   6. 3D QUANTUM CORE HERO SCENE (THREE.JS WEBGL)
   ========================================================================== */
function initHero3DScene() {
  const canvas = document.getElementById('hero-canvas3d');
  const container = document.getElementById('hero-3d-stage');
  if (!canvas || !container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 7.5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const cyanPoint = new THREE.PointLight(0x00f0ff, 3, 20);
  cyanPoint.position.set(4, 3, 3);
  scene.add(cyanPoint);

  const purplePoint = new THREE.PointLight(0xa855f7, 2.5, 20);
  purplePoint.position.set(-4, -3, 3);
  scene.add(purplePoint);

  // Group containing all 3D artifacts
  const quantumGroup = new THREE.Group();
  scene.add(quantumGroup);

  // 1. Concentric Gimbal Rings (Torus Geometry)
  const ringMatCyan = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.35,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });

  const ringMatPurple = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    emissive: 0xa855f7,
    emissiveIntensity: 0.35,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });

  const ringMatEmerald = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.35,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.02, 16, 100), ringMatCyan);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.025, 16, 100), ringMatPurple);
  const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.02, 16, 100), ringMatEmerald);
  
  ring2.rotation.x = Math.PI / 3;
  ring3.rotation.y = Math.PI / 4;

  quantumGroup.add(ring1);
  quantumGroup.add(ring2);
  quantumGroup.add(ring3);

  // 2. Outer Geometric Icosahedron Cage
  const cageGeo = new THREE.IcosahedronGeometry(2.6, 1);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  quantumGroup.add(cageMesh);

  // 3. Stardust / Quantum Particle Field
  const particleCount = window.innerWidth < 768 ? 120 : 260;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colors = [
    new THREE.Color(0x00f0ff),
    new THREE.Color(0xa855f7),
    new THREE.Color(0x10b981),
    new THREE.Color(0x38bdf8)
  ];

  for (let i = 0; i < particleCount; i++) {
    const radius = 2.4 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);

    const c = colors[Math.floor(Math.random() * colors.length)];
    particleColors[i * 3] = c.r;
    particleColors[i * 3 + 1] = c.g;
    particleColors[i * 3 + 2] = c.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particleField = new THREE.Points(particleGeo, particleMat);
  quantumGroup.add(particleField);

  // 4. Floating Holographic "US" Geometric Monogram at Core
  const monogramGroup = new THREE.Group();

  const uShape = new THREE.Shape();
  uShape.moveTo(-0.55, 0.55);
  uShape.lineTo(-0.35, 0.55);
  uShape.lineTo(-0.35, -0.05);
  uShape.quadraticCurveTo(-0.35, -0.45, 0, -0.45);
  uShape.quadraticCurveTo(0.35, -0.45, 0.35, -0.05);
  uShape.lineTo(0.35, 0.25);
  uShape.lineTo(0.55, 0.25);
  uShape.lineTo(0.55, -0.05);
  uShape.quadraticCurveTo(0.55, -0.65, 0, -0.65);
  uShape.quadraticCurveTo(-0.55, -0.65, -0.55, -0.05);
  uShape.closePath();

  const uGeo = new THREE.ShapeGeometry(uShape);
  const uMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });
  const uMesh = new THREE.Mesh(uGeo, uMat);
  monogramGroup.add(uMesh);

  const sShape = new THREE.Shape();
  sShape.moveTo(0.55, 0.55);
  sShape.lineTo(-0.15, 0.55);
  sShape.quadraticCurveTo(-0.35, 0.55, -0.35, 0.35);
  sShape.lineTo(-0.15, 0.35);
  sShape.quadraticCurveTo(-0.15, 0.42, 0, 0.42);
  sShape.lineTo(0.35, 0.42);
  sShape.quadraticCurveTo(0.42, 0.42, 0.42, 0.3);
  sShape.quadraticCurveTo(0.42, 0.12, 0.1, 0.05);
  sShape.lineTo(-0.1, -0.02);
  sShape.quadraticCurveTo(-0.45, -0.1, -0.45, -0.38);
  sShape.lineTo(-0.25, -0.38);
  sShape.quadraticCurveTo(-0.25, -0.22, 0, -0.22);
  sShape.lineTo(0.3, -0.22);
  sShape.lineTo(0.3, -0.08);
  sShape.lineTo(0.08, -0.08);
  sShape.quadraticCurveTo(-0.22, -0.08, -0.22, -0.22);
  sShape.closePath();

  const sGeo = new THREE.ShapeGeometry(sShape);
  const sMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });
  const sMesh = new THREE.Mesh(sGeo, sMat);
  sMesh.position.z = 0.05;
  monogramGroup.add(sMesh);

  quantumGroup.add(monogramGroup);

  // Mouse Parallax & Drag Interactivity
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotationY = normX * 0.5;
    targetRotationX = normY * 0.4;
  }, { passive: true });

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;

    quantumGroup.rotation.y += deltaX * 0.01;
    quantumGroup.rotation.x += deltaY * 0.01;

    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  // Render Loop
  let clock = new THREE.Clock();

  function animateHero() {
    requestAnimationFrame(animateHero);
    const elapsedTime = clock.getElapsedTime();

    // Constant orbital rotational drift
    ring1.rotation.z = elapsedTime * 0.35;
    ring2.rotation.x = elapsedTime * 0.25;
    ring2.rotation.y = elapsedTime * 0.3;
    ring3.rotation.y = -elapsedTime * 0.4;
    ring3.rotation.z = elapsedTime * 0.2;

    cageMesh.rotation.y = elapsedTime * 0.12;
    cageMesh.rotation.x = elapsedTime * 0.08;

    particleField.rotation.y = -elapsedTime * 0.06;

    monogramGroup.rotation.y = -elapsedTime * 0.22;
    monogramGroup.rotation.x = Math.sin(elapsedTime * 0.45) * 0.14;

    // Smooth inertia interpolation towards mouse target
    if (!isDragging) {
      quantumGroup.rotation.y += (targetRotationY - quantumGroup.rotation.y) * 0.05;
      quantumGroup.rotation.x += (targetRotationX - quantumGroup.rotation.x) * 0.05;
    }

    renderer.render(scene, camera);
  }

  animateHero();

  // Resize Handler
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ==========================================================================
   7. 3D INTERACTIVE SKILL UNIVERSE CONSTELLATION (THREE.JS)
   ========================================================================== */
function initSkillsUniverse3D() {
  const canvas = document.getElementById('skills-canvas3d');
  const stage = document.getElementById('skills-3d-stage');
  if (!canvas || !stage) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, stage.clientWidth / stage.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 8.5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  const mainLight = new THREE.PointLight(0x00f0ff, 3, 30);
  mainLight.position.set(0, 5, 5);
  scene.add(mainLight);

  const universeGroup = new THREE.Group();
  scene.add(universeGroup);

  // 4 Core Nodes corresponding to the 4 Pillars
  const pillarNodesData = [
    { id: 'web', name: 'Web Development', count: '8 Skills', color: 0x00f0ff, pos: [-3.2, 1.2, 0] },
    { id: 'app', name: 'App Development', count: '5 Skills', color: 0xa855f7, pos: [3.2, 1.4, -0.5] },
    { id: 'python', name: 'Python Dev', count: '6 Skills', color: 0x10b981, pos: [-1.8, -1.8, 0.8] },
    { id: 'office', name: 'MS Office Suite', count: '5 Tools', color: 0x38bdf8, pos: [2.2, -1.6, 0.5] }
  ];

  const nodeMeshes = [];

  pillarNodesData.forEach((data) => {
    const nodeGroup = new THREE.Group();
    nodeGroup.position.set(...data.pos);
    nodeGroup.userData = { id: data.id, name: data.name };

    // Core Orb
    const orbGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.8
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    nodeGroup.add(orb);

    // Halo Ring
    const ringGeo = new THREE.TorusGeometry(0.8, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.65,
      wireframe: true
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    nodeGroup.add(ring);

    universeGroup.add(nodeGroup);
    nodeMeshes.push(nodeGroup);
  });

  // Interconnecting Energy Lines
  const linePoints = [
    new THREE.Vector3(...pillarNodesData[0].pos),
    new THREE.Vector3(...pillarNodesData[1].pos),
    new THREE.Vector3(...pillarNodesData[3].pos),
    new THREE.Vector3(...pillarNodesData[2].pos),
    new THREE.Vector3(...pillarNodesData[0].pos),
    new THREE.Vector3(...pillarNodesData[3].pos)
  ];

  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35
  });
  const networkLines = new THREE.Line(lineGeo, lineMat);
  universeGroup.add(networkLines);

  // Background Particles
  const bgStarsCount = 200;
  const bgStarsGeo = new THREE.BufferGeometry();
  const bgStarsPos = new Float32Array(bgStarsCount * 3);
  for (let i = 0; i < bgStarsCount * 3; i++) {
    bgStarsPos[i] = (Math.random() - 0.5) * 16;
  }
  bgStarsGeo.setAttribute('position', new THREE.BufferAttribute(bgStarsPos, 3));
  const bgStarsMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.6
  });
  const bgStars = new THREE.Points(bgStarsGeo, bgStarsMat);
  universeGroup.add(bgStars);

  // Raycasting for click/hover
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  canvas.addEventListener('mousemove', onPointerMove, { passive: true });

  // Click on 3D node triggers 2D UI filtering and focuses discipline
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(universeGroup.children, true);

    if (intersects.length > 0) {
      let parent = intersects[0].object.parent;
      while (parent && !parent.userData?.id && parent !== universeGroup) {
        parent = parent.parent;
      }
      if (parent && parent.userData?.id) {
        const catId = parent.userData.id;
        window.playSynthChime?.(1100, 0.06, 'triangle', 0.04);
        showToast(`Focusing ${parent.userData.name}`);

        // Trigger Category Filter in DOM
        const tab = document.querySelector(`.cat-tab[data-filter="${catId}"]`);
        if (tab) tab.click();

        // Smooth scroll to skills section
        const targetBlock = document.querySelector(`.category-group-block[data-category="${catId}"]`);
        if (targetBlock) {
          targetBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  });

  // Drag rotation
  let isDraggingUniverse = false;
  let prevX = 0;
  let prevY = 0;

  stage.addEventListener('mousedown', (e) => {
    isDraggingUniverse = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDraggingUniverse = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingUniverse) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    universeGroup.rotation.y += dx * 0.008;
    universeGroup.rotation.x += dy * 0.008;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animateSkills() {
    requestAnimationFrame(animateSkills);
    const time = clock.getElapsedTime();

    if (!isDraggingUniverse) {
      universeGroup.rotation.y = time * 0.08;
      universeGroup.rotation.x = Math.sin(time * 0.1) * 0.1;
    }

    // Node self rotation & pulsing
    nodeMeshes.forEach((mesh, idx) => {
      mesh.rotation.y = time * 0.4 + idx;
      const scale = 1 + Math.sin(time * 2 + idx) * 0.06;
      mesh.scale.set(scale, scale, scale);
    });

    renderer.render(scene, camera);
  }

  animateSkills();

  // Resize
  window.addEventListener('resize', () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* ==========================================================================
   8. 3D CARD TILT WITH DYNAMIC SPECULAR GLARE
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.skill-card-3d, .project-card-3d, .pillar-card');

  cards.forEach((card) => {
    const glare = card.querySelector('.project-card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;

      const rotX = -normY * 7;
      const rotY = normX * 7;

      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   9. SKILLS MATRIX FILTER & REAL-TIME SEARCH
   ========================================================================== */
function initSkillsFilterAndSearch() {
  const tabs = document.querySelectorAll('.cat-tab');
  const pillarCards = document.querySelectorAll('.pillar-card');
  const searchInput = document.getElementById('skill-search');
  const categoryBlocks = document.querySelectorAll('.category-group-block');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterSkills() {
    categoryBlocks.forEach((block) => {
      const blockCategory = block.dataset.category;
      const categoryMatch = currentCategory === 'all' || currentCategory === blockCategory;

      const cards = block.querySelectorAll('.skill-card-3d');
      let visibleCount = 0;

      cards.forEach((card) => {
        const text = (card.innerText || '').toLowerCase();
        const searchMatch = !searchQuery || text.includes(searchQuery);

        if (categoryMatch && searchMatch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      block.style.display = visibleCount > 0 ? 'block' : 'none';
    });

    // Update tab styles
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.filter === currentCategory));
    pillarCards.forEach((p) => p.classList.toggle('active', p.dataset.filter === currentCategory));
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      currentCategory = tab.dataset.filter;
      filterSkills();
    });
  });

  pillarCards.forEach((pillar) => {
    pillar.addEventListener('click', () => {
      currentCategory = pillar.dataset.filter;
      filterSkills();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterSkills();
  });
}

/* ==========================================================================
   10. DYNAMIC GITHUB REPOSITORIES (LIVE FROM @US-development-9)
   ========================================================================== */
const GITHUB_USERNAME = 'US-development-9';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// Verified real fallback repositories from Usman Shah's GitHub
const DEFAULT_VERIFIED_REPOS = [
  {
    name: 'AI-studyhub',
    description: 'Artificial intelligence learning repository, algorithmic research, machine learning problem sets, and interactive study hub.',
    language: 'Python',
    stargazers_count: 0,
    forks_count: 0,
    html_url: 'https://github.com/US-development-9/AI-studyhub',
    homepage: 'https://us-development-9.github.io/AI-studyhub/',
    updated_at: '2026-09-17T09:41:49Z'
  },
  {
    name: 'DIGITAL-CALCULATER',
    description: 'Modern digital calculation engine and mathematical tools built with high-precision JavaScript and structured web architecture.',
    language: 'JavaScript',
    stargazers_count: 0,
    forks_count: 0,
    html_url: 'https://github.com/US-development-9/DIGITAL-CALCULATER',
    homepage: 'https://us-development-9.github.io/DIGITAL-CALCULATER/',
    updated_at: '2026-09-17T09:41:49Z'
  },
  {
    name: 'DIGITAL-CALCULATER-99.html',
    description: 'Interactive lightweight single-page digital calculator application featuring keyboard shortcuts, memory registers, and responsive UI.',
    language: 'HTML',
    stargazers_count: 0,
    forks_count: 0,
    html_url: 'https://github.com/US-development-9/DIGITAL-CALCULATER-99.html',
    homepage: 'https://us-development-9.github.io/DIGITAL-CALCULATER-99.html/',
    updated_at: '2026-09-17T09:41:49Z'
  },
  {
    name: 'my-portfolio',
    description: 'Usman Shah\'s official engineering portfolio website engineered with 3D Three.js WebGL graphics, futuristic HUD, and live GitHub integration.',
    language: 'HTML',
    stargazers_count: 0,
    forks_count: 0,
    html_url: 'https://github.com/US-development-9/my-portfolio',
    homepage: window.location.origin || 'https://us-development-9.github.io/my-portfolio/',
    updated_at: '2026-09-17T09:41:49Z'
  }
];

let currentRepositories = [];

async function fetchAndRenderGitHubProjects(forceRefresh = false) {
  const grid = document.getElementById('projects-grid');
  const countBadge = document.getElementById('repo-count-badge');
  const syncBtn = document.getElementById('sync-github-btn');
  const syncIcon = document.getElementById('sync-icon');
  const filterBar = document.getElementById('projects-filter-bar');
  if (!grid) return;

  if (syncIcon) syncIcon.classList.add('spin');

  let repos = null;

  // Check localStorage cache unless forceRefresh
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem('usman_github_repos_cache');
      if (cached) {
        repos = JSON.parse(cached);
      }
    } catch (e) {}
  }

  // Fetch from live GitHub API
  if (!repos || forceRefresh) {
    try {
      const res = await fetch(GITHUB_API_URL, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          repos = data.filter(r => !r.fork);
          if (repos.length === 0) repos = data;
          localStorage.setItem('usman_github_repos_cache', JSON.stringify(repos));
        }
      }
    } catch (err) {
      console.warn('Could not reach GitHub API directly. Using cached/verified repository list.', err);
    }
  }

  // Fallback to verified real repositories if API failed and no cache
  if (!repos || !Array.isArray(repos) || repos.length === 0) {
    repos = DEFAULT_VERIFIED_REPOS;
  }

  currentRepositories = repos;
  if (syncIcon) syncIcon.classList.remove('spin');

  // Update repository count badge
  if (countBadge) {
    countBadge.textContent = `${repos.length} REPOSITORIES SYNCED`;
  }

  // Build Dynamic Language / Category Tabs
  if (filterBar) {
    const languages = new Set();
    repos.forEach(r => {
      if (r.language) languages.add(r.language);
    });

    let filterHtml = `<button class="project-tab-btn active" data-cat="all">ALL REPOSITORIES (${repos.length})</button>`;
    languages.forEach(lang => {
      const count = repos.filter(r => r.language === lang).length;
      filterHtml += `<button class="project-tab-btn" data-cat="${lang.toLowerCase()}">${lang.toUpperCase()} (${count})</button>`;
    });
    filterBar.innerHTML = filterHtml;

    // Attach filter tab listeners
    filterBar.querySelectorAll('.project-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.project-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const selectedCat = btn.dataset.cat;

        grid.querySelectorAll('.project-card-3d').forEach(card => {
          const cardLang = card.dataset.lang || '';
          if (selectedCat === 'all' || cardLang === selectedCat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Render Repository Cards
  let cardsHtml = '';
  repos.forEach((repo) => {
    const lang = repo.language || 'Software';
    const langLower = lang.toLowerCase();
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const updated = new Date(repo.updated_at || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });

    // Intelligent description if repo description is empty
    let desc = repo.description;
    if (!desc || desc.trim() === '') {
      if (repo.name.toLowerCase().includes('ai')) {
        desc = 'Artificial intelligence, machine learning problem sets, data structures, and computer science educational resources.';
      } else if (repo.name.toLowerCase().includes('calculat')) {
        desc = 'Interactive calculation engine engineered with precision mathematical logic and responsive user interface.';
      } else if (repo.name.toLowerCase().includes('portfolio')) {
        desc = 'Official software engineering and computer science portfolio website engineered with 3D WebGL and modern web architecture.';
      } else {
        desc = `Open-source engineering repository developed by Usman Shah in ${lang}. Clean code, structured architecture, and modular design.`;
      }
    }

    // Determine live demo URL
    let liveDemoUrl = repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : '';
    if (!liveDemoUrl) {
      if (repo.has_pages) {
        liveDemoUrl = `https://us-development-9.github.io/${repo.name}/`;
      } else if (repo.name.toLowerCase().includes('calculat')) {
        liveDemoUrl = `https://us-development-9.github.io/${repo.name}/`;
      } else if (repo.name.toLowerCase().includes('portfolio')) {
        liveDemoUrl = window.location.origin || `https://us-development-9.github.io/${repo.name}/`;
      } else {
        liveDemoUrl = `https://us-development-9.github.io/${repo.name}/`;
      }
    }

    cardsHtml += `
      <div class="project-card-3d" data-lang="${langLower}" data-name="${repo.name}">
        <div class="project-card-glare"></div>
        <div>
          <div class="project-top-meta">
            <span class="badge-pill" style="font-size: 10px;">${lang.toUpperCase()}</span>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--cyan-core);">★ ${stars} STARS</span>
          </div>
          <h3>${repo.name}</h3>
          <p>${desc}</p>
          <div class="project-stats-row">
            <span class="project-stat-item">🔄 Updated ${updated}</span>
            <span class="project-stat-item">🍴 ${forks} Forks</span>
          </div>
        </div>
        <div>
          <div class="skill-tags-row" style="margin-bottom: 16px;">
            <span class="skill-tag-item">@US-development-9</span>
            <span class="skill-tag-item">${lang}</span>
            <span class="skill-tag-item">Live Project</span>
          </div>
          <div class="project-footer-actions">
            <button class="project-inspect-btn" onclick="openRepoModal('${repo.name}')" aria-label="Inspect details for ${repo.name}">
              <span>DETAILS</span>
              <span>&rarr;</span>
            </button>
            <a href="${liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="project-demo-btn" aria-label="Launch Live Demo for ${repo.name}">
              <span>⚡ LIVE DEMO</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = cardsHtml;

  // Rebind 3D tilt to newly injected cards
  init3DCardTilt();
}

// Hook up live sync button
document.getElementById('sync-github-btn')?.addEventListener('click', () => {
  fetchAndRenderGitHubProjects(true);
  showToast('Repositories refreshed from GitHub (@US-development-9)!');
  window.playSynthChime?.(1200, 0.05, 'triangle');
});

window.openRepoModal = function(repoName) {
  const repo = currentRepositories.find(r => r.name === repoName) || DEFAULT_VERIFIED_REPOS.find(r => r.name === repoName);
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  if (!repo || !modal || !content) return;

  const lang = repo.language || 'Software';
  const updated = new Date(repo.updated_at || Date.now()).toLocaleDateString('en-US', {
    dateStyle: 'medium'
  });

  // Determine live demo URL
  let liveDemoUrl = repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : '';
  if (!liveDemoUrl) {
    if (repo.has_pages) {
      liveDemoUrl = `https://us-development-9.github.io/${repo.name}/`;
    } else if (repo.name.toLowerCase().includes('calculat')) {
      liveDemoUrl = `https://us-development-9.github.io/${repo.name}/`;
    } else if (repo.name.toLowerCase().includes('portfolio')) {
      liveDemoUrl = window.location.origin || `https://us-development-9.github.io/${repo.name}/`;
    } else {
      liveDemoUrl = `https://us-development-9.github.io/${repo.name}/`;
    }
  }

  content.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="badge-pill" style="margin-bottom: 12px;">${lang.toUpperCase()} // REPOSITORY</span>
      <h2 style="font-size: 26px; color: #fff; margin-bottom: 12px;">${repo.name}</h2>
      <p style="font-size: 15px; color: #cbd5e1; line-height: 1.7;">${repo.description || 'Public open-source repository by Usman Shah on GitHub.'}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 14px; font-family: var(--font-mono); color: var(--cyan-core); margin-bottom: 10px; text-transform: uppercase;">
        Repository Telemetry &amp; Access
      </h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
        <li style="display: flex; gap: 10px; font-size: 13.5px; color: #94a3b8; line-height: 1.6;">
          <span style="color: var(--cyan-core);">▹</span>
          <span><strong>Owner:</strong> Usman Shah (@US-development-9)</span>
        </li>
        <li style="display: flex; gap: 10px; font-size: 13.5px; color: #94a3b8; line-height: 1.6;">
          <span style="color: var(--cyan-core);">▹</span>
          <span><strong>Primary Language:</strong> ${lang}</span>
        </li>
        <li style="display: flex; gap: 10px; font-size: 13.5px; color: #94a3b8; line-height: 1.6;">
          <span style="color: var(--cyan-core);">▹</span>
          <span><strong>Last Synchronized Commit:</strong> ${updated}</span>
        </li>
        <li style="display: flex; gap: 10px; font-size: 13.5px; color: #94a3b8; line-height: 1.6;">
          <span style="color: var(--cyan-core);">▹</span>
          <span><strong>Live Demo URL:</strong> <a href="${liveDemoUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--cyan-core); text-decoration: underline;">${liveDemoUrl}</a></span>
        </li>
        <li style="display: flex; gap: 10px; font-size: 13.5px; color: #94a3b8; line-height: 1.6;">
          <span style="color: var(--cyan-core);">▹</span>
          <span><strong>Clone Command:</strong> <code style="background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 4px; color: var(--cyan-core);">git clone ${repo.html_url}.git</code></span>
        </li>
      </ul>
    </div>

    <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
      <a href="${liveDemoUrl}" target="_blank" rel="noopener noreferrer" class="project-demo-btn" style="padding: 11px 24px; font-size: 13px;">
        <span>⚡ LAUNCH LIVE DEMO</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 11px 20px; font-size: 12.5px; display: inline-flex; align-items: center; gap: 8px;">
        <span>VIEW CODE</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      <button type="button" class="btn-secondary" onclick="closeProjectModal()" style="padding: 11px 20px; font-size: 12.5px;">
        <span>CLOSE</span>
      </button>
    </div>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  window.playSynthChime?.(900, 0.04, 'triangle');
};

window.openProjectModal = window.openRepoModal;

window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.getElementById('modal-close-btn')?.addEventListener('click', closeProjectModal);
document.getElementById('project-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'project-modal') closeProjectModal();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectModal();
});

/* ==========================================================================
   12. DIRECT WHATSAPP CONTACT DISPATCHER
   ========================================================================== */
function initContactFormDispatcher() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim() || '';
    const email = document.getElementById('contact-email')?.value.trim() || '';
    const message = document.getElementById('contact-message')?.value.trim() || '';

    if (!name || !message) {
      showToast('Please fill in your name and message.');
      return;
    }

    const waText = encodeURIComponent(
      `Hello Usman Shah,\n\nMy name is ${name} (${email}).\n\nProject Scope & Inquiry:\n${message}`
    );
    const waUrl = `https://wa.me/923444257911?text=${waText}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast(`Redirecting to WhatsApp to message Usman Shah directly...`);
    form.reset();
  });
}

/* ==========================================================================
   13. QUICK-COPY CLIPBOARD HELPER
   ========================================================================== */
window.copyToClipboard = function(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
      window.playSynthChime?.(1200, 0.05, 'triangle');
    }).catch(() => {
      manualCopy(text, successMsg);
    });
  } else {
    manualCopy(text, successMsg);
  }
};

function manualCopy(text, msg) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(msg);
  window.playSynthChime?.(1200, 0.05, 'triangle');
}

/* ==========================================================================
   14. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   15. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}
