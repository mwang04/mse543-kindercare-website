/* ============================================================
   KinderCare — interactive demo logic
   Fires GA `view_demo` events as the visitor explores screens.
   CUSTOM METRIC: demo_screens_viewed = count of UNIQUE app
   screens the visitor reached (engagement depth).
   ============================================================ */
(function () {
  var phone = document.getElementById('demo-phone');
  if (!phone) return;

  var screens = phone.querySelectorAll('.screen');
  var viewed = {};          // unique screens reached
  var counterEl = document.getElementById('demo-screen-count');
  var firstFired = false;

  function uniqueCount() { return Object.keys(viewed).length; }

  function updateCounter() {
    if (counterEl) counterEl.textContent = uniqueCount();
  }

  function showScreen(name, opts) {
    opts = opts || {};
    var target = phone.querySelector('.screen[data-screen="' + name + '"]');
    if (!target) return;
    screens.forEach(function (s) { s.classList.remove('active'); });
    target.classList.add('active');
    target.querySelector('.content') && (target.querySelector('.content').scrollTop = 0);

    var isNew = !viewed[name];
    if (isNew) { viewed[name] = true; updateCounter(); }

    // GA: fire view_demo. The first real interaction (anything past the
    // landing screen) counts as "started the demo".
    if (!opts.silent) {
      if (isNew || !firstFired) {
        firstFired = true;
        trackEvent('view_demo', {
          event_category: 'engagement',
          screen_name: name,
          // ----- CUSTOM METRIC -----
          demo_screens_viewed: uniqueCount()
        });
      }
    }
  }

  function toast(msg) {
    var t = document.getElementById('demo-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 1600);
  }

  // Navigation: any element with data-go="screenName"
  phone.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-go]');
    if (nav) {
      showScreen(nav.getAttribute('data-go'));
      return;
    }
    // Task check toggles
    var task = e.target.closest('.task-row');
    if (task && e.target.closest('.check')) {
      var nowDone = task.classList.toggle('done');
      task.querySelector('.check').textContent = nowDone ? '✓' : '';
      if (nowDone) toast('Logged — nice work');
      return;
    }
    // Toast-only actions
    var act = e.target.closest('[data-toast]');
    if (act) toast(act.getAttribute('data-toast'));
  });

  // Initialise on the landing screen (counts as 1 viewed, no event yet)
  showScreen('landing', { silent: true });
  updateCounter();
})();
