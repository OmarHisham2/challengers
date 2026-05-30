const HttpError = require("../models/http-error");
const User = require("../models/user");
const Player = require("../models/player");
const Judge = require("../models/judge");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (e) {
    const error = new HttpError("Couldn not Fetch Users!", 500);
    return next(error);
  }
  res.json(users.map((user) => user.toObject({ getters: true })));
};
const getUserById = async (req, res, next) => {
  let user;
  const { userId } = req.body;
  try {
    user = await User.findById({ id: userId }, "-password");
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
      await Player.create({ _id: newUser._id });
    } else if (role == "judge") {
      await Judge.create({ _id: newUser._id });
    }

    res.status(201).json({ newUser });
  } catch (e) {
    const error = new HttpError(`Could not create user.${e.message}`, 501);
    return next(error);
  }
};
const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new HttpError("All fields are required!", 400);
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    console.log("Couldn't search for user -- during LOGIN");
    const error = new HttpError(`An Error has occured: ${e.message}}`, 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid Credentials.", 401);
    return next(error);
  }

  let isValidPassword;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (e) {
    return next(
      new HttpError(
        "Could not sign in. Please try again. Dev: Invalid PW",
        500,
      ),
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid Credentials", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
  } catch (e) {
    return next(
      new HttpError(
        "Could not sign in, please try again -- Dev: Token Registation Failed",
        500,
      ),
    );
  }

  res.json({
    token,
    user: {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    },
  });
};

exports.getUsers = getAllUsers;
exports.getUser = getUserById;
exports.signUp = signUp;
exports.signIn = signIn;
