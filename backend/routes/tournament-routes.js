const express = require("express");

const tournamentController = require("../controllers/tournament-controller");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.post(
    "/create",
    tournamentController.createTournament,
);

module.exports = router;
