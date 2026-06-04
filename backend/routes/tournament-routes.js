const express = require("express");

const tournamentController = require("../controllers/tournament-controller");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const router = express.Router();


router.get(
    "/",
    tournamentController.getTournaments,
);

router.post(
    "/create",
    authenticate,
    authorizeRoles('admin'),
    tournamentController.createTournament,
);

module.exports = router;
