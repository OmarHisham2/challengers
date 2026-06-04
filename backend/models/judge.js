const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const judgeSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  name: {type:String, required:true},
  license_number: { type: String },
  bio: { type: String },
});

module.exports = mongoose.model("Judge", judgeSchema);
