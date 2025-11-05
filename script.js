// ===== DOM ELEMENTS =====
const priorityFilter = document.getElementById("priorityFilter");
const copyLinksBtn = document.getElementById("copyLinksBtn");
const clearPurchasedBtn = document.getElementById("clearPurchasedBtn");
const productCards = document.querySelectorAll(".product-card");

// ===== LOCAL STORAGE HELPERS =====
function getPurchased() {
  return JSON.parse(localStorage.getItem("purchasedItems") || "[]");
}
function savePurchased(arr) {
  localStorage.setItem("purchasedItems", JSON.stringify(arr));
}

// ===== INITIALIZATION =====
let purchasedItems = getPurchased();

// Apply saved purchase states
purchasedItems.forEach(id => {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) markCardAsPurchased(card);
});

// ===== PRIORITY FILTER =====
priorityFilter.addEventListener("change", () => {
  const selected = priorityFilter.value;
  productCards.forEach(card => {
    const stars = parseInt(card.getAttribute("data-priority"));
    card.style.display =
      selected === "all" || stars === parseInt(selected) ? "block" : "none";
  });
});

// ===== PURCHASE BUTTON =====
productCards.forEach(card => {
  const btn = card.querySelector(".purchase-btn");
  const id = card.getAttribute("data-id");

  btn.addEventListener("click", e => {
    e.stopPropagation();
    if (purchasedItems.includes(id)) {
      purchasedItems = purchasedItems.filter(x => x !== id);
      unmarkCardAsPurchased(card);
    } else {
      purchasedItems.push(id);
      markCardAsPurchased(card);
    }
    savePurchased(purchasedItems);
  });
});

function markCardAsPurchased(card) {
  const btn = card.querySelector(".purchase-btn");
  btn.textContent = "✓ Purchased";
  btn.classList.add("purchased");
  card.classList.add("card-purchased");
}
function unmarkCardAsPurchased(card) {
  const btn = card.querySelector(".purchase-btn");
  btn.textContent = "Mark as Purchased";
  btn.classList.remove("purchased");
  card.classList.remove("card-purchased");
}

// ===== COPY VISIBLE LINKS =====
copyLinksBtn.addEventListener("click", () => {
  const visibleCards = Array.from(productCards).filter(
    c => c.style.display !== "none"
  );
  const links = visibleCards
    .map(c => c.getAttribute("data-link"))
    .filter(Boolean)
    .join("\n");

  if (links.length) {
    navigator.clipboard.writeText(links);
    copyLinksBtn.textContent = "Copied!";
    setTimeout(() => (copyLinksBtn.textContent = "Copy Visible Links"), 1500);
  } else {
    alert("No visible products with links to copy!");
  }
});

// ===== CLEAR PURCHASED MARKS =====
clearPurchasedBtn.addEventListener("click", () => {
  purchasedItems = [];
  savePurchased(purchasedItems);
  productCards.forEach(unmarkCardAsPurchased);
});

// ===== OPEN LINKS (with PlayStation override) =====
productCards.forEach(card => {
  card.addEventListener("click", () => {
    const link = card.getAttribute("data-link");
    const isPlayStation = card.classList.contains("playstation");

    if (isPlayStation) {
      window.open(
        "https://www.amazon.com/Funko-Pop-Games-Portal-Chell/dp/B00TR79BO8",
        "_blank"
      );
    } else if (link) {
      window.open(link, "_blank");
    }
  });
});
