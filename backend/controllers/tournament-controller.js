const HttpError = require("../models/http-error");
const Tournament = require("../models/tournament");
const User = require("../models/user");
const Player = require("../models/player");
const mongoose = require("mongoose");

const getTournaments = async (req, res, next) => {
  let tournaments;
  try {
    tournaments = await Tournament.find({}, "-__v");
  } catch (e) {
    return next(new HttpError("Could not fetch tournaments", 500));
  }
  res.json(
    tournaments.map((tournament) => tournament.toObject({ getters: true })),
  );
};
const getTournamentById = async (req, res, next) => {
    
    const {id} = req.params;

    let tournament;

    try {
        tournament = await Tournament.findById(id,"-__v")
    }

    catch(err) {
        return next(new HttpError("Could not fetch tournament", 500));
    }

    if(!tournament) {
        return next(new HttpError("Could not find tournament with this ID.", 404));
    }

    res.json(tournament.toObject({getters:true}))

};
const getTournamentPlayers = (req, res, next) => {};
const getTournamentMatches = (req, res, next) => {};
const createTournament = async (req, res, next) => {
    const {name, location, format, max_players, start_date, end_date, registration_deadline, description} = req.body

    if (!name || !location || !format || !max_players || !start_date || !end_date || !registration_deadline) {
        return next(new HttpError("Please fill the required fields.", 400));
    }

    if (!["round_robin", "single_elimination"].includes(format)) {
        // Safeguard -- Should never be reached.
        return next(new HttpError("Invalid format provided", 400));
    }

    const regDeadline = new Date(registration_deadline);
    const start = new Date(start_date);
    const end = new Date(end_date);

    // More safeguards -- Should never be reached as it will be verified by the frontend.
    if (regDeadline >= start) {
        return next(new HttpError("Registration deadline must be before start date", 400));
    }

    if (start >= end) {
        return next(new HttpError("Start date must be before end date", 400));
    }

    let tournament;

    try {
        tournament = await Tournament.create({
            name, location, format, max_players, registration_deadline: regDeadline, start_date: start, end_date: end,
            description: description || "",
            status: "draft",
            created_by: '65f1a2b3c4d5e6f7a8b9c0d1'
        })
    }
    catch (err)
    {
        return next(new HttpError("Could not create tournament", 500));
    }
    res.status(201).json(tournament.toObject({getters:true}))

};
const updateTournament = async (req, res, next) => {
    const {id} = req.params;
    let tournament;

    const updates = req.body

    try {
        tournament = await Tournament.findById(id)
    }
    catch (err)
    {
        return next(new HttpError("Could not update tournament", 500));
    }

    if(!tournament) {
        return next(new HttpError('Could not find a tournament with that ID.',404))
    }

    if(["active","completed"].includes(tournament.status))
    {
        return next(new HttpError("Tournament is active or completed, and therefore cannot be edited.", 400));
    }

    if(updates.format && !["round_robin", "single_elimination"].includes(updates.format)) // Safeguard -- Should not arrive here at all.
    {
        return next(new HttpError("Format must be round_robin or single_elimination.", 400));
    }

    if (updates.registration_deadline || updates.start_date || updates.end_date) {
        const regDeadline = updates.registration_deadline ? new Date(updates.registration_deadline) : tournament.registration_deadline;
        const start = updates.start_date ? new Date(updates.start_date) : tournament.start_date;
        const end = updates.end_date ? new Date(updates.end_date) : tournament.end_date;

        if (regDeadline >= start) {
            return next(new HttpError("Registration deadline must be before start date.", 400));
        }
        if (start >= end) {
            return next(new HttpError("Start date must be before end date.", 400));
        }

        if (updates.registration_deadline) updates.registration_deadline = regDeadline;
        if (updates.start_date) updates.start_date = start;
        if (updates.end_date) updates.end_date = end;
    }

    // TODO: There has to be a better way to handle this.
    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
            tournament[key] = updates[key];
        }
    });

    try {
        await tournament.save()
    }

    catch(err)
    {
        return next(new HttpError("Could not update tournament", 500));
    }

    res.json({tournament:tournament.toObject({getters:true})})

};
const deleteTournament = (req, res, next) => {};
const updateTournamentStatus = async (req, res, next) => {
    const {id} = req.params
    const {status} = req.body

    let tournament;

    try {
            tournament = await Tournament.findById(id)
    }
    catch(err)
    {
        return next(new HttpError("Could not find tournament", 500));
    }

    if(!tournament) {
        return next(new HttpError("Could not find a tournament with this ID.", 404));
    }

    if(!["draft","registration","active","completed"].includes(status))
    {
        // Safeguard -- Should not be reached.
        return next(new HttpError("Invalid status passed.", 400));
    }

    tournament.status = status;

    try {
        await tournament.save()
    }
    catch(err)
    {
        return next(new HttpError("Could not update tournament", 500));
    }

    res.status(200).json({tournament:tournament.toObject({getters:true})})

};
const registerPlayerToTournament = async (req, res, next) => {
    const {id} = req.params;
    const {playerId} = req.body;

    let tournament, player;

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        tournament = await Tournament.findById(id).session(session).exec()
        if (!tournament) {
            await session.abortTransaction()
            return next(new HttpError("Could not find a tournament with this ID.", 404));
        }

        player = await Player.findById(playerId).session(session).exec()
        if (!player) {
            await session.abortTransaction()
            return next(new HttpError("Could not find a player with this ID.", 404));
        }


        if (tournament.players.length >= tournament.max_players) {
            await session.abortTransaction()
            return next(new HttpError('Tournament has reached max capacity.', 409))
        }
        if (tournament.players.includes(player._id)) // Safeguard - Shouldn't be reached.
        {
            await session.abortTransaction()
            return next(new HttpError("Player is already in the tournament.", 409))
        }
        tournament.players.push(player);
        await tournament.save({session})
        await session.commitTransaction()
        res.status(200).json({tournament: tournament.toObject({getters: true})})
    }
    catch (err)
        {
            await session.abortTransaction()
            return next(new HttpError(`Could not add player to the tournament ${err.message}`, 500));
        }
    finally {
        await session.endSession()
    }
}

