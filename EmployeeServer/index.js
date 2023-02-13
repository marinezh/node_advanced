"use strict";

const path = require("path");

const express = require("express");
const app = express();

const { port, host, storage } = require("./serverConfig.json");

const Datastorage = require(path.join(
  __dirname,
  storage.storageFolder,
  storage.dataLayer
));

const dataStorage = new Datastorage();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages")); // connect folder pages with ejs files

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // connect folder public with scc file

// home page
const menuPath = path.join(__dirname, "menu.html"); // connect home page

app.get("/", (req, res) => res.sendFile(menuPath));

// Getting All Employees
app.get("/all", (req, res) =>
  dataStorage
    .getAll()
    .then((data) => res.render("allPersons", { result: data }))
);

// Getting one person by ID
app.get("/getPerson", (req, res) =>
  res.render("getPerson", {
    title: "Get",
    header1: "Get",
    action: "/getPerson",
  })
);

app.post("/getPerson", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  const personId = req.body.id; // becaose in getPerson we have name=id
  dataStorage
    .getOne(personId)
    .then((employee) => res.render("personPage", { result: employee }))
    .catch((error) => sendErrorPage(res, error));
});

// Adding the new person to the Database
app.get("/inputform", (req, res) => {
  res.render("form", {
    title: "Add person",
    header1: "Add a new Person",
    action: "/input",
    id: { value: "", readonly: "" },
    firstname: { value: "", readonly: "" },
    lastname: { value: "", readonly: "" },
    department: { value: "", readonly: "" },
    salary: { value: "", readonly: "" },
  });
});

app.post("/input", (req, res) => {
  if (!req.body) return res.statusCode(500);

  dataStorage
    .insert(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

// Updating the form
app.get("/updateform", (req, res) =>
  res.render("form", {
    title: "Update person",
    header1: "Update Person data",
    action: "/updatedata1",
    id: { value: "", readonly: "" },
    firstname: { value: "", readonly: "readonly" },
    lastname: { value: "", readonly: "readonly" },
    department: { value: "", readonly: "readonly" },
    salary: { value: "", readonly: "readonly" },
  })
);

app.post("/updatedata1", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  dataStorage
    .getOne(req.body.id)
    .then((employee) =>
      res.render("form", {
        title: "Update person",
        header1: "Update Person data",
        action: "/update1",
        id: { value: employee.id, readonly: "readonly" },
        firstname: { value: employee.firstname, readonly: "" },
        lastname: { value: employee.lastname, readonly: "" },
        department: { value: employee.department, readonly: "" },
        salary: { value: employee.salary, readonly: "" },
      })
    )
    .catch((error) => sendErrorPage(res, error));
});

app.post("/update1", (req, res) => {
  if (!req.body) return res.statusCode(500);
  dataStorage
    .update(req.body)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

// removing Person
app.get("/removePerson", (req, res) =>
  res.render("getPerson", {
    title: "Remove",
    header1: "remove person",
    action: "/removePerson",
  })
);

app.post("/removePerson", (req, res) => {
  if (!req.body) return res.sendStatus(500);

  const personId = req.body.id; // becaose in getPerson we have name=id
  dataStorage
    .remove(personId)
    .then((status) => sendStatusPage(res, status)) // check
    .catch((error) => sendErrorPage(res, error));
});

app.listen(port, host, () =>
  console.log(`Server ${host}:${port} listening...`)
);

// helper functions

function sendErrorPage(res, error, title = "Error", header1 = "Error") {
  sendStatusPage(res, error, title, header1);
}

function sendStatusPage(res, status, title = "Status", header1 = "Status") {
  return res.render("statusPage", { title, header1, status });
}
