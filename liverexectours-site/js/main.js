document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    // Close the mobile menu after tapping a link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  // Set current year in footer (runs in the visitor's browser)
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Enquiry form: submits into Supabase (see supabase/enquiries.sql) when
  // window.SUPABASE_URL / SUPABASE_ANON_KEY are set in index.html. Falls
  // back to a mailto: with the details pre-filled if those aren't
  // configured yet, or if the submission fails for any reason.
  var supabaseClient = (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase)
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
    : null;

  var form = document.querySelector('.enquiry');
  if (form) {
    var statusEl = form.querySelector('.form-status');

    function openMailto(name, email, phone, service, message) {
      var subject = encodeURIComponent('Enquiry from liverexectours.com: ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Service needed: ' + service + '\n\n' +
        'Message:\n' + message
      );
      window.location.href = 'mailto:Liverexectours@gmail.com?subject=' + subject + '&body=' + body;
    }

    function setStatus(text, kind) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name').value;
      var email = form.querySelector('#email').value;
      var phone = form.querySelector('#phone').value;
      var service = form.querySelector('#service').value;
      var message = form.querySelector('#message').value;

      if (!supabaseClient) {
        openMailto(name, email, phone, service, message);
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending...', '');

      supabaseClient
        .from('enquiries')
        .insert([{ name: name, email: email, phone: phone, service: service, message: message }])
        .then(function (result) {
          if (submitBtn) submitBtn.disabled = false;
          if (result.error) {
            setStatus('Something went wrong — opening your email app instead.', 'error');
            openMailto(name, email, phone, service, message);
            return;
          }
          setStatus('Thanks — your enquiry has been sent. We’ll reply the same day.', 'success');
          form.reset();
        });
    });
  }

  // ---- Hero scroll-scrub video ---------------------------------------
  // Scrubs the hero video's currentTime to match scroll position through
  // a pinned runway. Never calls .play() — the video only ever seeks, so
  // it naturally holds on whatever frame the visitor stops scrolling at.
  // Progressively enhanced: if the browser lacks IntersectionObserver, or
  // the visitor has requested reduced motion, the hero simply stays as a
  // normal single-viewport section showing the poster/first frame — see
  // the base (non `.scrub-active`) styles in css/style.css.
  (function initHeroScrub() {
    var section = document.querySelector('[data-hero-scrub]');
    if (!section) return;
    var video = section.querySelector('.hero-scrub-video');
    if (!video) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    // Mobile: sticky-pinned hero with parallax on the img instead of video scrub.
    // The scrub-active class locks the hero in place during the scroll runway,
    // then releases into the page — same mechanic as desktop, no video needed.
    if (window.innerWidth <= 720) {
      var mobileImg = section.querySelector('.hero-mobile-img');
      if (!mobileImg) return;
      section.classList.add('scrub-active');

      var mInView = false, mTicking = false;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          mInView = e.isIntersecting;
          if (mInView) mRequestTick();
        });
      }, { threshold: 0 }).observe(section);

      function updateMobileParallax() {
        mTicking = false;
        if (!mInView) return;
        var rect = section.getBoundingClientRect();
        var runway = rect.height - window.innerHeight;
        if (runway <= 0) return;
        var progress = Math.max(0, Math.min(1, (0 - rect.top) / runway));
        mobileImg.style.transform = 'translateY(' + Math.round(progress * -60) + 'px)';
      }
      function mRequestTick() {
        if (!mTicking) { mTicking = true; requestAnimationFrame(updateMobileParallax); }
      }
      window.addEventListener('scroll', mRequestTick, { passive: true });
      window.addEventListener('resize', mRequestTick);
      return;
    }

    var ready = false;
    var duration = 0;
    var inView = false;
    var ticking = false;
    var lastTarget = -1;

    function onMetadata() {
      duration = video.duration;
      if (duration && isFinite(duration) && duration > 0) {
        ready = true;
        section.classList.add('scrub-active');
        requestTick();
      }
    }
    video.addEventListener('loadedmetadata', onMetadata);
    if (video.readyState >= 1 && video.duration) onMetadata();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inView = entry.isIntersecting;
        if (inView) requestTick();
      });
    }, { threshold: 0 });
    observer.observe(section);

    function updateScrub() {
      ticking = false;
      if (!ready || !inView) return;
      var rect = section.getBoundingClientRect();
      var runway = rect.height - window.innerHeight;
      if (runway <= 0) return;
      var progress = (0 - rect.top) / runway;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      var target = progress * (duration - 0.05);
      // Skip near-duplicate seeks so we're not fighting the decoder on
      // every single scroll tick.
      if (Math.abs(target - lastTarget) > 0.03) {
        try { video.currentTime = target; } catch (e) { /* ignore seek errors */ }
        lastTarget = target;
      }
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrub);
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  })();

  // ---- Cinematic hero title fade-in + header reveal on scroll -------
  (function initCinematicFadeAndHeader() {
    var cinematicHero = document.querySelector('.hero-scrub-cinematic');
    if (!cinematicHero) return;

    // On mobile the photo fades in over 1.5s — text starts at 80% through (1200ms).
    // On desktop, text fades in after a short settle delay.
    var fadeDelay = window.innerWidth <= 720 ? 1200 : 900;
    window.requestAnimationFrame(function () {
      setTimeout(function () {
        cinematicHero.classList.add('fade-in');
      }, fadeDelay);
    });

    // Reveal the header once the visitor has scrolled past the hero,
    // hide it again if they scroll back up into it. Uses the same
    // rect-based progress math as the video scrub above, so the header
    // appears at the exact moment the pinned hero releases — not some
    // arbitrary distance later — and it works whether or not the pin
    // ever activates (e.g. reduced-motion / no-video fallback), where
    // it just falls back to a plain "scrolled past this section" check.
    var header = document.querySelector('.site-header');
    if (!header) return;

    var headerTicking = false;
    function updateHeader() {
      headerTicking = false;
      var rect = cinematicHero.getBoundingClientRect();
      var runway = rect.height - window.innerHeight;
      var pastHero = runway > 0
        ? (0 - rect.top) / runway >= 0.99
        : rect.bottom <= 0;
      header.classList.toggle('header-visible', pastHero);
    }
    function requestHeaderTick() {
      if (!headerTicking) {
        headerTicking = true;
        requestAnimationFrame(updateHeader);
      }
    }
    window.addEventListener('scroll', requestHeaderTick, { passive: true });
    window.addEventListener('resize', requestHeaderTick);
    requestHeaderTick();
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
    var EMAIL_ADDRESS = 'Liverexectours@gmail.com';

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
