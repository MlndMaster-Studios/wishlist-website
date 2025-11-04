// === ??? SYSTEM BOOT SEQUENCE ===
const output = document.getElementById("output");
const btn = document.getElementById("main-btn");
const log = document.getElementById("log");
const status = document.getElementById("status");

let active = false;
let lines = [
  "…establishing uplink…",
  "…verifying memory integrity…",
  "…signal found.",
  "…analyzing tone patterns…",
  "…ready.",
];

function typeText(el, text, speed = 45) {
  return new Promise(resolve => {
    el.textContent = "";
    let i = 0;
    let typer = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(typer);
        resolve();
      }
    }, speed);
  });
}

btn.addEventListener("click", async () => {
  if (active) return;
  active = true;
  btn.disabled = true;
  btn.textContent = "Running...";
  status.textContent = "Processing";

  for (let line of lines) {
    await typeText(output, line);
    await new Promise(r => setTimeout(r, 600));
  }

  await typeText(output, "complete.");
  log.textContent = "Activity detected.";
  status.textContent = "Online";
  btn.textContent = "Reactivate?";
  btn.disabled = false;
  active = false;
});

// === Subtle mouse parallax ===
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  document.body.style.transform = `translate(${x}px, ${y}px)`;
  document.body.style.transition = "transform 0.1s ease-out";
});
