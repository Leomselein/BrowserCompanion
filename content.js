const {
  host,
  image,
  cornerImage,
  quoteElement,
  chatContainer,
  chatMessages,
  chatInput,
} = createCompanionView();
const cursor = createCursorCompanion(image);
const chat = createCompanionChat(chatContainer, chatMessages, chatInput);
const corner = createCornerCompanion(cornerImage, quoteElement, chat);

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

const settingHandlers = {
  enabled(value) {
    enabled = value;
    cursor.setEnabled(value);
    updateHost();
  },
  cornerEnabled(value) {
    cornerEnabled = value;
    corner.setEnabled(value);
    updateHost();
  },
  cornerClickable: corner.setClickable,
  chatEnabled: corner.setChatEnabled,
};

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  for (const [key, handler] of Object.entries(settingHandlers)) {
    if (changes[key]) {
      changedSettings.add(key);
      handler(changes[key].newValue === true);
    }
  }
});

browser.storage.local
  .get(Object.keys(settingHandlers))
  .then((settings) => {
    for (const [key, handler] of Object.entries(settingHandlers)) {
      if (!changedSettings.has(key)) {
        handler(settings[key] === true);
      }
    }
  })
  .catch((reason) => {
    console.error("Could not load companion setting:", reason);
  });
