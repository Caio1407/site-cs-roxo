document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     MENU MOBILE
  ========================================================= */
  const alternar_menu = document.getElementById('alternar_menu');
  const menu_principal = document.getElementById('menu_principal');

  const closeNav = () => {
    menu_principal.classList.remove('aberto');
    alternar_menu.setAttribute('aria-expanded', 'false');
    alternar_menu.setAttribute('aria-label', 'Abrir menu');
  };

  alternar_menu.addEventListener('click', () => {
    const isOpen = menu_principal.classList.toggle('aberto');
    alternar_menu.setAttribute('aria-expanded', String(isOpen));
    alternar_menu.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  menu_principal.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  /* =========================================================
     REVELAÇÃO AO ROLAR
  ========================================================= */
  const revealEls = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visivel'));
  }

  /* =========================================================
     CONTADOR DE ESTATÍSTICAS
  ========================================================= */
  const statNumbers = document.querySelectorAll('.numero_estatistica');
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
  const voltar_topo = document.getElementById('voltar_topo');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 480) voltar_topo.classList.add('visivel');
    else voltar_topo.classList.remove('visivel');
  }, { passive: true });

  voltar_topo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* =========================================================
     FORMULÁRIO DE CONTATO — validação + envio simulado
  ========================================================= */
  const form = document.getElementById('formulario_contato');
  const successMsg = document.getElementById('sucesso_formulario');
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const validators = {
    nome: (v) => v.trim().length >= 2 || 'Informe seu nome.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Informe um e-mail válido.',
    mensagem: (v) => v.trim().length >= 10 || 'Conte um pouco mais (mín. 10 caracteres).'
  };

  const setError = (fieldName, message) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    const row = field.closest('.linha_formulario');
    if (message) {
      row.classList.add('com_erro');
      errorEl.textContent = message;
    } else {
      row.classList.remove('com_erro');
      errorEl.textContent = '';
    }
  };

  form.addEventListener('submit', async (e) => {
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

    const dadosMensagem = {
      nome: form.querySelector('[name="nome"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      empresa: form.querySelector('[name="empresa"]').value.trim(),
      mensagem: form.querySelector('[name="mensagem"]').value.trim()
    };

    const { error } = await supabaseClient.from('mensagens_contato').insert([dadosMensagem]);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensagem';

    if (error) {
      successMsg.classList.add('erro');
      successMsg.textContent = 'Não foi possível enviar sua mensagem. Tente novamente em instantes.';
      return;
    }

    successMsg.classList.remove('erro');
    successMsg.textContent = 'Mensagem enviada! Retornaremos em até 1 dia útil.';
    form.reset();
  });

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.closest('.linha_formulario').classList.contains('com_erro')) {
        const validator = validators[field.name];
        if (validator && validator(field.value) === true) {
          setError(field.name, null);
        }
      }
    });
  });

});
