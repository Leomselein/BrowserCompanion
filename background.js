chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "getQuote") return;

  // Workshop: fetch a quote, validate the response, and reply asynchronously.
  fetch("https://dummyjson.com/quotes/random", { credentials: "omit" })
    .then((response) => {
      sendResponse({
        error: "Quote requests are a workshop exercise, not implemented yet.",
      });
    })
    .catch((error) => {
      sendResponse({
        error: "Quote requests are a workshop exercise, not implemented yet.",
      });
    });
});
