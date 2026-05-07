/**
 * Brew & Bean — script.js
 * All DOM interactions via addEventListener. No page refreshes.
 */

/* =============================================
   1. NAVIGATION — Highlight, Hamburger & Dropdown
   ============================================= */
function initNavigation() {
  const header    = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');

  // --- Active link highlighting ---
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // --- Hamburger toggle ---
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // --- Close mobile menu when a plain nav-link is clicked ---
  navLinks.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link') && !e.target.classList.contains('dropdown-toggle')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // --- Dropdown toggle ---
  const dropdownParent = document.querySelector('.nav-item-dropdown');
  const dropdownToggle = dropdownParent && dropdownParent.querySelector('.dropdown-toggle');

  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = dropdownParent.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close dropdown when a dropdown link is clicked
    dropdownParent.querySelectorAll('.dropdown-link').forEach(link => {
      link.addEventListener('click', () => {
        dropdownParent.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        // Also close mobile menu
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
      if (!dropdownParent.contains(e.target)) {
        dropdownParent.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdown on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && dropdownParent.classList.contains('open')) {
        dropdownParent.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownToggle.focus();
      }
    });
  }

  // --- Dropdown links trigger menu filter ---
  document.querySelectorAll('.dropdown-link[data-filter]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const filter = link.dataset.filter;
      // Scroll to menu section
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
      // Trigger the corresponding filter button
      setTimeout(() => {
        const btn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (btn) btn.click();
      }, 400);
    });
  });

  // --- Scrolled state ---
  const heroSection = document.getElementById('hero');

  function onScroll() {
    const scrolled = window.scrollY > heroSection.offsetHeight * 0.6;
    header.classList.toggle('scrolled', scrolled);

    // Back-to-top visibility
    const backBtn = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
      backBtn.removeAttribute('hidden');
    } else {
      backBtn.setAttribute('hidden', '');
    }

    // Highlight active nav link based on scroll position
    highlightNavOnScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

function highlightNavOnScroll() {
  const sections = document.querySelectorAll('main section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current    = '';

  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.id;
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* =============================================
   2. MENU FILTER & SEARCH
   ============================================= */
function initMenuFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const menuItems   = document.querySelectorAll('.menu-item');
  const searchInput = document.getElementById('menu-search');
  const noResults   = document.getElementById('no-results');

  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    menuItems.forEach(item => {
      const matchesFilter = activeFilter === 'all' || item.dataset.category === activeFilter;
      const itemText      = item.textContent.toLowerCase();
      const matchesSearch = query === '' || itemText.includes(query);
      const visible       = matchesFilter && matchesSearch;

      if (visible) {
        item.classList.remove('hidden');
        item.style.opacity   = '0';
        item.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'translateY(0)';
          });
        });
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    noResults.classList.toggle('visible', visibleCount === 0);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);
}

/* =============================================
   3. ABOUT — Animated Stats Counter
   ============================================= */
function initStatsCounter() {
  const statsSection = document.getElementById('about');
  const statNumbers  = document.querySelectorAll('.stat-number');
  let animated       = false;

  function animateCount(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(eased * target);
      el.textContent = value >= 1000
        ? value.toLocaleString()
        : String(value);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(animateCount);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* =============================================
   4. GALLERY — Lightbox
   ============================================= */
function initGallery() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const closeBtn     = lightbox.querySelector('.lightbox-close');
  const prevBtn      = lightbox.querySelector('.lightbox-prev');
  const nextBtn      = lightbox.querySelector('.lightbox-next');
  const backdrop     = lightbox.querySelector('.lightbox-backdrop');

  let currentIndex = 0;

  // Collect image data
  const images = galleryItems.map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt,
  }));

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    galleryItems[currentIndex].focus();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Close on backdrop click
  backdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Focus trap inside lightbox
  lightbox.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      lightbox.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.hasAttribute('disabled'));
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}

/* =============================================
   5. TESTIMONIALS — Auto-advancing Carousel
   ============================================= */
function initCarousel() {
  const track    = document.getElementById('carousel-track');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const dotsWrap = document.getElementById('carousel-dots');
  const cards    = Array.from(track.querySelectorAll('.testimonial-card'));

  let current      = 0;
  let autoInterval = null;
  const AUTO_DELAY = 4000;
  const PAUSE_AFTER_MANUAL = 5000;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', () => {
      goTo(i);
      pauseThenResume();
    });
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
  }

  function startAuto() {
    autoInterval = setInterval(() => goTo(current + 1), AUTO_DELAY);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  function pauseThenResume() {
    stopAuto();
    setTimeout(startAuto, PAUSE_AFTER_MANUAL);
  }

  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    pauseThenResume();
  });

  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    pauseThenResume();
  });

  startAuto();
}

/* =============================================
   6. CONTACT FORM — Validation
   ============================================= */
function initContactForm() {
  const form        = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.toggle('invalid', !!message);
    error.textContent = message || '';
  }

  function clearErrors() {
    ['name', 'email', 'message'].forEach(id => {
      document.getElementById(id).classList.remove('invalid');
      document.getElementById(`${id}-error`).textContent = '';
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    successMsg.setAttribute('hidden', '');

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let valid     = true;

    if (!name) {
      setError('name', 'name-error', 'Please enter your name.');
      valid = false;
    }
    if (!email) {
      setError('email', 'email-error', 'Please enter your email address.');
      valid = false;
    } else if (!EMAIL_RE.test(email)) {
      setError('email', 'email-error', 'Please enter a valid email address.');
      valid = false;
    }
    if (!message) {
      setError('message', 'message-error', 'Please enter a message.');
      valid = false;
    }

    if (valid) {
      form.reset();
      successMsg.removeAttribute('hidden');
      successMsg.focus();
    }
  });

  // Clear error on input
  ['name', 'email', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(id).classList.remove('invalid');
      document.getElementById(`${id}-error`).textContent = '';
    });
  });
}

/* =============================================
   7. BACK TO TOP
   ============================================= */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================
   8. FADE-IN SECTIONS on scroll
   ============================================= */
function initFadeIn() {
  const sections = document.querySelectorAll('.fade-in-section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
}

/* =============================================
   9. COPYRIGHT YEAR
   ============================================= */
function initCopyrightYear() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* =============================================
   10. TYPEWRITER EFFECT
   ============================================= */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    "Kigali's finest cup, rooted in Rwandan soil.",
    "Single-origin beans, crafted with pride.",
    "From Rwanda's highlands to your cup.",
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  const TYPE_SPEED   = 55;   // ms per character when typing
  const DELETE_SPEED = 30;   // ms per character when deleting
  const PAUSE_END    = 2000; // ms to pause at end of phrase
  const PAUSE_START  = 400;  // ms to pause before typing next phrase

  function tick() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      // Type one character
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        isDeleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Delete one character
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMenuFilter();
  initStatsCounter();
  initGallery();
  initCarousel();
  initContactForm();
  initBackToTop();
  initFadeIn();
  initCopyrightYear();
  initTypewriter();
});
