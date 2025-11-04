const bootScreen = document.getElementById("bootScreen");
const bootText = document.getElementById("bootText");
const successScreen = document.getElementById("successScreen");
const mainContent = document.getElementById("mainContent");
const storyLog = document.getElementById("storyLog");
const startButton = document.getElementById("startButton");
const clickerGame = document.getElementById("clickerGame");
const dataCountDisplay = document.getElementById("dataCount");
const collectButton = document.getElementById("collectButton");

const bootSequence = [
  "RUNNING SYSTEM CHECK...",
  "LOADING CORE MODULES...",
  "VERIFYING DATA INTEGRITY...",
  "ESTABLISHING SECURE CONNECTION...",
  "BOOT COMPLETE."
];

let dataFragments = 0;
let storyStage = 0;

function simulateBoot(skipDelay = false) {
  let i = 0;
  bootText.innerHTML = "<p>INITIALIZING SYSTEM...</p>";
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
          if (localStorage.getItem("initialized")) {
            startButton.style.display = "none";
            clickerGame.style.display = "flex";
            storyLog.textContent = "[System online. Continue data collection.]";
            loadProgress();
          }
        }, 1000);
      }, skipDelay ? 0 : 500);
    }
  }, skipDelay ? 0 : 1000);
}

function activateSystem() {
  startButton.style.display = "none";
  storyLog.innerText = "System restarting...";
  mainContent.style.display = "none";
  document.body.style.background = "black";

  setTimeout(() => {
    successScreen.style.display = "flex";
    successScreen.classList.add("fade-in");
    successScreen.style.opacity = "1";
  }, 2000);

  setTimeout(() => {
    successScreen.classList.remove("fade-in");
    successScreen.classList.add("fade-out");
  }, 3500);

  setTimeout(() => {
    successScreen.style.display = "none";
    mainContent.style.display = "flex";
    clickerGame.style.display = "flex";
    storyLog.textContent = "[System online. Begin data collection.]";
    localStorage.setItem("initialized", "true");
  }, 5000);
}

// Clicker system
function collectData() {
  dataFragments++;
  dataCountDisplay.textContent = dataFragments;
  localStorage.setItem("dataFragments", dataFragments);

  // Story progression thresholds
  const stages = [
    { count: 5, text: "[Signal detected. Connection stabilizing...]" },
    { count: 15, text: "[Unknown subroutine awakening. Proceed with caution.]" },
    { count: 30, text: "[Fragmented memory recovered: 'Who... are you?']" },
    { count: 50, text: "[System anomaly detected. Recompiling consciousness...]" },
    { count: 75, text: "[Entity online. Awaiting directives.]" }
  ];

  const nextStage = stages[storyStage];
  if (nextStage && dataFragments >= nextStage.count) {
    storyLog.textContent = nextStage.text;
    storyStage++;
    localStorage.setItem("storyStage", storyStage);
  }
}

function loadProgress() {
  const savedFragments = localStorage.getItem("dataFragments");
  const savedStage = localStorage.getItem("storyStage");

  if (savedFragments) {
    dataFragments = parseInt(savedFragments);
    dataCountDisplay.textContent = dataFragments;
  }
  if (savedStage) storyStage = parseInt(savedStage);
}

// Event listeners
startButton.addEventListener("click", activateSystem);
collectButton.addEventListener("click", collectData);

// Boot
simulateBoot(localStorage.getItem("initialized"));
loadProgress();
