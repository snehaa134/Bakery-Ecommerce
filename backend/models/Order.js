
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        guest: {
            type: String,
            default: null
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                productName: {
                    type: String,
                    required: true,
                    trim: true
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0
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
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: ["COD"],
            default: "COD",
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
            required: true
        },

        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "CONFIRMED",
                "PREPARING",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "PLACED"
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
                trim: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            },

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true
            },

            address: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            postalCode: {
                type: String,
                required: true,
                trim: true
            }
        }
    },
    {
        timestamps: true
    }
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema)