const host = document.createElement("div");
const shadow = host.attachShadow({ mode: "closed" });
const image = document.createElement("img");
image.src = chrome.runtime.getURL("logo.png");
image.alt = "";
image.style.cssText = "position: fixed; width: 64px; height: 64px; left: 0; top: 0; pointer-events: none; display: none; z-index: 2147483647;";
const cornerImage = document.createElement("img");
cornerImage.src = chrome.runtime.getURL("logo.png");
cornerImage.alt = "";
cornerImage.draggable = false;
cornerImage.style.cssText = "position: fixed; width: 64px; height: 64px; right: 16px; bottom: 16px; pointer-events: none; display: none; z-index: 2147483647;";
const quoteElement = document.createElement("div");
quoteElement.setAttribute("role", "status");
quoteElement.style.cssText = "position: fixed; right: 16px; bottom: 88px; max-width: min(320px, calc(100vw - 32px)); max-height: 40vh; overflow-y: auto; box-sizing: border-box; padding: 12px; border-radius: 8px; background: white; color: #17213a; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25); font: 14px/1.4 Arial, sans-serif; overflow-wrap: anywhere; pointer-events: auto; display: none;";
const chatContainer = document.createElement("div");
chatContainer.style.cssText = "position: fixed; right: 16px; bottom: 88px; width: min(320px, calc(100vw - 32px)); max-height: 40vh; box-sizing: border-box; display: none; flex-direction: column; border-radius: 8px; background: white; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25); font: 14px/1.4 Arial, sans-serif; pointer-events: auto; z-index: 2147483647;";
const chatMessages = document.createElement("div");
chatMessages.style.cssText = "flex: 1; overflow-y: auto; padding: 12px; border-bottom: 1px solid #e0e0e0;";
const chatInput = document.createElement("input");
chatInput.type = "text";
chatInput.placeholder = "Type a message...";
chatInput.setAttribute("aria-label", "Chat message");
chatInput.style.cssText = "border: none; padding: 12px; font: 14px/1.4 Arial, sans-serif; outline: none;";
chatContainer.append(chatMessages, chatInput);
host.style.cssText = "position: fixed; inset: 0; pointer-events: none; z-index: 2147483647;";
shadow.append(image, cornerImage, quoteElement, chatContainer);

let enabled = false;
let cornerEnabled = false;
let chatEnabled = false;
let quoteRequest = 0;
const changedSettings = new Set();

chatInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter" || event.isComposing || !chatInput.value.trim() || chatInput.disabled) return;
  event.preventDefault();
  const userMessage = chatInput.value;
  chatInput.value = "";
  chatInput.disabled = true;
  const request = ++quoteRequest;
  const messageDiv = document.createElement("div");
  messageDiv.textContent = "You: " + userMessage;
  messageDiv.style.cssText = "margin-bottom: 8px; color: #17213a;";
  chatMessages.append(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  try {
    const response = await chrome.runtime.sendMessage({ type: "getQuote" });
    if (!response || typeof response.content !== "string") {
      throw new Error(response?.error || "Invalid response");
    }
    if (request === quoteRequest && chatEnabled) {
      const aiDiv = document.createElement("div");
      aiDiv.textContent = "Companion: " + response.content;
      aiDiv.style.cssText = "margin-bottom: 8px; color: #1747ff;";
      chatMessages.append(aiDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      console.log(response.content);
    }
  } catch (error) {
    console.error("Could not get response:", error);
    if (request === quoteRequest && chatEnabled) {
      const errorDiv = document.createElement("div");
      errorDiv.textContent = "Error: Could not load response.";
      errorDiv.style.cssText = "margin-bottom: 8px; color: #b42318;";
      chatMessages.append(errorDiv);
    }
  } finally {
    if (request === quoteRequest) {
      chatInput.disabled = false;
    }
  }
});

cornerImage.addEventListener("click", async (event) => {
  event.stopPropagation();
  if (chatEnabled) {
    quoteElement.style.display = "none";
    chatContainer.style.display = "flex";
    chatInput.focus();
    return;
  }
  const request = ++quoteRequest;
  quoteElement.textContent = "Loading quote...";
  quoteElement.style.display = "block";
  try {
    const response = await chrome.runtime.sendMessage({ type: "getQuote" });
    if (!response || typeof response.content !== "string") {
      throw new Error(response?.error || "Invalid quote response");
    }
    console.log(response.content);
    if (request === quoteRequest && cornerEnabled) {
      quoteElement.textContent = response.content;
    }
  } catch (error) {
    console.error("Could not load quote:", error);
    if (request === quoteRequest && cornerEnabled) {
      quoteElement.textContent = "Could not load a quote. Please try again.";
    }
  }
});

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
  if (!value) {
    quoteRequest++;
    quoteElement.style.display = "none";
    quoteElement.textContent = "";
    chatContainer.style.display = "none";
    chatInput.disabled = false;
  }
  updateHost();
}

function setCornerClickable(value) {
  cornerImage.style.pointerEvents = value ? "auto" : "none";
  cornerImage.style.cursor = value ? "pointer" : "";
}

function setChatEnabled(value) {
  chatEnabled = value;
  quoteRequest++;
  quoteElement.style.display = "none";
  chatContainer.style.display = "none";
  chatInput.disabled = false;
  if (!value) {
    chatMessages.textContent = "";
    chatInput.value = "";
  }
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
  if (changes.cornerClickable) {
    changedSettings.add("cornerClickable");
    setCornerClickable(changes.cornerClickable.newValue === true);
  }
  if (changes.chatEnabled) {
    changedSettings.add("chatEnabled");
    setChatEnabled(changes.chatEnabled.newValue === true);
  }
});

chrome.storage.local.get(["enabled", "cornerEnabled", "cornerClickable", "chatEnabled"]).then((settings) => {
  if (!changedSettings.has("enabled")) {
    setEnabled(settings.enabled === true);
  }
  if (!changedSettings.has("cornerEnabled")) {
    setCornerEnabled(settings.cornerEnabled === true);
  }
  if (!changedSettings.has("cornerClickable")) {
    setCornerClickable(settings.cornerClickable === true);
  }
  if (!changedSettings.has("chatEnabled")) {
    setChatEnabled(settings.chatEnabled === true);
  }
}).catch((reason) => {
  console.error("Could not load companion setting:", reason);
});
