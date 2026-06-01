const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const Tournament = require("../models/tournament");
const Match = require("../models/match");
const Judge = require("../models/judge");

const jwt = require("jsonwebtoken");

const createMatch = async (req, res, next) => {

  const { player1_id, player2_id, judge_id, tournament_id, scheduled_at, round } = req.body;

  if (!player1_id || !player2_id || !judge_id || !tournament_id || !scheduled_at || !round) {
    return next(new HttpError("All fields are required", 400));
  }

  if (player1_id === player2_id) {
    // Shouldn't be reached.
    return next(new HttpError("A player cannot play against themselves", 400));
  }

  let tournament;
  try {
    tournament = await Tournament.findById(tournament_id);
  } catch (e) {
    return next(new HttpError("Could not verify tournament", 500));
  }
  if (!tournament) {
    return next(new HttpError("Tournament not found", 404));
  }

  if (tournament.status !== "active") {
    return next(new HttpError("Matches can only be created for active tournaments", 400));
  }

  if (
      !tournament.players.includes(player1_id) ||
      !tournament.players.includes(player2_id)
  ) {
    return next(new HttpError("Both players must be registered in the tournament", 400));
  }

  let match;
  try {
    match = await Match.create({
      player1_id,
      player2_id,
      judge_id,
      tournament_id,
      scheduled_at: new Date(scheduled_at),
      round,
      status: "scheduled",
    });
  } catch (e) {
    return next(new HttpError("Could not create match", 500));
  }

  res.status(201).json(match.toObject({ getters: true }));
};

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
const updateMatchStatus = async (req, res, next) => {
  const { matchId } = req.params;
  const { status } = req.body;

  const validStatuses = ["scheduled", "in_progress", "completed", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    return next(new HttpError("Invalid status value passed", 400));
  }

  let match;
  try {
    match = await Match.findById(matchId);
  } catch (e) {
    return next(new HttpError("Could not fetch match", 500));
  }

  if (!match) {
    return next(new HttpError("Match not found", 404));
  }

  const validTransitions = {
    scheduled: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  if (!validTransitions[match.status].includes(status)) {
    return next(
        new HttpError(`Cannot transition from ${match.status} to ${status}`, 400)
    );
  }

  match.status = status;

  try {
    await match.save();
  } catch (e) {
    return next(new HttpError("Could not update match status", 500));
  }

  res.status(200).json(match.toObject({ getters: true }));
};

const assignJudgeToMatch = async (req, res, next) => {  const { matchId } = req.params;
  const { judge_id } = req.body;

  if (!judge_id) {
    return next(new HttpError("Judge ID is required", 400));
  }

  let judge;
  try {
    judge = await Judge.findById(judge_id);
  } catch (e) {
    return next(new HttpError("Invalid Judge ID Entered.", 500));
  }

  if (!judge) {
    return next(new HttpError("Judge not found", 404));
  }

  let match;
  try {
    match = await Match.findById(matchId);
  } catch (e) {
    return next(new HttpError("Could not fetch match", 500));
  }

  if (!match) {
    return next(new HttpError("Match not found", 404));
  }

  if (["completed", "cancelled"].includes(match.status)) {
    return next(new HttpError("Cannot reassign judge for completed or cancelled matches", 400));
  }

  match.judge_id = judge_id;

  try {
    await match.save();
  } catch (e) {
    return next(new HttpError("Could not assign judge to match", 500));
  }

  res.status(200).json(match.toObject({ getters: true }));
};

exports.getMatches = getMatches;
exports.getMatchById = getMatchById;
exports.getMatchesByPlayerId = getMatchesByPlayerId;
exports.getMatchesByJudgeId = getMatchesByJudgeId;
exports.getMatchesByTournamentId = getMatchesByTournamentId;
exports.updateMatchScore = updateMatchScore;
exports.updateMatchStatus = updateMatchStatus;
exports.assignJudgeToMatch = assignJudgeToMatch;
exports.createMatch = createMatch;