const removePlayerFromTournament = async (req, res, next) => {
    const {id} = req.params;
    const {playerId} = req.body;

    let tournament, player;

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        tournament = await Tournament.findById(id).session(session).exec()
        if (!tournament) {
            await session.abortTransaction()
            return next(new HttpError("Could not find a tournament with this ID.", 404));
        }

        player = await Player.findById(playerId).session(session).exec()
        if (!player) {
            await session.abortTransaction()
            return next(new HttpError("Could not find a player with this ID.", 404));
        }

        if (!tournament.players.includes(player._id))
        {
            await session.abortTransaction()
            return next(new HttpError("Player is not in the tournament.", 409))
        }
        tournament.players.pull(player._id);
        await tournament.save({session})
        await session.commitTransaction()
        res.status(200).json({tournament: tournament.toObject({getters: true})})
    }
    catch (err)
    {
        await session.abortTransaction()
        return next(new HttpError(`Could not remove player from tournament ${err.message}`, 500));
    }
    finally {
        await session.endSession()
    }
};

exports.getTournaments = getTournaments;
exports.getTournamentById = getTournamentById;
exports.getTournamentPlayers = getTournamentPlayers;
exports.getTournamentMatches = getTournamentMatches;

exports.createTournament = createTournament;
exports.updateTournament = updateTournament;
exports.deleteTournament = deleteTournament;
exports.updateTournamentStatus = updateTournamentStatus;
exports.registerPlayerToTournament = registerPlayerToTournament;
exports.removePlayerFromTournament = removePlayerFromTournament;
