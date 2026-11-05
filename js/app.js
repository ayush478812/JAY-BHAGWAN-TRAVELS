/* ==========================================================================
   ANVISHA TRAVELS - Luxury Roadways & Premier Tour Packages
   Direct WhatsApp Tour Booking & State Destination Explorer
   ========================================================================== */

// WhatsApp Contact Number
const WHATSAPP_PHONE = '918446802069';

// Show More Configuration
const CARDS_PER_PAGE = 8;
let currentVisibleCount = CARDS_PER_PAGE;
let isShowingAll = false;
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initDatePickers();
  initMobileDrawer();
  initBackgroundAnimation();
  initSmoothAnchorScroll();
  initUnifiedScroll();
  initScrollReveal();
  initAnimatedCounters();
});

/* --------------------------------------------------------------------------
   Date Pickers & Defaults
   -------------------------------------------------------------------------- */
function initDatePickers() {
  const today = new Date();
  const todayStr = formatDateISO(today);

  const heroDate = document.getElementById('heroTravelDate');
  const modalDate = document.getElementById('modalTravelDate');

  if (heroDate) {
    heroDate.value = todayStr;
    heroDate.min = todayStr;
  }
  if (modalDate) {
    modalDate.value = todayStr;
    modalDate.min = todayStr;
  }
}

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* --------------------------------------------------------------------------
   Hero Trip Booking -> Direct WhatsApp Redirect
   -------------------------------------------------------------------------- */
function handleHeroWhatsAppBooking(e) {
  e.preventDefault();

  const fromCity = document.getElementById('heroFromCity').value.trim() || 'Pune';
  const destination = document.getElementById('heroDestination').value.trim() || 'Shirdi Sai Baba Mandir';
  const date = document.getElementById('heroTravelDate').value || 'Upcoming';
  const vehicle = document.getElementById('heroVehicleChoice').value;
  const passengers = document.getElementById('heroPassengers').value || '12';

  const msg = `Hi Anvisha Travels,\n\nI want to go to *${destination}* from *${fromCity}*.\n- Journey Date: ${date}\n- Choose Vehicle: ${vehicle}\n- Total Passengers: ${passengers} Persons\n\nPlease share the best tour package rate and coach availability.`;

  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

function quickFillPlace(placeName) {
  const destInput = document.getElementById('heroDestination');
  if (destInput) {
    destInput.value = placeName;
    destInput.focus();
    destInput.style.borderColor = 'var(--gold-primary)';
    setTimeout(() => { destInput.style.borderColor = ''; }, 1500);
  }

  const planSec = document.getElementById('planTripSection');
  if (planSec) {
    planSec.scrollIntoView({ behavior: 'smooth' });
  }
}

/* --------------------------------------------------------------------------
   Horizontal Swipeable Destination Carousels
   -------------------------------------------------------------------------- */
function scrollCarousel(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const card = track.querySelector('.carousel-card');
  const cardWidth = card ? card.offsetWidth : 310;
  const scrollDistance = (cardWidth + 20) * 2 * direction;
  track.scrollBy({ left: scrollDistance, behavior: 'smooth' });
}

function filterCarouselPlaces() {
  const input = document.getElementById('placeSearchInput');
  const query = input ? input.value.trim().toLowerCase() : '';
  const blocks = document.querySelectorAll('.carousel-category-block');

  blocks.forEach(block => {
    let hasVisibleCard = false;
    const cards = block.querySelectorAll('.carousel-card');
    cards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const title = (card.querySelector('.carousel-card-title')?.innerText || '').toLowerCase();
      const desc = (card.querySelector('.carousel-card-desc')?.innerText || '').toLowerCase();
      if (!query || name.includes(query) || title.includes(query) || desc.includes(query)) {
        card.style.display = 'flex';
        hasVisibleCard = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (query && !hasVisibleCard) {
      block.style.display = 'none';
    } else {
      block.style.display = 'block';
    }
  });
}

/* --------------------------------------------------------------------------
   Place Tour Booking Modal & WhatsApp Confirmation
   -------------------------------------------------------------------------- */
function openPlaceBookingModal(placeName, defaultVehicle) {
  const modalDest = document.getElementById('modalDestName');
  const modalVehicle = document.getElementById('modalVehicleSelect');

  if (modalDest) modalDest.value = placeName;
  if (modalVehicle && defaultVehicle) {
    modalVehicle.value = defaultVehicle;
  }

  openModal('tourBookingModal');
}

function confirmTourToWhatsApp(e) {
  e.preventDefault();

  const dest = document.getElementById('modalDestName').value;
  const fromCity = document.getElementById('modalFromCity').value.trim() || 'Pune';
  const date = document.getElementById('modalTravelDate').value || 'Upcoming';
  const vehicle = document.getElementById('modalVehicleSelect').value;
  const persons = document.getElementById('modalPersonsCount').value || '12';

  const msg = `Hi Anvisha Travels,\n\nI want to go to *${dest}* from *${fromCity}*.\n- Journey Date: ${date}\n- Choose Vehicle: ${vehicle}\n- Total Passengers: ${persons} Persons\n\nPlease provide all-inclusive quotation and availability.`;

  closeModal('tourBookingModal');

  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

/* --------------------------------------------------------------------------
   Modal Window Controls
   -------------------------------------------------------------------------- */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer & Header
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggle = document.getElementById('drawerToggle');
  const close = document.getElementById('drawerClose');
  const drawer = document.getElementById('mobileDrawer');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => drawer.classList.add('active'));
  }
  if (close && drawer) {
    close.addEventListener('click', () => drawer.classList.remove('active'));
  }

  const drawerLinks = document.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer) drawer.classList.remove('active');
    });
  });
}

