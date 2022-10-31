const mongoose = require("mongoose");

const odpovedSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  team_id: String,
  otazka: {
    required: Boolean,
    right: Boolean,
  },
});

module.exports = mongoose.model("Odpoved", odpovedSchema, "odpovedi");
