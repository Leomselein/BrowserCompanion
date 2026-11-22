const host = document.createElement("div");
const shadow = host.attachShadow({ mode: "closed" });
const image = document.createElement("img");
image.src = chrome.runtime.getURL("logo.png");
image.alt = "";
image.style.cssText = "position: fixed; width: 64px; height: 64px; left: 0; top: 0; pointer-events: none; display: none; z-index: 2147483647;";
host.style.cssText = "position: fixed; inset: 0; pointer-events: none; z-index: 2147483647;";
shadow.append(image);

let enabled = false;
let settingChanged = false;

function moveCompanion(event) {
  image.style.left = `${event.clientX + 16}px`;
  image.style.top = `${event.clientY + 16}px`;
  image.style.display = "block";
}

function hideCompanion() {
  image.style.display = "none";
}

function setEnabled(value) {
  if (enabled === value) return;
  enabled = value;
  if (enabled) {
    document.documentElement.append(host);
    document.addEventListener("mousemove", moveCompanion);
    document.addEventListener("mouseleave", hideCompanion);
  } else {
    document.removeEventListener("mousemove", moveCompanion);
    document.removeEventListener("mouseleave", hideCompanion);
    hideCompanion();
    host.remove();
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    settingChanged = true;
    setEnabled(changes.enabled.newValue === true);
  }
});

chrome.storage.local.get("enabled").then(({ enabled: storedEnabled }) => {
  if (!settingChanged) {
    setEnabled(storedEnabled === true);
  }
}).catch((reason) => {
  console.error("Could not load companion setting:", reason);
});
