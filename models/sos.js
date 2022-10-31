const mongoose = require("mongoose");

const odpovedSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  stanoviste: String,
  cas: Number,
});

module.exports = mongoose.model("Odpoved", odpovedSchema, "odpovedi");
