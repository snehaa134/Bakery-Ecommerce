const express = require("express");
const {createAdmin}= require("../controllers/adminController")
const adminRouter = express.Router();

adminRouter.post("/admin-SignUp",createAdmin);

module.exports = adminRouter;