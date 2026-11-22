const host = document.createElement("div");
const shadow = host.attachShadow({ mode: "closed" });
const image = document.createElement("img");
image.src = chrome.runtime.getURL("logo.png");
image.alt = "";
image.style.cssText = "position: fixed; width: 64px; height: 64px; left: 0; top: 0; pointer-events: none; display: none; z-index: 2147483647;";
const cornerImage = document.createElement("img");
cornerImage.src = chrome.runtime.getURL("logo.png");
cornerImage.alt = "";
cornerImage.style.cssText = "position: fixed; width: 64px; height: 64px; right: 16px; bottom: 16px; pointer-events: none; display: none; z-index: 2147483647;";
host.style.cssText = "position: fixed; inset: 0; pointer-events: none; z-index: 2147483647;";
shadow.append(image, cornerImage);

let enabled = false;
let cornerEnabled = false;
const changedSettings = new Set();

function updateHost() {
  if (enabled || cornerEnabled) {
    if (!host.isConnected) document.documentElement.append(host);
  } else {
    host.remove();
  }
}

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
    document.addEventListener("mousemove", moveCompanion);
    document.addEventListener("mouseleave", hideCompanion);
  } else {
    document.removeEventListener("mousemove", moveCompanion);
    document.removeEventListener("mouseleave", hideCompanion);
    hideCompanion();
  }
  updateHost();
}

function setCornerEnabled(value) {
  cornerEnabled = value;
  cornerImage.style.display = value ? "block" : "none";
  updateHost();
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.enabled) {
    changedSettings.add("enabled");
    setEnabled(changes.enabled.newValue === true);
  }
  if (changes.cornerEnabled) {
    changedSettings.add("cornerEnabled");
    setCornerEnabled(changes.cornerEnabled.newValue === true);
  }
});

chrome.storage.local.get(["enabled", "cornerEnabled"]).then((settings) => {
  if (!changedSettings.has("enabled")) {
    setEnabled(settings.enabled === true);
  }
  if (!changedSettings.has("cornerEnabled")) {
    setCornerEnabled(settings.cornerEnabled === true);
  }
}).catch((reason) => {
  console.error("Could not load companion setting:", reason);
});
