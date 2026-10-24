
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        isActive:{
            type:Boolean,
            default:true
        },
        description: {
            type: String,
            trim: true
        },

        image: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Category", categorySchema);