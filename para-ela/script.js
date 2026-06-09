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
  handleScroll(); // aplica no carregamento
})();


/* ============================================================
   2. ANIMAÇÕES DE ENTRADA — Intersection Observer
      Elementos com [data-reveal] entram ao aparecer na tela
   ============================================================ */
(function initRevealAnimations() {
  // Respeita preferência de animação reduzida
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Torna todos os elementos visíveis imediatamente
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

          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay * 1000);

          observer.unobserve(el); // anima uma vez só
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
  });
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

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();


/* ============================================================
   4. BOTÕES DO PAGBANK — aviso de link placeholder
      Intercepta clicks em links com "PAGBANK_LINK_"
      e alerta o desenvolvedor no console (não afeta usuário final)
   ============================================================ */
(function initPagBankLinks() {
  const pagBankButtons = document.querySelectorAll('a[href^="PAGBANK_LINK_"]');

  pagBankButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const valor = this.dataset.valor || '?';

      // ⚠️  Se o link não foi substituído, evita abrir uma página inválida
      const href = this.getAttribute('href');
      if (href.startsWith('PAGBANK_LINK_')) {
        e.preventDefault();
        console.warn(
          `[Para Ela] 🔗 Link do PagBank para R$ ${valor} ainda não configurado.\n` +
          `Substitua "${href}" pelo link real do PagBank no index.html.`
        );

        // Feedback visual temporário no botão
        const originalText = this.textContent;
        this.textContent = 'Link em breve ✦';
        this.style.opacity = '0.7';
        this.style.pointerEvents = 'none';

        setTimeout(() => {
          this.textContent = originalText;
          this.style.opacity = '';
          this.style.pointerEvents = '';
        }, 2500);
      }
    });
  });
})();


/* ============================================================
   5. WHATSAPP — aviso de número placeholder
   ============================================================ */
(function initWhatsAppLink() {
  const waLinks = document.querySelectorAll('a[href*="55XXXXXXXXXXX"]');

  waLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      console.warn(
        '[Para Ela] 📱 Número do WhatsApp ainda não configurado.\n' +
        'Substitua "55XXXXXXXXXXX" pelo número real no index.html.\n' +
        'Formato: 55 + DDD + número (sem espaços ou símbolos). Ex: 5511999999999'
      );

      // Feedback visual
      const originalText = this.innerHTML;
      this.textContent = 'Configure o WhatsApp ✦';
      this.style.opacity = '0.7';

      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.opacity = '';
      }, 2500);
    });
  });
})();


/* ============================================================
   6. EFEITO PARALLAX SUTIL na hero photo (desktop only)
   ============================================================ */
(function initParallax() {
  // Apenas em telas maiores (não em mobile, por performance)
  if (window.innerWidth < 768) return;

  const heroPhoto = document.querySelector('.hero__photo, .hero__photo-placeholder');
  if (!heroPhoto) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight;

    if (scrollY <= maxScroll) {
      const offset = scrollY * 0.12;
      heroPhoto.style.transform = `translateY(${offset}px)`;
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
   7. ANIMAÇÃO DOURADA nas frases de citação (hover)
   ============================================================ */
(function initQuoteHover() {
  const quotes = document.querySelectorAll('.quote-card');

  quotes.forEach(card => {
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
   8. INDICADOR DE PROGRESSO DE LEITURA (linha dourada no topo)
   ============================================================ */
(function initReadingProgress() {
  // Cria a barra de progresso
  const bar = document.createElement('div');
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, #D09C64, #E8C490, #D09C64);
    z-index: 200;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================================
   9. LAZY LOAD de imagens (nativas com IntersectionObserver)
   ============================================================ */
(function initLazyImages() {
  // Adiciona loading="lazy" a todas as <img> que não têm
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
})();


/* ============================================================
   10. LOG DE CONFIGURAÇÃO no console (para o dev)
   ============================================================ */
(function devLog() {
  const style = [
    'background: linear-gradient(90deg, #3A3330, #2A2420)',
    'color: #D09C64',
    'padding: 8px 16px',
    'border-radius: 4px',
    'font-family: monospace',
    'font-size: 12px'
  ].join(';');

  console.log('%c✦ Para Ela — Dra. Marcella Barros ✦', style);
  console.log(
    '%c📋 Checklist de configuração:\n' +
    '  [ ] Adicionar foto: assets/foto-marcella.jpg\n' +
    '  [ ] Adicionar logo: assets/logo-dourado.svg\n' +
    '  [ ] Adicionar logo: assets/logo-preto.svg\n' +
    '  [ ] Substituir PAGBANK_LINK_500 pelo link real\n' +
    '  [ ] Substituir PAGBANK_LINK_800 pelo link real\n' +
    '  [ ] Substituir PAGBANK_LINK_1200 pelo link real\n' +
    '  [ ] Substituir 55XXXXXXXXXXX pelo número do WhatsApp\n' +
    '  [ ] Subir no GitHub Pages (veja README-deploy.md)',
    'color: #AA8F72; font-family: monospace; font-size: 11px;'
  );
})();
