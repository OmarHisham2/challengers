export const Match = {
  score: String,
  status: String,
  round: Number,
  scheduled_at: Date,
};

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const matchSchema = new Schema({
  player1_id: { type: mongoose.Types.ObjectId, required: true, ref: "Player" },
  player2_id: { type: mongoose.Types.ObjectId, required: true, ref: "Player" },
  judge_id: { type: mongoose.Types.ObjectId, required: true, ref: "Judge" },
  tournament_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Tournament",
  },
  winner_id: { type: mongoose.Types.ObjectId, ref: "Player" },
  score: { type: String },
  status: { type: String, required: true },
  round: { type: Number },
  scheduled_at: { type: Date, required: true },
});

module.exports = mongoose.model("Match", matchSchema);