/* --------------------------------------------------------------------------
   Silky Smooth Anchor Navigation (Offset for Sticky Header)
   -------------------------------------------------------------------------- */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        const drawer = document.getElementById('mobileDrawer');
        if (drawer && drawer.classList.contains('active')) {
          drawer.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   UNIFIED 60/120FPS SCROLL RUNNER (Buttery Smooth on Mobile & Desktop)
   ========================================================================== */
function initUnifiedScroll() {
  const header = document.getElementById('mainHeader');
  const progressBar = document.getElementById('pageScrollProgress');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navMenu = document.getElementById('navMenu');
  const line = document.getElementById('navActiveLine');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-menu-list .drawer-link');

  const sectionIds = ['home', 'planTripSection', 'destinationsSection', 'whyChooseSection', 'reviewsSection', 'amenitiesSection', 'faqSection', 'contactSection'];

  let currentActiveId = 'home';
  let isHovering = false;

  function moveLineTo(targetLink) {
    if (!targetLink || !line || !navMenu) return;
    const menuRect = navMenu.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    const left = linkRect.left - menuRect.left;
    const width = linkRect.width;

    line.style.opacity = '1';
    line.style.transform = `translateX(${left}px)`;
    line.style.width = `${width}px`;
  }

  function setActive(id) {
    if (id === currentActiveId) return; // Prevent unnecessary DOM work on every frame
    currentActiveId = id;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
        if (!isHovering) moveLineTo(link);
      } else {
        link.classList.remove('active');
      }
    });

    drawerLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Hover transitions
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      isHovering = true;
      moveLineTo(link);
    });
  });

  if (navMenu) {
    navMenu.addEventListener('mouseleave', () => {
      isHovering = false;
      const activeLink = navMenu.querySelector('.nav-link.active') || navLinks[0];
      moveLineTo(activeLink);
    });
  }

  // High performance RAF Scroll Tick
  let isTicking = false;
  function onScrollTick() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // 1. Sticky Header
    if (header) {
      if (scrollY > 50) {
        header.style.background = 'rgba(3, 11, 28, 0.96)';
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.75)';
      } else {
        header.style.background = 'rgba(3, 11, 28, 0.82)';
        header.style.boxShadow = 'none';
      }
    }

    // 2. Reading Progress Bar
    if (progressBar) {
      const scrollHeight = docHeight - windowHeight;
      const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    // 3. Back To Top Button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // 4. Nav Scrollspy (Using fast offsetTop instead of getBoundingClientRect)
    const scrollPos = scrollY + 200;
    if (scrollY + windowHeight >= docHeight - 80) {
      setActive('contactSection');
    } else if (scrollY < 120) {
      setActive('home');
    } else {
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const secEl = document.getElementById(sectionIds[i]);
        if (secEl && scrollPos >= secEl.offsetTop) {
          setActive(sectionIds[i]);
          break;
        }
      }
    }
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        onScrollTick();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    const activeLink = navMenu ? (navMenu.querySelector('.nav-link.active') || navLinks[0]) : null;
    if (activeLink) moveLineTo(activeLink);
  });

  setTimeout(() => {
    onScrollTick();
    const activeLink = navMenu ? (navMenu.querySelector('.nav-link.active') || navLinks[0]) : null;
    if (activeLink) moveLineTo(activeLink);
  }, 150);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* --------------------------------------------------------------------------
   Scroll-Reveal Intersection Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/* --------------------------------------------------------------------------
   Animated Trust Statistics Counters
   -------------------------------------------------------------------------- */
