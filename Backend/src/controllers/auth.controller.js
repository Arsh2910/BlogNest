const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AppError = require("../utils/AppError");

async function registerUser(req, res, next) {
  try {
    const { username, email, password, role } = req.body;

    const UserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (UserAlreadyExist) {
      throw new AppError("User with same username or email already exist", 409);
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}
async function loginUser(req, res, next) {
  try {
    const { username, email, password, role } = req.body;
    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid password", 401);
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token);
    res.status(200).json({
      message: "User Logged in Successfully",
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}
async function logoutUser(req, res, next) {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "User Logged out Successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerUser, loginUser, logoutUser };
