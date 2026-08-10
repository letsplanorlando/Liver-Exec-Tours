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

  // Enquiry form: no backend on this static site, so we build a mailto:
  // with the visitor's details pre-filled and open their email client.
  // (Swap this for a proper form service like Formspree later if you want
  // submissions to land without the visitor's email client opening.)
  var form = document.querySelector('.enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name').value;
      var email = form.querySelector('#email').value;
      var phone = form.querySelector('#phone').value;
      var service = form.querySelector('#service').value;
      var message = form.querySelector('#message').value;

      var subject = encodeURIComponent('Enquiry from liverexectours.com: ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Service needed: ' + service + '\n\n' +
        'Message:\n' + message
      );
      window.location.href = 'mailto:Liverexectours@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
});
