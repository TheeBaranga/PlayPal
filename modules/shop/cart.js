(function () {
  "use strict";

  var PP = window.PlayPal;
  var shop = window.PlayPalShop;
  var CART_KEY = "playpal.shop.cart";

  function getItems() {
    var items = PP.storage.get(CART_KEY, []);
    return Array.isArray(items) ? items : [];
  }

  function formatPrice(price) {
    return "KSh " + Number(price).toLocaleString("en-KE");
  }

  function render() {
    var items = getItems();
    var list = document.querySelector("[data-basket-items]");
    var summary = document.querySelector("[data-basket-summary]");
    var totalNode = document.querySelector("[data-basket-total]");
    var totalQty = items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    var totalPrice = items.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);
    if (!list || !summary || !totalNode) return;

    summary.textContent = totalQty + (totalQty === 1 ? " toy in your basket" : " toys in your basket");
    totalNode.textContent = formatPrice(totalPrice);
    if (!items.length) {
      list.innerHTML = '<p class="shop-basket-empty">Your basket is waiting for a fun pick.</p>';
      return;
    }

    list.innerHTML = items.map(function (item) {
      return '<div class="shop-basket-item"><img src="../../assets/images/shop/' +
        encodeURIComponent(item.image) + '" alt=""><div><strong>' + PP.escape(item.name) +
        '</strong><span>Qty ' + item.quantity + '</span></div><strong>' +
        formatPrice(item.price * item.quantity) + '</strong></div>';
    }).join("");
  }

  shop.cart = {
    add: function (product) {
      var items = getItems();
      var existing = items.find(function (item) { return item.id === product.id; });
      if (existing) existing.quantity += 1;
      else items.push({ id: product.id, name: product.name, image: product.image, price: product.price, quantity: 1 });
      PP.storage.set(CART_KEY, items);
      PP.basket.add(1);
      render();
    },
    render: render,
    open: function () {
      var dialog = document.getElementById("shop-basket-dialog");
      render();
      if (dialog && !dialog.open && typeof dialog.showModal === "function") dialog.showModal();
    }
  };
})();
