const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const authenticate = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (e) {
    return next(new HttpError("Authentication failed", 401));
  }

  if (!token) {
    return next(new HttpError("Authentication failed", 401));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return next(new HttpError("Authentication failed", 401));
  }

  req.user = { userId: decodedToken.userId, role: decodedToken.role };
  next();
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      console.log('No role found')
      return next(
          new HttpError("Authentication required. Missing user role.", 401)
      );
    }
    if (!allowedRoles.includes(req.user.role)) {
      console.log(req.user.role)
      return next(
        new HttpError("You are not authorized to perform this action", 403),
      );
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
