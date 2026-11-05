// Simple enquiry forms (corporate page). Each <form data-message-form> has
// labelled fields; the Send buttons package them into a pre-filled
// WhatsApp or email message for the visitor's own app — nothing is stored
// or sent by the website itself.
document.addEventListener('DOMContentLoaded', function () {
  var WHATSAPP_NUMBER = '447808299060';
  var EMAIL_ADDRESS = 'info@liverexectours.com';

  document.querySelectorAll('[data-message-form]').forEach(function (form) {
    var error = form.querySelector('[data-form-error]');
    var intro = form.getAttribute('data-intro') || 'Hi,';
    var subject = form.getAttribute('data-subject') || 'Enquiry from liverexectours.com';

    form.querySelectorAll('[data-send]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lines = [intro];
        var missing = null;
        form.querySelectorAll('input, select, textarea').forEach(function (field) {
          var label = form.querySelector('label[for="' + field.id + '"] .label-text');
          var name = label ? label.textContent.trim() : field.name;
          var value = field.value.trim();
          if (field.required && !value && !missing) missing = field;
          if (value) lines.push(name + ': ' + value);
        });
        if (missing) {
          error.textContent = 'Please fill in the required fields.';
          error.hidden = false;
          missing.focus();
          return;
        }
        error.hidden = true;
        var text = lines.join('\n');
        if (btn.getAttribute('data-send') === 'whatsapp') {
          window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        } else {
          window.location.href = 'mailto:' + EMAIL_ADDRESS + '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(text);
        }
      });
    });
  });
});
