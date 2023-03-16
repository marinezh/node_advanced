"use strict";

(function () {
  let inputField;
  let messagearea;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    inputField = document.getElementById("computerid");
    messagearea = document.getElementById("messagearea");

    document.getElementById("submit").addEventListener("click", send);
  }

  async function send() {
    clearMessage();
    const id = inputField.value;
    try {
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),

      };
      const data = await fetch(`/remove`, options);
       const status = await data.json();
      );
      

      if (status.message) {
        updateMessage(status.message, status.type);
      }
    } catch (err) {
      updateMessage(error.message, "error");
    }
  }

  function updateMessage(message, type) {
    messagearea.textContent = message;
    messagearea.setAttribute("class", type);
  }

  function clearMessage(message, type) {
    messagearea.textContent = "";
    messagearea.removeAttribute("class");
  }
})();
