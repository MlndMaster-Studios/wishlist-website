const bootScreen = document.getElementById("bootScreen");
const bootText = document.getElementById("bootText");
const mainContent = document.getElementById("mainContent");
const storyLog = document.getElementById("storyLog");
const startButton = document.getElementById("startButton");

const bootSequence = [
  "RUNNING SYSTEM CHECK...",
  "LOADING CORE MODULES...",
  "VERIFYING DATA INTEGRITY...",
  "ESTABLISHING SECURE CONNECTION...",
  "BOOT COMPLETE."
];

function simulateBoot() {
  let i = 0;
  const interval = setInterval(() => {
    if (i < bootSequence.length) {
      bootText.innerHTML += `<p>${bootSequence[i]}</p>`;
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        bootScreen.classList.add("fade-out");
        setTimeout(() => {
          bootScreen.style.display = "none";
          mainContent.style.display = "flex";
        }, 1000);
      }, 500);
    }
  }, 1000);
}

function activateSystem() {
  startButton.style.display = "none";
  storyLog.innerText = "System restarting...";
  document.body.style.background = "black";
  mainContent.style.display = "none";

  setTimeout(() => {
    bootText.innerHTML = "<p>REBOOTING...</p>";
    bootScreen.style.display = "flex";
    bootScreen.classList.remove("fade-out");
    simulateBoot();
  }, 3000);
}

startButton.addEventListener("click", activateSystem);

// Run the first boot on page load
simulateBoot();
