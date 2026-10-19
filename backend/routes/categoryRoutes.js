const express = require("express");
const { addCategory, getAllCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/adminCategoryController");
const categoryRouter = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

categoryRouter.post("/add-category", authMiddleware, adminMiddleware, upload.single("image"), addCategory);
categoryRouter.get("/get-categories",getAllCategories);
categoryRouter.get("/get-category/:id", getCategory);
categoryRouter.put("/update-category/:id", authMiddleware, adminMiddleware, upload.single("image"), updateCategory);
categoryRouter.delete("/delete-category/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = categoryRouter;