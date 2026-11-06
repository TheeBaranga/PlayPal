(function () {
  "use strict";

  var PP = window.PlayPal;
  var shop = window.PlayPalShop;
  var products = shop.products;
  var categories = shop.categories;
  var pageSize = 8;
  var confirmationTimer;
  var state = {
    category: "board-games",
    query: "",
    age: "any",
    price: "any",
    sort: "newest",
    visible: pageSize
  };

  function escape(value) {
    return PP.escape(String(value));
  }

  function formatPrice(price) {
    return "KSh " + Number(price).toLocaleString("en-KE");
  }

  function updateUrl() {
    var params = new URLSearchParams(window.location.search);
    if (state.category) params.set("category", state.category);
    else params.delete("category");
    if (state.query) params.set("q", state.query);
    else params.delete("q");
    if (state.sort !== "newest") params.set("sort", state.sort);
    else params.delete("sort");
    var url = window.location.pathname + (params.toString() ? "?" + params.toString() : "") + window.location.hash;
    window.history.replaceState(null, "", url);
  }

  function categoryMarkup(category) {
    var selected = state.category === category.id;
    return '<button type="button" class="shop-category' + (selected ? " is-active" : "") +
      '" data-category="' + escape(category.id) + '" aria-pressed="' + selected + '">' +
      '<span class="shop-category__icon" aria-hidden="true">' + category.icon + "</span>" +
      "<span>" + escape(category.name) + "</span></button>";
  }

  function productMarkup(product, index) {
    var badge = product.badge ? '<span class="shop-product__badge">' + escape(product.badge) + "</span>" : "";
    return '<article class="shop-product pp-tone-shop">' +
      '<div class="shop-product__media">' + badge +
      '<button class="shop-product__favorite" type="button" aria-label="Add ' + escape(product.name) +
      ' to favourites" aria-pressed="false" data-favorite="' + escape(product.id) + '">♡</button>' +
      '<img src="../../assets/images/shop/' + encodeURIComponent(product.image) +
      '" width="800" height="800" loading="' + (index < 4 ? "eager" : "lazy") +
      '" decoding="async" alt="' + escape(product.name) + '"></div>' +
      '<div class="shop-product__body"><h3 class="shop-product__name">' + escape(product.name) + "</h3>" +
      '<div class="shop-product__rating" aria-label="' + product.rating + " out of 5 stars, " +
      product.reviews + ' reviews"><span aria-hidden="true">★</span> ' + product.rating.toFixed(1) +
      " · " + product.reviews + ' reviews <span class="pp-tag shop-product__age">Ages ' + product.age +
      '+</span></div><strong class="shop-product__price">' + formatPrice(product.price) + "</strong>" +
      '<button type="button" class="pp-btn pp-btn--block shop-product__add" data-add-product="' +
      escape(product.id) + '">Add to basket</button></div></article>';
  }

  function filteredProducts() {
    var query = state.query.toLocaleLowerCase();
    var result = products.filter(function (product) {
      return (!state.category || product.category === state.category) &&
        (!query || product.name.toLocaleLowerCase().includes(query)) &&
        (state.age === "any" || product.age >= Number(state.age)) &&
        (state.price === "any" ||
          (state.price === "under-1000" && product.price < 1000) ||
          (state.price === "1000-2000" && product.price >= 1000 && product.price <= 2000) ||
          (state.price === "over-2000" && product.price > 2000));
    });

    if (state.sort === "price-low") result.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === "price-high") result.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === "rating") result.sort(function (a, b) { return b.rating - a.rating; });
    return result;
  }

  function render() {
    var activeCategory = categories.find(function (category) { return category.id === state.category; });
    var shown = filteredProducts();
    var page = shown.slice(0, state.visible);
    var grid = document.querySelector("[data-product-grid]");
    var heading = document.getElementById("results-title");
    var count = document.querySelector("[data-results-count]");
    var empty = document.querySelector("[data-empty]");
    var more = document.querySelector("[data-show-more]");
    var pageCount = document.querySelector("[data-page-count]");

    heading.textContent = activeCategory ? activeCategory.name : "All toys";
    if (state.query) heading.textContent += ' · "' + state.query + '"';
    count.textContent = "Showing " + page.length + " of " + shown.length + " toys";
    empty.hidden = shown.length > 0;
    grid.innerHTML = page.map(productMarkup).join("");
    more.hidden = shown.length <= state.visible;
    pageCount.textContent = shown.length ? "Page " + Math.ceil(page.length / pageSize) + " of " + Math.ceil(shown.length / pageSize) : "";

    document.querySelectorAll("[data-category]").forEach(function (button) {
      var selected = button.getAttribute("data-category") === state.category;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function init() {
    var params = new URLSearchParams(window.location.search);
    var category = params.get("category");
    state.category = categories.some(function (item) { return item.id === category; }) ? category : "board-games";
    state.query = (params.get("q") || "").trim();
    state.sort = ["newest", "price-low", "price-high", "rating"].includes(params.get("sort")) ? params.get("sort") : "newest";

    var categoryList = document.querySelector("[data-category-list]");
    var searchForm = document.querySelector("[data-shop-search]");
    var searchInput = document.getElementById("shop-search-input");
    var sortSelect = document.querySelector("[data-sort]");
    var ageSelect = document.querySelector("[data-age]");
    var priceSelect = document.querySelector("[data-price]");
    searchInput.value = state.query;
    sortSelect.value = state.sort;
    categoryList.innerHTML = categories.map(categoryMarkup).join("");

    categoryList.addEventListener("click", function (event) {
      var button = event.target.closest("[data-category]");
      if (!button) return;
      state.category = button.getAttribute("data-category");
      state.visible = pageSize;
      updateUrl();
      render();
    });
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      state.query = searchInput.value.trim();
      state.visible = pageSize;
      updateUrl();
      render();
    });
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      state.visible = pageSize;
      updateUrl();
      render();
    });
    ageSelect.addEventListener("change", function () {
      state.age = ageSelect.value;
      state.visible = pageSize;
      render();
    });
    priceSelect.addEventListener("change", function () {
      state.price = priceSelect.value;
      state.visible = pageSize;
      render();
    });
    document.querySelectorAll("[data-age-shortcut]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.age = button.getAttribute("data-age-shortcut");
        ageSelect.value = state.age;
        state.visible = pageSize;
        render();
        document.querySelector(".shop-products").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    document.querySelector("[data-show-more]").addEventListener("click", function () {
      state.visible += pageSize;
      render();
    });
    document.querySelector("[data-product-grid]").addEventListener("click", function (event) {
      var add = event.target.closest("[data-add-product]");
      var favorite = event.target.closest("[data-favorite]");
      if (add) {
        var product = products.find(function (item) { return item.id === add.getAttribute("data-add-product"); });
        if (!product) return;
        shop.cart.add(product);
        add.classList.add("is-added");
        add.textContent = "Added!";
        var confirmation = document.querySelector("[data-shop-confirmation]");
        if (confirmation) {
          confirmation.hidden = false;
          window.clearTimeout(confirmationTimer);
          confirmationTimer = window.setTimeout(function () { confirmation.hidden = true; }, 3200);
        }
        PP.toast.show(product.name + " added to your basket");
        window.setTimeout(function () {
          add.classList.remove("is-added");
          add.textContent = "Add to basket";
        }, 1400);
      }
      if (favorite) {
        var selected = favorite.getAttribute("aria-pressed") !== "true";
        favorite.setAttribute("aria-pressed", String(selected));
        favorite.classList.toggle("is-favorite", selected);
        favorite.textContent = selected ? "♥" : "♡";
      }
    });
    document.querySelectorAll("[data-open-basket]").forEach(function (button) {
      button.addEventListener("click", shop.cart.open);
    });
    document.querySelectorAll("[data-close-basket]").forEach(function (button) {
      button.addEventListener("click", function () {
        var dialog = document.getElementById("shop-basket-dialog");
        if (dialog.open) dialog.close();
      });
    });
    document.getElementById("shop-basket-dialog").addEventListener("click", function (event) {
      if (event.target === event.currentTarget) event.currentTarget.close();
    });
    shop.cart.render();
    render();
  }

  PP.ready(init);
})();
