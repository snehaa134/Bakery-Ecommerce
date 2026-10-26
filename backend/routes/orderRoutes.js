const express = require("express");
const orderRouter = express.Router();
const {createOrder, getMyOrders,getAllOrders,updateOrderStatus,getOrderById} = require("../controllers/orderController");
const cartIdentity = require("../middlewares/cartIdentity");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

orderRouter.post("/create-order", cartIdentity, createOrder);
orderRouter.get("/my-orders", authMiddleware, getMyOrders);
orderRouter.get("/get-order/:id", cartIdentity, getOrderById);
orderRouter.get(
    "/get-orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);
orderRouter.put(
    "/update-order-status/:id",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);

module.exports = orderRouter;