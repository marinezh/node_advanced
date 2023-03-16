"use strict";

const express = require("express");
const app = express();

const path = require("path");
const fetch = require("node-fetch");

const { port, host } = require("./config.json");
app.set("view engine", "ejs");
app.set("view", path.join(__dirname, "pages"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.get("/.", (req, res) =>
  res.render("menu", { title: "Menu", header: "Menu" })
);

app.get("/all", (req, res) =>
  fetch("http://127.0.0.1:4000/api/computers", { mode: "cors" })
    .then((data) => data.json())
    .then((result) =>
      res.render("allPage", {
        title: "Computers",
        header: "All computers",
        data: result,
      })
    )
    .catch((err) => res.end())
); // will be changed

app.listen(port, host, () => {
  console.log(`Server ${host}:${port} is listening`);
});
