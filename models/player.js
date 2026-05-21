const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  rank: { type: Number },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  status: { type: String },
});

module.exports = mongoose.model("Player", playerSchema);
