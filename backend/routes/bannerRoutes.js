const express = require("express");
const { addBanner, getAllBanners, getBanner, updateBanner, deleteBanner } = require("../controllers/bannerController");
const bannerRouter = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

bannerRouter.post("/add-banner", authMiddleware, adminMiddleware, upload.array("images",6), addBanner);
bannerRouter.get("/get-banners",  getAllBanners);
bannerRouter.get("/get-banner/:id",  getBanner);
bannerRouter.put("/update-banner/:id", authMiddleware, adminMiddleware, upload.array("images",6), updateBanner);
bannerRouter.delete("/delete-banner/:id", authMiddleware, adminMiddleware, deleteBanner);

module.exports = bannerRouter;