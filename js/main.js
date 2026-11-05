
/* ==========================================================================
   PlayPal · js/main.js
   App bootstrap, shared by every screen. Runs after js/components.js and js/header-footer.js.

   What it does (in order):
     1. Applies the saved theme (light / dark)
     2. Mounts shared components into  <div data-component="nav|footer">
     3. Wires global UI: basket badge, sound toggle, help dialog, search
     4. Resolves screen [data-route] links from PlayPal.routes
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
    var main = document.querySelector("main");
    var options = { active: PP.headerFooter.currentPage(), mainId: main && main.id || "main" };
    document.querySelectorAll("[data-component]").forEach(function (el) {
      var build = PP.components[el.getAttribute("data-component")];
      if (typeof build === "function") {
        el.innerHTML = build(options);
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

  function resolveRoutes() {
    document.querySelectorAll("main [data-route]").forEach(function (a) {
      var route = a.getAttribute("data-route");
      if (!PP.routes[route]) {
        a.removeAttribute("href");
        a.setAttribute("aria-disabled", "true");
        a.setAttribute("title", "This page is not available yet.");
        return;
      }
      a.setAttribute("href", PP.url(route, a.getAttribute("data-query") || ""));
    });
  }

  /* ------------------------------------------------------------------- boot */
  function boot() {
    if (PP.isReady) return;
    if (!PP.headerFooter) {
      console.error("PlayPal: load js/header-footer.js before js/main.js");
      return;
    }
    PP.theme.init();
    mountComponents();
    mountIcons();
    resolveRoutes();
    PP.headerFooter.bind();
    PP.isReady = true;
    document.dispatchEvent(new CustomEvent("playpal:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
