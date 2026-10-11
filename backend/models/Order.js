
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD",
            required: true
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING"
        },
        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
                "CONFIRMED",
                "PREPARING"
            ],
            default: "PLACED"
        },

        shippingAddress: {
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Order", orderSchema);