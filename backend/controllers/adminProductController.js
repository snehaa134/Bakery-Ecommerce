
const Product = require("../models/Product");
const STATUS_CODE = require("../helpers/enum");
const { default: mongoose } = require("mongoose");

const addProduct = async (req, res) => {
    try {

        const { productName, description, category, isAvailable } = req.body;
        const sellingPrice = Number(req.body.sellingPrice);
        const stock = Number(req.body.stock);

        const images = req.files?.map((file) => file.filename)

        const product = await Product.create({
            productName,
            description,
            sellingPrice,
            category,
            images,
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

        const sellingPrice = Number(req.body.sellingPrice);
        const stock = Number(req.body.stock);
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product not found"
            });
        }

        let existingImages = product.images;

        if (req.body.existingImages !== undefined) {
            existingImages = JSON.parse(req.body.existingImages);
        }

        existingImages = product.images.filter((image) =>
            existingImages.includes(image)
        );


        const newImages = req.files ? req.files.map((file) => file.filename) : [];

        if (existingImages.length + newImages.length > 6) {
            return res.status(400).json({
                message: "Maximum 6 images are allowed"
            });
        }

        const updateData = {
            productName,
            description,
            sellingPrice,
            category,
            stock,
            isAvailable,
            images: [...existingImages, ...newImages]
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate("category", "categoryName");

        return res.status(STATUS_CODE.OK).json({
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};



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

const filteredProductsByCategory = async (req, res) => {
    try {

        const { category, search, sort } = req.query;
             
        const filterCategory = {}
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    success: false,
                    message: "Valid Category Id is required"
                });
            }

            filterCategory.category = new mongoose.Types.ObjectId(category);
        }

        if (search && search.trim()) {
            const searchWord = search.trim().replace(/s$/i,"")
            filterCategory.productName = {
                $regex: searchWord,
                $options: "i"
            }
        }


        let sortOption = {}
        if (sort === "lowToHigh") {
            sortOption = { sellingPrice: 1 };
        } else if (sort === "highToLow") {
            sortOption = { sellingPrice: -1 }
        } else if (sort === "aToZ") {
            sortOption = { productName: 1 }
        } else if (sort === "zToA") {
            sortOption = { productName: -1 }
        }


        const pipeline = [
            {
                $match: filterCategory
            }
        ];

        if (Object.keys(sortOption).length > 0) {
            pipeline.push({
                $sort: sortOption
            });
        }

        const products = await Product.aggregate(pipeline)


        return res.status(STATUS_CODE.OK).json({
            success: true,
            data: products
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })

    }
}

module.exports = { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct, filteredProductsByCategory };