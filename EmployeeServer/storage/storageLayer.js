"use strict";

const path = require("path");

const { key, adapterFile, storageFile } = require("./storageConfig.json");
// const { key, adapterFile, storageFile } = require("./bookStorageConfig.json") // for bookstesting

const { readStorage, writeStorage } = require("./readerWriter");

const storageFilePath = path.join(__dirname, storageFile); // this is the path to json file with employees

const { adapt } = require(path.join(__dirname, adapterFile));

console.log("storageFilePath...", storageFilePath);

async function getAllFromStorage() {
  return readStorage(storageFilePath);
}

async function getFromStorage(id) {
  return (
    (await readStorage(storageFilePath)).find((item) => item[key] == id) || null
  );
}

async function addToStorage(newObject) {
  const storageData = await readStorage(storageFilePath);
  storageData.push(adapt(newObject));
  return await writeStorage(storageFilePath, storageData);
}

async function updateStorage(modifiedObject) {
  const storageData = await readStorage(storageFilePath);
  const oldObject = storageData.find(
    (item) => item[key] == modifiedObject[key]
  );
  if (oldObject) {
    Object.assign(oldObject, adapt(modifiedObject));
    return await writeStorage(storageFilePath, storageData);
  }
  return false;
}

async function removeFromStorage(id) {
  const storageData = await readStorage(storageFilePath);
  const i = storageData.findIndex((item) => item[key] == id);
  if (i < 0) return false;
  storageData.splice(i, 1);
  return await writeStorage(storageFilePath, storageData);
}

module.exports = {
  getAllFromStorage,
  getFromStorage,
  addToStorage,
  removeFromStorage,
  updateStorage,
};

//tests
// getAllFromStorage().then(console.log).catch(console.log)
// getFromStorage(2).then(console.log).catch(console.log)
// getFromStorage(100).then(console.log).catch(console.log)

// addToStorage({
//     "id": '500',
//     "firstname": "fff",
//     "lastname": "ggg",
//     "department": "hhh",
//     "salary": "555"
// }).then(console.log).catch(console.log)

// addToStorage({
//     "id": '100',
//     "firstname": "fff",
//     "lastname": "ggg",
//     "department": "hhh",
//     "salary": "5557"
// }).then(console.log).catch(console.log)

// removeFromStorage(100).then(console.log).catch(console.log)
