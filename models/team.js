const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  team_id: String,
  stanoviste: {
    aktualni: String,
    navstivene: [String],
  },
  cleni: [String],
  splneneUkoly: 0,
  vytvoren: Number,
  dokonceno: {
    limit: Boolean,
    cas: Number,
  }
});

module.exports = mongoose.model("Team", teamSchema, "teamy");
