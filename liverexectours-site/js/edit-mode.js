(function () {
  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var params = new URLSearchParams(location.search);
  if (!isLocal || params.get('edit') !== '1') return;

  var EXCLUDE_ANCESTORS = 'form, header, [data-hero]';

  function isEditable(el) {
    if (el.children.length > 0) return false;
    if (!el.textContent.trim()) return false;
    if (el.closest(EXCLUDE_ANCESTORS)) return false;
    if (el.hasAttribute('data-year')) return false;
    if (el.classList.contains('faq-icon')) return false;
    return true;
  }

  var editableEls = [];
  document.querySelectorAll('h1, h2, h3, h4, p, li, div, span').forEach(function (el) {
    if (isEditable(el)) editableEls.push(el);
  });

  var originals = new Map();
  editableEls.forEach(function (el) {
    originals.set(el, el.textContent);
    el.setAttribute('contenteditable', 'true');
    el.classList.add('edit-target');
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      }
    });
  });

  function hasUnsavedChanges() {
    return editableEls.some(function (el) { return el.textContent !== originals.get(el); });
  }

  window.addEventListener('beforeunload', function (e) {
    if (hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  var style = document.createElement('style');
  style.textContent =
    '.edit-target { outline: 1px dashed transparent; cursor: text; border-radius: 2px; transition: outline-color .15s ease, background-color .15s ease; }' +
    '.edit-target:hover { outline-color: rgba(196,151,58,0.6); }' +
    '.edit-target:focus { outline: 2px solid #C4973A; outline-offset: 2px; background-color: rgba(196,151,58,0.1); }' +
    '#edit-mode-bar { position: fixed; bottom: 20px; right: 20px; z-index: 99999; background: #10192B; color: #fff; padding: 12px 16px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 14px; display: flex; align-items: center; gap: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); max-width: 360px; }' +
    '#edit-mode-bar button { background: #C4973A; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; white-space: nowrap; }' +
    '#edit-mode-bar button:hover { background: #fff; color: #10192B; }' +
    '#edit-status { font-size: 13px; opacity: 0.85; }';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'edit-mode-bar';
  bar.innerHTML = '<button type="button" id="edit-save-btn">Save changes</button><span id="edit-status">Click any highlighted text to edit it.</span>';
  document.body.appendChild(bar);

  var statusEl = bar.querySelector('#edit-status');

  bar.querySelector('#edit-save-btn').addEventListener('click', function () {
    var changes = [];
    editableEls.forEach(function (el) {
      var newText = el.textContent;
      var oldText = originals.get(el);
      if (newText !== oldText) {
        changes.push({ oldText: oldText, newText: newText });
      }
    });

    if (!changes.length) {
      statusEl.textContent = 'No changes to save.';
      return;
    }

    statusEl.textContent = 'Saving...';
    fetch('/__save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changes: changes })
    })
      .then(function (r) { return r.json(); })
      .then(function (result) {
        if (result.ok) {
          editableEls.forEach(function (el) { originals.set(el, el.textContent); });
          statusEl.textContent = result.failed
            ? 'Saved ' + result.applied + ' change(s) — ' + result.failed + ' couldn\'t be matched, try again.'
            : 'Saved ' + result.applied + ' change(s) to index.html.';
        } else {
          statusEl.textContent = 'Error: ' + (result.error || 'save failed');
        }
      })
      .catch(function () {
        statusEl.textContent = 'Could not reach the local save server.';
      });
  });
})();
