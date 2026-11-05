
/* ==========================================================================
   PlayPal · js/main.js
   App bootstrap, shared by every screen. Runs after js/components.js.

   What it does (in order):
     1. Applies the saved theme (light / dark)
     2. Mounts shared components into  <div data-component="nav|footer">
     3. Wires global UI: basket badge, sound toggle, help dialog, search
     4. Resolves  [data-route]  links from PlayPal.routes
     5. Fires  "playpal:ready"  – screen scripts use PlayPal.ready(fn)

   Per-screen behaviour belongs in modules/<screen>/<screen>.js.
   ========================================================================== */
(function () {
  "use strict";

  var PP = window.PlayPal;
  if (!PP) {
    console.error("PlayPal: load js/components.js before js/main.js");
    return;
  }

  /* ------------------------------------------------------------------ theme */
  PP.theme = {
    key: "playpal.theme",
    get: function () {
      return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    },
    set: function (theme) {
      if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
      PP.storage.set(PP.theme.key, theme === "dark" ? "dark" : "light");
    },
    init: function () {
      /* ?theme=dark in the URL previews dark mode (and remembers it). */
      var fromUrl = new URLSearchParams(window.location.search).get("theme");
      var theme = fromUrl === "dark" || fromUrl === "light" ? fromUrl : PP.storage.get(PP.theme.key, "light");
      PP.theme.set(theme);
    }
  };

  /* ------------------------------------------------------------------ sound */
  PP.sound = {
    key: "playpal.muted",
    muted: function () { return PP.storage.get(PP.sound.key, false) === true; },
    set: function (muted) { PP.storage.set(PP.sound.key, !!muted); }
  };

  /* ------------------------------------------------------------------ mount */
  function mountComponents() {
    document.querySelectorAll("[data-component]").forEach(function (el) {
      var build = PP.components[el.getAttribute("data-component")];
      if (typeof build === "function") {
        el.innerHTML = build({ active: el.getAttribute("data-active") || "" });
      }
    });

    if (!document.getElementById("pp-help-dialog")) {
      document.body.insertAdjacentHTML("beforeend", PP.components.helpDialog());
    }
  }

  /* Fill  <span data-icon="arrow-right" data-size="20">  with the inline SVG. */
  function mountIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      el.innerHTML = PP.icon(el.getAttribute("data-icon"), parseInt(el.getAttribute("data-size"), 10) || 0);
      el.setAttribute("aria-hidden", "true");
    });
  }
  PP.mountIcons = mountIcons;

  /* ---------------------------------------------------------------- global UI */
  function bindBasket() {
    PP.basket.subscribe(function (n) {
      document.querySelectorAll("[data-basket-count]").forEach(function (el) {
        el.textContent = n;
        el.hidden = n === 0;
      });
      document.querySelectorAll("[data-basket-link]").forEach(function (el) {
        el.setAttribute("aria-label", "Basket, " + n + (n === 1 ? " item" : " items"));
      });
    });
  }

  function bindSound() {
    document.querySelectorAll("[data-sound-toggle]").forEach(function (btn) {
      function paint() {
        var muted = PP.sound.muted();
        btn.setAttribute("aria-pressed", String(muted));
        btn.setAttribute("aria-label", "Mute sound");
        btn.title = muted ? "Sound is off" : "Sound is on";
      }
      paint();
      btn.addEventListener("click", function () {
        PP.sound.set(!PP.sound.muted());
        paint();
      });
    });
  }

  function bindHelp() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-open-help]");
      if (!trigger) return;
      var dialog = document.getElementById("pp-help-dialog");
      if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    });
  }

  function bindSearch() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = (form.elements.q.value || "").trim();
        if (q) window.location.href = PP.url("toyShop", "q=" + encodeURIComponent(q));
      });
    });
  }

  function resolveRoutes() {
    document.querySelectorAll("[data-route]").forEach(function (a) {
      a.setAttribute("href", PP.url(a.getAttribute("data-route"), a.getAttribute("data-query") || ""));
    });
  }

  /* ------------------------------------------------------------------- boot */
  function boot() {
    PP.theme.init();
    mountComponents();
    mountIcons();
    resolveRoutes();
    bindBasket();
    bindSound();
    bindHelp();
    bindSearch();
    PP.isReady = true;
    document.dispatchEvent(new CustomEvent("playpal:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
