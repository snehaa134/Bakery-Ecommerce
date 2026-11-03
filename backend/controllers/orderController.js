
const crypto = require("crypto");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const STATUS_CODE = require("../helpers/enum");
const razorpay = require("../config/razorpay");
const sendOrderConfirmationEmail = require("../config/sendMailEmailConfirmation");

const validateShippingDetails = (body) => {
    const {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        postalCode
    } = body;

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
        throw new Error("Please fill all details");
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        throw new Error("Please enter a valid email address");
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
        throw new Error("Please enter a valid 10-digit phone number");
    }
    if (!/^\d{6}$/.test(postalCode.trim())) {
        throw new Error("Please enter a valid 6-digit PIN code");
    }

    return {
        fullName: fullName.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim()
    };
};

const getCartDetails = async (req) => {
    const isUserLoggedIn = Boolean(req.user);

    if (!isUserLoggedIn && !req.cartGuestId) {
        throw new Error("Guest identity is missing");
    }

    const cartFilter = isUserLoggedIn
        ? { user: req.user.id }
        : { guest: req.cartGuestId };

    const cart = await Cart.findOne(cartFilter).populate(
        "items.product"
    );

    if (!cart || cart.items.length === 0) {
        throw new Error("Your cart is empty");
    }

    let subTotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const product = item.product;

        if (!product) {
            throw new Error("A product in your cart no longer exists");
        }

        if (
            !product.isAvailable ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1 ||
            !Number.isFinite(product.sellingPrice) ||
            product.sellingPrice < 0 ||
            product.stock < item.quantity
        ) {
            throw new Error(
                `${product.productName} is unavailable or stock is insufficient`
            );
        }

        orderItems.push({
            product: product._id,
            productName: product.productName,
            price: product.sellingPrice,
            quantity: item.quantity
        });

        subTotal += product.sellingPrice * item.quantity;
    }

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

    return {
        cart,
        isUserLoggedIn,
        orderItems,
        totalAmount
    };
};

const saveOrderAndUpdateCart = async ({
    req,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    razorpayOrderId = null,
    razorpayPaymentId = null,
    cartDetails
}) => {
    const {
        cart,
        isUserLoggedIn,
        orderItems,
        totalAmount
    } = cartDetails;

    const originalCartItems = cart.items.map(item => ({
        product: item.product?._id || item.product,
        quantity: item.quantity
    }));

    const deductedStock = [];

    let order = null;
    let cartClearAttempted = false;

    try {
        order = await Order.create({
            user: isUserLoggedIn ? req.user.id : null,
            guest: isUserLoggedIn ? null : req.cartGuestId,
            items: orderItems,
            totalAmount,
            paymentMethod,
            paymentStatus,
            razorpayOrderId,
            razorpayPaymentId,
            orderStatus: "PLACED",
            shippingAddress
        });

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

        cart.items = [];
        cartClearAttempted = true;

        await cart.save();

        

    } catch (error) {
        console.error("SAVE ORDER ERROR:", error);

        if (cartClearAttempted) {
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
                console.error("CART RESTORE ERROR:", rollbackError);
            }
        }

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
                console.error("STOCK RESTORE ERROR:", rollbackError);
            }
        }

        if (order) {
            try {
                await Order.deleteOne({
                    _id: order._id
                });
            } catch (rollbackError) {
                console.error("ORDER CLEANUP ERROR:", rollbackError);
            }
        }

        throw error;
    }

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

    return order;
};

const createOrder = async (req, res) => {
    try {
        const shippingAddress = validateShippingDetails(req.body);

        const cartDetails = await getCartDetails(req);

        const order = await saveOrderAndUpdateCart({
            req,
            shippingAddress,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            cartDetails
        });

        return res.status(STATUS_CODE.CREATED).json({
            success: true,
            message: "Order placed successfully",
            data: order
        });

    } catch (error) {
        console.error("CREATE COD ORDER ERROR:", error);

        return res.status(
            error.statusCode || STATUS_CODE.BAD_REQUEST
        ).json({
            success: false,
            message: error.message || "Failed to place order. Please try again."
        });
    }
};

const createRazorpayOrder = async (req, res) => {
    try {
        const shippingAddress = validateShippingDetails(req.body);

        const cartDetails = await getCartDetails(req);

        const amountInPaise = Math.round(
            cartDetails.totalAmount * 100
        );

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        return res.status(STATUS_CODE.CREATED).json({
            success: true,
            message: "Razorpay order created successfully",
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID,
                shippingAddress
            }
        });

    } catch (error) {
        console.error("CREATE RAZORPAY ORDER ERROR:", error);

        return res.status(
            error.statusCode || STATUS_CODE.BAD_REQUEST
        ).json({
            success: false,
            message: error.message || "Unable to start online payment"
        });
    }
};

const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Payment details are missing"
            });
        }

        const cleanShippingAddress = validateShippingDetails(
            shippingAddress || {}
        );

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        const signatureBuffer = Buffer.from(generatedSignature);
        const receivedSignatureBuffer = Buffer.from(razorpay_signature);

        const isAuthentic =
            signatureBuffer.length === receivedSignatureBuffer.length &&
            crypto.timingSafeEqual(
                signatureBuffer,
                receivedSignatureBuffer
            );

        if (!isAuthentic) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const existingOrder = await Order.findOne({
            razorpayOrderId: razorpay_order_id
        });

        if (existingOrder) {
            return res.status(STATUS_CODE.OK).json({
                success: true,
                message: "Payment already verified",
                data: existingOrder
            });
        }

        const razorpayOrder = await razorpay.orders.fetch(
            razorpay_order_id
        );

        const razorpayPayment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            razorpayOrder.currency !== "INR" ||
            razorpayOrder.status !== "paid" ||
            razorpayPayment.order_id !== razorpay_order_id ||
            razorpayPayment.status !== "captured" ||
            razorpayPayment.amount !== razorpayOrder.amount ||
            razorpayPayment.currency !== "INR"
        ) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Payment details are invalid"
            });
        }

        const cartDetails = await getCartDetails(req);

        const expectedAmount = Math.round(
            cartDetails.totalAmount * 100
        );

        if (razorpayOrder.amount !== expectedAmount) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: "Cart amount has changed. Please contact support."
            });
        }

        const order = await saveOrderAndUpdateCart({
            req,
            shippingAddress: cleanShippingAddress,
            paymentMethod: "RAZORPAY",
            paymentStatus: "PAID",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            cartDetails
        });

        return res.status(STATUS_CODE.CREATED).json({
            success: true,
            message: "Payment verified and order placed successfully",
            data: order
        });

    } catch (error) {
        console.error("VERIFY RAZORPAY PAYMENT ERROR:", error);

        return res.status(
            error.statusCode || STATUS_CODE.BAD_REQUEST
        ).json({
            success: false,
            message: error.message || "Payment verification failed"
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
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

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

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

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch all orders"
        });
    }
};

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

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
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
                message: "Invalid order ID"
            });
        }

        if (!req.user && !req.cartGuestId) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                success: false,
                message: "Unable to identify the customer"
            });
        }

        const identityFilter = req.user
            ? { user: req.user.id }
            : { guest: req.cartGuestId };

        const order = await Order.findOne({
            _id: id,
            ...identityFilter
        }).lean();

        if (!order) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(STATUS_CODE.OK).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });

    } catch (error) {
        console.error("GET ORDER BY ID ERROR:", error);

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch order"
        });
    }
};

module.exports = {
    createOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById
};
