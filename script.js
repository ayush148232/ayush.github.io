/* ============================================================
   PORTFOLIO — SCRIPT.JS
   All interactive features: typing animation, scroll effects,
   particle background, progress bars, and micro-interactions.
   ============================================================ */

// Wait until the full DOM is loaded before running any code
document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide icons (the icon library we loaded via CDN)
  lucide.createIcons();

  /* ==========================================================
     1. TYPING ANIMATION — cycles through an array of phrases
     ========================================================== */
  const typingElement = document.getElementById('typingText');
  const phrases = [
    'CSE Student',
    'Web Developer',
    'Problem Solver',
    'Tech Enthusiast',
    'Quick Learner'
  ];
  let phraseIndex = 0;   // which phrase we're on
  let charIndex = 0;      // which character we're on
  let isDeleting = false; // are we typing or deleting?

  function typeEffect() {
    const current = phrases[phraseIndex];

    // Build the visible text
    if (isDeleting) {
      typingElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    // Determine the speed for the next frame
    let speed = isDeleting ? 40 : 80;

    // If we finished typing the full phrase, pause then start deleting
    if (!isDeleting && charIndex === current.length) {
      speed = 1800; // pause at full phrase
      isDeleting = true;
    }

    // If we finished deleting, move to the next phrase
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400; // small pause before next phrase
    }

    setTimeout(typeEffect, speed);
  }

  // Kick off the typing animation
  typeEffect();

  /* ==========================================================
     2. NAVBAR — scroll effects & mobile menu toggle
     ========================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Add "scrolled" class to navbar when user scrolls down
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Toggle mobile nav menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ==========================================================
     3. ACTIVE NAV LINK — highlight based on scroll position
     ========================================================== */
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNav() {
    const scrollY = window.scrollY + 120; // offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Remove "active" from all links
        allNavLinks.forEach(link => link.classList.remove('active'));
        // Add "active" to the matching link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  /* ==========================================================
     4. SCROLL PROGRESS INDICATOR
     ========================================================== */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = progress + '%';
  }

  /* ==========================================================
     5. BACK TO TOP BUTTON
     ========================================================== */
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================
     6. COMBINED SCROLL HANDLER — runs all scroll functions
     ========================================================== */
  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    highlightActiveNav();
    updateScrollProgress();
    handleBackToTop();
  });

  // Run once on load to set initial states
  handleNavbarScroll();
  highlightActiveNav();
  updateScrollProgress();
  handleBackToTop();

  /* ==========================================================
     7. INTERSECTION OBSERVER — fade-in on scroll
     Uses the IntersectionObserver API to detect when elements
     enter the viewport and adds the "visible" class.
     ========================================================== */
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,          // observe relative to viewport
    threshold: 0.15,     // trigger when 15% of element is visible
    rootMargin: '0px 0px -40px 0px'  // slight offset from bottom
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // stop watching once visible
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  /* ==========================================================
     8. SKILL PROGRESS BARS — animate width when visible
     ========================================================== */
  const progressBars = document.querySelectorAll('.progress-fill');

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        // Small delay so the animation feels intentional
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, 200);
        progressObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  /* ==========================================================
     9. ANIMATED STAT COUNTERS — count up from 0
     ========================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));

  /**
   * Smoothly count from 0 to a target number.
   * @param {HTMLElement} element - the DOM element to update
   * @param {number} target - the final number to count to
   */
  function animateCounter(element, target) {
    let current = 0;
    const duration = 1500; // total animation time in ms
    const steps = 60;       // number of increments
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.round(current);
    }, stepTime);
  }

  /* ==========================================================
     10. PARTICLE / GRADIENT BACKGROUND CANVAS
     A subtle animated particle field behind the hero section.
     Lightweight — uses only a few particles.
     ========================================================== */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match window
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Create particle array
  const particles = [];
  const PARTICLE_COUNT = 50; // keep low for performance

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  /**
   * Draw lines between particles that are close to each other.
   * This creates the "connected nodes" effect.
   */
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Main animation loop
  function animateParticles() {
    // Clear the canvas with the background color
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a soft radial gradient behind everything
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.6
    );
    gradient.addColorStop(0, 'rgba(129, 140, 248, 0.04)');
    gradient.addColorStop(0.5, 'rgba(192, 132, 252, 0.02)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw each particle
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  /* ==========================================================
     11. MICRO-INTERACTION — ripple effect on button clicks
     Adds a brief visual ripple wherever you click a .btn
     ========================================================== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Create a ripple span
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.25)';
      ripple.style.pointerEvents = 'none';

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';

      this.appendChild(ripple);

      // Trigger the animation
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2.5)';
        ripple.style.opacity = '0';
      });

      // Remove the ripple element after animation
      setTimeout(() => ripple.remove(), 600);
    });
  });

}); // end DOMContentLoaded
