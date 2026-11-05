// Shuttles info page: one card per event from js/shuttles-data.js, each
// linking to that event's own page (seat booking lives there, js/event.js).
// Events whose every run is past its cut-off are left out.
document.addEventListener('DOMContentLoaded', function () {
  var shuttles = window.LET_SHUTTLES || {};
  var list = document.querySelector('[data-event-cards]');
  if (!list) return;
  var first = list.firstChild;
  var NAMES = { sprinter: 'Sprinter', vito: 'Vito' };

  (shuttles.events || []).forEach(function (ev) {
    var runs = shuttles.openRuns ? shuttles.openRuns(ev) : ev.runs;
    if (!runs.length) return;
    var prices = ['sprinter', 'vito'].filter(function (k) { return ev.vehicles[k]; }).map(function (k) {
      return NAMES[k] + ' ' + ev.vehicles[k].price;
    }).join(' · ');

    var card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML =
      '<div class="event-card-head">' +
        '<div class="event-date"><span></span><strong></strong></div>' +
        '<div><p></p><h3></h3></div>' +
      '</div>' +
      '<div class="event-card-body">' +
        '<p></p>' +
        '<div class="event-card-foot">' +
          '<span class="event-price"><small></small></span>' +
          '<a class="btn btn-dark">Book seats</a>' +
        '</div>' +
      '</div>';
    card.querySelector('.event-date span').textContent = ev.month;
    card.querySelector('.event-date strong').textContent = ev.day;
    card.querySelector('.event-card-head p').textContent = ev.category + ' · ' + ev.place + ' · ' + ev.dateLabel;
    card.querySelector('.event-card-head h3').textContent = ev.name;
    card.querySelector('.event-card-body > p').textContent = ev.blurb || '';
    card.querySelector('.event-price small').textContent = prices + ' a seat';
    card.querySelector('.event-card-foot a').href = ev.page;
    list.insertBefore(card, first);
  });
});
