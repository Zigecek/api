const mongoose = require("mongoose");

const vysledekSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  jmeno: String,
  prijmeni: String,
  body: Number
});

module.exports = mongoose.model("Vysledek", vysledekSchema, "vysledky");
