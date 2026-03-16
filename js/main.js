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
  initServiceDetails();
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
    form.querySelectorAll('.form-group:not(#contactMessage)').forEach(group => {
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
      showContactSuccess();
      form.reset();
    }
  });
}

function showContactSuccess() {
  const messageEl = document.getElementById('contactMessage');
  if (!messageEl) return;
  
  messageEl.className = 'contact-form-message contact-form-message--success';
  messageEl.textContent = '✓ Message sent successfully! We\'ll get back to you within 24 hours.';
  messageEl.style.display = 'block';
  
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 5000);
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

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const msgEl = document.getElementById('authMessage');
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const passVal = passwordInput ? passwordInput.value.trim() : '';
    
    // Clear previous error states
    form.querySelectorAll('input').forEach(input => input.classList.remove('error'));
    
    let hasError = false;
    
    // Validate email
    if (!emailVal) {
      if (msgEl) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Email is required';
      }
      emailInput.classList.add('error');
      hasError = true;
    } else if (!isValidEmail(emailVal)) {
      if (msgEl) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Please enter a valid email address';
      }
      emailInput.classList.add('error');
      hasError = true;
    }
    
    // Validate password
    if (!passVal) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Password is required';
      }
      passwordInput.classList.add('error');
      hasError = true;
    } else if (passVal.length < 6) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Password must be at least 6 characters';
      }
      passwordInput.classList.add('error');
      hasError = true;
    }
    
    // If validation passes, show success and redirect
    if (!hasError) {
      if (msgEl) {
        msgEl.hidden = false;
        msgEl.classList.remove('auth-message--error');
        msgEl.classList.add('auth-message--success');
        msgEl.textContent = '✓ Login successful! Redirecting...';
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 1500);
    }
  });
}

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const msgEl = document.getElementById('authMessage');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    const passwordInput = passwordInputs[0];
    const confirmInput = passwordInputs[1];
    
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const passVal = passwordInput ? passwordInput.value.trim() : '';
    const confirmVal = confirmInput ? confirmInput.value.trim() : '';
    
    // Clear previous error states
    form.querySelectorAll('input').forEach(input => input.classList.remove('error'));
    
    let hasError = false;
    
    // Validate name
    if (!nameVal) {
      if (msgEl) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Full name is required';
      }
      nameInput.classList.add('error');
      hasError = true;
    } else if (nameVal.length < 2) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Name must be at least 2 characters';
      }
      nameInput.classList.add('error');
      hasError = true;
    }
    
    // Validate email
    if (!emailVal) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Email is required';
      }
      emailInput.classList.add('error');
      hasError = true;
    } else if (!isValidEmail(emailVal)) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Please enter a valid email address';
      }
      emailInput.classList.add('error');
      hasError = true;
    }
    
    // Validate password
    if (!passVal) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Password is required';
      }
      passwordInput.classList.add('error');
      hasError = true;
    } else if (passVal.length < 6) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Password must be at least 6 characters';
      }
      passwordInput.classList.add('error');
      hasError = true;
    }
    
    // Validate confirm password
    if (!confirmVal) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Please confirm your password';
      }
      confirmInput.classList.add('error');
      hasError = true;
    } else if (passVal !== confirmVal) {
      if (msgEl && !hasError) {
        msgEl.hidden = false;
        msgEl.classList.add('auth-message--error');
        msgEl.classList.remove('auth-message--success');
        msgEl.textContent = '❌ Passwords do not match';
      }
      passwordInput.classList.add('error');
      confirmInput.classList.add('error');
      hasError = true;
    }
    
    // If validation passes, show success and redirect
    if (!hasError) {
      if (msgEl) {
        msgEl.hidden = false;
        msgEl.classList.remove('auth-message--error');
        msgEl.classList.add('auth-message--success');
        msgEl.textContent = '✓ Account created successfully! Redirecting...';
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 1500);
    }
  });
}

function initServiceDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get('service');
  
  if (!service) return;

  const serviceContent = {
    'web-development': {
      title: 'Web Development',
      subtitle: 'Full-Stack Web Solutions',
      description: 'We build scalable, performant web applications using React, Vue.js, or Angular for the frontend, and Node.js, Python, or Java for the backend. Our solutions are responsive, accessible, and optimized for SEO.',
      emoji: '🖥️',
      features: [
        { title: 'Responsive Design', desc: 'Works perfectly on desktop, tablet, and mobile' },
        { title: 'Performance Optimization', desc: 'Fast load times and smooth user experience' },
        { title: 'Secure & Scalable', desc: 'Built with security best practices and horizontal scaling' }
      ]
    },
    'mobile-apps': {
      title: 'Mobile App Development',
      subtitle: 'iOS & Android Solutions',
      description: 'We create native and cross-platform mobile applications using React Native and Flutter. Our apps are performant, user-friendly, and integrated with backend services.',
      emoji: '📱',
      features: [
        { title: 'Native Performance', desc: 'Swift for iOS and Kotlin for Android development' },
        { title: 'Cross-Platform', desc: 'React Native for faster development across platforms' },
        { title: 'App Store Ready', desc: 'Complete app store submission and guidelines compliance' }
      ]
    },
    'cloud-solutions': {
      title: 'Cloud & DevOps',
      subtitle: 'Cloud Infrastructure & Automation',
      description: 'We help you migrate to the cloud and set up robust DevOps pipelines. Services include AWS, Azure, and GCP cloud solutions with containerization and CI/CD automation.',
      emoji: '☁️',
      features: [
        { title: 'Cloud Migration', desc: 'Seamless migration from on-premises to AWS, Azure, or GCP' },
        { title: 'CI/CD Pipelines', desc: 'Automated testing, building, and deployment pipelines' },
        { title: 'Monitoring & Optimization', desc: 'Cost optimization and performance monitoring' }
      ]
    },
    'api-backend': {
      title: 'API & Backend Development',
      subtitle: 'RESTful APIs & Microservices',
      description: 'We build scalable backend systems using Node.js, Python, and Java. Our APIs are well-documented, secure, and optimized for performance. We design microservices architecture for flexibility.',
      emoji: '⚙️',
      features: [
        { title: 'REST & GraphQL APIs', desc: 'Modern API design with comprehensive documentation' },
        { title: 'Database Design', desc: 'MongoDB, PostgreSQL, MySQL, and Redis optimization' },
        { title: 'Security', desc: 'Authentication, authorization, and encryption best practices' }
      ]
    },
    'ai-automation': {
      title: 'AI & Machine Learning',
      subtitle: 'Intelligent Automation',
      description: 'We develop custom machine learning models and AI-powered solutions. From ChatGPT integration to predictive analytics, we bring intelligence to your applications.',
      emoji: '🤖',
      features: [
        { title: 'ML Model Development', desc: 'Custom models for classification, regression, and clustering' },
        { title: 'AI Integration', desc: 'ChatGPT, GPT-4, and other LLM integrations' },
        { title: 'Automation', desc: 'Workflow automation and intelligent process orchestration' }
      ]
    },
    'it-consulting': {
      title: 'IT Consulting',
      subtitle: 'Technology Strategy & Architecture',
      description: 'We provide strategic IT consulting to help you make the right technology choices. From architecture review to digital transformation, we guide you through your tech journey.',
      emoji: '💼',
      features: [
        { title: 'Technology Strategy', desc: 'Roadmap planning and technology selection guidance' },
        { title: 'Architecture Review', desc: 'System design evaluation and optimization recommendations' },
        { title: 'Digital Transformation', desc: 'Business process reengineering with technology enablement' }
      ]
    }
  };

  const content = serviceContent[service];
  if (!content) return;

  // Update page title
  document.title = content.title + ' - Stackly';

  // Update page header
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    const h1 = pageHeader.querySelector('h1');
    if (h1) h1.textContent = content.title;
    const p = pageHeader.querySelector('p');
    if (p) p.textContent = 'Professional ' + content.title.toLowerCase() + ' services';
  }

  // Update service content section
  const section = document.querySelector('.section:nth-of-type(2)');
  if (section) {
    const aboutDiv = section.querySelector('div:nth-child(1)');
    if (aboutDiv) {
      const h2 = aboutDiv.querySelector('h2');
      if (h2) h2.textContent = content.subtitle;
      
      const descP = aboutDiv.querySelector('p');
      if (descP) descP.textContent = content.description;
      
      const featuresList = aboutDiv.querySelector('.about__features');
      if (featuresList) {
        featuresList.innerHTML = content.features.map(feature => `
          <li class="about__feature">
            <div class="about__feature-icon">✓</div>
            <div>
              <h4>${feature.title}</h4>
              <p>${feature.desc}</p>
            </div>
          </li>
        `).join('');
      }
    }

    const imageDiv = section.querySelector('.about__image-placeholder');
    if (imageDiv) imageDiv.textContent = content.emoji;
  }
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
