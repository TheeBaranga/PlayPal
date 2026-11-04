/* ==========================================================================
   PlayPal · modules/home/home.js
   Behaviour that belongs ONLY to the Home screen.
   Relies on js/components.js + js/main.js (loaded first) for PlayPal.*.

     1. "Welcome back" card   – shows the child's saved game progress
     2. "Add to basket"       – updates the nav basket count + shows a toast
   ========================================================================== */
(function () {
  "use strict";

  var PP = window.PlayPal;
  if (!PP) return;

  /* ------------------------------------------------ 1. Continue / progress
     Saved by the Games screen as:
       PlayPal.storage.set("playpal.progress",
         { name: "Sam", game: "Memory Match", slug: "memory-match", level: 2, levels: 5 })
     If nothing is saved yet we keep the defaults already in index.html.      */
  function initContinueCard() {
    var title = document.querySelector("[data-continue-title]");
    var sub = document.querySelector("[data-continue-sub]");
    var bar = document.querySelector("[data-continue-progress]");
    var link = bar && bar.parentElement.querySelector("a.pp-btn");
    var p = PP.storage.get("playpal.progress", null);
    if (!title || !sub || !bar || !p || !p.game || !p.levels) return;

    var level = Math.min(Math.max(parseInt(p.level, 10) || 0, 0), p.levels);
    title.textContent = "Welcome back, " + (p.name || "friend") + "!";
    sub.textContent = "Continue " + p.game + " · Level " + level + " of " + p.levels;
    bar.style.setProperty("--progress", (level / p.levels) * 100 + "%");
    bar.setAttribute("aria-label", p.game + " progress");
    bar.setAttribute("aria-valuemax", String(p.levels));
    bar.setAttribute("aria-valuenow", String(level));
    if (link && p.slug) link.setAttribute("data-query", "game=" + encodeURIComponent(p.slug));
    if (link) link.setAttribute("href", PP.url("games", link.getAttribute("data-query") || ""));
  }

  /* ------------------------------------------------------ 2. Add to basket */
  function initAddToBasket() {
    document.querySelectorAll("[data-add-to-basket]").forEach(function (btn) {
      var original = btn.textContent;
      var timer;

      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-product") || "Item";
        PP.basket.add(1);
        PP.toast.show(name + " added to your basket");

        /* Immediate on-button feedback so the child knows it worked. */
        btn.classList.add("is-added");
        btn.textContent = "Added!";
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          btn.classList.remove("is-added");
          btn.textContent = original;
        }, 1500);
      });
    });
  }

  PP.ready(function () {
    initContinueCard();
    initAddToBasket();
  });
})();
