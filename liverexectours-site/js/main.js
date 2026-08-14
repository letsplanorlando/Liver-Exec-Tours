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
});
