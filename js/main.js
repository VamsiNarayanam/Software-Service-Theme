document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initSmoothScroll();
  initCounters();
  initTestimonials();
  initFAQ();
  initContactForm();
  initLoginForm();
  initRegisterForm();
  initScrollReveal();
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.navbar__mobile-toggle');
  const menu = document.querySelector('.navbar__menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.navbar__dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.navbar__link');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.querySelectorAll('.navbar__dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
      });
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar__dropdown')) {
      document.querySelectorAll('.navbar__dropdown').forEach(d => d.classList.remove('open'));
    }
  });

  menu.querySelectorAll('.navbar__dropdown-link').forEach(link => {
    link.addEventListener('click', (e) => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
      document.querySelectorAll('.navbar__dropdown').forEach(d => d.classList.remove('open'));
    });
  });

  menu.querySelectorAll('.navbar__link:not(.navbar__dropdown .navbar__link)').forEach(link => {
    link.addEventListener('click', (e) => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme === 'dark' ? 'dark' : '');
  updateThemeIcon(toggle, savedTheme);

  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(toggle, newTheme);
  });
}

function updateThemeIcon() {
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('h3[data-count]');
  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'), 10);
        animateCounter(counter, 0, target, 2000);
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);
    element.textContent = prefix + current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  let currentIndex = 0;

  function showTestimonial(index) {
    currentIndex = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('hidden', i !== currentIndex);
    });
  }

  showTestimonial(0);
  setInterval(() => showTestimonial(currentIndex + 1), 5000);
}

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;
    form.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('input, textarea');
      const errorMsg = group.querySelector('.error-message');
      if (!input) return;
      if (errorMsg) errorMsg.remove();

      const value = input.value.trim();
      const required = input.hasAttribute('required');

      if (required && !value) {
        isValid = false;
        showError(group, 'This field is required', input);
      } else if (input.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        showError(group, 'Please enter a valid email address', input);
      } else {
        input.classList.remove('error');
      }
    });

    if (isValid) {
      form.reset();
      window.location.href = '404.html';
    }
  });
}

function showError(group, message, input) {
  input.classList.add('error');
  const errorEl = document.createElement('span');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  group.appendChild(errorEl);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const tabs = document.querySelectorAll('.auth-tabs__button');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabType = tab.dataset.tab;
      

      tabs.forEach(t => t.classList.remove('auth-tabs__button--active'));
      tab.classList.add('auth-tabs__button--active');
      
     
      const cardHeader = document.querySelector('.auth-card__header p');
      if (cardHeader) {
        if (tabType === 'admin') {
          cardHeader.textContent = 'Sign in to access your Stackly admin panel';
        } else {
          cardHeader.textContent = 'Sign in to access your Stackly account';
        }
      }
    });
  });

  const msgEl = document.getElementById('authMessage');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    const password = form.querySelector('input[type="password"]');
    const emailVal = email ? email.value.trim() : '';
    const passVal = password ? password.value.trim() : '';

    if (msgEl) {
      msgEl.hidden = false;
      msgEl.classList.remove('auth-message--success');
      msgEl.classList.add('auth-message--error');
    }

    if (!emailVal || !passVal) {
      if (msgEl) msgEl.textContent = 'Details not filled';
      return;
    }
    window.location.href = '404.html';
  });
}

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const msgEl = document.getElementById('authMessage');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[type="email"]');
    const password = form.querySelectorAll('input[type="password"]');
    const nameVal = name ? name.value.trim() : '';
    const emailVal = email ? email.value.trim() : '';
    const passVal = password[0] ? password[0].value.trim() : '';
    const confirmVal = password[1] ? password[1].value.trim() : '';

    if (msgEl) {
      msgEl.hidden = false;
      msgEl.classList.remove('auth-message--success');
      msgEl.classList.add('auth-message--error');
    }

    if (!nameVal || !emailVal || !passVal || !confirmVal) {
      if (msgEl) msgEl.textContent = 'Details not filled';
      return;
    }
    if (passVal !== confirmVal) {
      if (msgEl) msgEl.textContent = 'Passwords do not match';
      return;
    }
    window.location.href = '404.html';
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.service-card, .blog-card, .portfolio-card, .pricing-card, .team__card, .process__step, .tech__item, .about__feature, .journey__item, .clients__item'
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 50);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
