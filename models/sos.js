const mongoose = require("mongoose");

const sosSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  stanoviste: String,
  cas: Number,
});

module.exports = mongoose.model("Sos", sosSchema, "soska");
