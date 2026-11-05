document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  var header = document.querySelector('.site-header');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // The dropdown is porcelain, so make the bar solid while it's open.
      if (header) header.classList.toggle('menu-open', open);
    });
    // Close the mobile menu after tapping a link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        if (header) header.classList.remove('menu-open');
      });
    });
  }

  // Set current year in footer (runs in the visitor's browser)
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---- Hero content reveal --------------------------------------------
  // Phone: the text is on the first screen, so it fades in on a timer.
  // Desktop: it starts below the fold and fades in as it scrolls up over
  // the pinned photo.
  (function initHeroReveal() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var pieces = hero.querySelectorAll('.hero-reveal');
    var phone = window.innerWidth <= 720;
    if (phone || !('IntersectionObserver' in window)) {
      pieces.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-visible'); }, 300 + i * 450);
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    pieces.forEach(function (el) { io.observe(el); });
  })();

  // ---- Phone hero: lock its height ------------------------------------
  // Measured once on load (and again only if the width changes, e.g. the
  // phone is turned), so the address bar showing/hiding never resizes it.
  (function initHeroHeight() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var width = 0;
    function lock() {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      if (width <= 720) {
        hero.style.setProperty('--hero-h', window.innerHeight + 'px');
      } else {
        hero.style.removeProperty('--hero-h');
      }
    }
    lock();
    window.addEventListener('resize', lock);
  })();

  // ---- Hero auto-scroll (desktop) --------------------------------------
  // The desktop hero opens on the photo alone, with the text below the
  // fold. If the visitor hasn't scrolled after 5 seconds, glide the page
  // down until the text and enquiry bar are on screen. Any wheel, touch,
  // key or click stops it, and it never runs with reduced motion, on a
  // phone, or when the page opened part-way down.
  (function initHeroNudge() {
    var hero = document.querySelector('[data-hero]');
    var content = hero && hero.querySelector('.hero-content');
    if (!content || window.innerWidth <= 720) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cancelled = false;
    var frame = null;
    function cancel() {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
    }
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (type) {
      window.addEventListener(type, cancel, { passive: true, once: true });
    });

    setTimeout(function () {
      if (cancelled || window.scrollY > 0 || location.hash) return;
      var rect = content.getBoundingClientRect();
      // Bottom of the text block 40px above the bottom of the window.
      var target = Math.max(0, Math.round(rect.bottom - window.innerHeight + 40));
      if (!target) return;
      var start = window.scrollY;
      var began = null;
      var duration = 1400;
      function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
      function step(now) {
        if (cancelled) return;
        if (began === null) began = now;
        var t = Math.min(1, (now - began) / duration);
        window.scrollTo({ top: start + (target - start) * ease(t), behavior: 'instant' });
        if (t < 1) frame = requestAnimationFrame(step);
      }
      frame = requestAnimationFrame(step);
    }, 5000);
  })();

  // ---- Plan Trip opening tab --------------------------------------------
  // Service pages set <section id="book" data-default-trip="airport|hourly">
  // so the planner opens on the right tab. Wait for load so booking.js has
  // wired up the tabs.
  (function initDefaultTrip() {
    var book = document.querySelector('[data-default-trip]');
    if (!book) return;
    var tab = book.querySelector('[data-trip-tab="' + book.getAttribute('data-default-trip') + '"]');
    if (tab) window.addEventListener('load', function () { tab.click(); });
  })();

  // ---- "Airport" links → Plan Trip with Airport Transfer selected ------
  // The header links to #airport (index.html#airport from other pages).
  // Wait for load so booking.js has wired up the trip tabs.
  (function initAirportLinks() {
    var book = document.getElementById('book');
    var tab = document.querySelector('[data-trip-tab="airport"]');
    if (!book || !tab) return;
    function go(smooth) {
      tab.click();
      // 'instant' on page load: the page-wide smooth scrolling can stall
      // while the rest of the page is still settling.
      book.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
    }
    document.querySelectorAll('a[href="#airport"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        history.replaceState(null, '', '#airport');
        go(true);
      });
    });
    if (location.hash === '#airport') {
      window.addEventListener('load', function () { go(false); });
    }
  })();

  // ---- Header + mobile action bar on scroll ----------------------------
  // Homepage: the header sits transparent over the hero photo and turns
  // solid once the hero text reaches it. The phone action bar (Call /
  // WhatsApp / Plan Trip) slides in once the visitor is past the hero, or
  // past the first screen on the sub-pages.
  (function initScrollChrome() {
    var hero = document.querySelector('[data-hero]');
    var bar = document.querySelector('[data-action-bar]');
    if (bar) document.body.classList.add('has-action-bar');

    var ticking = false;
    function update() {
      ticking = false;
      var past;
      if (hero) {
        var rect = hero.getBoundingClientRect();
        past = rect.bottom <= 80;
        // Solid as soon as the hero text scrolls up under the header, so
        // the two never overlap.
        var content = hero.querySelector('.hero-content');
        var solid = content ? content.getBoundingClientRect().top + 140 <= 80 : past;
        if (header) header.classList.toggle('is-solid', solid);
      } else {
        past = window.scrollY > 320;
      }
      if (bar) bar.classList.toggle('is-visible', past);
    }
    function requestTick() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    requestTick();
  })();

  // ---- Reviews slider -------------------------------------------------
  // Moves on every 5 seconds; arrows and dots switch by hand. Pauses while
  // the pointer or keyboard focus is on it, and doesn't auto-advance at all
  // if the visitor has asked for reduced motion.
  (function initReviewSlider() {
    var slider = document.querySelector('[data-review-slider]');
    if (!slider) return;
    var slides = slider.querySelectorAll('.review-slide');
    var dotsBox = slider.querySelector('[data-review-dots]');
    if (slides.length < 2) return;
    var index = 0;
    var timer = null;
    var paused = false;
    var dots = [];

    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'review-dot';
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      dot.addEventListener('click', function () { show(i); restart(); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === index);
        s.setAttribute('aria-hidden', k === index ? 'false' : 'true');
      });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === index);
        d.setAttribute('aria-current', k === index ? 'true' : 'false');
      });
    }

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function restart() {
      clearInterval(timer);
      if (reduceMotion || paused) return;
      timer = setInterval(function () { show(index + 1); }, 5000);
    }
    function pause(p) { paused = p; restart(); }

    slider.querySelector('[data-review-prev]').addEventListener('click', function () { show(index - 1); restart(); });
    slider.querySelector('[data-review-next]').addEventListener('click', function () { show(index + 1); restart(); });
    slider.addEventListener('mouseenter', function () { pause(true); });
    slider.addEventListener('mouseleave', function () { pause(false); });
    slider.addEventListener('focusin', function () { pause(true); });
    slider.addEventListener('focusout', function () { pause(false); });

    show(0);
    restart();
  })();

  // ---- Next event shuttle teaser (homepage) ---------------------------
  // Shows the first event that's taking bookings in js/shuttles-data.js, so
  // the seat count lives in one place.
  (function initShuttleTeaser() {
    var box = document.querySelector('[data-shuttle-teaser]');
    var events = (window.LET_SHUTTLES && window.LET_SHUTTLES.events) || [];
    var openRuns = (window.LET_SHUTTLES && window.LET_SHUTTLES.openRuns) || function (e) { return e.runs || []; };
    // The next event that still has a run open for booking.
    var ev = events.filter(function (e) { return openRuns(e).length; })[0];
    if (!box) return;
    if (!ev) { box.hidden = true; return; }
    var run = openRuns(ev)[0];
    // The meter follows the Sprinter (the main shuttle); the price shown is
    // the cheapest seat across the vehicles on offer.
    var vehicles = ev.vehicles || {};
    var main = vehicles.sprinter || vehicles.vito;
    if (!main) { box.hidden = true; return; }
    var capacity = vehicles.sprinter ? 16 : 7;
    var booked = ((main.bookedSeats || {})[run.key] || []).length;
    var cheapest = Object.keys(vehicles).map(function (k) { return vehicles[k]; })
      .filter(function (v) { return v.pricePence; })
      .sort(function (a, b) { return a.pricePence - b.pricePence; })[0] || main;
    function set(key, text) {
      var el = box.querySelector('[data-ev="' + key + '"]');
      if (el) el.textContent = text;
    }
    set('name', ev.name);
    set('place', ev.place);
    set('dateLabel', ev.dateLabel);
    set('price', cheapest.price);
    set('minSeats', String(main.minSeats));
    set('booked', String(booked));
    set('capacity', String(capacity));
    set('left', (capacity - booked) + ' left');
    var fill = box.querySelector('[data-ev="fill"]');
    if (fill) fill.style.width = Math.round(booked / capacity * 100) + '%';
    var link = box.querySelector('[data-ev-link]');
    if (link) link.href = ev.page + '#book-seat';
  })();

  // ---- FAQ accordion ------------------------------------------------
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-q').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.hidden = true;
      });
      // Open this one if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.hidden = false;
      }
    });
  });

  // ---- Hero enquiry bar → WhatsApp / Email ---------------------------
  // Not a live quote engine — just packages up what the visitor typed
  // and hands it to their own WhatsApp or email client to send to us.
  (function initHeroEnquiryBar() {
    var bar = document.getElementById('hero-enquiry-bar');
    if (!bar) return;

    var WHATSAPP_NUMBER = '447808299060';
    var EMAIL_ADDRESS = 'info@liverexectours.com';

    function fieldVal(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }

    function formatDate(value) {
      if (!value) return '';
      var parts = value.split('-');
      if (parts.length !== 3) return value;
      return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    function buildMessage() {
      var pickup = fieldVal('he-pickup');
      var dropoff = fieldVal('he-dropoff');
      var date = formatDate(fieldVal('he-date'));
      var time = fieldVal('he-time');

      var lines = ['Hi, I\'d like to enquire about a journey:'];
      lines.push('Pickup: ' + (pickup || 'Not specified'));
      lines.push('Drop-off: ' + (dropoff || 'Not specified'));
      if (date) lines.push('Date: ' + date);
      if (time) lines.push('Pickup time: ' + time);

      return { pickup: pickup, dropoff: dropoff, text: lines.join('\n') };
    }

    bar.querySelectorAll('[data-send]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var msg = buildMessage();
        if (!msg.pickup && !msg.dropoff) {
          document.getElementById('he-pickup').focus();
          return;
        }
        if (btn.getAttribute('data-send') === 'whatsapp') {
          var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg.text);
          window.open(waUrl, '_blank', 'noopener');
        } else {
          var subject = encodeURIComponent('Journey enquiry from liverexectours.com');
          var body = encodeURIComponent(msg.text);
          window.location.href = 'mailto:' + EMAIL_ADDRESS + '?subject=' + subject + '&body=' + body;
        }
      });
    });
  })();
});
