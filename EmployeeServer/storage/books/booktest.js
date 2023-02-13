"use strict";

const {
    getAllFromStorage,
    getFromStorage,
    addToStorage,
    updateStorage,
    removeFromStorage,
} = require("./storageLayer.js");

getAllFromStorage().then(console.log).catch(console.log);

// getFromStorage(2).then(console.log).catch(console.log);

addToStorage({ number: 3, title: "abcd" }).then(console.log).catch(console.log);

/* updateStorage({ number: 3, title: "abcde" })
  .then(console.log)
  .catch(console.log);
 */

// removeFromStorage(3).then(console.log).catch(console.log);