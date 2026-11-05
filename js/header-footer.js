/* PlayPal's shared header and footer: markup, navigation and event bindings.
   Load after components.js and before main.js on every full page.
   Fonts, colours and spacing inherit from theme.css and header-footer.css. */
(function () {
  "use strict";
  var PP = window.PlayPal;
  if (!PP) return;

  // Used by BOTH the main menu and the footer's Explore column.
  var NAV_ITEMS = [
    { key: "home", label: "Home", icon: "home", tone: "home" },
    { key: "toyShop", label: "Toy Shop", icon: "toy-shop", tone: "shop" },
    { key: "games", label: "Games", icon: "games", tone: "games" },
    { key: "activities", label: "Activities", icon: "activities", tone: "activities" }
  ];
  var FOOTER_GROUPS = [
    { title: "Explore", items: NAV_ITEMS },
    { title: "Toy Shop", items: [
      { key: "toyShop", label: "Board games", query: "category=board-games" },
      { key: "toyShop", label: "Art kits", query: "category=art-kits" },
      { key: "toyShop", label: "Building kits", query: "category=building-kits" },
      { key: "toyShop", label: "Science kits", query: "category=science-kits" },
      { key: "toyShop", label: "Creative stationery", query: "category=creative-stationery" }
    ] },
    { title: "Grown-ups", items: [
      { key: "parents", label: "Parents corner" },
      { key: "parents", label: "Safety & privacy" },
      { key: "parents", label: "Delivery & returns" },
      { key: "parents", label: "Contact us" }
    ] }
  ];

  // Exact local Figma SVGs used as masks so icons inherit active/dark colours.
  function shellIcon(name) {
    return '<span class="pp-shell-icon pp-shell-icon--' + name + '" aria-hidden="true"></span>';
  }

  function routeLink(item, className, active) {
    var attrs = className ? ' class="' + PP.escape(className) + '"' : "";
    if (!PP.routes[item.key]) {
      return '<span' + attrs + ' aria-disabled="true" title="This page is not available yet.">' +
        PP.escape(item.label) + '</span>';
    }
    return '<a' + attrs + ' href="' + PP.escape(PP.url(item.key, item.query)) +
      '" data-route="' + item.key + '"' +
      (item.query ? ' data-query="' + PP.escape(item.query) + '"' : '') +
      (active === item.key ? ' aria-current="page"' : '') + '>' +
      (item.icon && className ? shellIcon(item.icon) : '') +
      '<span>' + PP.escape(item.label) + '</span></a>';
  }

  PP.components.nav = function (opts) {
    opts = opts || {};
    var basketContent = shellIcon("basket") + '<span class="pp-nav__label">Basket</span>' +
      '<span class="pp-nav__count" data-basket-count aria-hidden="true">0</span>';
    var basket = PP.routes.basket
      ? '<a class="pp-nav__basket" data-route="basket" data-basket-link href="' +
        PP.escape(PP.url("basket")) + '">' + basketContent + '</a>'
      : '<button type="button" class="pp-nav__basket" data-basket-link disabled ' +
        'title="This page is not available yet.">' + basketContent + '</button>';
    return '<a class="pp-skip-link" href="#' + PP.escape(opts.mainId || "main") + '">Skip to main content</a>' +
      '<header class="pp-nav"><div class="pp-container pp-nav__inner">' +
      '<a class="pp-nav__logo" href="' + PP.escape(PP.url("home")) + '" data-route="home" aria-label="PlayPal home">' +
      '<span class="pp-nav__mark" aria-hidden="true">P</span><span class="pp-nav__wordmark">PlayPal</span></a>' +
      '<nav class="pp-nav__menu" aria-label="Main">' + NAV_ITEMS.map(function (item) {
        return routeLink(item, "pp-nav__link pp-tone-" + item.tone, opts.active);
      }).join("") + '</nav><div class="pp-nav__actions">' +
      '<button type="button" class="pp-nav__sound" data-sound-toggle aria-pressed="false" aria-label="Mute sound">' +
      shellIcon("sound") + '</button>' +
      '<button type="button" class="pp-nav__search-toggle" data-search-toggle aria-label="Search PlayPal" ' +
      'aria-expanded="false" aria-controls="pp-nav-search">' + shellIcon("search") + '</button>' +
      '<form class="pp-nav__search" id="pp-nav-search" role="search" data-search-form>' + shellIcon("search") +
      '<label class="pp-visually-hidden" for="pp-search">Search PlayPal</label>' +
      '<input id="pp-search" name="q" type="search" placeholder="Search" autocomplete="off"></form>' +
      '<button type="button" class="pp-nav__help" data-open-help aria-label="Need help?">' +
      shellIcon("help") + '<span>Need help?</span></button>' + basket + '</div></div></header>';
  };

  PP.components.footer = function () {
    return '<footer class="pp-footer"><div class="pp-container pp-footer__inner">' +
      '<div class="pp-footer__columns"><div class="pp-footer__brand">' +
      '<p class="pp-footer__name">PlayPal</p>' +
      '<p class="pp-footer__about">A safe place to play, make and discover. Made for kids aged 8–12.</p></div>' +
      FOOTER_GROUPS.map(function (group) {
        return '<section class="pp-footer__col"><h2 class="pp-footer__title">' + group.title + '</h2>' +
          group.items.map(function (item) { return routeLink(item); }).join("") + '</section>';
      }).join("") + '</div><p class="pp-footer__legal">© ' + new Date().getFullYear() +
      ' PlayPal · Made for kids aged 8–12</p></div></footer>';
  };

  var bound = false;
  PP.headerFooter = {
    currentPage: function () {
      var pathname = window.location.pathname;
      var item = NAV_ITEMS.find(function (item) {
        return PP.routes[item.key] && new URL(PP.url(item.key)).pathname === pathname;
      });
      return item ? item.key : "";
    },
    bind: function () {
      if (bound) return;
      var header = document.querySelector('[data-component="nav"]');
      if (!header) return;
      bound = true;
      var counts = header.querySelectorAll('[data-basket-count]');
      var basketLinks = header.querySelectorAll('[data-basket-link]');
      function paintBasket(n) {
        counts.forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
        basketLinks.forEach(function (el) {
          el.setAttribute("aria-label", "Basket, " + n + (n === 1 ? " item" : " items") +
            (PP.routes.basket ? "" : ". Page not available yet."));
        });
      }
      PP.basket.subscribe(paintBasket);
      var sound = header.querySelector('[data-sound-toggle]');
      function paintSound() {
        var muted = PP.sound.muted();
        sound.setAttribute("aria-pressed", String(muted));
        sound.title = muted ? "Sound is off" : "Sound is on";
      }
      paintSound();
      sound.addEventListener("click", function () { PP.sound.set(!PP.sound.muted()); paintSound(); });
      window.addEventListener("storage", function (event) {
        if (event.key === PP.sound.key || event.key === null) paintSound();
        if (event.key === PP.basket.key || event.key === null) paintBasket(PP.basket.count());
      });
      header.querySelector('[data-open-help]').addEventListener("click", function () {
        var dialog = document.getElementById("pp-help-dialog");
        if (dialog && !dialog.open && typeof dialog.showModal === "function") dialog.showModal();
      });
      var searchForm = header.querySelector('[data-search-form]');
      var searchInput = searchForm.elements.q;
      var searchToggle = header.querySelector('[data-search-toggle]');
      function setSearchOpen(open) {
        header.classList.toggle("is-search-open", open);
        searchToggle.setAttribute("aria-expanded", String(open));
      }
      searchToggle.addEventListener("click", function () {
        var open = searchToggle.getAttribute("aria-expanded") !== "true";
        setSearchOpen(open);
        if (open) searchInput.focus();
      });
      searchForm.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && window.matchMedia("(max-width: 47.999rem)").matches) {
          event.preventDefault();
          setSearchOpen(false);
          searchToggle.focus();
        }
      });
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var q = (event.currentTarget.elements.q.value || "").trim();
        if (q) window.location.href = PP.url("toyShop", "q=" + encodeURIComponent(q));
      });

      // One observer handles menu wrapping, zoom, font loading and viewport changes.
      var lastHeight = 0;
      function recordHeight(height) {
        height = Math.ceil(height);
        if (height === lastHeight) return;
        lastHeight = height;
        document.documentElement.style.setProperty("--site-header-height", height + "px");
      }
      recordHeight(header.getBoundingClientRect().height);
      if (window.ResizeObserver) {
        new window.ResizeObserver(function (entries) {
          var box = entries[0].borderBoxSize;
          recordHeight(box && box[0] ? box[0].blockSize : header.getBoundingClientRect().height);
        }).observe(header);
      } else {
        window.addEventListener("resize", function () { recordHeight(header.getBoundingClientRect().height); });
      }
    }
  };
})();
