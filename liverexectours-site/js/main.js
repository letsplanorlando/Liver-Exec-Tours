document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
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
});
