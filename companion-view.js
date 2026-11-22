function createCompanionView() {
  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "closed" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = chrome.runtime.getURL("companion.css");
  stylesheet.addEventListener("error", () => {
    console.error("Could not load companion styles.");
  });

  const image = document.createElement("img");
  image.className = "cursor-companion";
  image.src = chrome.runtime.getURL("logo.png");
  image.alt = "";
  image.hidden = true;

  const cornerImage = document.createElement("img");
  cornerImage.className = "corner-companion";
  cornerImage.src = chrome.runtime.getURL("logo.png");
  cornerImage.alt = "";
  cornerImage.draggable = false;
  cornerImage.hidden = true;

  const quoteElement = document.createElement("div");
  quoteElement.className = "quote";
  quoteElement.setAttribute("role", "status");
  quoteElement.hidden = true;

  const chatContainer = document.createElement("div");
  chatContainer.className = "chat";
  chatContainer.hidden = true;

  const chatMessages = document.createElement("div");
  chatMessages.className = "chat-messages";
  const chatInput = document.createElement("input");
  chatInput.className = "chat-input";
  chatInput.type = "text";
  chatInput.placeholder = "Type a message...";
  chatInput.setAttribute("aria-label", "Chat message");
  chatContainer.append(chatMessages, chatInput);
  shadow.append(stylesheet, image, cornerImage, quoteElement, chatContainer);

  return { host, image, cornerImage, quoteElement, chatContainer, chatMessages, chatInput };
}
