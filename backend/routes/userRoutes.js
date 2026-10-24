const express = require("express");
const { createUser, verifyOtp, resendOtp, getCurrentUser, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const userRouter = express.Router();
const upload = require("../middlewares/multerMiddleware");


userRouter.post("/signUp", createUser);
userRouter.post("/verify-Otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.get("/current-user", authMiddleware, getCurrentUser);
userRouter.put("/update-profile", authMiddleware, upload.single("image"), updateProfile);

module.exports = userRouter;
