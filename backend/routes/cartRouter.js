const express = require("express");
const { addToCart, getCart, updateCartQuantity, removeProduct } = require("../controllers/cartController");
const cartRouter = express.Router();
const cartIdentity= require("../middlewares/cartIdentity");
cartRouter.post("/add-to-cart", cartIdentity, addToCart);
cartRouter.get("/get-cart", cartIdentity, getCart);
cartRouter.patch("/update-quantity", cartIdentity, updateCartQuantity);
cartRouter.delete("/remove-product/:productId", cartIdentity, removeProduct)
module.exports = cartRouter;