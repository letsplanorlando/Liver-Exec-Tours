// Event pages (fury-joshua.html, cheltenham.html, oasis.html): date choice,
// Sprinter/Vito choice, seat map, whole-vehicle private options. All data
// comes from js/shuttles-data.js; the page says which event it is with
// <div class="seat-card" data-event="...">. Reserving doesn't take payment
// — it hands a pre-filled message to the visitor's own WhatsApp or email;
// we send a payment link once the run is confirmed.
document.addEventListener('DOMContentLoaded', function () {
  var shuttles = window.LET_SHUTTLES || {};
  var card = document.querySelector('[data-event]');
  if (!card) return;
  var ev = (shuttles.events || []).filter(function (e) { return e.id === card.getAttribute('data-event'); })[0];
  if (!ev) return;

  var WHATSAPP_NUMBER = '447808299060';
  var EMAIL_ADDRESS = 'info@liverexectours.com';

  // Seat maps from Joe's drawings: [row, column] for each seat, front to
  // back, numbered in that order. Driver front right.
  var VEHICLES = {
    sprinter: {
      name: 'Sprinter',
      cols: 4,
      driver: [1, 4],
      door: ['2 / 4', 1],   // sliding door on the left beside rows 2–3
      seats: [
        [1, 2], [1, 3],
        [2, 2], [2, 3], [2, 4],
        [3, 3], [3, 4],
        [4, 1], [4, 3], [4, 4],
        [5, 1], [5, 3], [5, 4],
        [6, 1], [6, 2], [6, 4]
      ]
    },
    vito: {
      name: 'Vito',
      cols: 3,
      driver: [1, 3],
      seats: [
        [1, 1],
        [2, 1], [2, 2], [2, 3],
        [3, 1], [3, 2], [3, 3]
      ]
    }
  };
  var keys = ['sprinter', 'vito'].filter(function (k) { return ev.vehicles && ev.vehicles[k]; });
  if (!keys.length) return;

  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  var runs = shuttles.openRuns ? shuttles.openRuns(ev) : ev.runs;
  var run = runs[0];
  var current = keys[0];
  var picked = [];

  var grid = card.querySelector('[data-seat-grid]');
  var summary = card.querySelector('[data-seat-summary]');
  var error = card.querySelector('[data-seat-error]');
  var choice = card.querySelector('[data-vehicle-choice]');
  var runSelect = card.querySelector('[data-run-select]');
  var runLabel = card.querySelector('[data-run-label]');
  var form = card.querySelector('[data-seat-form]');
  var closed = card.querySelector('[data-seat-closed]');

  function vehicle() { return VEHICLES[current]; }
  function seatData() { return ev.vehicles[current]; }
  function booked() { return (run && seatData().bookedSeats[run.key]) || []; }

  // Every run past its cut-off: say so instead of showing seats.
  if (!run) {
    if (form) form.hidden = true;
    if (closed) closed.hidden = false;
  }

  // Date: a dropdown when there's more than one night, plain text otherwise.
  if (runSelect && runs.length > 1) {
    runs.forEach(function (r) {
      var opt = document.createElement('option');
      opt.value = r.key;
      opt.textContent = r.label;
      runSelect.appendChild(opt);
    });
    runSelect.addEventListener('change', function () {
      run = runs[runSelect.selectedIndex];
      reset();
    });
    if (runLabel) runLabel.hidden = true;
  } else if (runSelect) {
    runSelect.closest('label').hidden = true;
    if (runLabel && run) runLabel.textContent = run.label;
  }

  // Vehicle toggle.
  if (choice && keys.length > 1) {
    keys.forEach(function (key) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'seat-vehicle';
      btn.setAttribute('data-vehicle', key);
      btn.setAttribute('aria-pressed', key === current ? 'true' : 'false');
      btn.textContent = VEHICLES[key].name + ' · ' + VEHICLES[key].seats.length + ' seats · ' + ev.vehicles[key].price;
      btn.addEventListener('click', function () {
        current = key;
        choice.querySelectorAll('[data-vehicle]').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        reset();
      });
      choice.appendChild(btn);
    });
  }

  // Whole-vehicle private options: one line per vehicle, always on offer.
  var privateList = document.querySelector('[data-private-options]');
  if (privateList) {
    keys.forEach(function (key) {
      var v = ev.vehicles[key];
      var li = document.createElement('li');
      var label = document.createElement('span');
      label.innerHTML = 'All ' + VEHICLES[key].seats.length + ' seats on the ' + VEHICLES[key].name + ' &mdash; <strong></strong>';
      label.querySelector('strong').textContent = v.privatePrice || 'ask for a price';
      var link = document.createElement('a');
      link.className = 'btn btn-ghost-light';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Book the ' + VEHICLES[key].name + ' privately';
      link.addEventListener('click', function () {
        // Built on click so it names the night picked above.
        link.href = waLink('Hi, we\'d like to book the whole ' + VEHICLES[key].name + ' privately for ' + ev.name +
          ' (' + (run ? run.label : ev.dateLabel) + ')' + (v.privatePrice ? ', ' + v.privatePrice : '') + '.\n' +
          'Group size: \nOur pick-up and drop-off point in Liverpool: ');
      });
      link.href = waLink('Hi, we\'d like to book the whole ' + VEHICLES[key].name + ' privately for ' + ev.name + '.');
      li.appendChild(label);
      li.appendChild(link);
      privateList.appendChild(li);
    });
  }

  function cell(className, row, col, text) {
    var el = document.createElement('span');
    el.className = className;
    el.style.gridRow = row;
    el.style.gridColumn = col;
    if (text) el.textContent = text;
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  // Per-vehicle / per-night text elsewhere on the page.
  function fillSlots() {
    var values = {
      name: vehicle().name,
      capacity: String(vehicle().seats.length),
      minSeats: String(seatData().minSeats),
      cutoff: run ? run.cutoff : ''
    };
    document.querySelectorAll('[data-veh]').forEach(function (el) {
      var value = values[el.getAttribute('data-veh')];
      if (value) el.textContent = value;
    });
  }

  function buildGrid() {
    var v = vehicle();
    var taken = booked();
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(' + v.cols + ', minmax(0, 1fr))';
    grid.style.maxWidth = (v.cols * 72) + 'px';
    grid.setAttribute('aria-label', 'Seats on the ' + v.name);
    grid.appendChild(cell('seat-driver', v.driver[0], v.driver[1], 'Driver'));
    if (v.door) grid.appendChild(cell('seat-door', v.door[0], v.door[1], 'Door'));
    v.seats.forEach(function (pos, i) {
      var n = i + 1;
      var isTaken = taken.indexOf(n) !== -1;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'seat';
      btn.style.gridRow = pos[0];
      btn.style.gridColumn = pos[1];
      btn.textContent = n;
      btn.setAttribute('data-seat', n);
      btn.setAttribute('aria-label', 'Seat ' + n + (isTaken ? ', booked' : ''));
      if (isTaken) {
        btn.disabled = true;
      } else {
        btn.setAttribute('aria-pressed', 'false');
      }
      grid.appendChild(btn);
    });
    fillSlots();
  }

  function money(pence) {
    return '£' + (pence / 100).toFixed(2);
  }

  function total() {
    var d = seatData();
    return d.pricePence ? money(picked.length * d.pricePence) : picked.length + ' × ' + d.price;
  }

  function render() {
    var left = vehicle().seats.length - booked().length - picked.length;
    if (!picked.length) {
      summary.textContent = left + ' seats left on the ' + vehicle().name;
    } else {
      summary.textContent = picked.length + (picked.length === 1 ? ' seat' : ' seats') +
        ' selected (' + picked.join(', ') + ') · ' + total() + ' return';
    }
  }

  function reset() {
    picked = [];
    error.hidden = true;
    buildGrid();
    render();
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-seat]');
    if (!btn || btn.disabled) return;
    var n = parseInt(btn.getAttribute('data-seat'), 10);
    var i = picked.indexOf(n);
    if (i === -1) picked.push(n); else picked.splice(i, 1);
    picked.sort(function (a, b) { return a - b; });
    btn.setAttribute('aria-pressed', i === -1 ? 'true' : 'false');
    error.hidden = true;
    render();
  });
  if (run) reset();

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  card.querySelectorAll('[data-seat-send]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = val('seat-name');
      var phone = val('seat-phone');
      var problem = !picked.length ? 'Pick at least one seat.'
        : !name ? 'Add your name.'
        : phone.replace(/\D/g, '').length < 7 ? 'Add a phone number we can reach you on.'
        : '';
      if (problem) {
        error.textContent = problem;
        error.hidden = false;
        return;
      }
      var text = [
        'Hi, I\'d like to reserve ' + (picked.length === 1 ? 'a seat' : picked.length + ' seats') +
          ' on the ' + ev.name + ' shuttle:',
        'Event: ' + ev.name + ', ' + ev.venue + ', ' + run.label,
        'Vehicle: ' + vehicle().name,
        'Seat' + (picked.length === 1 ? '' : 's') + ': ' + picked.join(', '),
        'Total: ' + total() + ' return (paid by link once the run is confirmed)',
        'Name: ' + name,
        'Phone: ' + phone
      ].join('\n');
      if (btn.getAttribute('data-seat-send') === 'whatsapp') {
        window.open(waLink(text), '_blank', 'noopener');
      } else {
        window.location.href = 'mailto:' + EMAIL_ADDRESS +
          '?subject=' + encodeURIComponent(ev.name + ' shuttle seat reservation') +
          '&body=' + encodeURIComponent(text);
      }
    });
  });
});
