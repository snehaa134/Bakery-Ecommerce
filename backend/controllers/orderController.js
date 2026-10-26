
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const STATUS_CODE = require("../helpers/enum");
const sendOrderConfirmationEmail = require("../config/sendMailEmailConfirmation");

// CREATE ORDER
const createOrder = async (req, res) => {
    let order = null;
    let cart = null;
    let originalCartItems = [];
    let cartClearAttempted = false;

    const deductedStock = [];

    try {
        const {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            postalCode
        } = req.body;

        // Validate shipping details
        const details = [
            fullName,
            email,
            phone,
            address,
            city,
            state,
            postalCode
        ];

        if (
            details.some(
                value =>
                    typeof value !== "string" ||
                    !value.trim()
            )
        ) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Please fill all details"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (!/^[6-9]\d{9}$/.test(phone.trim())) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Please enter a valid 10-digit phone number"
            });
        }

        if (!/^\d{6}$/.test(postalCode.trim())) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Please enter a valid 6-digit PIN code"
            });
        }

        // Identify logged-in user or guest
        const isUserLoggedIn = Boolean(req.user);

        if (!isUserLoggedIn && !req.cartGuestId) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Guest identity is missing"
            });
        }

        const cartFilter = isUserLoggedIn
            ? { user: req.user.id }
            : { guest: req.cartGuestId };

        // Fetch cart with product details
        cart = await Cart.findOne(cartFilter).populate(
            "items.product"
        );

        if (!cart || cart.items.length === 0) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        // Keep original cart items for recovery
        originalCartItems = cart.items.map(item => ({
            product: item.product?._id || item.product,
            quantity: item.quantity
        }));

        let subTotal = 0;
        const orderItems = [];

        // Validate products and calculate subtotal
        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    success: false,
                    message: "A product in your cart no longer exists"
                });
            }

            if (
                !product.isAvailable ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                !Number.isFinite(product.sellingPrice) ||
                product.sellingPrice < 0 ||
                product.stock < item.quantity
            ) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    success: false,
                    message: `${product.productName} is unavailable or stock is insufficient`
                });
            }

            orderItems.push({
                product: product._id,
                productName: product.productName,
                price: product.sellingPrice,
                quantity: item.quantity
            });

            subTotal += product.sellingPrice * item.quantity;
        }

        // Calculate GST on the server
        const cgst = Number(
            (subTotal * 2.5 / 100).toFixed(2)
        );

        const sgst = Number(
            (subTotal * 2.5 / 100).toFixed(2)
        );

        const totalGst = Number(
            (cgst + sgst).toFixed(2)
        );

        const totalAmount = Number(
            (subTotal + totalGst).toFixed(2)
        );

        // Create order with GST-inclusive total
        order = await Order.create({
            user: isUserLoggedIn ? req.user.id : null,
            guest: isUserLoggedIn ? null : req.cartGuestId,
            items: orderItems,
            totalAmount,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            orderStatus: "PLACED",
            shippingAddress: {
                fullName: fullName.trim(),
                email: cleanEmail,
                phone: phone.trim(),
                address: address.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: postalCode.trim()
            }
        });

        // Deduct stock after order creation
        for (const item of cart.items) {
            const result = await Product.updateOne(
                {
                    _id: item.product._id,
                    isAvailable: true,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );

            if (result.modifiedCount !== 1) {
                const error = new Error(
                    "Stock changed. Please try again."
                );

                error.statusCode = STATUS_CODE.BAD_REQUEST;
                throw error;
            }

            deductedStock.push({
                productId: item.product._id,
                quantity: item.quantity
            });
        }

        // Clear cart after successful stock updates
        cart.items = [];
        cartClearAttempted = true;

        await cart.save();

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        // Restore cart if clearing was attempted
        if (cartClearAttempted && cart) {
            try {
                await Cart.updateOne(
                    { _id: cart._id },
                    {
                        $set: {
                            items: originalCartItems
                        }
                    }
                );
            } catch (rollbackError) {
                console.error(
                    "CART RESTORE ERROR:",
                    rollbackError
                );
            }
        }

        // Restore stock if any stock was deducted
        for (const item of deductedStock) {
            try {
                await Product.updateOne(
                    { _id: item.productId },
                    {
                        $inc: {
                            stock: item.quantity
                        }
                    }
                );
            } catch (rollbackError) {
                console.error(
                    "STOCK RESTORE ERROR:",
                    rollbackError
                );
            }
        }

        // Delete order if the operation failed
        if (order) {
            try {
                await Order.deleteOne({
                    _id: order._id
                });
            } catch (rollbackError) {
                console.error(
                    "ORDER CLEANUP ERROR:",
                    rollbackError
                );
            }
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(
            STATUS_CODE.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: "Failed to place order. Please try again."
        });
    }

    // Send confirmation email after successful order placement
    try {
        await sendOrderConfirmationEmail({
            to: order.shippingAddress.email,
            orderId: order._id.toString(),
            fullName: order.shippingAddress.fullName,
            items: order.items,
            totalAmount: order.totalAmount
        });
    } catch (emailError) {
        console.error(
            "Order confirmation email failed:",
            emailError
        );
    }

    return res.status(STATUS_CODE.CREATED).json({
        success: true,
        message: "Order placed successfully",
        data: order
    });
};


// USER: GET MY ORDERS
const getMyOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(
                STATUS_CODE.UNAUTHORIZED
            ).json({
                success: false,
                message: "Please login to view your orders"
            });
        }

        const orders = await Order.find({
            user: req.user.id
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(STATUS_CODE.OK).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });

    } catch (error) {
        console.error("GET MY ORDERS ERROR:", error);

        return res.status(
            STATUS_CODE.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};


// ADMIN: GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .lean();

        return res.status(STATUS_CODE.OK).json({
            success: true,
            message: "All orders fetched successfully",
            data: orders
        });

    } catch (error) {
        console.error("GET ALL ORDERS ERROR:", error);

        return res.status(
            STATUS_CODE.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: "Failed to fetch all orders"
        });
    }
};


// ADMIN: UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "PLACED",
            "CONFIRMED",
            "PREPARING",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Invalid order status"
            });
        }

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = status;

        await order.save();

        return res.status(STATUS_CODE.OK).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });

    } catch (error) {
        console.error("UPDATE ORDER STATUS ERROR:", error);

        return res.status(
            STATUS_CODE.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};


const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        if (!req.user && !req.cartGuestId) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                success: false,
                message: "Unable to identify the customer",
            });
        }

        const identityFilter = req.user
            ? { user: req.user.id }
            : { guest: req.cartGuestId };

        const order = await Order.findOne({
            _id: id,
            ...identityFilter,
        }).lean();

        if (!order) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(STATUS_CODE.OK).json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    } catch (error) {
        console.error("GET ORDER BY ID ERROR:", error);

        return res.status(
            STATUS_CODE.INTERNAL_SERVER_ERROR
        ).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById
};
