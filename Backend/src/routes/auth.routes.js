const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validators");
router.post("/register", validate(registerSchema), authController.registerUser);
router.post("/login", validate(loginSchema), authController.loginUser);
router.post("/logout", authController.logoutUser);
module.exports = router;
