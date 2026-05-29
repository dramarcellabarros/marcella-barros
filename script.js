/* ============================================================
   DRA. MARCELLA BARROS — Site Institucional
   script.js
   ============================================================ */

/* ============================================================
   1. NAVBAR — scroll + menu mobile
   ============================================================ */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('navbar-burger');
  const links   = document.getElementById('navbar-links');
  if (!navbar) return;

  // Scroll: adiciona classe
  function handleScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburguer
  if (burger && links) {
    burger.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha ao clicar em um link
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


/* ============================================================
   2. ANIMAÇÕES DE ENTRADA — Intersection Observer
   ============================================================ */
(function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseFloat(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('is-visible'), delay * 1000);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();


/* ============================================================
   3. SCROLL SUAVE para links âncora
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.getElementById(this.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const offset = (document.getElementById('navbar')?.offsetHeight || 72);
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   4. LINK ATIVO na navbar (highlight conforme seção visível)
   ============================================================ */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--dourado-ambar)';
        }
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ============================================================
   5. BARRA DE PROGRESSO dourada no topo
   ============================================================ */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = `
    position:fixed; top:0; left:0;
    width:0%; height:2px;
    background:linear-gradient(90deg,#D09C64,#E8C490,#D09C64);
    z-index:200; transition:width .1s linear; pointer-events:none;
  `;
  document.body.appendChild(bar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = doc > 0 ? `${Math.min((window.scrollY / doc) * 100, 100)}%` : '0%';
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ============================================================
   6. PARALLAX SUTIL na foto do hero (desktop)
   ============================================================ */
(function initParallax() {
  if (window.innerWidth < 768) return;
  const photo = document.querySelector('.hero__photo, .hero__photo-placeholder');
  if (!photo) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      if (window.scrollY <= window.innerHeight) {
        photo.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ============================================================
   7. LAZY LOAD imagens
   ============================================================ */
document.querySelectorAll('img:not([loading])').forEach(img => {
  img.setAttribute('loading', 'lazy');
});
