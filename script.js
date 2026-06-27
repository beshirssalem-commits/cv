/* =====================================================================
   BESHIR SAAD SALEM — PORTFOLIO SCRIPT
   Vanilla JS only. Organized by feature. Edit DATA objects below to
   update content (courses, projects) without touching layout logic.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     0. LOADER
  --------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 400);
  });
  // Fallback in case load event already fired / slow assets
  setTimeout(() => loader && loader.classList.add('hide'), 2500);

  /* ---------------------------------------------------------------
     1. FOOTER YEAR
  --------------------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     2. THEME TOGGLE (dark default, persists in-session only)
  --------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  let theme = 'dark';
  themeToggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  });

  /* ---------------------------------------------------------------
     3. NAV: scroll state + mobile toggle
  --------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------------------------------------------------------------
     4. TYPING EFFECT — rotating role titles
  --------------------------------------------------------------- */
  const roles = [
    'Instrumentation & Control Specialist',
    'Process Analytical Instruments Supervisor',
    'Acting Head of Instrumentation Division',
    'Oil & Gas Engineering Professional'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeTick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeTick, 1800);
        return;
      }
      setTimeout(typeTick, 45);
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeTick, 300);
        return;
      }
      setTimeout(typeTick, 22);
    }
  }
  typeTick();

  /* ---------------------------------------------------------------
     5. HERO SIGNAL CANVAS — animated instrumentation grid + pulse line
  --------------------------------------------------------------- */
  const canvas = document.getElementById('signalCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '58, 214, 238';
  }

  function drawSignal() {
    ctx.clearRect(0, 0, w, h);
    const rgb = getAccent();
    const rows = 4;
    const amp = 18 * devicePixelRatio;
    const gap = h / (rows + 1);

    for (let r = 1; r <= rows; r++) {
      const y0 = gap * r;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${rgb}, ${0.12 + r * 0.02})`;
      ctx.lineWidth = 1.4 * devicePixelRatio;
      for (let x = 0; x <= w; x += 4 * devicePixelRatio) {
        const phase = (x / (60 * devicePixelRatio)) + t * (0.015 + r * 0.004) + r * 2;
        const y = y0 + Math.sin(phase) * amp * (0.4 + 0.15 * r);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    t += 1;
    if (!reduceMotion) requestAnimationFrame(drawSignal);
  }
  drawSignal();

  /* ---------------------------------------------------------------
     6. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------
     7. ANIMATED COUNTERS (hero stats)
  --------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------------
     8. LANGUAGE / DIGITAL SKILL METERS
  --------------------------------------------------------------- */
  const meters = document.querySelectorAll('.meter-fill');
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.pct + '%';
        meterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  meters.forEach(el => meterObserver.observe(el));

  /* ---------------------------------------------------------------
     9. TIMELINE PROGRESS RAIL
  --------------------------------------------------------------- */
  const timeline = document.getElementById('timeline');
  const railFill = document.getElementById('railFill');
  const timelineItems = document.querySelectorAll('.timeline-item');

  function updateRail() {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.65;
    const total = rect.height;
    const passed = Math.min(Math.max(viewportCenter - rect.top, 0), total);
    railFill.style.height = (passed / total * 100) + '%';

    timelineItems.forEach(item => {
      const r = item.getBoundingClientRect();
      item.classList.toggle('active', r.top < viewportCenter);
    });
  }
  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail);
  updateRail();

  /* ---------------------------------------------------------------
     10. BACK TO TOP
  --------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------------------------------------------------------
     11. COPY BUTTONS (phone / email)
  --------------------------------------------------------------- */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const value = btn.dataset.copy;
      navigator.clipboard.writeText(value).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1800);
      });
    });
  });

  /* ---------------------------------------------------------------
     12. SOCIAL LINKS
     LinkedIn is a placeholder — update once a public profile URL exists.
     GitHub points to the repository hosting this site.
  --------------------------------------------------------------- */
  document.getElementById('githubLink').href = 'https://github.com/beshirssalem-commits/cv';
  // document.getElementById('linkedinLink').href = 'https://linkedin.com/in/your-profile';

  /* =================================================================
     13. PROFESSIONAL COURSES — DATA (edit this array to add/remove)
  ================================================================= */
  const courses = [
    'Distributed Control System (DCS) Operation & Maintenance — Arab Academy for Advanced Studies, Egypt',
    'Risk Assessment',
    'Microsoft Outlook',
    'Process Analytical Instrumentation',
    'Pneumatic Converters',
    'Process Control Techniques',
    'Maintenance Management System — Train the Trainer',
    'Pneumatic Level Transmitters',
    'Pneumatic Flow Transmitters',
    'Pneumatic Pressure Transmitters',
    'Instrumentation Symbols & P&ID',
    'Instrumentation Level Measurement',
    'Flow & Temperature Measurement Fundamentals',
    'Electrical & Electronic Circuits',
    'Instrumentation Electrical & Mechanical Installation',
    'Pressure Measurement Fundamentals',
    'Industrial Safety Fundamentals'
  ];
  const courseGrid = document.getElementById('courseGrid');
  courseGrid.innerHTML = courses.map(c => `<div class="course-chip" data-reveal>${c}</div>`).join('');
  // Re-observe newly injected reveal elements
  courseGrid.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* =================================================================
     14. MAJOR PROJECTS — DATA (edit this array to add/remove projects)
  ================================================================= */
  const projects = [
    {
      tag: 'PRJ-01 · VIBRATION MONITORING',
      title: 'Bently Nevada System 1 EVO Upgrade',
      summary: 'Modernization of the plant\u2019s machinery protection and condition-monitoring platform.',
      overview: 'Led the technical evaluation and upgrade planning for migrating legacy Bently Nevada monitoring infrastructure to System 1 EVO, improving real-time visibility into rotating equipment health.',
      responsibilities: [
        'Technical evaluation of upgrade scope and compatibility',
        'Coordination with vendor on migration sequencing',
        'Field verification of monitoring nodes and wiring',
        'Documentation of as-built configuration'
      ],
      technologies: ['Bently Nevada System 1 EVO', 'Vibration Monitoring', 'Machinery Protection'],
      challenges: 'Migrating without interrupting continuous condition-monitoring coverage on critical rotating machinery during a live production environment.',
      solutions: 'Phased cutover plan with parallel monitoring during transition, verified against historical baseline trends before full handover.',
      impact: 'Improved diagnostic resolution and alarm reliability on critical machinery, supporting RASCO\u2019s reliability program.'
    },
    {
      tag: 'PRJ-02 · TANK GAUGING',
      title: 'Rosemount 5408 Radar Tank Modernization',
      summary: 'Replacement of legacy tank gauging with radar-based level measurement.',
      overview: 'Oversaw the technical scope for upgrading storage tank level measurement to Rosemount 5408 radar transmitters, improving accuracy for inventory and custody-relevant measurement.',
      responsibilities: [
        'Engineering review of tank nozzle and mounting requirements',
        'Calibration and commissioning of radar transmitters',
        'Loop verification against control system',
        'Technical liaison with vendor engineers'
      ],
      technologies: ['Rosemount 5408', 'Radar Level Measurement', 'Tank Gauging'],
      challenges: 'Ensuring measurement accuracy and signal stability across varying tank conditions and legacy mechanical interfaces.',
      solutions: 'Careful mounting and antenna selection per tank geometry, followed by methodical commissioning and cross-checking against reference methods.',
      impact: 'More accurate, lower-maintenance level measurement with reduced reliance on mechanical gauging.'
    },
    {
      tag: 'PRJ-03 · GAS CHROMATOGRAPHY',
      title: 'Yokogawa GC8000 Upgrade',
      summary: 'Upgrade and reliability improvement of process gas chromatograph analytical trains.',
      overview: 'Supervised upgrade work on Yokogawa GC8000 process gas chromatographs supporting custody and process-control measurement, focusing on analytical accuracy and uptime.',
      responsibilities: [
        'Supervision of analyzer upgrade and recommissioning',
        'Calibration gas system verification',
        'Performance validation against reference samples',
        'Technical reporting on analyzer reliability'
      ],
      technologies: ['Yokogawa GC8000', 'Process Gas Chromatography', 'Calibration Gas Systems'],
      challenges: 'Minimizing analytical downtime while maintaining measurement integrity for process-critical streams.',
      solutions: 'Scheduled upgrade windows aligned with process conditions, with rigorous post-upgrade validation against known reference gases.',
      impact: 'Restored and improved analytical reliability, supporting tighter process control and reduced analyzer downtime.'
    },
    {
      tag: 'PRJ-04 · LEGACY MIGRATION',
      title: 'Foxboro Pneumatic Modernization',
      summary: 'Migration from legacy pneumatic instrumentation to modern electronic transmitters.',
      overview: 'Technical lead for the phased replacement of aging Foxboro pneumatic transmitters and converters with modern electronic instrumentation, reducing maintenance burden and improving signal reliability.',
      responsibilities: [
        'Inventory and condition assessment of pneumatic loops',
        'Specification of replacement electronic transmitters',
        'Loop-by-loop migration planning to avoid process disruption',
        'Commissioning and calibration of new instruments'
      ],
      technologies: ['Pneumatic Systems', 'Signal Converters', 'Electronic Transmitters'],
      challenges: 'Replacing instrumentation embedded in decades-old piping and control logic without disrupting continuous operations.',
      solutions: 'Sequenced loop-by-loop migration with temporary bypass procedures and close coordination with operations.',
      impact: 'Reduced pneumatic-system maintenance load and improved measurement accuracy across migrated loops.'
    },
    {
      tag: 'PRJ-05 · LIQUID ANALYSIS',
      title: 'Yokogawa FLXA202 Migration',
      summary: 'Migration of liquid analyzer transmitters to the Yokogawa FLXA202 platform.',
      overview: 'Managed the technical migration of pH and conductivity measurement points to the Yokogawa FLXA202 two-wire analyzer platform, consolidating maintenance and improving diagnostics.',
      responsibilities: [
        'Migration scope definition across affected measurement points',
        'Sensor compatibility verification',
        'Commissioning and calibration of new transmitters',
        'Operator and technician familiarization support'
      ],
      technologies: ['Yokogawa FLXA202', 'pH Analyzers', 'Conductivity Analyzers'],
      challenges: 'Ensuring sensor and wiring compatibility across a fleet of analyzers with varying installation histories.',
      solutions: 'Point-by-point compatibility audit before procurement, followed by staged commissioning with calibration verification.',
      impact: 'Standardized liquid-analysis instrumentation platform, simplifying spares and improving diagnostic visibility.'
    },
    {
      tag: 'PRJ-06 · PROCESS SAFETY',
      title: 'Aromatic Benzene Upgrade',
      summary: 'Instrumentation upgrade supporting benzene measurement and process safety.',
      overview: 'Contributed instrumentation engineering support to an aromatic unit upgrade with emphasis on benzene measurement accuracy and process safety instrumentation integrity.',
      responsibilities: [
        'Technical input on instrumentation scope for the upgrade',
        'Verification of measurement points relevant to benzene monitoring',
        'Coordination with engineering studies and safety reviews',
        'Field support during implementation'
      ],
      technologies: ['Process Analyzers', 'Safety Instrumentation', 'Engineering Studies'],
      challenges: 'Balancing upgrade implementation with strict process-safety requirements around aromatic handling.',
      solutions: 'Close alignment with engineering studies and safety review checkpoints throughout the upgrade scope.',
      impact: 'Strengthened measurement integrity around a safety-sensitive process stream.'
    },
    {
      tag: 'PRJ-07 · VENDOR EVALUATION',
      title: 'WOMA Pump Technical Evaluation',
      summary: 'Technical evaluation supporting procurement of WOMA high-pressure pump equipment.',
      overview: 'Led the technical evaluation phase for WOMA pump procurement, assessing vendor proposals against operational requirements and instrumentation interface needs.',
      responsibilities: [
        'Technical evaluation of vendor proposals',
        'Assessment of instrumentation and control interface requirements',
        'Liaison between procurement and vendor technical teams',
        'Evaluation report preparation'
      ],
      technologies: ['Vendor Evaluation', 'Procurement Support', 'Technical Reports'],
      challenges: 'Comparing competing vendor proposals on technical merit while keeping integration requirements realistic.',
      solutions: 'Structured technical evaluation criteria covering performance, interface compatibility, and maintainability.',
      impact: 'Informed procurement decision-making with a clear, documented technical basis.'
    },
    {
      tag: 'PRJ-08 · MECHANICAL RESTORATION',
      title: 'Compressor Overhead Crane Restoration',
      summary: 'Engineering support for restoring overhead crane infrastructure serving compressor maintenance.',
      overview: 'Provided engineering and technical evaluation support for restoring overhead crane systems critical to compressor maintenance access and turnaround execution.',
      responsibilities: [
        'Technical assessment of crane system condition',
        'Coordination of restoration scope with engineering studies',
        'Support for project planning and scheduling',
        'Verification of restored system readiness'
      ],
      technologies: ['Engineering Studies', 'Project Planning', 'Mechanical Restoration'],
      challenges: 'Restoring critical lifting infrastructure without delaying dependent maintenance and turnaround activities.',
      solutions: 'Tight scheduling integration with turnaround planning and proactive technical assessment ahead of need.',
      impact: 'Restored reliable crane access supporting compressor maintenance continuity.'
    }
  ];

  const projectGrid = document.getElementById('projectGrid');
  projectGrid.innerHTML = projects.map((p, i) => `
    <article class="project-card" data-reveal data-index="${i}" tabindex="0" role="button" aria-haspopup="dialog">
      <span class="proj-tag">${p.tag}</span>
      <h3>${p.title}</h3>
      <p>${p.summary}</p>
      <span class="proj-open">View full scope <svg width="12" height="12" viewBox="0 0 24 24" style="stroke:currentColor;fill:none;stroke-width:2"><path d="M5 12h14m0 0l-6-6m6 6l-6 6"/></svg></span>
    </article>
  `).join('');
  projectGrid.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------
     15. PROJECT MODAL
  --------------------------------------------------------------- */
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openProject(i) {
    const p = projects[i];
    modalContent.innerHTML = `
      <span class="proj-tag">${p.tag}</span>
      <h2 id="modalTitle">${p.title}</h2>
      <div class="modal-block"><h4>Overview</h4><p>${p.overview}</p></div>
      <div class="modal-block"><h4>Responsibilities</h4><ul>${p.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul></div>
      <div class="modal-block"><h4>Technologies</h4><div class="modal-tags">${p.technologies.map(t => `<span>${t}</span>`).join('')}</div></div>
      <div class="modal-block"><h4>Engineering Challenges</h4><p>${p.challenges}</p></div>
      <div class="modal-block"><h4>Solutions</h4><p>${p.solutions}</p></div>
      <div class="modal-block"><h4>Impact</h4><p>${p.impact}</p></div>
    `;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }
  function closeProject() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  projectGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (card) openProject(parseInt(card.dataset.index, 10));
  });
  projectGrid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.project-card');
      if (card) { e.preventDefault(); openProject(parseInt(card.dataset.index, 10)); }
    }
  });
  modalClose.addEventListener('click', closeProject);
  modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeProject(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProject(); });

});
