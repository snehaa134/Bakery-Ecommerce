const express = require("express");

const { createAdmin } = require("../controllers/adminController");
const { updateProfile } = require("../controllers/userController");

const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const adminRouter = express.Router();

adminRouter.post("/admin-SignUp", createAdmin);

adminRouter.put(
    "/update-profile",authMiddleware,adminMiddleware,upload.single("image"),updateProfile
);

module.exports = adminRouter;