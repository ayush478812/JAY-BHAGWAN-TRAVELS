/* ==========================================================================
   JAY BHAGWAN TRAVELS - Luxury Roadways & Premier Tour Packages
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
  initStickyHeader();
  initScrollProgressBar();
  initScrollReveal();
  initAnimatedCounters();
  initBackToTop();
  initShowMore();
  initParallaxEffects();
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

  const msg = `Hi Jay Bhagwan Travels,\n\nI want to go to *${destination}* from *${fromCity}*.\n- Travel Date: ${date}\n- Preferred Vehicle: ${vehicle}\n- Number of Travelers: ${passengers} Persons\n\nPlease share the best tour package rate and coach availability.`;

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
   Show More / Show Less - Destination Cards Pagination
   -------------------------------------------------------------------------- */
function initShowMore() {
  applyShowMore();
}

function getVisibleCards() {
  const allCards = document.querySelectorAll('#destinationsGrid .destination-card');
  const visible = [];
  allCards.forEach(card => {
    const cardState = card.getAttribute('data-state');
    if (activeFilter === 'all' || cardState === activeFilter) {
      visible.push(card);
    }
  });
  return visible;
}

function applyShowMore() {
  const matchingCards = getVisibleCards();
  const totalMatching = matchingCards.length;
  const showMoreWrap = document.getElementById('showMoreWrap');
  const btnShowMore = document.getElementById('btnShowMore');
  const showMoreCount = document.getElementById('showMoreCount');

  // Hide all cards first
  const allCards = document.querySelectorAll('#destinationsGrid .destination-card');
  allCards.forEach(card => {
    card.style.display = 'none';
    card.classList.remove('card-fade-in', 'card-hidden');
  });

  // Show cards up to current limit
  const limit = isShowingAll ? totalMatching : Math.min(currentVisibleCount, totalMatching);
  let stagger = 0;
  matchingCards.forEach((card, index) => {
    if (index < limit) {
      card.style.display = 'flex';
      card.classList.remove('card-fade-in');
      void card.offsetWidth;
      card.classList.add('card-fade-in');
      card.style.animationDelay = `${Math.min(stagger * 0.05, 0.4)}s`;
      stagger++;
    }
  });

  // Update Show More button state
  if (showMoreWrap && btnShowMore) {
    if (totalMatching <= CARDS_PER_PAGE) {
      // Not enough cards to need the button
      showMoreWrap.style.display = 'none';
    } else if (isShowingAll || limit >= totalMatching) {
      // All cards are shown - offer "Show Less"
      showMoreWrap.style.display = 'flex';
      btnShowMore.innerHTML = '<span class="show-more-text"><i class="fa-solid fa-chevron-up"></i> Show Less</span>';
      btnShowMore.classList.add('showing-less');
    } else {
      // More cards available - offer "Show More"
      const remaining = totalMatching - limit;
      showMoreWrap.style.display = 'flex';
      btnShowMore.innerHTML = `<span class="show-more-text"><i class="fa-solid fa-chevron-down"></i> Show More Destinations</span><span class="show-more-count">${remaining} more</span>`;
      btnShowMore.classList.remove('showing-less');
    }
  }
}

function toggleShowMore() {
  const matchingCards = getVisibleCards();
  const totalMatching = matchingCards.length;

  if (isShowingAll || currentVisibleCount >= totalMatching) {
    // Currently showing all → collapse back to initial
    isShowingAll = false;
    currentVisibleCount = CARDS_PER_PAGE;
    applyShowMore();
    // Smooth scroll back to top of destinations
    const destSection = document.getElementById('destinationsSection');
    if (destSection) {
      setTimeout(() => {
        destSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  } else {
    // Show next batch
    currentVisibleCount += CARDS_PER_PAGE;
    if (currentVisibleCount >= totalMatching) {
      isShowingAll = true;
    }
    applyShowMore();
  }
}

/* --------------------------------------------------------------------------
   State Tabs Filter (Interactive States & Famous Places)
   -------------------------------------------------------------------------- */
function filterState(stateKey, clickedBtn) {
  // Clear search input if state tab is clicked
  const searchInput = document.getElementById('placeSearchInput');
  if (searchInput) searchInput.value = '';

  // Update active filter
  activeFilter = stateKey;
  currentVisibleCount = CARDS_PER_PAGE;
  isShowingAll = false;

  // Update button active state
  const buttons = document.querySelectorAll('.state-filter-nav .btn-state-tab');
  buttons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = clickedBtn || (window.event && window.event.currentTarget);
  if (activeBtn) {
    activeBtn.classList.add('active');
    if (activeBtn.scrollIntoView) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Apply show more with new filter
  applyShowMore();
}

/* --------------------------------------------------------------------------
   Live Instant Search Across All Places & Monuments
   -------------------------------------------------------------------------- */
function searchPlacesLive() {
  const input = document.getElementById('placeSearchInput');
  const query = input ? input.value.trim().toLowerCase() : '';
  const cards = document.querySelectorAll('#destinationsGrid .destination-card');
  const showMoreWrap = document.getElementById('showMoreWrap');

  if (query) {
    // When searching, show all matching cards (bypass show more)
    if (showMoreWrap) showMoreWrap.style.display = 'none';

    let stagger = 0;
    cards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const title = (card.querySelector('.destination-title')?.innerText || '').toLowerCase();
      const desc = (card.querySelector('.destination-desc')?.innerText || '').toLowerCase();
      const state = (card.getAttribute('data-state') || '').toLowerCase();

      if (name.includes(query) || title.includes(query) || desc.includes(query) || state.includes(query)) {
        card.style.display = 'flex';
        card.classList.remove('card-fade-in');
        void card.offsetWidth;
        card.classList.add('card-fade-in');
        card.style.animationDelay = `${Math.min(stagger * 0.04, 0.3)}s`;
        stagger++;
      } else {
        card.style.display = 'none';
        card.classList.remove('card-fade-in');
      }
    });

    document.querySelectorAll('.state-filter-nav .btn-state-tab').forEach(b => b.classList.remove('active'));
  } else {
    // Reset to filtered view with show more
    const allBtn = document.querySelector('.state-filter-nav .btn-state-tab');
    if (allBtn) allBtn.classList.add('active');
    activeFilter = 'all';
    currentVisibleCount = CARDS_PER_PAGE;
    isShowingAll = false;
    applyShowMore();
  }
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

  const msg = `Hi Jay Bhagwan Travels,\n\nI want to go to *${dest}* from *${fromCity}*.\n- Date: ${date}\n- Vehicle: ${vehicle}\n- Number of Persons: ${persons}\n\nPlease provide all-inclusive quotation and availability.`;

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

// Close modal when clicking outside on dark backdrop
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

function initStickyHeader() {
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(4, 9, 20, 0.96)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
    } else {
      header.style.background = 'rgba(5, 11, 24, 0.85)';
      header.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   INTERACTIVE SCROLL & LUXURY ANIMATION CONTROLLERS
   ========================================================================== */

/* 1. Viewport Scroll Reading Progress Bar */
function initScrollProgressBar() {
  const progressBar = document.getElementById('pageScrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

/* 2. Scroll-Reveal Intersection Observer */
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

/* 3. Live Animated Statistics Counters */
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
      const duration = 1800; // ms
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

/* 4. Back To Top Floating Action Button */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* 5. Parallax & Floating Effects */
function initParallaxEffects() {
  // Add subtle parallax to hero section
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const heroContent = hero.querySelector('.hero-header-center');
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
        heroContent.style.opacity = `${1 - (scrolled / (window.innerHeight * 0.8))}`;
      }
    }
  }, { passive: true });
}
