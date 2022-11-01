const mongoose = require("mongoose");

const odpovedSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  team_id: String,
  stanoviste: String,
  otazka: {
    required: Boolean,
    spravne: Boolean,
  },
});

module.exports = mongoose.model("Odpoved", odpovedSchema, "odpovedi");
