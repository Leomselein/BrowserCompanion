const toggle = document.getElementById("enabled");
const error = document.getElementById("error");
let settingChanged = false;

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    settingChanged = true;
    toggle.checked = changes.enabled.newValue === true;
  }
});

chrome.storage.local.get("enabled").then(({ enabled }) => {
  if (!settingChanged) {
    toggle.checked = enabled === true;
  }
  toggle.disabled = false;
}).catch((reason) => {
  console.error("Could not load companion setting:", reason);
  error.textContent = "Could not load the setting. Reopen the popup to try again.";
  error.hidden = false;
});

toggle.addEventListener("change", async () => {
  toggle.disabled = true;
  error.hidden = true;
  try {
    await chrome.storage.local.set({ enabled: toggle.checked });
  } catch (reason) {
    console.error("Could not save companion setting:", reason);
    toggle.checked = !toggle.checked;
    error.textContent = "Could not save the setting. Please try again.";
    error.hidden = false;
  } finally {
    toggle.disabled = false;
  }
});