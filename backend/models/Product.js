

const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
    {
        productName:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            trim:true
        },
        sellingPrice:{
              type:Number,
              required:true
        },
        images:{
            type:String,
            required:true
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required: true
        },
        stock:{
            type:Number,
            required:true,
            default:0
        },
        isAvailable:{
            type:Boolean,
            default:true
        }

    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Product",productSchema);