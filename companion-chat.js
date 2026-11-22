function createCompanionChat(container, messages, input) {
  let requestId = 0;

  function appendMessage(text, className) {
    const message = document.createElement("div");
    message.textContent = text;
    message.className = className;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }

  input.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter" || event.isComposing || !input.value.trim() || input.disabled) return;
    event.preventDefault();
    const userMessage = input.value;
    input.value = "";
    input.disabled = true;
    const request = ++requestId;
    appendMessage("You: " + userMessage, "chat-message");
    try {
      const response = await chrome.runtime.sendMessage({ type: "getQuote" });
      if (!response || typeof response.content !== "string") {
        throw new Error(response?.error || "Invalid response");
      }
      if (request === requestId) {
        appendMessage("Companion: " + response.content, "chat-message companion");
        console.log(response.content);
      }
    } catch (error) {
      console.error("Could not get response:", error);
      if (request === requestId) {
        appendMessage("Error: Could not load response.", "chat-message error");
      }
    } finally {
      if (request === requestId) {
        input.disabled = false;
      }
    }
  });

  function open() {
    container.hidden = false;
    input.focus();
  }

  function close(clear = false) {
    requestId++;
    container.hidden = true;
    input.disabled = false;
    if (clear) {
      messages.textContent = "";
      input.value = "";
    }
  }

  return { open, close };
}
