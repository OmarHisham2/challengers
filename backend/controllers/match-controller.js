const HttpError = require("../models/http-error");
const Match = require("../models/match");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const createMatch = async (req, res, next) => {};

const getMatches = async (req, res, next) => {
  let matches;
  try {
    matches = await Match.find({}, "-__v");
  } catch (e) {
    const error = new HttpError("Could not fetch matches!", 500);
    return next(error);
  }
  res.json(matches.map((match) => match.toObject({ getters: true })));
};

const getMatchById = async (req, res, next) => {
  let match;
  const { matchId } = req.params;
  try {
    match = await Match.findById(matchId);
  } catch (e) {
    const error = new HttpError("Couldnt Fetch Match List", 500);
    return next(error);
  }
  if (!match) {
    return next(new HttpError("Couldnt find match with specified ID.", 404));
  }
  res.status(200).json({ match: match.toObject({ getters: true }) });
};

const getMatchesByPlayerId = async (req, res, next) => {
  let matches;
  const { playerId } = req.params;
  try {
    matches = await Match.find({
      $or: [{ player1_id: playerId }, { player2_id: playerId }],
    });
  } catch (err) {
    return next(new HttpError("Could not fetch matches for this player.", 500));
  }
  if (!matches || matches.length === 0) {
    return next(new HttpError("This player does not have any matches.", 404));
  }
  res.status(200).json({
    matches: matches.map((match) => match.toObject({ getters: true })),
  });
};
const getMatchesByJudgeId = async (req, res, next) => {
  let matches;
  const { judgeId } = req.params;
  try {
    matches = await Match.find({ judge_id: judgeId });
  } catch (err) {
    return next(new HttpError("Could not fetch matches for this judge.", 500));
  }
  if (!matches || matches.length === 0) {
    return next(new HttpError("This judge does not have any matches.", 404));
  }
  res.status(200).json({
    matches: matches.map((match) => match.toObject({ getters: true })),
  });
};
const getMatchesByTournamentId = async (req, res, next) => {
  let matches;
  const { tournamentId } = req.params;
  try {
    matches = await Match.find({ tournament_id: tournamentId });
  } catch (err) {
    return next(
      new HttpError("Could not fetch matches for this tournament.", 500),
    );
  }
  if (!matches || matches.length === 0) {
    return next(
      new HttpError("This tournament does not have any matches.", 404),
    );
  }
  res.status(200).json({
    matches: matches.map((match) => match.toObject({ getters: true })),
  });
};
const updateMatchScore = async (req, res, next) => {};
const updateMatchStatus = async (req, res, next) => {};
const assignJudgeToMatch = async (req, res, next) => {};

exports.getMatches = getMatches;
exports.getMatchById = getMatchById;
exports.getMatchesByPlayerId = getMatchesByPlayerId;
exports.getMatchesByJudgeId = getMatchesByJudgeId;
exports.getMatchesByTournamentId = getMatchesByTournamentId;
exports.updateMatchScore = updateMatchScore;
exports.updateMatchStatus = updateMatchStatus;
exports.assignJudgeToMatch = assignJudgeToMatch;
exports.createMatch = createMatch;
