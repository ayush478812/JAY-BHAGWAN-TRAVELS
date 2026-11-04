/* ==========================================================================
   JAY BHAGWAN TRAVELS - Luxury Roadways & Premier Tour Packages
   Direct WhatsApp Tour Booking & State Destination Explorer
   ========================================================================== */

// WhatsApp Contact Number
const WHATSAPP_PHONE = '918446802069';

document.addEventListener('DOMContentLoaded', () => {
  initDatePickers();
  initMobileDrawer();
  initStickyHeader();
  initScrollProgressBar();
  initScrollReveal();
  initAnimatedCounters();
  initBackToTop();
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

  // Construct message as requested: "hi i want to go ____ place"
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
   State Tabs Filter (Interactive States & Famous Places)
   -------------------------------------------------------------------------- */
function filterState(stateKey, clickedBtn) {
  // Clear search input if state tab is clicked
  const searchInput = document.getElementById('placeSearchInput');
  if (searchInput) searchInput.value = '';

  // Update button active state
  const buttons = document.querySelectorAll('.state-filter-nav .btn-state-tab');
  buttons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = clickedBtn || (window.event && window.event.currentTarget);
  if (activeBtn) {
    activeBtn.classList.add('active');
    // Mobile smooth auto-centering in horizontal state scrollbar
    if (activeBtn.scrollIntoView) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Filter destination cards with smooth staggered animation
  const cards = document.querySelectorAll('#destinationsGrid .destination-card');
  let stagger = 0;
  cards.forEach(card => {
    const cardState = card.getAttribute('data-state');
    if (stateKey === 'all' || cardState === stateKey) {
      card.style.display = 'flex';
      card.classList.remove('card-fade-in');
      void card.offsetWidth; // trigger reflow
      card.classList.add('card-fade-in');
      card.style.animationDelay = `${Math.min(stagger * 0.04, 0.35)}s`;
      stagger++;
    } else {
      card.style.display = 'none';
      card.classList.remove('card-fade-in');
    }
  });
}

/* --------------------------------------------------------------------------
   Live Instant Search Across All Places & Monuments
   -------------------------------------------------------------------------- */
function searchPlacesLive() {
  const input = document.getElementById('placeSearchInput');
  const query = input ? input.value.trim().toLowerCase() : '';
  const cards = document.querySelectorAll('#destinationsGrid .destination-card');

  let stagger = 0;
  cards.forEach(card => {
    const name = (card.getAttribute('data-name') || '').toLowerCase();
    const title = (card.querySelector('.destination-title')?.innerText || '').toLowerCase();
    const desc = (card.querySelector('.destination-desc')?.innerText || '').toLowerCase();
    const state = (card.getAttribute('data-state') || '').toLowerCase();

    if (!query || name.includes(query) || title.includes(query) || desc.includes(query) || state.includes(query)) {
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

  if (query) {
    document.querySelectorAll('.state-filter-nav .btn-state-tab').forEach(b => b.classList.remove('active'));
  } else {
    const allBtn = document.querySelector('.state-filter-nav .btn-state-tab');
    if (allBtn) allBtn.classList.add('active');
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

  // Construct message: "hi i want to go ____ place"
  const msg = `Hi Jay Bhagwan Travels,\n\nI want to go to *${dest}* from *${fromCity}*.\n- Date: ${date}\n- Vehicle: ${vehicle}\n- Number of Persons: ${persons}\n\nPlease provide all-inclusive quotation and availability.`;

  closeModal('tourBookingModal');

  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

/* --------------------------------------------------------------------------
   Fleet Filtering
   -------------------------------------------------------------------------- */
function filterFleet(group) {
  const buttons = document.querySelectorAll('.fleet-filter-nav .btn-fleet-tab');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  const cards = document.querySelectorAll('#fleetGridContainer .fleet-card');
  cards.forEach(card => {
    const cardGroup = card.getAttribute('data-group');
    if (group === 'all' || cardGroup === group) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
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
   Trending On Instagram: Viral Reels & Stories System (Mobile + PC)
   ========================================================================== */
const REELS_DATA = [
  {
    id: 0,
    dest: "Shirdi Sai Baba Samadhi Mandir, Maharashtra",
    location: "Shirdi Sai Baba Samadhi Mandir, Maharashtra",
    caption: "Divine Kakad Aarti at Shirdi Sai Baba Samadhi Mandir with our luxury 17-Seater Force Urbania group! 🙏✨ Shirdi VIP Darshan package. #Shirdi #SaiBaba #Maharashtra #JayBhagwanTravels",
    audio: "Om Sai Namo Namah (Divine Chant) • Jay Bhagwan Travels",
    image: "assets/images/destinations/shirdi-temple.jpg",
    likes: "98.4K",
    likesNum: 98400,
    views: "1.2M Views",
    ambient: "radial-gradient(circle, rgba(255, 183, 3, 0.45), rgba(225, 48, 108, 0.3), transparent 70%)"
  },
  {
    id: 1,
    dest: "Trimbakeshwar Jyotirlinga, Nashik",
    location: "Trimbakeshwar Shiva Temple, Nashik",
    caption: "Holy Godavari Aarti & Maha Abhishek at Trimbakeshwar Jyotirlinga! 🛕🔱 Direct highway ride from Pune in luxury Tempo Traveller! #Trimbakeshwar #5Jyotirlinga #Maharashtra",
    audio: "Har Har Mahadev (Rudra Mix) • Viral Audio",
    image: "assets/images/destinations/trimbakeshwar.jpg",
    likes: "82.6K",
    likesNum: 82600,
    views: "750K Views",
    ambient: "radial-gradient(circle, rgba(0, 210, 255, 0.45), rgba(225, 48, 108, 0.3), transparent 70%)"
  },
  {
    id: 2,
    dest: "Mahabaleshwar & Panchgani Hill Station",
    location: "Venna Lake & Arthur Seat, Mahabaleshwar",
    caption: "Cruising through misty Sahyadri Ghats & fresh strawberry farms in Mahabaleshwar! 🍓⛰️ Best weekend family getaway from Pune! #Mahabaleshwar #SahyadriHills",
    audio: "Sahyadri Monsoon Beats • Trending Audio",
    image: "assets/images/destinations/mahabaleshwar.jpg",
    likes: "64.2K",
    likesNum: 64200,
    views: "610K Views",
    ambient: "radial-gradient(circle, rgba(0, 210, 255, 0.5), rgba(255, 255, 255, 0.2), transparent 70%)"
  },
  {
    id: 3,
    dest: "Lonavala, Khandala & Karla Caves",
    location: "Tiger Point & Bhushi Dam, Lonavala",
    caption: "Chasing monsoon clouds & waterfalls at Tiger Point Lonavala! 🌧️⛰️ Group fun with chilled AC & premium pushback seating! #Lonavala #TigerPoint",
    audio: "Rain In Sahyadri (Acoustic) • Trending Reel",
    image: "assets/images/destinations/lonavala-khandala.jpg",
    likes: "71.5K",
    likesNum: 71500,
    views: "690K Views",
    ambient: "radial-gradient(circle, rgba(131, 58, 180, 0.45), rgba(0, 210, 255, 0.35), transparent 70%)"
  },
  {
    id: 4,
    dest: "Raigad Fort (Capital of Swarajya)",
    location: "Chhatrapati Shivaji Maharaj Samadhi, Raigad Fort",
    caption: "Standing in awe at the majestic capital of Chhatrapati Shivaji Maharaj! 🚩⚔️ Historical heritage tours from Pune! Jai Shivray! #Raigad #ShivajiMaharaj #MarathaEmpire",
    audio: "Jayostute Chhatrapati (War Horn Mix) • Viral Audio",
    image: "assets/images/destinations/raigad-fort.jpg",
    likes: "112K",
    likesNum: 112000,
    views: "1.5M Views",
    ambient: "radial-gradient(circle, rgba(255, 183, 3, 0.5), rgba(225, 48, 108, 0.35), transparent 70%)"
  },
  {
    id: 5,
    dest: "Gateway of India & Mumbai Darshan",
    location: "Marine Drive & Gateway of India, Mumbai",
    caption: "Sunset coastal drive along Marine Drive & Gateway of India! 🌊🏙️ Full day Mumbai Darshan package in luxury AC mini-coach! #MumbaiDarshan #GatewayOfIndia",
    audio: "Yeh Hai Bombay Meri Jaan (Lofi Mix) • Trending Audio",
    image: "assets/images/destinations/mumbai-gateway.jpg",
    likes: "56.9K",
    likesNum: 56900,
    views: "530K Views",
    ambient: "radial-gradient(circle, rgba(225, 48, 108, 0.5), rgba(255, 183, 3, 0.4), transparent 70%)"
  }
];

let currentReelIndex = 0;
let currentReelDest = "Shirdi Sai Baba Samadhi Mandir, Maharashtra";
let reelTimer = null;
let reelProgress = 0;
let isPlayerMuted = false;

/* --------------------------------------------------------------------------
   Reels Carousel Smooth Scroll (PC Arrows & Mobile Touch)
   -------------------------------------------------------------------------- */
function scrollReelsCarousel(direction) {
  const track = document.getElementById('reelsTrack');
  if (!track) return;
  const scrollDistance = 320;
  track.scrollBy({ left: direction * scrollDistance, behavior: 'smooth' });
}

/* Handle clicking the card body to open fullscreen player */
function handleReelCardClick(e, index) {
  // If clicked button, prevent card modal open
  if (e.target.closest('.reel-action-btn') || e.target.closest('button')) {
    return;
  }
  openReelModal(index);
}

/* --------------------------------------------------------------------------
   Interactive Instagram Heart Like Animation (Card Level)
   -------------------------------------------------------------------------- */
function likeReelCard(btn, e, baseLikes) {
  e.stopPropagation();
  const countSpan = btn.querySelector('.action-count');
  const isLiked = btn.classList.toggle('liked');

  if (isLiked) {
    if (countSpan) countSpan.textContent = formatLikeCount(baseLikes + 1);
    spawnFloatingHeart(btn);
  } else {
    if (countSpan) countSpan.textContent = formatLikeCount(baseLikes);
  }
}

function spawnFloatingHeart(parentEl) {
  const heart = document.createElement('div');
  heart.className = 'floating-heart-particle';
  heart.innerHTML = '<i class="fa-solid fa-heart"></i>';
  
  const rect = parentEl.getBoundingClientRect();
  heart.style.left = `${rect.left + rect.width / 2}px`;
  heart.style.top = `${rect.top}px`;
  heart.style.position = 'fixed';
  
  document.body.appendChild(heart);
  setTimeout(() => { heart.remove(); }, 1000);
}

function formatLikeCount(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/* --------------------------------------------------------------------------
   Quick WhatsApp Direct Booking from Reel
   -------------------------------------------------------------------------- */
function quickBookReelWhatsApp(destName, e) {
  if (e) e.stopPropagation();
  const msg = `Hi Jay Bhagwan Travels,\n\nI just watched your viral Instagram Reel about *${destName}* and want to book this tour package!\n\nPlease share available dates, Force Urbania / Tempo Traveller options, and rates.`;
  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

/* Share Reel link */
function shareReel(index, e) {
  if (e) e.stopPropagation();
  const reel = REELS_DATA[index] || REELS_DATA[0];
  if (navigator.share) {
    navigator.share({
      title: 'Jay Bhagwan Travels - Viral Tour Reel',
      text: reel.caption,
      url: window.location.href
    }).catch(() => {});
  } else {
    // Copy to clipboard fallback
    navigator.clipboard.writeText(window.location.href);
    alert('Reel link copied to clipboard!');
  }
}

/* --------------------------------------------------------------------------
   Fullscreen Instagram Reel Video Viewer Modal
   -------------------------------------------------------------------------- */
function openReelModal(index) {
  const modal = document.getElementById('instagramReelModal');
  if (!modal) return;

  currentReelIndex = (index >= 0 && index < REELS_DATA.length) ? index : 0;
  const reel = REELS_DATA[currentReelIndex];
  currentReelDest = reel.dest;

  // Populate Reel content
  const videoImg = document.getElementById('playerVideoBg');
  const locationText = document.getElementById('playerLocationText');
  const captionText = document.getElementById('playerCaptionText');
  const audioText = document.getElementById('playerAudioText');
  const likeCount = document.getElementById('playerLikeCount');
  const ambientGlow = document.getElementById('playerAmbientGlow');
  const waCta = document.getElementById('playerWhatsAppCta');

  if (videoImg) videoImg.src = reel.image;
  if (locationText) locationText.textContent = reel.location;
  if (captionText) captionText.textContent = reel.caption;
  if (audioText) audioText.textContent = reel.audio;
  if (likeCount) likeCount.textContent = reel.likes;
  if (ambientGlow) ambientGlow.style.background = reel.ambient;

  if (waCta) {
    const msg = `Hi Jay Bhagwan Travels,\n\nI am watching your viral Instagram Reel about *${reel.dest}* and want to book this exact tour!\n\nPlease share the vehicle choices and package price.`;
    waCta.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  // Reset like button inside player
  const playerLikeBtn = document.getElementById('playerLikeBtn');
  if (playerLikeBtn) playerLikeBtn.classList.remove('liked');

  // Open modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Start animated progress bar (12 seconds story timer)
  startReelProgressBar();
}

function closeReelModal() {
  const modal = document.getElementById('instagramReelModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  stopReelProgressBar();
}

function closeReelModalOnBackdrop(e) {
  if (e.target.id === 'instagramReelModal') {
    closeReelModal();
  }
}

/* Stories Animated Progress Bar */
function startReelProgressBar() {
  stopReelProgressBar();
  const fill = document.getElementById('playerProgressFill');
  if (!fill) return;

  reelProgress = 0;
  fill.style.width = '0%';

  const duration = 12000; // 12 seconds
  const step = 100;
  const increment = (step / duration) * 100;

  reelTimer = setInterval(() => {
    reelProgress += increment;
    if (fill) fill.style.width = `${Math.min(reelProgress, 100)}%`;

    if (reelProgress >= 100) {
      // Advance to next reel automatically!
      const nextIndex = (currentReelIndex + 1) % REELS_DATA.length;
      openReelModal(nextIndex);
    }
  }, step);
}

function stopReelProgressBar() {
  if (reelTimer) {
    clearInterval(reelTimer);
    reelTimer = null;
  }
}

/* Double Tap Center Heart Pop Animation */
function triggerDoubleTapHeart(e) {
  const heartBurst = document.getElementById('playerHeartBurst');
  if (heartBurst) {
    heartBurst.classList.remove('pop');
    void heartBurst.offsetWidth;
    heartBurst.classList.add('pop');
    setTimeout(() => { heartBurst.classList.remove('pop'); }, 800);
  }

  const likeBtn = document.getElementById('playerLikeBtn');
  if (likeBtn && !likeBtn.classList.contains('liked')) {
    likeBtn.classList.add('liked');
    const reel = REELS_DATA[currentReelIndex];
    const countSpan = document.getElementById('playerLikeCount');
    if (countSpan && reel) {
      countSpan.textContent = formatLikeCount(reel.likesNum + 1);
    }
  }
}

function togglePlayerLike(btn) {
  const reel = REELS_DATA[currentReelIndex];
  const isLiked = btn.classList.toggle('liked');
  const countSpan = document.getElementById('playerLikeCount');

  if (isLiked) {
    triggerDoubleTapHeart();
    if (countSpan && reel) countSpan.textContent = formatLikeCount(reel.likesNum + 1);
  } else {
    if (countSpan && reel) countSpan.textContent = formatLikeCount(reel.likesNum);
  }
}

function togglePlayerSound() {
  const btn = document.getElementById('playerSoundToggle');
  isPlayerMuted = !isPlayerMuted;
  if (btn) {
    btn.innerHTML = isPlayerMuted 
      ? '<i class="fa-solid fa-volume-xmark"></i>' 
      : '<i class="fa-solid fa-volume-high"></i>';
    btn.style.color = isPlayerMuted ? '#ff3366' : '#ffffff';
  }
}

function triggerPlayerShare() {
  shareReel(currentReelIndex);
}

// Keyboard controls: ESC to close, Left/Right arrow to change reels
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('instagramReelModal');


  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeReelModal();
  } else if (e.key === 'ArrowRight') {
    const nextIndex = (currentReelIndex + 1) % REELS_DATA.length;
    openReelModal(nextIndex);
  } else if (e.key === 'ArrowLeft') {
    const prevIndex = (currentReelIndex - 1 + REELS_DATA.length) % REELS_DATA.length;
    openReelModal(prevIndex);
  }
});

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
    // Fallback if browser doesn't support IntersectionObserver
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
        // Ease-out cubic calculation
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
