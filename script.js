document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     MENU MOBILE
  ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  /* =========================================================
     REVELAÇÃO AO ROLAR
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* =========================================================
     CONTADOR DE ESTATÍSTICAS
  ========================================================= */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach(el => statObserver.observe(el));
  } else {
    statNumbers.forEach(el => { el.textContent = el.getAttribute('data-count'); });
  }

  /* =========================================================
     BOTÃO VOLTAR AO TOPO
  ========================================================= */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 480) backToTop.classList.add('is-visible');
    else backToTop.classList.remove('is-visible');
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* =========================================================
     FORMULÁRIO DE CONTATO — validação + envio simulado
  ========================================================= */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const validators = {
    nome: (v) => v.trim().length >= 2 || 'Informe seu nome.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Informe um e-mail válido.',
    mensagem: (v) => v.trim().length >= 10 || 'Conte um pouco mais (mín. 10 caracteres).'
  };

  const setError = (fieldName, message) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    const row = field.closest('.form-row');
    if (message) {
      row.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      row.classList.remove('has-error');
      errorEl.textContent = '';
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.keys(validators).forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const result = validators[fieldName](field.value);
      if (result !== true) {
        setError(fieldName, result);
        isValid = false;
      } else {
        setError(fieldName, null);
      }
    });

    if (!isValid) {
      successMsg.textContent = '';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Simulação de envio (sem backend conectado neste protótipo).
    setTimeout(() => {
      successMsg.textContent = 'Mensagem enviada! Retornaremos em até 1 dia útil.';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensagem';
    }, 900);
  });

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.closest('.form-row').classList.contains('has-error')) {
        const validator = validators[field.name];
        if (validator && validator(field.value) === true) {
          setError(field.name, null);
        }
      }
    });
  });

});
