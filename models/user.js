const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["judge", "player", "admin"], required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