let hasStatsAnimated = false;
function initAnimatedCounters() {
  const statsSection = document.getElementById('statsCounterSection');
  if (!statsSection) return;

  const counterEls = statsSection.querySelectorAll('.counter-val');
  if (!counterEls.length) return;

  const runCounters = () => {
    if (hasStatsAnimated) return;
    hasStatsAnimated = true;

    counterEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        el.textContent = currentVal.toLocaleString('en-IN');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString('en-IN');
        }
      }

      requestAnimationFrame(updateCounter);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        runCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  } else {
    runCounters();
  }
}

/* ==========================================================================
   DYNAMIC STARRY NIGHT & AIRPLANE FLIGHT TRAIL BACKGROUND ANIMATION
   Matched to the Anvisha Travels Mountain & Starry Skies Emblem
   ========================================================================== */
function initBackgroundAnimation() {
  const canvas = document.getElementById('bgAnimationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const isMobile = width < 768;
  const particleCount = isMobile ? 12 : 24;

  // Colors matched to Anvisha Travels Logo: Warm Gold, Sky Blue, Pure White
  const colors = [
    'rgba(245, 173, 24, ',  // Warm Gold
    'rgba(56, 189, 248, ',  // Sky Blue
    'rgba(255, 255, 255, '  // Crisp White
  ];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.5 + 0.6;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
      this.alphaSpeed = (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1);
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.35 + 0.15);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += this.alphaSpeed;

      if (this.alpha > 0.85 || this.alpha < 0.15) {
        this.alphaSpeed = -this.alphaSpeed;
      }

      if (this.y < -10) this.y = height + 10;
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + this.alpha + ')';
      ctx.fill();
    }
  }

  // Shooting star / airplane flight streak (mirroring airplane flight trail in logo)
  class FlightStreak {
    constructor() {
      this.active = false;
      this.reset();
    }
    reset() {
      this.x = Math.random() * (width * 0.8);
      this.y = Math.random() * (height * 0.35);
      this.length = Math.random() * 110 + 70;
      this.speed = Math.random() * 9 + 11;
      this.angle = Math.PI / 4.2; // ~42 degree flight angle
      this.alpha = 1;
      this.active = false;
      this.nextTrigger = Date.now() + Math.random() * 5000 + 3500;
    }
    update() {
      if (!this.active) {
        if (Date.now() > this.nextTrigger) {
          this.active = true;
          this.x = Math.random() * (width * 0.8);
          this.y = Math.random() * (height * 0.3);
          this.alpha = 1;
        }
        return;
      }

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= 0.024;

      if (this.alpha <= 0 || this.x > width || this.y > height) {
        this.reset();
      }
    }
    draw() {
      if (!this.active || this.alpha <= 0) return;
      ctx.save();
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, 'rgba(245, 173, 24, 0)');
      grad.addColorStop(0.5, `rgba(56, 189, 248, ${this.alpha * 0.5})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${this.alpha})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Glowing head
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.shadowColor = '#fed269';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: particleCount }, () => new Particle());
  const streak = new FlightStreak();

  let isRunning = true;
  let isScrolling = false;
  let scrollPauseTimer = null;

  window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollPauseTimer);
    scrollPauseTimer = setTimeout(() => {
      isScrolling = false;
      if (isRunning) requestAnimationFrame(animate);
    }, 120);
  }, { passive: true });

  function animate() {
    if (!isRunning) return;
    if (isScrolling) return; // Keep 100% frame rate dedicated to scrolling

    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    streak.update();
    streak.draw();

    requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
    } else {
      isRunning = true;
      requestAnimationFrame(animate);
    }
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  requestAnimationFrame(animate);
}
