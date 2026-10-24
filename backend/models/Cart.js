const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        guest: {
            type: String,
            default: null
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1
                }
            }

        ]

    },
    {
        timestamps: true
    }
)

cartSchema.index(
    { user: 1 },
    {
        unique: true,
        partialFilterExpression: {
            user: { $type: "objectId" }
        }
    }
);

cartSchema.index(
    { guest: 1 },
    {
        unique: true,
        partialFilterExpression: {
            guest: { $type: "string" }
        }
    }
);

module.exports = mongoose.model("Cart", cartSchema);

