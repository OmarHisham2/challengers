const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const judgeSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  license_number: { type: String },
  bio: { type: String },
});

module.exports = mongoose.model("Judge", judgeSchema);
