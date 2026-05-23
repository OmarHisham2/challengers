const HttpError = require("../models/http-error");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

const getJudges = async (req, res, next) => {
  let judges;
  try {
    judges = await User.find({ role: "judge" }, "-password");
  } catch (e) {
    const error = new HttpError("Couldnt Fetch Judges!", 500);
    return next(error);
  }
  res.json(judges.map((judge) => judge.toObject({ getters: true })));
};

exports.getJudges = getJudges;
