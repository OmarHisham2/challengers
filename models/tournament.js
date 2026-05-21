const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  status: { type: String, required: true },
  format: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
});

module.exports = mongoose.model("Tournament", tournamentSchema);
