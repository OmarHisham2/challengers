const HttpError = require("../models/http-error");
const Player = require("../models/player");

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getPlayers = async (req, res, next) => {
  let players;
  try {
    players = await Player.find();
  } catch (e) {
    const error = new HttpError("Could not Fetch PlayersDirectory!", 500);
    return next(error);
  }
  res.json(players.map((player) => player.toObject({ getters: true })));
};

const getPlayerById = async (req, res, next) => {
  let player;
  const { playerId } = req.params;
  try {
    player = await Player.findById(playerId);
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
  if (!player) {
    const error = new HttpError("Could not find player-info with specified ID", 404);
    return next(error);
  }
  res.json(player);
};

exports.getPlayers = getPlayers;
exports.getPlayerById = getPlayerById;
