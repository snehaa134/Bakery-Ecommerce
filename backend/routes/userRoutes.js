const express = require("express");
const { createUser, verifyOtp, resendOtp } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/signUp", createUser);
userRouter.post("/verify-Otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp)

module.exports = userRouter;