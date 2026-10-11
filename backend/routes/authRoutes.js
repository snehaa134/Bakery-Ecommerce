const express = require("express");
const { login, logout, googleLogin} = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/logout",logout);
authRouter.post("/googleLogin",googleLogin);

module.exports = authRouter;