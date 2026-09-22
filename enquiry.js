/* Enquiry form controller for /contact.html.
 *
 * TODO: FORM CONFIGURATION REQUIRED — paste the production Web3Forms access
 * key for bharatinfrassociate.com into ACCESS_KEY below, after confirming
 * with Bharat Infra Associate that (a) the key belongs to this domain and
 * (b) submissions are delivered to procurement@bharatinfrassociate.com.
 * A Web3Forms access key is a publishable client-side value, but it is still
 * readable in page source: never put a server-side secret here.
 *
 * While ACCESS_KEY is empty the form does not submit. It tells the visitor
 * so plainly and points them at the phone and email routes instead, rather
 * than POSTing to an endpoint that is guaranteed to reject the request and
 * showing a failure the visitor cannot act on.
 */
(function (w, d) {
  "use strict";

  var ACCESS_KEY = "";

  var form = d.getElementById("enquiry");
  if (!form) return;

  var status  = d.getElementById("form-status");
  var submit  = form.querySelector("button[type=submit]");
  var offline = d.getElementById("form-offline");
  var configured = /^[0-9a-f-]{20,}$/i.test(ACCESS_KEY);

  var EMAIL = "procurement@bharatinfrassociate.com";
  var FALLBACK = " Please call +91 98187 42322 or email " + EMAIL + ".";

  /* ---------- capture context (no personal data) ---------- */
  function setHidden(name, value) {
    var el = form.querySelector('input[name="' + name + '"]');
    if (el) el.value = value;
  }
  var params = new URLSearchParams(w.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) {
    setHidden(k, params.get(k) || "");
  });
  setHidden("source_page", w.location.origin + w.location.pathname);
  setHidden("referrer", d.referrer ? d.referrer.split("?")[0] : "");

  /* The notice renders visible in the HTML and is removed only once a real
     key is present, so a JS failure can never leave the page implying the
     form works when it does not. */
  if (configured && offline) offline.hidden = true;

  /* ---------- state ---------- */
  var busy = false;

  function say(message, kind) {
    status.textContent = message;
    status.className = "form-status" + (kind ? " is-" + kind : "");
  }

  function setBusy(on) {
    busy = on;
    submit.disabled = on;
    submit.setAttribute("aria-busy", String(on));
    submit.textContent = on ? "Sending…" : "Submit enquiry";
  }

  /* ---------- validation ---------- */
  function fieldError(input, message) {
    var box = d.getElementById(input.id + "-error");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (box) box.textContent = message || "";
    return !message;
  }

  function validate() {
    var bad = [];

    function check(id, test, message) {
      var el = d.getElementById(id);
      if (!el) return;
      if (!fieldError(el, test(el) ? "" : message)) bad.push(el);
    }

    check("f-name", function (el) { return el.value.trim().length > 1; },
      "Enter the name we should reply to.");
    check("f-phone", function (el) { return el.value.replace(/\D/g, "").length >= 10; },
      "Enter a phone number of at least 10 digits.");
    check("f-email", function (el) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()); },
      "Enter an email address we can reply to.");
    check("f-service", function (el) { return el.value !== ""; },
      "Select the service the enquiry concerns.");
    check("f-location", function (el) { return el.value.trim().length > 1; },
      "Enter the project location (at least the district and state).");
    check("f-scope", function (el) { return el.value.trim().length > 9; },
      "Describe the requirement in a sentence or two.");

    return bad;
  }

  form.addEventListener("input", function (e) {
    if (e.target.id && e.target.getAttribute("aria-invalid") === "true") fieldError(e.target, "");
  });

  /* ---------- submission ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) return;

    var bad = validate();
    if (bad.length) {
      say(bad.length + (bad.length === 1 ? " field needs" : " fields need") +
          " attention before this enquiry can be sent.", "bad");
      bad[0].focus();
      /* Category only — never the values the visitor typed. */
      if (w.biaTrack) w.biaTrack("form_submit_error", { form_id: "enquiry", error_type: "validation" });
      return;
    }

    if (!configured) {
      say("The online enquiry form is not connected yet." + FALLBACK, "bad");
      if (w.biaTrack) w.biaTrack("form_submit_error", { form_id: "enquiry", error_type: "not_configured" });
      return;
    }

    /* Web3Forms' own honeypot. A real visitor never sees or ticks it. */
    if (form.botcheck && form.botcheck.checked) return;

    setBusy(true);
    say("Sending your enquiry…", "busy");

    var payload = new FormData(form);
    payload.append("access_key", ACCESS_KEY);
    payload.append("subject", "Website project enquiry — " + (form.querySelector("#f-service").value || "General"));

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload
    })
      .then(function (r) {
        return r.json().then(function (j) { return { ok: r.ok, body: j }; });
      })
      .then(function (res) {
        /* Success is claimed only when the provider confirms it. */
        if (res.ok && res.body && res.body.success) {
          say("Enquiry received. We will reply to the email address you gave. " +
              "This confirms delivery only — it is not acceptance of scope, price or dates.", "ok");
          form.reset();
          if (w.biaTrack) {
            w.biaTrack("generate_lead", {
              form_id: "enquiry",
              service_category: payload.get("service") || "unspecified",
              cta_location: "contact_page"
            });
          }
        } else {
          /* Values stay in the fields so the visitor can retry. */
          say("The form service could not accept this enquiry." + FALLBACK, "bad");
          if (w.biaTrack) w.biaTrack("form_submit_error", { form_id: "enquiry", error_type: "provider" });
        }
      })
      .catch(function () {
        say("The enquiry could not be sent — check your connection and try again." + FALLBACK, "bad");
        if (w.biaTrack) w.biaTrack("form_submit_error", { form_id: "enquiry", error_type: "network" });
      })
      .then(function () { setBusy(false); });
  });
})(window, document);
