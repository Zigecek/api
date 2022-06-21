const express = require("express");
const mongoose = require("mongoose");
const Vysledek = require("../../models/vysledek");

const adam = express.Router();

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
  console.log(vysledky);
  res.status(200).send(vysledky);
});

module.exports = adam;
