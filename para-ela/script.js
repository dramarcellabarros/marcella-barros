/* ============================================================
   PARA ELA — Dra. Marcella Barros
   script.js — Interações e animações
   ============================================================ */

/* ============================================================
   1. NAVBAR: adiciona classe ao rolar
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();


/* ============================================================
   2. ANIMAÇÕES DE ENTRADA — Intersection Observer
   ============================================================ */
(function initRevealAnimations() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.dataset.delay || 0);
          setTimeout(() => { el.classList.add('is-visible'); }, delay * 1000);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();


/* ============================================================
   3. SCROLL SUAVE para links âncora internos
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   4. RASTREAMENTO GA4 — Eventos de conversão
   ============================================================ */
(function initTracking() {
  function track(eventName, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, Object.assign({ event_category: 'para_ela' }, params));
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); return; }
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  onReady(function() {

    // Vouchers PagBank
    document.getElementById('btn-voucher-500')?.addEventListener('click', function() {
      track('click_voucher_pagbank', { event_label: 'voucher_500' });
    });
    document.getElementById('btn-voucher-800')?.addEventListener('click', function() {
      track('click_voucher_pagbank', { event_label: 'voucher_800' });
    });
    document.getElementById('btn-voucher-1200')?.addEventListener('click', function() {
      track('click_voucher_pagbank', { event_label: 'voucher_1200' });
    });

    // WhatsApp campanha
    document.getElementById('btn-whatsapp-para-ela')?.addEventListener('click', function() {
      track('click_whatsapp_para_ela', { event_label: 'conversao_whatsapp' });
    });

    // CTAs hero
    document.querySelectorAll('.hero__ctas .btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        track('click_hero_cta', { event_label: this.textContent.trim() });
      });
    });

  });
})();


/* ============================================================
   5. EFEITO PARALLAX SUTIL na hero photo (desktop only)
   ============================================================ */
(function initParallax() {
  if (window.innerWidth < 768) return;
  const heroPhoto = document.querySelector('.hero__photo, .hero__photo-placeholder');
  if (!heroPhoto) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    if (scrollY <= window.innerHeight) {
      heroPhoto.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================================
   6. ANIMAÇÃO DOURADA nas frases de citação (hover)
   ============================================================ */
(function initQuoteHover() {
  document.querySelectorAll('.quote-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 12px 40px rgba(208, 156, 100, 0.18)';
      this.style.borderColor = 'rgba(208, 156, 100, 0.35)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.boxShadow = '';
      this.style.borderColor = '';
    });
  });
})();


/* ============================================================
   7. INDICADOR DE PROGRESSO DE LEITURA (linha dourada no topo)
   ============================================================ */
(function initReadingProgress() {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 0%; height: 2px;
    background: linear-gradient(90deg, #D09C64, #E8C490, #D09C64);
    z-index: 200; transition: width 0.1s linear; pointer-events: none;
  `;
  document.body.appendChild(bar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = docHeight > 0 ? `${Math.min((window.scrollY / docHeight) * 100, 100)}%` : '0%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================================
   8. LAZY LOAD de imagens
   ============================================================ */
document.querySelectorAll('img:not([loading])').forEach(img => {
  img.setAttribute('loading', 'lazy');
});
