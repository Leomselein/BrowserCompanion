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

cursor.setEnabled(false);
corner.setClickable(false);
corner.setChatEnabled(false);

let settingChanged = false;

function setCornerEnabled(value) {
  corner.setEnabled(value);
  if (value) {
    if (!host.isConnected) document.documentElement.append(host);
  } else {
    host.remove();
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.cornerEnabled) {
    settingChanged = true;
    setCornerEnabled(changes.cornerEnabled.newValue !== false);
  }
});

chrome.storage.local
  .get({ cornerEnabled: true })
  .then((settings) => {
    if (!settingChanged) {
      setCornerEnabled(settings.cornerEnabled === true);
    }
  })
  .catch((reason) => {
    console.error("Could not load companion setting:", reason);
  });
