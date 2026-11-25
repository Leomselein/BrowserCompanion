function createCornerCompanion(image, quoteElement, chat) {
  function setEnabled(value) {
    image.hidden = !value;
  }

  function setClickable(value) {
    // Workshop: enable pointer events and handle clicks to request a quote.
  }

  function setChatEnabled(value) {
    // Workshop: open chat instead of quoteElement when chat mode is enabled.
  }

  return { setEnabled, setClickable, setChatEnabled };
}
