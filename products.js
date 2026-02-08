var searchInput = document.getElementById("searchInput");
var categorySelect = document.getElementById("categorySelect");
var sortSelect = document.getElementById("sortSelect");
var clearBtn = document.getElementById("clearBtn");
var resultsText = document.getElementById("resultsText");
var productGrid = document.getElementById("productGrid");

var cards = productGrid.getElementsByClassName("product-card");

for (var i = 0; i < cards.length; i++) {
  cards[i].setAttribute("data-original", i);
}

function getText(el, selector) {
  var found = el.querySelector(selector);
  if (found) return found.textContent;
  return "";
}

function getPriceNumber(priceText) {
  var cleaned = "";
  for (var i = 0; i < priceText.length; i++) {
    var ch = priceText[i];
    if (ch >= "0" && ch <= "9") cleaned += ch;
  }
  if (cleaned === "") return 0;
  return parseInt(cleaned);
}

function updateProducts() {
  var searchValue = searchInput.value.toLowerCase().trim();
  var categoryValue = categorySelect.value;
  var sortValue = sortSelect.value;

  var matched = [];

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];

    var name = getText(card, "h3").toLowerCase();
    var category = getText(card, ".category");

    var matchesSearch = true;
    var matchesCategory = true;

    if (searchValue !== "") {
      if (name.indexOf(searchValue) === -1) {
        matchesSearch = false;
      }
    }

    if (categoryValue !== "all") {
      if (category !== categoryValue) {
        matchesCategory = false;
      }
    }

    if (matchesSearch && matchesCategory) {
      matched.push(card);
    }
  }

  if (sortValue !== "default") {
    for (var a = 0; a < matched.length; a++) {
      for (var b = 0; b < matched.length - 1; b++) {
        var card1 = matched[b];
        var card2 = matched[b + 1];

        var swap = false;

        if (sortValue === "priceLow" || sortValue === "priceHigh") {
          var p1 = getPriceNumber(getText(card1, ".price"));
          var p2 = getPriceNumber(getText(card2, ".price"));

          if (sortValue === "priceLow" && p1 > p2) swap = true;
          if (sortValue === "priceHigh" && p1 < p2) swap = true;
        }

        if (sortValue === "nameAZ" || sortValue === "nameZA") {
          var n1 = getText(card1, "h3").toLowerCase();
          var n2 = getText(card2, "h3").toLowerCase();

          if (sortValue === "nameAZ" && n1 > n2) swap = true;
          if (sortValue === "nameZA" && n1 < n2) swap = true;
        }

        if (swap) {
          var temp = matched[b];
          matched[b] = matched[b + 1];
          matched[b + 1] = temp;
        }
      }
    }
  } else {
    for (var a = 0; a < matched.length; a++) {
      for (var b = 0; b < matched.length - 1; b++) {
        var o1 = parseInt(matched[b].getAttribute("data-original"));
        var o2 = parseInt(matched[b + 1].getAttribute("data-original"));
        if (o1 > o2) {
          var tmp = matched[b];
          matched[b] = matched[b + 1];
          matched[b + 1] = tmp;
        }
      }
    }
  }

  for (var i = 0; i < cards.length; i++) {
    cards[i].style.display = "none";
  }

  for (var i = 0; i < matched.length; i++) {
    var card = matched[i];
    card.style.display = "block";
    productGrid.appendChild(card);
  }

  resultsText.textContent = "Showing " + matched.length + " products";
}

searchInput.addEventListener("input", updateProducts);
categorySelect.addEventListener("change", updateProducts);
sortSelect.addEventListener("change", updateProducts);

clearBtn.addEventListener("click", function () {
  searchInput.value = "";
  categorySelect.value = "all";
  sortSelect.value = "default";
  updateProducts();
});

updateProducts();
