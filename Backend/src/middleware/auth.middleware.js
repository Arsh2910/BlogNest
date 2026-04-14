const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

async function authAdmin(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("Unauthorized ", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      throw new AppError("You dont have access to this resource", 403);
    }
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user" && decoded.role !== "admin") {
      throw new AppError("You dont have access to this resource", 403);
    }
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authUser, authAdmin };
