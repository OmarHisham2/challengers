const express = require("express");

const playerController = require("../controllers/player-controller");

const router = express.Router();

router.get("/", playerController.getPlayers);
router.get("/:playerId", playerController.getPlayerById);

module.exports = router;
