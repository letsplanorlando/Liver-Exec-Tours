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
      window.location.href = 'mailto:info@liverexectours.com?subject=' + subject + '&body=' + body;
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
  // the base (non `.is-scrubbing`) styles in css/style.css.
  (function initHeroScrub() {
    var section = document.querySelector('[data-hero]');
    if (!section) return;
    var video = section.querySelector('.hero-video');
    if (!video) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    // Mobile: static hero with fade-in photo — skip video scrub entirely.
    if (window.innerWidth <= 720) return;

    var ready = false;
    var duration = 0;
    var inView = false;
    var ticking = false;
    var lastTarget = -1;

    function onMetadata() {
      duration = video.duration;
      if (duration && isFinite(duration) && duration > 0) {
        ready = true;
        section.classList.add('is-scrubbing');
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

  // ---- Hero content reveal --------------------------------------------
  // Desktop: title block + enquiry box fade in together once the video
  // has settled. Mobile: photo, then title ("LET"), then the enquiry box
  // fade in one at a time, so nothing appears all at once.
  (function initHeroReveal() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;

    var photo = hero.querySelector('.hero-photo-mobile');
    var titleBlock = hero.querySelector('.hero-title-block');
    var enquiryBlock = hero.querySelector('.hero-enquiry-block');

    function reveal(el) {
      if (el) el.classList.add('is-visible');
    }

    if (window.innerWidth <= 720) {
      setTimeout(function () { reveal(photo); }, 200);
      setTimeout(function () { reveal(titleBlock); }, 1100);
      setTimeout(function () { reveal(enquiryBlock); }, 1900);
    } else {
      setTimeout(function () {
        reveal(titleBlock);
        reveal(enquiryBlock);
      }, 900);
    }
  })();

  // ---- Header reveal on scroll ----------------------------------------
  // Shows the fixed header once the visitor has scrolled past the hero,
  // hides it again if they scroll back up into it. Uses the same
  // rect-based progress as the video scrub, so it appears at the exact
  // moment the pinned hero releases — and falls back to a plain
  // "scrolled past this section" check when the pin never activates
  // (reduced-motion / no-video fallback).
  (function initHeaderReveal() {
    var hero = document.querySelector('[data-hero]');
    var header = document.querySelector('.site-header');
    if (!hero || !header) return;

    var ticking = false;
    function update() {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      var runway = rect.height - window.innerHeight;
      var pastHero = runway > 0
        ? (0 - rect.top) / runway >= 0.99
        : rect.bottom <= 0;
      header.classList.toggle('header-visible', pastHero);
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
