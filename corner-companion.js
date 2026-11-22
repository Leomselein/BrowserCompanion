function createCornerCompanion(image, quoteElement, chat) {
  let enabled = false;
  let chatEnabled = false;
  let quoteRequest = 0;

  image.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (chatEnabled) {
      quoteElement.hidden = true;
      chat.open();
      return;
    }
    const request = ++quoteRequest;
    quoteElement.textContent = "Loading quote...";
    quoteElement.hidden = false;
    try {
      const response = await chrome.runtime.sendMessage({ type: "getQuote" });
      if (!response || typeof response.content !== "string") {
        throw new Error(response?.error || "Invalid quote response");
      }
      console.log(response.content);
      if (request === quoteRequest && enabled) {
        quoteElement.textContent = response.content;
      }
    } catch (error) {
      console.error("Could not load quote:", error);
      if (request === quoteRequest && enabled) {
        quoteElement.textContent = "Could not load a quote. Please try again.";
      }
    }
  });

  function setEnabled(value) {
    enabled = value;
    image.hidden = !value;
    if (!value) {
      quoteRequest++;
      quoteElement.hidden = true;
      quoteElement.textContent = "";
      chat.close();
    }
  }

  function setClickable(value) {
    image.classList.toggle("clickable", value);
  }

  function setChatEnabled(value) {
    chatEnabled = value;
    quoteRequest++;
    quoteElement.hidden = true;
    chat.close(!value);
  }

  return { setEnabled, setClickable, setChatEnabled };
}
