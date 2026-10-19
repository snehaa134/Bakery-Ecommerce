const express = require("express");
const { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct,filteredProductsByCategory } = require("../controllers/adminProductController");
const productRouter = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

productRouter.post("/add-product", authMiddleware, adminMiddleware, upload.array("images",6), addProduct);
productRouter.get("/get-products",  getAllProducts);
productRouter.get("/get-product/:id",  getProduct);
productRouter.put("/update-product/:id", authMiddleware, adminMiddleware, upload.array("images",6), updateProduct);
productRouter.delete("/delete-product/:id", authMiddleware, adminMiddleware, deleteProduct);
productRouter.get("/filter-products",filteredProductsByCategory)

module.exports = productRouter;