const toggles = {
  enabled: document.getElementById("enabled"),
  cornerEnabled: document.getElementById("cornerEnabled")
};
const error = document.getElementById("error");
const changedSettings = new Set();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  for (const [key, toggle] of Object.entries(toggles)) {
    if (changes[key]) {
      changedSettings.add(key);
      toggle.checked = changes[key].newValue === true;
    }
  }
});

chrome.storage.local.get(Object.keys(toggles)).then((settings) => {
  for (const [key, toggle] of Object.entries(toggles)) {
    if (!changedSettings.has(key)) {
      toggle.checked = settings[key] === true;
    }
    toggle.disabled = false;
  }
}).catch((reason) => {
  console.error("Could not load companion setting:", reason);
  error.textContent = "Could not load the setting. Reopen the popup to try again.";
  error.hidden = false;
});

for (const [key, toggle] of Object.entries(toggles)) {
  toggle.addEventListener("change", async () => {
    toggle.disabled = true;
    error.hidden = true;
    try {
      await chrome.storage.local.set({ [key]: toggle.checked });
    } catch (reason) {
      console.error("Could not save companion setting:", reason);
      toggle.checked = !toggle.checked;
      error.textContent = "Could not save the setting. Please try again.";
      error.hidden = false;
    } finally {
      toggle.disabled = false;
    }
  });
}