const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const Vysledek = require("../../models/vysledek");

const adam = express.Router();

adam.use(cors());

/**
 * @swagger
 * /adam/ulozit:
 *  post:
 *    description: Uloží výsledek do databáze
 *    parameters:
 *    - name: jmeno
 *      description: Jméno hráče
 *      in: body
 *      required: true
 *      type: string
 *    - name: prijimeni
 *      description: Příjmení hráče
 *      in: body
 *      required: true
 *      type: string
 *    - name: body
 *      description: Body hráče
 *      in: body
 *      required: true
 *      type: number
 */
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

/**
 * @swagger
 * /adam/vysledek:
 * get:
 *  description: Vrátí výsledky
 */
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
