chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "getQuote") return;

  fetch("https://dummyjson.com/quotes/random", { credentials: "omit" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Quote API returned HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((quote) => {
      if (typeof quote.quote !== "string") {
        throw new Error("Quote API response is missing quote text");
      }
      sendResponse({ content: quote.quote });
    })
    .catch((error) => {
      console.error("Could not fetch quote:", error);
      sendResponse({ error: "Could not load a quote. Please try again." });
    });

  return true;
});
