const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  rank: { type: Number },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  status: { type: String },
  nationality:{type:String,required: true},

});

module.exports = mongoose.model("Player", playerSchema);
