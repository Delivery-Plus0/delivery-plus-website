// Delivery Plus website: story player, screenshot gallery, lightbox, language switch, navigation.
// Screenshot data (file, caption, how it was reached) comes from js/screens.js, generated from the
// real screenshot inventory by scripts/sync-screens.mjs.
(() => {
  'use strict';

  const SCREENS = window.DP_SCREENS || [];
  const byFile = new Map(SCREENS.map((s) => [s.file, s]));
  const shot = (path) => `assets/screens/${path}`;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header and navigation ---------- */

  const header = document.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const setNav = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  navToggle.addEventListener('click', () => setNav(navToggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setNav(false);
  });

  /* ---------- Lightbox ---------- */

  const lightbox = document.querySelector('[data-lightbox]');
  const lbImage = lightbox.querySelector('[data-lightbox-image]');
  const lbTitle = lightbox.querySelector('[data-lightbox-title]');
  const lbMeta = lightbox.querySelector('[data-lightbox-meta]');
  let lbList = [];
  let lbIndex = 0;

  const describe = (s) => {
    const lang = s.lang === 'ar' ? 'Arabic, right to left' : 'English';
    return `${lang} · ${s.device} · ${s.how}`;
  };

  const showLightbox = (index) => {
    lbIndex = (index + lbList.length) % lbList.length;
    const s = lbList[lbIndex];
    lbImage.src = s.file;
    lbImage.alt = s.screen;
    lbTitle.textContent = s.screen;
    lbMeta.textContent = describe(s);
    lightbox.querySelectorAll('.lightbox-nav').forEach((b) => (b.hidden = lbList.length < 2));
  };

  const openLightbox = (list, index) => {
    lbList = list;
    showLightbox(index);
    if (!lightbox.open) lightbox.showModal();
  };

  lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => showLightbox(lbIndex - 1));
  lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => showLightbox(lbIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close(); // a click on the backdrop
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    if (event.key === 'ArrowRight') showLightbox(lbIndex + 1);
  });

  /* ---------- The story of one order ---------- */

  const STORY = [
    { role: 'customer', file: 'customer/flow/01-customer-restaurant.png', title: 'Find a restaurant', text: 'The customer opens QA Kitchen, sees what is sold out, and adds a burger to the cart.' },
    { role: 'customer', file: 'customer/flow/03-customer-checkout.png', title: 'Check out', text: 'The EGP 25 delivery fee and the total come from the server’s quote, never from app math. Payment is simulated on the test stack.' },
    { role: 'customer', file: 'customer/flow/04-customer-order-confirmed.png', title: 'Order confirmed', text: 'Paid and confirmed. The customer can still cancel until the kitchen starts, with a full refund.' },
    { role: 'restaurant', file: 'restaurant/flow/05-restaurant-new-order.png', title: 'A new order arrives', text: 'It appears in the New orders lane by itself. The board checks for new orders every 10 seconds.' },
    { role: 'restaurant', file: 'restaurant/flow/07-restaurant-preparing.png', title: 'Into the kitchen', text: 'One tap on Start preparing, and the customer’s screen moves on too.' },
    { role: 'restaurant', file: 'restaurant/flow/08-restaurant-ready.png', title: 'Ready for pickup', text: 'From here nobody assigns a driver by hand: automatic dispatch takes over.' },
    { role: 'customer', file: 'customer/flow/09-customer-finding-driver.png', title: 'Finding a driver', text: 'No driver is online yet, so the delivery waits and the system keeps retrying.' },
    { role: 'driver', file: 'driver/flow/10-driver-assigned.png', title: 'Assigned automatically', text: 'The driver goes online and gets the job at once: pickup, drop-off and items. Location sharing starts.' },
    { role: 'customer', file: 'customer/flow/11-customer-driver-card-map.png', title: 'The driver, live', text: 'The customer sees a driver card and the driver on a live map, updated over Server-Sent Events.' },
    { role: 'driver', file: 'driver/flow/12-driver-pickup-confirm.png', title: 'Confirm the pickup', text: 'Each step asks for confirmation, so a stray tap can’t skip ahead. Retrying a step is always safe.' },
    { role: 'customer', file: 'customer/flow/16-customer-on-the-way.png', title: 'On the way', text: 'The phase bar and the map follow the driver until the door.' },
    { role: 'driver', file: 'driver/flow/17-driver-completed.png', title: 'Delivered', text: 'The driver marks it delivered and is free for the next job straight away.' },
    { role: 'driver', file: 'driver/flow/18-driver-wallet-pending.png', title: 'Earning recorded', text: 'Half the delivery fee, EGP 12.50, lands in the wallet as pending and becomes available 12 hours later.' },
    { role: 'customer', file: 'customer/flow/20-customer-rating-filled.png', title: 'Rate the driver', text: 'Five stars and a comment, once per delivery. The driver sees the rating summary.' },
    { role: 'customer', file: 'customer/flow/22-customer-alerts.png', title: 'Told at every stage', text: 'Payment received, confirmed, driver assigned, picked up, delivered: one alert each, in the customer’s language.' },
    { role: 'restaurant', file: 'restaurant/flow/23-restaurant-reject-dialog.png', title: 'When the kitchen says no', text: 'On a second order, the restaurant rejects it before cooking and picks a reason.' },
    { role: 'customer', file: 'customer/flow/25-customer-order-rejected-reason.png', title: 'Told why', text: 'The customer sees the cancellation with the restaurant’s own reason, and a paid order is refunded in full.' },
  ];
  const ROLE_LABEL = { customer: 'Customer app', restaurant: 'Restaurant app', driver: 'Driver app' };

  const story = document.querySelector('[data-story]');
  if (story) {
    const stepsEl = story.querySelector('[data-story-steps]');
    const device = story.querySelector('[data-story-device]');
    const image = story.querySelector('[data-story-image]');
    const roleEl = story.querySelector('[data-story-role]');
    const titleEl = story.querySelector('[data-story-title]');
    const textEl = story.querySelector('[data-story-text]');
    const countEl = story.querySelector('[data-story-count]');
    const playBtn = story.querySelector('[data-story-play]');
    let current = 0;
    let timer = null;

    stepsEl.innerHTML = STORY.map(
      (step, i) => `
        <li class="story-step" role="presentation">
          <button type="button" role="tab" id="story-tab-${i}" aria-selected="false" data-step="${i}">
            <span class="story-num">${i + 1}</span>
            <span>
              <span class="story-step-role role-${step.role}">${ROLE_LABEL[step.role]}</span>
              <span class="story-step-title">${step.title}</span>
            </span>
          </button>
        </li>`,
    ).join('');
    const tabs = [...stepsEl.querySelectorAll('[data-step]')];

    // Warm the cache so switching steps doesn't flash.
    STORY.forEach((step) => {
      const img = new Image();
      img.src = shot(step.file);
    });

    const show = (index, { focus = false, scroll = true } = {}) => {
      current = (index + STORY.length) % STORY.length;
      const step = STORY[current];
      const isLaptop = step.role === 'restaurant';

      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === current));
        tab.tabIndex = i === current ? 0 : -1;
      });
      if (focus) tabs[current].focus();
      if (scroll) tabs[current].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });

      const swap = () => {
        device.className = `story-device device ${isLaptop ? 'laptop is-laptop' : 'phone'}`;
        device.innerHTML = isLaptop
          ? '<div class="laptop-screen"><img data-story-image alt=""></div><div class="laptop-base" aria-hidden="true"></div>'
          : '<img data-story-image alt="">';
        const img = device.querySelector('img');
        img.src = shot(step.file);
        img.alt = byFile.get(shot(step.file))?.screen || step.title;
        img.width = isLaptop ? 1440 : 824;
        img.height = isLaptop ? 900 : 1830;
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => openLightbox(STORY.map((s) => byFile.get(shot(s.file))).filter(Boolean), current));
      };
      if (reducedMotion) swap();
      else {
        const old = device.querySelector('img');
        if (old) old.classList.add('is-swapping');
        setTimeout(swap, old ? 160 : 0);
      }

      roleEl.textContent = ROLE_LABEL[step.role];
      roleEl.className = `story-role role-${step.role}`;
      titleEl.textContent = step.title;
      textEl.textContent = step.text;
      countEl.textContent = `${current + 1} / ${STORY.length}`;
    };

    const stop = () => {
      clearInterval(timer);
      timer = null;
      playBtn.setAttribute('aria-pressed', 'false');
      playBtn.textContent = 'Play';
    };
    const play = () => {
      playBtn.setAttribute('aria-pressed', 'true');
      playBtn.textContent = 'Pause';
      timer = setInterval(() => show(current + 1), 3800);
    };

    stepsEl.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-step]');
      if (!tab) return;
      stop();
      show(Number(tab.dataset.step));
    });
    stepsEl.addEventListener('keydown', (event) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (event.key in keys) {
        event.preventDefault();
        stop();
        show(current + keys[event.key], { focus: true });
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        stop();
        show(event.key === 'Home' ? 0 : STORY.length - 1, { focus: true });
      }
    });
    story.querySelector('[data-story-prev]').addEventListener('click', () => {
      stop();
      show(current - 1);
    });
    story.querySelector('[data-story-next]').addEventListener('click', () => {
      stop();
      show(current + 1);
    });
    playBtn.addEventListener('click', () => (timer ? stop() : play()));

    image.remove(); // replaced by the device markup built in show()
    show(0, { scroll: false });
  }

  /* ---------- Screenshot gallery ---------- */

  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    const grid = gallery.querySelector('[data-gallery-grid]');
    const count = gallery.querySelector('[data-gallery-count]');
    const appTabs = [...gallery.querySelectorAll('[data-gallery-apps] button')];
    const filters = [...gallery.querySelectorAll('[data-gallery-filters] button')];
    const state = { app: 'customer', group: 'all' };
    let visible = [];

    const render = () => {
      visible = SCREENS.filter((s) => s.app === state.app && (state.group === 'all' || s.group === state.group));
      // The integrated flow reads best in its numbered order.
      visible.sort((a, b) => (a.group === 'flow' && b.group === 'flow' ? a.file.localeCompare(b.file) : 0));
      grid.classList.toggle('is-wide', state.app === 'restaurant');
      grid.innerHTML = visible
        .map(
          (s, i) => `
          <li class="gallery-item">
            <button type="button" data-index="${i}">
              <span class="gallery-thumb"><img src="${s.file}" alt="" loading="lazy" decoding="async"></span>
              <span class="gallery-label"${s.lang === 'ar' ? ' title="Arabic, right to left"' : ''}>${s.screen}</span>
            </button>
          </li>`,
        )
        .join('');
      const total = SCREENS.filter((s) => s.app === state.app).length;
      count.textContent =
        state.group === 'all' ? `${visible.length} screenshots` : `${visible.length} of ${total} screenshots`;
    };

    appTabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        state.app = tab.dataset.app;
        appTabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
        render();
      }),
    );
    filters.forEach((button) =>
      button.addEventListener('click', () => {
        state.group = button.dataset.group;
        filters.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        render();
      }),
    );
    grid.addEventListener('click', (event) => {
      const item = event.target.closest('[data-index]');
      if (item) openLightbox(visible, Number(item.dataset.index));
    });

    render();
  }

  /* ---------- English / Arabic comparison ---------- */

  const langSwitch = document.querySelector('[data-lang-switch]');
  if (langSwitch) {
    const buttons = [...langSwitch.querySelectorAll('button')];
    const pairs = [...document.querySelectorAll('[data-pair] img')];
    pairs.forEach((img) => {
      new Image().src = img.dataset.ar; // preload the other language
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const list = pairs.map((p) => byFile.get(p.getAttribute('src'))).filter(Boolean);
        openLightbox(list, pairs.indexOf(img));
      });
    });

    buttons.forEach((button) =>
      button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        pairs.forEach((img) => {
          const next = img.dataset[lang];
          if (img.getAttribute('src') === next) return;
          if (reducedMotion) {
            img.src = next;
            return;
          }
          img.classList.add('is-swapping');
          setTimeout(() => {
            img.src = next;
            img.classList.remove('is-swapping');
          }, 180);
        });
      }),
    );
  }

  /* ---------- Reveal on scroll ---------- */

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-head, .app-card, .feature, .architecture, .quality, .status-col, .lang-pair, .facts li');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    targets.forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
})();
