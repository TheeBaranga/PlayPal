(function () {
  "use strict";

  window.PlayPalShop = window.PlayPalShop || {};
  window.PlayPalShop.categories = [
    { id: "board-games", name: "Board games", icon: "🎲" },
    { id: "art-kits", name: "Art kits", icon: "🎨" },
    { id: "building-kits", name: "Building kits", icon: "🧱" },
    { id: "science-kits", name: "Science kits", icon: "🧪" },
    { id: "creative-stationery", name: "Creative stationery", icon: "✏️" }
  ];

  window.PlayPalShop.products = [
    { id: "rainbow-ludo", name: "Rainbow Ludo Deluxe", category: "board-games", image: "board-ludo.jpg", price: 1350, rating: 4.8, reviews: 48, age: 8, badge: "New" },
    { id: "super-chess", name: "Super Chess Set", category: "board-games", image: "board-chess.jpg", price: 1800, rating: 4.8, reviews: 46, age: 8, badge: "Best seller" },
    { id: "checkers-challenge", name: "Checkers Challenge", category: "board-games", image: "board-checkers.jpg", price: 750, rating: 4.8, reviews: 32, age: 8, badge: "New" },
    { id: "word-builder", name: "Word Builder Tiles", category: "board-games", image: "board-scrabble.jpg", price: 1100, rating: 4.8, reviews: 29, age: 8, badge: "" },
    { id: "snakes-ladders", name: "Snakes & Ladders", category: "board-games", image: "board-snakes-ladders.jpg", price: 800, rating: 4.7, reviews: 27, age: 8, badge: "" },
    { id: "spin-and-win", name: "Spin & Win Game", category: "board-games", image: "board-spin-wheel.jpg", price: 1250, rating: 4.7, reviews: 21, age: 8, badge: "New" },
    { id: "treasure-island", name: "Treasure Island Quest", category: "board-games", image: "board-treasure-island.jpg", price: 2200, rating: 4.9, reviews: 18, age: 12, badge: "Best seller" },
    { id: "uno-card-game", name: "UNO Card Game", category: "board-games", image: "board-uno.jpg", price: 700, rating: 4.8, reviews: 53, age: 8, badge: "" },
    { id: "traditional-ludo", name: "Traditional Ludo", category: "board-games", image: "board-traditional-ludo.jpg", price: 1100, rating: 4.7, reviews: 22, age: 8, badge: "" },
    { id: "trouble-dice", name: "Trouble Dice Challenge", category: "board-games", image: "board-trouble.jpg", price: 1800, rating: 4.8, reviews: 16, age: 8, badge: "New" },
    { id: "uno-party-cards", name: "UNO Party Cards", category: "board-games", image: "board-uno-party.jpg", price: 650, rating: 4.8, reviews: 31, age: 8, badge: "" },
    { id: "classic-ludo", name: "Classic Ludo Board", category: "board-games", image: "board-classic-ludo.jpg", price: 1250, rating: 4.7, reviews: 18, age: 8, badge: "" },
    { id: "colour-splash-paint-kit", name: "Colour Splash Paint Kit", category: "art-kits", image: "home-colour-splash-kit.jpg", price: 1450, rating: 4.8, reviews: 48, age: 8, badge: "New" },
    { id: "all-in-one-craft-jar", name: "All-in-One Craft Jar", category: "art-kits", image: "art-craft-jar.jpg", price: 1650, rating: 4.9, reviews: 36, age: 8, badge: "New" },
    { id: "cheerful-watercolor-kit", name: "Cheerful Watercolor Kit", category: "art-kits", image: "art-watercolor.jpg", price: 1450, rating: 4.8, reviews: 42, age: 8, badge: "" },
    { id: "creative-art-collection", name: "Creative Art Collection", category: "art-kits", image: "art-creative-collection.jpg", price: 2100, rating: 4.9, reviews: 24, age: 10, badge: "Best seller" },
    { id: "brick-builder-castle", name: "Brick Builder Castle", category: "building-kits", image: "home-brick-builder-castle.jpg", price: 2300, rating: 4.8, reviews: 48, age: 8, badge: "New" },
    { id: "magnetic-building-tiles", name: "Magnetic Building Tiles", category: "building-kits", image: "build-magnetic-tiles.jpg", price: 2750, rating: 4.9, reviews: 31, age: 8, badge: "New" },
    { id: "wooden-blocks", name: "Wooden Building Blocks", category: "building-kits", image: "build-wooden-blocks.jpg", price: 1900, rating: 4.8, reviews: 22, age: 8, badge: "" },
    { id: "stem-construction-kit", name: "STEM Construction Kit", category: "building-kits", image: "build-stem-kit.jpg", price: 3200, rating: 4.9, reviews: 16, age: 10, badge: "Best seller" },
    { id: "mini-lab-science-kit", name: "Mini Lab Science Kit", category: "science-kits", image: "science-microscope.jpg", price: 1950, rating: 4.8, reviews: 48, age: 8, badge: "New" },
    { id: "junior-microscope", name: "Junior Microscope Kit", category: "science-kits", image: "science-microscope.jpg", price: 2450, rating: 4.8, reviews: 28, age: 10, badge: "New" },
    { id: "crystal-growing-kit", name: "Crystal Growing Kit", category: "science-kits", image: "science-crystal.jpg", price: 1800, rating: 4.7, reviews: 19, age: 8, badge: "" },
    { id: "volcano-experiment-kit", name: "Volcano Experiment Kit", category: "science-kits", image: "science-volcano.jpg", price: 2200, rating: 4.9, reviews: 25, age: 10, badge: "Best seller" },
    { id: "doodle-dreams-journal", name: "Doodle Dreams Journal", category: "creative-stationery", image: "home-doodle-journal.jpg", price: 850, rating: 4.8, reviews: 48, age: 8, badge: "New" },
    { id: "colorful-stationery-set", name: "Colorful Stationery Set", category: "creative-stationery", image: "stationery-colorful.jpg", price: 950, rating: 4.8, reviews: 34, age: 8, badge: "New" },
    { id: "pastel-desk-organizer", name: "Pastel Desk Organizer", category: "creative-stationery", image: "stationery-desk.jpg", price: 1250, rating: 4.7, reviews: 15, age: 8, badge: "" },
    { id: "creative-stationery-kit", name: "Creative Stationery Kit", category: "creative-stationery", image: "stationery-boys.jpg", price: 1100, rating: 4.8, reviews: 20, age: 8, badge: "" }
  ];
})();
