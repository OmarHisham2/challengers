const HttpError = require("../models/http-error");
const User = require("../models/user");
const Player = require("../models/player");
const Judge = require("../models/judge");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (e) {
    const error = new HttpError("Couldnt Fetch Users!", 500);
    return next(error);
  }
  res.json(users.map((user) => user.toObject({ getters: true })));
};
const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.find({ id: 41 }, "-password");
  } catch (e) {
    const error = new HttpError(e.message, 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("Couldnt find user with specified ID", 404);
    return next(error);
  }
  res.json(user);
};
const signUp = async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;

  try {
    if (!name || !email || !password || !phone || !role) {
      const error = new HttpError("All fields are required!", 400);
      return next(error);
    }
    if (!["player", "judge"].includes(role)) {
      const error = new HttpError("Invalid role", 400);
      return next(error);
    }

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      const error = new HttpError("Email is already registered!", 409);
      return next(error);
    }

    const hashed_password = await bcrypt.hash(password, 11);

    const newUser = await User.create({
      name,
      email,
      password: hashed_password,
      phone,
      role,
    });

    if (role == "player") {
      await Player.create({ user_id: newUser._id });
    } else if (role == "judge") {
      await Judge.create({ user_id: newUser._id });
    }

    res.status(201).json({ newUser });
  } catch (e) {
    const error = new HttpError(`Could not create user.${e.message}`, 501);
    return next(error);
  }
};
const signIn = async () => {};

exports.getUsers = getUsers;
exports.getUser = getUser;
exports.signUp = signUp;
exports.signIn = signIn;
