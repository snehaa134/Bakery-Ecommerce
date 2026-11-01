const express = require("express");
const { addFestiveTheme, getAllFestiveThemes, getFestiveThemeById, updateFestiveTheme, deleteFestiveTheme, getActiveFestiveTheme, setManualThemeStatus } = require("../controllers/festivalTheme");
const themeRouter = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

themeRouter.post("/addFestiveTheme", authMiddleware, adminMiddleware, addFestiveTheme);
themeRouter.get("/getAllFestiveThemes", authMiddleware, adminMiddleware, getAllFestiveThemes);
themeRouter.get("/getActiveFestiveTheme", getActiveFestiveTheme);
themeRouter.get("/get-FestiveTheme/:id", authMiddleware, adminMiddleware, getFestiveThemeById);
themeRouter.patch("/manual-status/:id", authMiddleware, adminMiddleware, setManualThemeStatus)
themeRouter.put("/updateFestiveTheme/:id", authMiddleware, adminMiddleware, updateFestiveTheme);
themeRouter.delete("/deleteFestiveTheme/:id", authMiddleware, adminMiddleware, deleteFestiveTheme);

module.exports = themeRouter;