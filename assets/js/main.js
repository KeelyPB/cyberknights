// ==========================================================================
// Cyber Knights — Shared site behavior
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavLink();
  initScrollReveal();
  initStatCounters();
  initFooterYear();
  initBackToTop();
  initDownloadStubs();
});

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const iconOpen = toggle.querySelector('.icon-open');
  const iconClose = toggle.querySelector('.icon-close');

  toggle.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !isHidden ? true : false);
    if (isHidden) {
      menu.classList.remove('hidden');
      requestAnimationFrame(() => menu.classList.add('opacity-100'));
    } else {
      menu.classList.add('hidden');
    }
    iconOpen?.classList.toggle('hidden');
    iconClose?.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(isHidden));
  });

  // Close menu when a link is tapped
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
    });
  });
}

/* ---------- Highlight the current page in the nav ---------- */
function initActiveNavLink() {
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const target = link.getAttribute('data-nav-link');
    if (target === current || (target === 'index.html' && current === '')) {
      link.classList.add('active');
    }
  });
}

/* ---------- Reveal-on-scroll ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------- Animated stat counters ---------- */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-counter'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('opacity-0', window.scrollY < 400);
    btn.classList.toggle('pointer-events-none', window.scrollY < 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Placeholder download buttons (Best Practices) ---------- */
function initDownloadStubs() {
  document.querySelectorAll('[data-download-stub]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-download-stub');
      showToast(`"${title}" checklist is coming soon — check back shortly.`);
    });
  });
}

/* ---------- Lightweight toast ---------- */
let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('ck-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ck-toast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] glass-strong text-sm text-slate-100 px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 opacity-0 translate-y-4';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-info text-sky-400 mr-2"></i>${message}`;
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-4');
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 3200);
}
