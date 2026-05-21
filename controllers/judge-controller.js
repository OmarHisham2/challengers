const HttpError = require("../models/http-error");
const User = require("../models/user");
const Player = require("../models/player");
const Judge = require("../models/judge");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const getJudges = async (req, res, next) => {
  let users;
  try {
    users = await User.find({ role: "judge" }, "-password");
  } catch (e) {
    const error = new HttpError("Couldnt Fetch Judges!", 500);
    return next(error);
  }
  res.json(users.map((user) => user.toObject({ getters: true })));
};

exports.getJudges = getJudges;
