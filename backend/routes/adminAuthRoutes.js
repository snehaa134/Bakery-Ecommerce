const express = require("express");
const {adminLogin,adminGoogleLogin}= require("../controllers/adminAuthController")
const adminAuthRouter = express.Router();

adminAuthRouter.post("/admin-Login",adminLogin);
adminAuthRouter.post("/admin-googleLogin",adminGoogleLogin);


module.exports = adminAuthRouter;