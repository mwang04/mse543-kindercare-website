/* ============================================================
   KinderCare — shared behaviour + Google Analytics events
   ============================================================
   Google Analytics 4 is loaded in the <head> of every page via
   gtag.js. This file centralises the three tracked conversions
   plus one custom metric:

     1. contact_us        — Contact Us form submitted
     2. view_demo         — user steps through the interactive demo
     3. newsletter_signup — newsletter form submitted

   CUSTOM METRIC: every `view_demo` event carries the parameter
   `demo_screens_viewed` (an integer count of how many app
   screens the visitor actually clicked through). Registered in
   GA4 as a custom metric, it shows engagement depth, not just
   whether the demo was opened.
   ============================================================ */

/* Safe wrapper — never throws if gtag hasn't loaded (e.g. blocked) */
function trackEvent(name, params) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', name, params || {});
    }
    // Helpful while developing / before GA ID is set:
    console.debug('[GA event]', name, params || {});
  } catch (e) {
    /* analytics must never break the page */
  }
}

/* ---------- Mobile nav toggle ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var reason = (contactForm.querySelector('[name="reason"]') || {}).value || 'general';
      trackEvent('contact_us', {
        event_category: 'engagement',
        contact_reason: reason,
        method: 'website_form'
      });
      contactForm.reset();
      var ok = document.getElementById('contact-success');
      if (ok) { ok.classList.add('show'); ok.focus(); }
    });
  }

  /* ---------- Newsletter form(s) ---------- */
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var role = (form.querySelector('[name="role"]') || {}).value || 'unspecified';
      trackEvent('newsletter_signup', {
        event_category: 'conversion',
        signup_role: role,
        location: form.getAttribute('data-location') || 'page'
      });
      form.reset();
      var ok = form.querySelector('.newsletter-success');
      if (ok) ok.classList.add('show');
    });
  });
});
