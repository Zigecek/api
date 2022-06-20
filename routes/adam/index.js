const express = require("express");

const adam = express.Router();

adam.post("/ulozit", (req, res, next) => {
  console.log(req);
  res.sendStatus(200);
});

adam.get("/vysledky", (req, res, next) => {
  console.log(req);
  res.sendStatus(200);
});

module.exports = adam;
