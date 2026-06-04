const express = require("express");

const userController = require("../controllers/user-controller");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/",authenticate, userController.getUsers);

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

// router.get(
//   "/",
//   authenticate,
//   authorizeRoles("admin"),
//   userController.getAllUsers,
// );
// router.get(
//   "/judges",
//   authenticate,
//   authorizeRoles("admin"),
//   userController.getJudges,
// );
// router.get(
//   "/players",
//   authenticate,
//   authorizeRoles("admin"),
//   userController.getPlayers,
// );

module.exports = router;
