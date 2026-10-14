
const Product = require("../models/Product");
const STATUS_CODE = require("../helpers/enum");

const addProduct = async (req, res) => {
    try {

        const { productName, description, category, isAvailable } = req.body;
        const sellingPrice = Number(req.body.sellingprice);
        const stock = Number(req.body.stock);

        const image = req.file ? req.file.fileName : "";

        const product = await Product.create({
            productName,
            description,
            sellingPrice,
            category,
            image,
            stock,
            isAvailable
        });

        return res.status(STATUS_CODE.CREATED).json({
            message: "Product created successfully ",
            data: product
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}

const getAllProducts = async (req, res) => {
    try {

        const product = await Product.find().populate("category", "categoryName");

        return res.status(STATUS_CODE.OK).json({
            message: "Products fetched successfully",
            data: product
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}


const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "categoryName");
        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "Product fetched successfully",
            data: product
        })



    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productName, description, category, isAvailable } = req.body;
        const sellingPrice = Number(req.body.sellingprice);
        const stock = Number(req.body.stock);


        const updateData = {
            productName,
            description,
            sellingPrice,
            category,
            stock,
            isAvailable
        }
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate("category", "categoryName")

        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "Product updated successfully",
            data: product
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "Product deleted successfully",
            data: product
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}


module.exports = { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };