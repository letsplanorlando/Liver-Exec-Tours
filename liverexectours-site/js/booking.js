document.addEventListener('DOMContentLoaded', function () {
  var WHATSAPP_NUMBER = '447808299060';
  var EMAIL_ADDRESS = 'info@liverexectours.com';
  var MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || '';

  // Approximate coordinates for the airport dropdown, used only to draw the
  // route preview — not shown to the visitor, just fed to Directions.
  var AIRPORT_COORDS = {
    'Liverpool John Lennon (LPL)': { lat: 53.3336, lng: -2.8497 },
    'Manchester Airport (MAN) — Terminal 1': { lat: 53.3537, lng: -2.2750 },
    'Manchester Airport (MAN) — Terminal 2': { lat: 53.3537, lng: -2.2750 },
    'Manchester Airport (MAN) — Terminal 3': { lat: 53.3537, lng: -2.2750 },
    'Leeds Bradford (LBA)': { lat: 53.8659, lng: -1.6606 },
    'London Heathrow (LHR)': { lat: 51.4700, lng: -0.4543 },
    'Liverpool — Ravenair / Liverpool Aviation Services': { lat: 53.3336, lng: -2.8497 },
    'Manchester — Signature Flight Support': { lat: 53.3537, lng: -2.2750 }
  };

  var VEHICLE_NAMES = {
    vito: 'Mercedes Vito (7 seats)',
    lexus: 'Lexus SUV (3 seats)',
    sprinter: 'Mercedes Sprinter (16 seats)'
  };

  var state = {
    tripType: 'oneway',
    pickup: '', pickupLoc: null,
    dropoff: '', dropoffLoc: null,
    flightDirection: 'departure',
    airport: '',
    airportAddress: '', airportAddressLoc: null,
    flightNumber: '',
    returnDate: '', returnTime: '', returnFlightNumber: '',
    hourlyPickup: '', hourlyPickupLoc: null,
    duration: '',
    date: '', time: '',
    vehicle: '',
    name: '', phone: '', email: '', passengers: '1', notes: ''
  };

  // ---- Step navigation ------------------------------------------------
  var panels = document.querySelectorAll('.wizard-panel');
  var stepItems = document.querySelectorAll('.wizard-step-item');
  var connectors = document.querySelectorAll('.wizard-step-connector');

  function showStep(n) {
    panels.forEach(function (p) {
      p.hidden = Number(p.getAttribute('data-step')) !== n;
    });
    stepItems.forEach(function (item) {
      var s = Number(item.getAttribute('data-step-item'));
      item.classList.toggle('is-current', s === n);
      item.classList.toggle('is-done', s < n);
    });
    connectors.forEach(function (c, i) {
      c.classList.toggle('is-done', (i + 1) < n);
    });
    if (n === 4) renderSummary();

    var mainEl = document.querySelector('.wizard-main');
    if (mainEl) {
      var rect = mainEl.getBoundingClientRect();
      if (rect.top < 0 || rect.top > 200) {
        mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function showError(step, msg) {
    var panel = document.querySelector('.wizard-panel[data-step="' + step + '"]');
    var err = panel && panel.querySelector('[data-step-error]');
    if (err) { err.textContent = msg; err.hidden = false; }
  }
  function clearError(step) {
    var panel = document.querySelector('.wizard-panel[data-step="' + step + '"]');
    var err = panel && panel.querySelector('[data-step-error]');
    if (err) err.hidden = true;
  }

  // ---- Trip type tabs ---------------------------------------------------
  var tripTabs = document.querySelectorAll('[data-trip-tab]');
  var tripPanels = document.querySelectorAll('[data-trip-panel]');
  tripTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var type = tab.getAttribute('data-trip-tab');
      state.tripType = type;
      tripTabs.forEach(function (t) { t.classList.toggle('is-active', t === tab); });
      tripPanels.forEach(function (p) { p.hidden = p.getAttribute('data-trip-panel') !== type; });
      clearRoutePreview();
    });
  });

  // ---- Plain field bindings (work with zero API key) --------------------
  function bindText(id, key) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () { state[key] = el.value; });
  }
  bindText('bk-pickup', 'pickup');
  bindText('bk-dropoff', 'dropoff');
  bindText('bk-airport-address', 'airportAddress');
  bindText('bk-hourly-pickup', 'hourlyPickup');
  bindText('bk-flight-number', 'flightNumber');
  bindText('bk-return-date', 'returnDate');
  bindText('bk-return-time', 'returnTime');
  bindText('bk-return-flight-number', 'returnFlightNumber');
  bindText('bk-date', 'date');
  bindText('bk-time', 'time');
  bindText('bk-airport-date', 'date');
  bindText('bk-airport-time', 'time');
  bindText('bk-hourly-date', 'date');
  bindText('bk-hourly-time', 'time');
  bindText('bk-name', 'name');
  bindText('bk-phone', 'phone');
  bindText('bk-email', 'email');
  bindText('bk-notes', 'notes');

  var airportSelect = document.getElementById('bk-airport');
  if (airportSelect) airportSelect.addEventListener('change', function () {
    state.airport = airportSelect.value;
    updateRoutePreview();
  });
  var durationSelect = document.getElementById('bk-duration');
  if (durationSelect) durationSelect.addEventListener('change', function () { state.duration = durationSelect.value; });
  var passengersInput = document.getElementById('bk-passengers');
  if (passengersInput) passengersInput.addEventListener('input', function () { state.passengers = passengersInput.value; });
  // Airport trip type has a third option ("return") that needs a second
  // set of date/time/flight-number fields — shown only then, with the
  // shared Date/Pickup time labels relabelled "Outbound..." so it's clear
  // which leg they belong to.
  var returnFieldsBlock = document.querySelector('[data-return-fields]');
  var outboundHeading = document.querySelector('[data-outbound-heading]');
  var dateLabel = document.querySelector('[data-date-label]');
  var timeLabel = document.querySelector('[data-time-label]');
  var flightNumberLabel = document.querySelector('[data-flight-number-label]');

  function updateAirportDirectionUI() {
    var isReturn = state.flightDirection === 'return';
    if (returnFieldsBlock) returnFieldsBlock.hidden = !isReturn;
    if (outboundHeading) outboundHeading.hidden = !isReturn;
    if (dateLabel) dateLabel.firstChild.textContent = isReturn ? 'Outbound date' : 'Date';
    if (timeLabel) timeLabel.firstChild.textContent = isReturn ? 'Outbound pickup time' : 'Pickup time';
    if (flightNumberLabel) flightNumberLabel.firstChild.textContent = isReturn ? 'Outbound flight number ' : 'Flight number ';
  }

  document.querySelectorAll('input[name="flight-direction"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (r.checked) {
        state.flightDirection = r.value;
        updateAirportDirectionUI();
        updateRoutePreview();
      }
    });
  });

  // ---- Step 1 -> 2 --------------------------------------------------------
  document.querySelector('[data-next="2"]').addEventListener('click', function () {
    clearError(1);
    if (state.tripType === 'oneway' && (!state.pickup.trim() || !state.dropoff.trim())) {
      showError(1, 'Please add both a pickup and drop-off address.'); return;
    }
    if (state.tripType === 'airport' && (!state.airport || !state.airportAddress.trim())) {
      showError(1, 'Please select an airport and add your address.'); return;
    }
    if (state.tripType === 'airport' && state.flightDirection === 'return' && (!state.returnDate || !state.returnTime)) {
      showError(1, 'Please add a return date and pickup time.'); return;
    }
    if (state.tripType === 'hourly' && !state.hourlyPickup.trim()) {
      showError(1, 'Please add a pickup address.'); return;
    }
    if (!state.date || !state.time) {
      showError(1, 'Please choose a date and pickup time.'); return;
    }
    showStep(2);
  });

  // ---- Vehicle selection --------------------------------------------------
  var vehicleCards = document.querySelectorAll('.vehicle-card');
  vehicleCards.forEach(function (card) {
    card.addEventListener('click', function () {
      state.vehicle = card.getAttribute('data-vehicle');
      vehicleCards.forEach(function (c) { c.classList.toggle('is-selected', c === card); });
      clearError(2);
    });
  });
  document.querySelector('[data-next="3"]').addEventListener('click', function () {
    if (!state.vehicle) { showError(2, 'Please choose a vehicle to continue.'); return; }
    showStep(3);
  });

  // ---- Step 3 -> 4 --------------------------------------------------------
  document.querySelector('[data-next="4"]').addEventListener('click', function () {
    clearError(3);
    if (!state.name.trim()) { showError(3, 'Please add your name.'); return; }
    if (!state.phone.trim() && !state.email.trim()) { showError(3, 'Please add a phone number or email so we can reply.'); return; }
    showStep(4);
  });

  // ---- Back buttons ---------------------------------------------------
  document.querySelectorAll('[data-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () { showStep(Number(btn.getAttribute('data-prev'))); });
  });

  // ---- Summary + send ---------------------------------------------------
  function formatDate(value) {
    if (!value) return 'Not specified';
    var parts = value.split('-');
    if (parts.length !== 3) return value;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function journeyLines() {
    var lines = [];
    if (state.tripType === 'oneway') {
      lines.push(['Pickup', state.pickup || 'Not specified']);
      lines.push(['Drop-off', state.dropoff || 'Not specified']);
    } else if (state.tripType === 'airport') {
      var dir = state.flightDirection === 'arrival' ? 'Arrival — collect from airport'
        : state.flightDirection === 'return' ? 'Return trip — take there and collect on return'
        : 'Departure — take to airport';
      lines.push(['Flight', dir]);
      lines.push(['Airport', state.airport || 'Not specified']);
      lines.push(['Address', state.airportAddress || 'Not specified']);
      if (state.flightNumber) {
        lines.push([state.flightDirection === 'return' ? 'Outbound flight number' : 'Flight number', state.flightNumber]);
      }
    } else if (state.tripType === 'hourly') {
      lines.push(['Pickup', state.hourlyPickup || 'Not specified']);
      lines.push(['Duration', state.duration || 'Not specified']);
    }

    var isReturnAirport = state.tripType === 'airport' && state.flightDirection === 'return';
    lines.push([isReturnAirport ? 'Outbound date' : 'Date', formatDate(state.date)]);
    lines.push([isReturnAirport ? 'Outbound pickup time' : 'Pickup time', state.time || 'Not specified']);

    if (isReturnAirport) {
      lines.push(['Return date', formatDate(state.returnDate)]);
      lines.push(['Return pickup time', state.returnTime || 'Not specified']);
      if (state.returnFlightNumber) lines.push(['Return flight number', state.returnFlightNumber]);
    }

    return lines;
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderSummary() {
    var dl = document.querySelector('[data-summary]');
    if (!dl) return;
    var rows = journeyLines();
    rows.push(['Vehicle', VEHICLE_NAMES[state.vehicle] || 'Not selected']);
    rows.push(['Name', state.name || 'Not specified']);
    rows.push(['Phone', state.phone || '—']);
    rows.push(['Email', state.email || '—']);
    rows.push(['Passengers', state.passengers || '1']);
    if (state.notes) rows.push(['Notes', state.notes]);

    dl.innerHTML = rows.map(function (r) {
      return '<div class="summary-row"><dt>' + escapeHtml(r[0]) + '</dt><dd>' + escapeHtml(r[1]) + '</dd></div>';
    }).join('');
  }

  function buildMessageText() {
    var lines = ['Hi, I\'d like to request a booking:'];
    journeyLines().forEach(function (r) { lines.push(r[0] + ': ' + r[1]); });
    lines.push('Vehicle: ' + (VEHICLE_NAMES[state.vehicle] || 'Not selected'));
    lines.push('Name: ' + (state.name || 'Not specified'));
    lines.push('Phone: ' + (state.phone || 'Not specified'));
    lines.push('Email: ' + (state.email || 'Not specified'));
    lines.push('Passengers: ' + (state.passengers || '1'));
    if (state.notes) lines.push('Notes: ' + state.notes);
    return lines.join('\n');
  }

  document.querySelectorAll('[data-submit]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = buildMessageText();
      if (btn.getAttribute('data-submit') === 'whatsapp') {
        window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      } else {
        var subject = encodeURIComponent('Booking request from liverexectours.com');
        window.location.href = 'mailto:' + EMAIL_ADDRESS + '?subject=' + subject + '&body=' + encodeURIComponent(text);
      }
    });
  });

  // ---- Google Maps: address autocomplete + route preview ----------------
  // Everything above works with zero API key. This section is a progressive
  // enhancement, same pattern as the Supabase keys in index.html: if
  // window.GOOGLE_MAPS_API_KEY is blank, the address fields stay plain text
  // and the panel on the right shows a placeholder instead of a map.
  var map, directionsService, directionsRenderer;

  if (MAPS_API_KEY) {
    var script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(MAPS_API_KEY) + '&v=weekly&loading=async';
    script.async = true;
    script.onload = function () { waitForImportLibrary(onMapsLoaded); };
    script.onerror = function () {
      console.warn('Liver Exec Tours booking example: Google Maps failed to load — check the API key, billing, and that Maps JavaScript API / Places API / Directions API are all enabled on it.');
    };
    document.head.appendChild(script);
  }

  // With `loading=async`, the script's own load event can fire slightly
  // before google.maps.importLibrary is actually ready to be called — poll
  // briefly rather than assume onload alone means Maps is fully live.
  function waitForImportLibrary(callback, attemptsLeft) {
    if (attemptsLeft === undefined) attemptsLeft = 40;
    if (window.google && google.maps && typeof google.maps.importLibrary === 'function') {
      callback();
      return;
    }
    if (attemptsLeft <= 0) {
      console.warn('Liver Exec Tours booking example: Google Maps script loaded but importLibrary never became available.');
      return;
    }
    setTimeout(function () { waitForImportLibrary(callback, attemptsLeft - 1); }, 100);
  }

  async function onMapsLoaded() {
    var placesLib = await google.maps.importLibrary('places');
    var mapsLib = await google.maps.importLibrary('maps');
    var routesLib = await google.maps.importLibrary('routes');

    upgradeAddressField('pickup', 'pickup', 'pickupLoc');
    upgradeAddressField('dropoff', 'dropoff', 'dropoffLoc');
    upgradeAddressField('airportAddress', 'airportAddress', 'airportAddressLoc');
    upgradeAddressField('hourlyPickup', 'hourlyPickup', 'hourlyPickupLoc');
    // Hero enquiry bar fields — same widget, but there's no wizard `state` or
    // route preview up there, so the simpler upgrader below is used instead.
    upgradeHeroAddressField('heroPickup');
    upgradeHeroAddressField('heroDropoff');

    function configureAutocompleteElement(el) {
      // GB-only, biased toward Liverpool/North West England so predictions
      // don't default to wherever else in the world shares a street name.
      // Best-effort: if these property names move on in a later API
      // version, autocomplete still works, it just won't be region-biased.
      try { el.includedRegionCodes = ['gb']; } catch (e) { /* ignore */ }
      // 45km from central Liverpool comfortably covers Manchester, Warrington,
      // Chester and Preston too — Google caps this at 50,000m exactly.
      try { el.locationBias = { radius: 45000, center: { lat: 53.4084, lng: -2.9916 } }; } catch (e) { /* ignore */ }
      el.style.width = '100%';
    }

    function upgradeAddressField(role, stateKey, locKey) {
      var wrapper = document.querySelector('[data-address-role="' + role + '"]');
      if (!wrapper) return;
      var plainInput = wrapper.querySelector('[data-plain-input]');

      var el = new placesLib.PlaceAutocompleteElement();
      configureAutocompleteElement(el);
      if (plainInput) el.placeholder = plainInput.placeholder;

      wrapper.appendChild(el);
      if (plainInput) plainInput.style.display = 'none';

      el.addEventListener('gmp-select', async function (evt) {
        var place = evt.placePrediction.toPlace();
        await place.fetchFields({ fields: ['formattedAddress', 'location'] });
        state[stateKey] = place.formattedAddress || '';
        state[locKey] = place.location ? { lat: place.location.lat(), lng: place.location.lng() } : null;
        updateRoutePreview();
      });
    }

    function upgradeHeroAddressField(role) {
      var wrapper = document.querySelector('[data-address-role="' + role + '"]');
      if (!wrapper) return;
      var plainInput = wrapper.querySelector('[data-plain-input]');
      if (!plainInput) return;

      var el = new placesLib.PlaceAutocompleteElement();
      configureAutocompleteElement(el);
      el.placeholder = plainInput.placeholder;

      wrapper.appendChild(el);
      plainInput.style.display = 'none';

      el.addEventListener('gmp-select', async function (evt) {
        var place = evt.placePrediction.toPlace();
        await place.fetchFields({ fields: ['formattedAddress'] });
        // Write straight into the (hidden) original input so the hero bar's
        // existing WhatsApp/email message-building in main.js — which reads
        // this input's .value directly — keeps working completely unchanged.
        plainInput.value = place.formattedAddress || '';
      });
    }

    var mapWrap = document.querySelector('[data-route-map]');
    var placeholder = document.querySelector('[data-route-placeholder]');
    if (mapWrap) {
      if (placeholder) placeholder.hidden = true;
      var canvas = document.createElement('div');
      canvas.className = 'route-map-canvas';
      mapWrap.appendChild(canvas);
      map = new mapsLib.Map(canvas, {
        center: { lat: 53.4084, lng: -2.9916 }, // Liverpool
        zoom: 10,
        disableDefaultUI: true
      });
      directionsService = new routesLib.DirectionsService();
      directionsRenderer = new routesLib.DirectionsRenderer({ map: map });
    }
  }

  function activeOriginDestination() {
    if (state.tripType === 'oneway') {
      return { origin: state.pickupLoc, destination: state.dropoffLoc };
    }
    if (state.tripType === 'airport') {
      var airportLoc = AIRPORT_COORDS[state.airport];
      if (!airportLoc || !state.airportAddressLoc) return { origin: null, destination: null };
      return state.flightDirection === 'arrival'
        ? { origin: airportLoc, destination: state.airportAddressLoc }
        : { origin: state.airportAddressLoc, destination: airportLoc };
    }
    // Hourly / as-directed hire has no fixed destination — nothing to preview.
    return { origin: null, destination: null };
  }

  function clearRoutePreview() {
    var statsEl = document.querySelector('[data-route-stats]');
    if (statsEl) statsEl.hidden = true;
    if (directionsRenderer) directionsRenderer.setDirections({ routes: [] });
  }

  function updateRoutePreview() {
    if (!directionsService || !directionsRenderer) return;
    var od = activeOriginDestination();
    if (!od.origin || !od.destination) return;

    directionsService.route({
      origin: od.origin,
      destination: od.destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (result, status) {
      if (status !== 'OK') return;
      directionsRenderer.setDirections(result);
      var leg = result.routes[0].legs[0];
      var statsEl = document.querySelector('[data-route-stats]');
      if (statsEl) {
        statsEl.hidden = false;
        document.querySelector('[data-route-distance]').textContent = (leg.distance.value / 1609.34).toFixed(1);
        document.querySelector('[data-route-duration]').textContent = leg.duration.text;
      }
    });
  }
});
