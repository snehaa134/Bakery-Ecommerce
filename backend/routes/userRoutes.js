const express = require("express");
const { createUser, verifyOtp, resendOtp ,getCurrentUser} = require("../controllers/userController");
const authMiddleware= require("../middlewares/authMiddleware");
const userRouter = express.Router();

userRouter.post("/signUp", createUser);
userRouter.post("/verify-Otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.get("/current-user",authMiddleware,getCurrentUser)

module.exports = userRouter;