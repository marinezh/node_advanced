"use strict";
(function () {
  let resultarea;
  let messagearea;
  let computerId;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    resultarea = document.getElementById("resultarea");
    computerId = document.getElementById("computerid"); // check this
    messagearea = document.getElementById("messagearea");
    document.getElementById("submit").addEventListener("click", send);
  }

  async function send() {
    clearMessage();
    resultarea.innerHTML = "";

    try {
      const data = await fetch(
        `/getOne/${computerId.value}`,
       
      );
      const result = await data.json();
      console.log(result);
      if (result) {
        if (result.message) {
          updateMessage(result.message, result.type);
        } else {
          updateComputer(result);
        }
      }
    } catch (error) {
      console.log(error);
      updateMessage(`Not found. ${error.message}`, "error");
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

  function updateComputer(result) {
    if (result.length == 0) return;
    const computer = result[0];
    resultarea.innerHTML = `
        <p><span class="legend">Id</span>${computer.id}</p>
        <p><span class="legend">Id</span>${computer.name}</p>
        <p><span class="legend">Id</span>${computer.type}</p>
        <p><span class="legend">Id</span>${computer.processor}</p>
        <p><span class="legend">Id</span>${computer.amount}</p>
        `;
  }
})();
