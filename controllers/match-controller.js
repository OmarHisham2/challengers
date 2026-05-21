const HttpError = require("../models/http-error");
const Match = require("../models/match");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const getMatches = async (req, res, next) => {
  let matches;
  try {
    matches = await Match.find({}, "-password");
  } catch (e) {
    const error = new HttpError("Couldnt Fetch Matches!", 500);
    return next(error);
  }
  res.json(matches.map((match) => match.toObject({ getters: true })));
};

exports.getMatches = getMatches;
