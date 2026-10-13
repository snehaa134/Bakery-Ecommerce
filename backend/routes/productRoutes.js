const express = require("express");
const { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/adminProductController");
const productRouter = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

productRouter.post("/add-product", authMiddleware, adminMiddleware, upload.single("image"), addProduct);
productRouter.get("/get-products", authMiddleware, adminMiddleware, getAllProducts);
productRouter.get("/get-product/:id", authMiddleware, adminMiddleware, getProduct);
productRouter.put("/update-product/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);
productRouter.delete("/delete-product/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = productRouter;