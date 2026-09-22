/* Shared analytics layer for bharatinfrassociate.com.
 *
 * ONE place configures GA4 for the whole site. Every page loads this file
 * with <script src="/analytics.js" defer> and nothing else; there is no
 * per-page gtag snippet, so the property can never be configured twice.
 *
 * TODO: ANALYTICS CONFIGURATION REQUIRED — paste the verified GA4
 * Measurement ID (format G-XXXXXXXXXX) into MEASUREMENT_ID below. While the
 * string is empty no tag is loaded, no network request is made and every
 * event call is a no-op. Do not commit a guessed or placeholder ID: a
 * placeholder still costs a request and reports into a property nobody owns.
 */
(function (w, d) {
  "use strict";

  var MEASUREMENT_ID = "";

  /* Events must never carry a name, phone number, email address, company
     name or message body. Only these parameter keys are allowed through. */
  var ALLOWED_PARAMS = {
    page_path: 1, cta_location: 1, service_category: 1,
    form_id: 1, error_type: 1, link_domain: 1
  };

  var sent = {};

  function enabled() { return /^G-[A-Z0-9]{6,}$/.test(MEASUREMENT_ID); }

  /* Honour an explicit opt-out and Do Not Track. Absent a consent banner on
     this site, a visitor's DNT header is the only consent signal available. */
  function allowed() {
    try {
      if (w.localStorage && w.localStorage.getItem("bia-analytics") === "off") return false;
    } catch (e) { /* storage blocked — fall through */ }
    return !(w.doNotTrack === "1" || navigator.doNotTrack === "1" || navigator.msDoNotTrack === "1");
  }

  function clean(params) {
    var out = { page_path: d.location.pathname };
    if (!params) return out;
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k) &&
          ALLOWED_PARAMS[k] && typeof params[k] !== "object") {
        out[k] = String(params[k]).slice(0, 100);
      }
    }
    return out;
  }

  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }

  if (enabled() && allowed()) {
    var s = d.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
    d.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
  }

  /* Public entry point. Safe to call whether or not a tag is configured.
     `once` de-duplicates events that would otherwise fire on every click. */
  w.biaTrack = function (name, params, once) {
    if (once) {
      var key = name + "|" + (params && params.cta_location ? params.cta_location : "");
      if (sent[key]) return;
      sent[key] = 1;
    }
    if (!enabled() || !allowed()) return;
    gtag("event", name, clean(params));
  };

  /* Outbound contact clicks. The tel:/mailto: target is the company's own
     published number, not anything the visitor typed, so no personal data
     leaves the page — only which contact route was used, and from where. */
  d.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var where = a.getAttribute("data-cta") ||
                (a.closest("footer") ? "footer" : a.closest("header") ? "header" : "body");

    if (href.indexOf("tel:") === 0) w.biaTrack("phone_click", { cta_location: where });
    else if (href.indexOf("mailto:") === 0) w.biaTrack("email_click", { cta_location: where });
    else if (a.hasAttribute("data-quote-cta")) w.biaTrack("quote_cta_click", { cta_location: where });
  }, true);

  /* No WhatsApp link is published anywhere on this site, so no
     whatsapp_click handler is registered. Add one only if a real
     wa.me/api.whatsapp.com link is added to the pages. */
})(window, document);
