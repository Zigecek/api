const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const Vysledek = require("../../models/vysledek");

const adam = express.Router();

const corsOrigins = ["https://soutez.kozohorsky.xyz", "http://localhost:5500"];

adam.use(cors());

adam.post("/ulozit", (req, res, next) => {
  const { jmeno, prijmeni, body } = req.body;
  console.log(req.body);

  if (!(jmeno && prijmeni && body)) {
    return res.status(406).send({ message: "Body not acteptable." });
  }

  if (typeof body == String) {
    body = Number(body);
  }

  const vysledek = new Vysledek({
    _id: mongoose.Types.ObjectId(),
    jmeno,
    prijmeni,
    body,
  });
  vysledek.save();
  res.status(200).send(vysledek);
});

adam.get("/vysledky", async (req, res, next) => {
  let vysledky = await Vysledek.find({});
  vysledky.sort(function (a, b) {
    if (a.body > b.body) return -1;
    if (a.body < b.body) return 1;
    return 0;
  });
  console.log(vysledky);
  res.status(200).send(vysledky);
});

module.exports = adam;
