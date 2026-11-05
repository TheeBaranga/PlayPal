/* ==========================================================================
   PlayPal · js/components.js
   Shared building blocks used by every screen:
     PlayPal.routes          – where each page lives (edit paths HERE only)
     PlayPal.url(key)        – resolve a route (resolves from this shared script location)
     PlayPal.storage         – safe localStorage wrapper
     PlayPal.icons / icon()  – the Figma icon set as inline SVG (uses currentColor)
     PlayPal.basket          – basket count shared by all screens
     PlayPal.toast.show()    – small feedback message
     PlayPal.components.helpDialog – shared help markup
     Header/footer live in js/header-footer.js.

   Plain scripts (no ES modules) so index.html also works when opened straight
   from the file system. Load this BEFORE js/main.js.
   ========================================================================== */
(function () {
  "use strict";

  var PP = (window.PlayPal = window.PlayPal || {});

  /* ------------------------------------------------------------------ routes
     One place to change page locations. Paths are relative to the site root.   */
  PP.routes = {
    home: "modules/index.html",
    toyShop: "modules/toy-shop/toy-shop.html",
    games: "modules/games/games.html",
    activities: "modules/activities/activities.html",
    basket: null, // Not implemented yet.
    parents: null // Not implemented yet.
  };

  // Resolve from the script, so links work from any page depth or hosted subfolder.
  var siteRoot = new URL("../", document.currentScript.src);
  PP.url = function (key, query) {
    var path = PP.routes[key];
    if (!path) return "#";
    var url = new URL(path, siteRoot);
    if (query) url.search = query;
    if (key === "activities" && url.searchParams.get("section") === "workshops") {
      url.hash = "workshops";
    }
    return url.href;
  };

  /* ----------------------------------------------------------------- helpers */
  PP.ready = function (fn) {
    if (PP.isReady) fn();
    else document.addEventListener("playpal:ready", fn, { once: true });
  };

  PP.escape = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  PP.storage = {
    get: function (key, fallback) {
      try {
        var v = window.localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) { /* private mode etc. – ignore */ }
    }
  };

  /* ------------------------------------------------------------------ icons
     Exported from the Figma "icon/*" components. Stroke colour = currentColor,
     so set the colour with CSS `color`.                                      */
  var ICONS = {
    home: ["0 0 22 22", '<path d="M3.66675 10.0833L11.0001 3.66667L18.3334 10.0833V18.3333C18.3334 18.5764 18.2368 18.8096 18.0649 18.9815C17.893 19.1534 17.6599 19.25 17.4167 19.25H13.7501V13.75H8.25008V19.25H4.58341C4.3403 19.25 4.10714 19.1534 3.93523 18.9815C3.76333 18.8096 3.66675 18.5764 3.66675 18.3333V10.0833Z"/>'],
    "toy-shop": ["0 0 22 22", '<path d="M4.58325 7.33333H17.4166L16.4999 18.3333H5.49992L4.58325 7.33333Z"/><path d="M8.25 7.33333V5.5C8.25 4.77065 8.53973 4.07118 9.05546 3.55546C9.57118 3.03973 10.2707 2.75 11 2.75C11.7293 2.75 12.4288 3.03973 12.9445 3.55546C13.4603 4.07118 13.75 4.77065 13.75 5.5V7.33333"/>'],
    games: ["0 0 22 22", '<path d="M5.49992 7.33333H16.4999C17.4724 7.33333 18.405 7.71964 19.0926 8.40727C19.7803 9.09491 20.1666 10.0275 20.1666 11V13.75C20.1594 14.2997 19.9876 14.8346 19.6734 15.2856C19.3592 15.7367 18.9171 16.0833 18.404 16.2806C17.8909 16.478 17.3305 16.517 16.795 16.3927C16.2595 16.2684 15.7736 15.9865 15.3999 15.5833L13.7499 13.75H8.24992L6.59992 15.5833C6.22623 15.9865 5.7403 16.2684 5.20482 16.3927C4.66934 16.517 4.1089 16.478 3.59582 16.2806C3.08275 16.0833 2.64059 15.7367 2.32641 15.2856C2.01224 14.8346 1.84046 14.2997 1.83325 13.75V11C1.83325 10.0275 2.21956 9.09491 2.90719 8.40727C3.59483 7.71964 4.52746 7.33333 5.49992 7.33333Z"/><path d="M7.33325 9.625V12.375M5.95825 11H8.70825"/><path d="M14.6667 11.0917C14.9705 11.0917 15.2167 10.8454 15.2167 10.5417C15.2167 10.2379 14.9705 9.99167 14.6667 9.99167C14.3629 9.99167 14.1167 10.2379 14.1167 10.5417C14.1167 10.8454 14.3629 11.0917 14.6667 11.0917Z"/><path d="M16.5 12.925C16.8037 12.925 17.05 12.6788 17.05 12.375C17.05 12.0712 16.8037 11.825 16.5 11.825C16.1962 11.825 15.95 12.0712 15.95 12.375C15.95 12.6788 16.1962 12.925 16.5 12.925Z"/>'],
    activities: ["0 0 22 22", '<path d="M3.66675 18.3333L4.58341 13.75L14.6667 3.66667L18.3334 7.33333L8.25008 17.4167L3.66675 18.3333Z"/><path d="M12.8333 5.5L16.4999 9.16667"/>'],
    sound: ["0 0 22 22", '<path d="M3.66675 8.25H7.33341L11.9167 4.58333V17.4167L7.33341 13.75H3.66675V8.25Z"/><path d="M14.6667 8.25C15.0569 8.59409 15.3694 9.01725 15.5834 9.49139C15.7974 9.96553 15.9081 10.4798 15.9081 11C15.9081 11.5202 15.7974 12.0345 15.5834 12.5086C15.3694 12.9827 15.0569 13.4059 14.6667 13.75M16.9584 5.95833C18.2478 7.32029 18.9664 9.1245 18.9664 11C18.9664 12.8755 18.2478 14.6797 16.9584 16.0417"/>'],
    search: ["0 0 20 20", '<path d="M9.16667 14.5833C12.1582 14.5833 14.5833 12.1582 14.5833 9.16667C14.5833 6.17512 12.1582 3.75 9.16667 3.75C6.17512 3.75 3.75 6.17512 3.75 9.16667C3.75 12.1582 6.17512 14.5833 9.16667 14.5833Z"/><path d="M13.3333 13.3333L17.4999 17.5"/>'],
    help: ["0 0 20 20", '<path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"/><path d="M7.91675 7.91667C7.91806 7.54137 8.02072 7.1734 8.21388 6.85164C8.40705 6.52987 8.68354 6.26626 9.01415 6.08865C9.34476 5.91105 9.71721 5.82605 10.0921 5.84263C10.4671 5.85922 10.8306 5.97678 11.1442 6.18288C11.4578 6.38898 11.71 6.67598 11.874 7.01355C12.038 7.35111 12.1077 7.72671 12.0759 8.10065C12.0441 8.4746 11.9118 8.833 11.6931 9.13798C11.4744 9.44297 11.1774 9.68321 10.8334 9.83333C10.2501 10.1667 10.0001 10.5833 10.0001 11.25M10.0001 14.1667H10.0084"/>'],
    basket: ["0 0 20 20", '<path d="M2.5 3.33333H5L6.83333 12.5H15.1667L16.8333 5.83333H5.83333"/><path d="M8.33341 17C8.97775 17 9.50008 16.4777 9.50008 15.8333C9.50008 15.189 8.97775 14.6667 8.33341 14.6667C7.68908 14.6667 7.16675 15.189 7.16675 15.8333C7.16675 16.4777 7.68908 17 8.33341 17Z"/><path d="M14.1667 17C14.811 17 15.3333 16.4777 15.3333 15.8333C15.3333 15.189 14.811 14.6667 14.1667 14.6667C13.5223 14.6667 13 15.189 13 15.8333C13 16.4777 13.5223 17 14.1667 17Z"/>'],
    "arrow-right": ["0 0 20 20", '<path d="M4.16675 10H15.8334M10.8334 15L15.8334 10L10.8334 5"/>'],
    user: ["0 0 26 26", '<path d="M13 13C15.3932 13 17.3333 11.0599 17.3333 8.66665C17.3333 6.27341 15.3932 4.33331 13 4.33331C10.6067 4.33331 8.66663 6.27341 8.66663 8.66665C8.66663 11.0599 10.6067 13 13 13Z"/><path d="M4.33337 21.6666C5.63337 17.7666 8.88337 15.7083 13 15.7083C17.1167 15.7083 20.3667 17.7666 21.6667 21.6666"/>'],
    star: ["0 0 18 18", '<path d="M9.00002 2.25L11.025 6.45L15.6 7.05L12.225 10.275L13.05 14.85L9.00002 12.675L4.95002 14.85L5.77502 10.275L2.40002 7.05L6.97502 6.45L9.00002 2.25Z" fill="var(--accent-yellow)" stroke="var(--accent-yellow)"/>'],
    calendar: ["0 0 20 20", '<path d="M14.9999 4.16675H4.99992C4.07944 4.16675 3.33325 4.91294 3.33325 5.83341V15.0001C3.33325 15.9206 4.07944 16.6667 4.99992 16.6667H14.9999C15.9204 16.6667 16.6666 15.9206 16.6666 15.0001V5.83341C16.6666 4.91294 15.9204 4.16675 14.9999 4.16675Z"/><path d="M3.33325 8.33333H16.6666M6.66659 2.5V5.83333M13.3333 2.5V5.83333"/>'],
    lock: ["0 0 22 22", '<path d="M15.5834 10.0833H6.41671C5.40419 10.0833 4.58337 10.9041 4.58337 11.9166V16.4999C4.58337 17.5124 5.40419 18.3333 6.41671 18.3333H15.5834C16.5959 18.3333 17.4167 17.5124 17.4167 16.4999V11.9166C17.4167 10.9041 16.5959 10.0833 15.5834 10.0833Z"/><path d="M7.33337 10.0834V7.33341C7.33337 6.36095 7.71968 5.42832 8.40732 4.74069C9.09495 4.05306 10.0276 3.66675 11 3.66675C11.9725 3.66675 12.9051 4.05306 13.5928 4.74069C14.2804 5.42832 14.6667 6.36095 14.6667 7.33341V10.0834"/>'],
    check: ["0 0 22 22", '<path d="M4.58325 11.4584L8.70825 15.5834L17.4166 6.41675"/>']
  };

  /* PlayPal.icon('home', 22) -> '<svg …>' (decorative, hidden from screen readers) */
  PP.icon = function (name, size) {
    var def = ICONS[name];
    if (!def) return "";
    var s = size || parseInt(def[0].split(" ")[2], 10);
    return (
      '<svg class="pp-icon" width="' + s + '" height="' + s + '" viewBox="' + def[0] +
      '" fill="none" stroke="currentColor" stroke-width="2.91667" stroke-linecap="round"' +
      ' stroke-linejoin="round" aria-hidden="true" focusable="false">' + def[1] + "</svg>"
    );
  };

  /* ------------------------------------------------------------------ basket
     Count is shared by every screen through localStorage ("playpal.basket").
     SEED_COUNT = 3 only so the nav matches the Figma mock-up on first load –
     set it to 0 once real basket data exists.                                */
  var SEED_COUNT = 3;
  var BASKET_KEY = "playpal.basket";
  var basketListeners = [];

  PP.basket = {
    key: BASKET_KEY,
    count: function () {
      var n = parseInt(PP.storage.get(BASKET_KEY, SEED_COUNT), 10);
      return isNaN(n) || n < 0 ? 0 : n;
    },
    add: function (qty) {
      var n = PP.basket.count() + (qty || 1);
      PP.storage.set(BASKET_KEY, n);
      basketListeners.forEach(function (fn) { fn(n); });
      return n;
    },
    subscribe: function (fn) {
      basketListeners.push(fn);
      fn(PP.basket.count());
    }
  };

  /* ------------------------------------------------------------------- toast */
  function toastRegion() {
    var region = document.querySelector(".pp-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "pp-toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    return region;
  }

  PP.toast = {
    show: function (message, ms) {
      var el = document.createElement("div");
      el.className = "pp-toast";
      el.innerHTML = '<span class="pp-toast__icon">' + PP.icon("check", 22) + "</span><span>" +
        PP.escape(message) + "</span>";
      toastRegion().appendChild(el);
      window.setTimeout(function () {
        el.classList.add("is-leaving");
        window.setTimeout(function () { el.remove(); }, 300);
      }, ms || 3200);
    }
  };

  /* -------------------------------------------------------------- components */
  var components = (PP.components = PP.components || {});

  components.helpDialog = function () {
    function item(tone, icon, text) {
      return '<li class="pp-tone-' + tone + '"><span class="pp-dialog__icon">' + PP.icon(icon, 22) +
        "</span><span>" + text + "</span></li>";
    }
    return (
      '<dialog class="pp-dialog" id="pp-help-dialog" aria-labelledby="pp-help-title">' +
      '<h2 class="pp-dialog__title text-h3" id="pp-help-title">Need help?</h2>' +
      '<ul class="pp-dialog__list">' +
      item("home", "lock", "Ask a grown-up before you buy") +
      item("activities", "check", "No ads. No chatting with strangers.") +
      item("shop", "help", "Tap “Need help?” any time") +
      "</ul>" +
      '<form method="dialog"><button class="pp-btn pp-tone-home" type="submit">Got it</button></form>' +
      "</dialog>"
    );
  };
})();
