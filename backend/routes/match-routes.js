const express = require("express");
const router = express.Router();

const matchController = require("../controllers/match-controller");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.get("/:id", authenticate, matchController.getMatchById);
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  matchController.createMatch,
);
router.patch(
  "/:id/score",
  authenticate,
  authorizeRoles("judge"),
  matchController.updateMatchScore,
);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  matchController.updateMatchStatus,
);
router.patch(
  "/:id/judge",
  authenticate,
  authorizeRoles("admin"),
  matchController.assignJudge,
);

module.exports = router;
