function updateMessage(message, type) {
  messagearea.textContent = message;
  messagearea.setAttribute("class", type);
}

function clearMessage() {
  messagearea.textContent = "";
  messagearea.removeAttribute("class");
}

export { updateMessage, clearMessage };
