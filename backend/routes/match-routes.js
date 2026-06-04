const express = require("express");
const router = express.Router();

const matchController = require("../controllers/match-controller");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.get("/", matchController.getMatches);
router.get("/:id", matchController.getMatchById);
router.get("/players/:playerId", matchController.getMatchesByPlayerId);
router.post(
  "/",
    authenticate,
  authorizeRoles('admin'),
  matchController.createMatch,
);
router.patch(
  "/:id/score",
    authenticate,
    authorizeRoles('admin'),
  matchController.updateMatchScore,
);
router.patch(
  "/:id/status",
    authenticate,
    authorizeRoles('admin'),
  matchController.updateMatchStatus,
);
// router.patch(
//   "/:id/judge",
//   matchController.assignJudge,
// );

module.exports = router;
