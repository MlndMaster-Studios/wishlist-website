// Load saved game or start new
let gameData = JSON.parse(localStorage.getItem("uplinkProtocol")) || {
  clicks: 0,
  upgrades: { cursor: 1 }
};

const clickCountEl = document.getElementById("clickCount");
const clickerBtn = document.getElementById("clickerBtn");
const shopEl = document.getElementById("shop");

// Define upgrades
const upgrades = [
  { name: "Cursor Upgrade", key: "cursor", cost: 10, multiplier: 1 },
  { name: "Packet Amplifier", key: "amplifier", cost: 50, multiplier: 5 }
];

// Render shop
function renderShop() {
  shopEl.innerHTML = "";
  upgrades.forEach(upg => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      <span>${upg.name} (Cost: ${upg.cost})</span>
      <button ${gameData.clicks < upg.cost ? "disabled" : ""}>Buy</button>
    `;
    div.querySelector("button").addEventListener("click", () => buyUpgrade(upg));
    shopEl.appendChild(div);
  });
}

// Handle upgrade purchase
function buyUpgrade(upg) {
  if (gameData.clicks >= upg.cost) {
    gameData.clicks -= upg.cost;
    gameData.upgrades[upg.key] = (gameData.upgrades[upg.key] || 0) + 1;
    upg.cost = Math.floor(upg.cost * 1.5);
    updateDisplay();
    renderShop();
    saveGame();
  }
}

// Update clicks display
function updateDisplay() {
  clickCountEl.textContent = gameData.clicks;
}

// Clicker button logic
clickerBtn.addEventListener("click", () => {
  let multiplier = 0;
  for (const upg in gameData.upgrades) {
    multiplier += gameData.upgrades[upg];
  }
  gameData.clicks += multiplier;
  updateDisplay();
  saveGame();
});

// Save game
function saveGame() {
  localStorage.setItem("uplinkProtocol", JSON.stringify(gameData));
}

// Initial render
updateDisplay();
renderShop();
