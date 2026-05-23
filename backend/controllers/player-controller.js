const HttpError = require("../models/http-error");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

const getPlayers = async (req, res, next) => {
  let players;
  try {
    players = await User.find({ role: "player" }, "-password");
  } catch (e) {
    const error = new HttpError("Couldnt Fetch Judges!", 500);
    return next(error);
  }
  res.json(players.map((player) => player.toObject({ getters: true })));
};

exports.getPlayers = getPlayers;
