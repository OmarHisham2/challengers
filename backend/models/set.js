const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const setSchema = new Schema({
    match_id: { type: mongoose.Types.ObjectId, required: true, ref: "Match" },
    set_number: { type: Number, required: true },
    player1_games: { type: Number, default: 0 },
    player2_games: { type: Number, default: 0 },
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    winner_id: { type: mongoose.Types.ObjectId, ref: "Player" },
    tiebreak: { type: Boolean, default: false },
    tiebreak_score: { type: String }, // e.g "7-5"
}, { timestamps: true });

module.exports = mongoose.model("Set", setSchema);