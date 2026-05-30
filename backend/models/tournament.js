
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
  name: { type: String, required: true },
  created_by: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  description: { type: String},
  status: { type: String, required: true },
  format: { type: String, required: true },
  max_players:{type: Number, required: true},
  location: { type: String, required: true },
  registration_deadline:{type:Date,required:true},
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  players: {type: [{ type: mongoose.Types.ObjectId, ref: "Player" }]
}})


module.exports = mongoose.model("Tournament", tournamentSchema);
