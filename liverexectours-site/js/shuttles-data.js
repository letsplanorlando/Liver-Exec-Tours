// Event shuttle details in one place — the homepage teaser, shuttles.html
// and every event page read this. Update a seat list as bookings come in,
// then re-upload this file only. Square-bracket values are placeholders
// still to be decided (grep for "\[" before any upload).
//
// Each event has:
//   page      the event's own page
//   runs      the dates it runs. One for a single event, one per night for
//             a residency (Oasis). Each run has its cut-off: 5 days before,
//             so people can arrange other transport if it doesn't fill.
//             A run drops off the page once its cut-off date has passed.
//   vehicles  sprinter (16 seats) and/or vito (7 seats), each with its seat
//             price, whole-vehicle private price, the minimum seats for it
//             to run, and the seats already reserved per run:
//               bookedSeats: { '2026-12-11': [3, 4] }
//
// Reserving is free; once a run is confirmed we send payment links. The
// whole-vehicle private option always stays on offer — overflow can go to
// partner firms.
window.LET_SHUTTLES = {
  events: [
    {
      id: 'fury-joshua',
      page: 'fury-joshua.html',
      name: 'Fury v Joshua',
      category: 'Boxing',
      place: 'Cardiff',
      venue: 'Principality Stadium, Cardiff',
      month: 'DEC',
      day: '11',
      dateLabel: 'Fri 11 Dec 2026',
      blurb: 'Liverpool to the Principality Stadium and back after the fight.',
      runs: [
        { key: '2026-12-11', label: 'Fri 11 Dec 2026', cutoff: 'Sun 6 Dec', closes: '2026-12-06' }
      ],
      vehicles: {
        sprinter: { price: '£115', pricePence: 11500, privatePrice: '£1,950', minSeats: 13, bookedSeats: {} },
        vito: { price: '£150', pricePence: 15000, privatePrice: '£950', minSeats: 5, bookedSeats: {} }
      }
    },
    {
      id: 'cheltenham',
      page: 'cheltenham.html',
      name: 'Cheltenham Gold Cup Day',
      category: 'Racing',
      place: 'Cheltenham',
      venue: 'Cheltenham Racecourse',
      month: 'MAR',
      day: '19',
      dateLabel: 'Fri 19 Mar 2027',
      blurb: 'The Friday of the Festival. Home an hour after the last race.',
      runs: [
        { key: '2027-03-19', label: 'Fri 19 Mar 2027', cutoff: 'Sun 14 Mar', closes: '2027-03-14' }
      ],
      vehicles: {
        sprinter: { price: '£115', pricePence: 11500, privatePrice: '£1,950', minSeats: 13, bookedSeats: {} },
        vito: { price: '£150', pricePence: 15000, privatePrice: '£950', minSeats: 5, bookedSeats: {} }
      }
    },
    {
      id: 'oasis',
      page: 'oasis.html',
      name: 'Oasis at the Etihad',
      category: 'Music',
      place: 'Manchester',
      venue: 'Etihad Stadium, Manchester',
      month: 'JUN',
      day: '4–26',
      dateLabel: '11 nights, 4–26 Jun 2027',
      blurb: 'Pick your night. Home after the encore.',
      runs: [
        { key: '2027-06-04', label: 'Fri 4 Jun 2027', cutoff: 'Sun 30 May', closes: '2027-05-30' },
        { key: '2027-06-06', label: 'Sun 6 Jun 2027', cutoff: 'Tue 1 Jun', closes: '2027-06-01' },
        { key: '2027-06-08', label: 'Tue 8 Jun 2027', cutoff: 'Thu 3 Jun', closes: '2027-06-03' },
        { key: '2027-06-11', label: 'Fri 11 Jun 2027', cutoff: 'Sun 6 Jun', closes: '2027-06-06' },
        { key: '2027-06-12', label: 'Sat 12 Jun 2027', cutoff: 'Mon 7 Jun', closes: '2027-06-07' },
        { key: '2027-06-15', label: 'Tue 15 Jun 2027', cutoff: 'Thu 10 Jun', closes: '2027-06-10' },
        { key: '2027-06-18', label: 'Fri 18 Jun 2027', cutoff: 'Sun 13 Jun', closes: '2027-06-13' },
        { key: '2027-06-19', label: 'Sat 19 Jun 2027', cutoff: 'Mon 14 Jun', closes: '2027-06-14' },
        { key: '2027-06-22', label: 'Tue 22 Jun 2027', cutoff: 'Thu 17 Jun', closes: '2027-06-17' },
        { key: '2027-06-25', label: 'Fri 25 Jun 2027', cutoff: 'Sun 20 Jun', closes: '2027-06-20' },
        { key: '2027-06-26', label: 'Sat 26 Jun 2027', cutoff: 'Mon 21 Jun', closes: '2027-06-21' }
      ],
      vehicles: {
        // Whole-vehicle price = 15 Sprinter seats / 6 Vito seats (Joe).
        sprinter: { price: '£40', pricePence: 4000, privatePrice: '£600', minSeats: 13, bookedSeats: {} },
        vito: { price: '£65', pricePence: 6500, privatePrice: '£390', minSeats: 5, bookedSeats: {} }
      }
    }
  ]
};

// ---- No need to edit below this line --------------------------------
// Runs still open for booking (cut-off date not yet passed, visitor's clock).
window.LET_SHUTTLES.openRuns = function (ev) {
  var today = new Date();
  var key = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  return (ev.runs || []).filter(function (r) { return r.closes >= key; });
};
