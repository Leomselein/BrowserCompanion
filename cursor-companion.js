function createCursorCompanion(image) {
  let enabled = false;

  function move(event) {
    image.style.left = `${event.clientX + 16}px`;
    image.style.top = `${event.clientY + 16}px`;
    image.hidden = false;
  }

  function hide() {
    image.hidden = true;
  }

  function setEnabled(value) {
    if (enabled === value) return;
    enabled = value;
    if (enabled) {
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseleave", hide);
    } else {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      hide();
    }
  }

  return { setEnabled };
}
