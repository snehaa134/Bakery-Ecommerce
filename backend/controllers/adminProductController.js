const Category = require("../models/Category");
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
        const activeCategories = await Category.find({
            isActive: true
        })
        const activeCategoriesIds = activeCategories.map((category) => category._id)

        const product = await Product.find({
            category: { $in: activeCategoriesIds },
            isAvailable: true
        }).populate("category", "categoryName isActive");

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

const getAllAdminProducts = async (req, res) => {
    try {
        const product = await Product.find().populate("category", "categoryName isActive");
        return res.status(STATUS_CODE.OK).json({
            message: "All products fetched successfully",
            data: product
        });
    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}


const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "categoryName isActive");
        if (!product) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product not found"
            })
        }

        if (!product.isAvailable) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product is not available"
            })
        }

        if (!product.category || !product.category.isActive) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Product category is inactive"
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


        const sellingPrice = req.body.sellingprice !== undefined ? Number(req.body.sellingprice) : undefined
        const stock = req.body.stock !== undefined ? Number(req.body.stock) : undefined;
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

        const updateData = {};

        if (productName !== undefined) {
            updateData.productName = productName;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (category !== undefined) {
            updateData.category = category;
        }

        if (sellingPrice !== undefined) {
            updateData.sellingPrice = sellingPrice;
        }

        if (stock !== undefined) {
            updateData.stock = stock;
        }

        updateData.images = [...existingImages, ...newImages];

        if (isAvailable !== undefined) {
            updateData.isAvailable =
                isAvailable === true || isAvailable === "true";
        }

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

        const activeCategories = await Category.find({
            isActive: true
        })

        const activeCategoriesIds = activeCategories.map((category) => category._id)

        const filterCategory = {
            category: { $in: activeCategoriesIds },
            isAvailable: true
        }
        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    success: false,
                    message: "Valid Category Id is required"
                });
            }

            filterCategory.category = {
                $in: activeCategoriesIds.filter((id) => id.toString() === category)
            }
        }

        if (search && search.trim()) {
            const searchWord = search.trim().replace(/s$/i, "")
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

module.exports = { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct, filteredProductsByCategory, getAllAdminProducts };


// {
//     $group:{
//         _id:null,
//         totalStock:{
//             $sum:"$stock"
//         }
//     }
// }



// {
//     $group:{
//         _id:null,
//         average:{
//             $avg:"$stock"
//         }
//     }
// }

// {
//     $match:{
//         category:"$cookies"
//     }
// }

// {
//     $sort:{
//         sellingPrice:-1
//     }
// }

// {
//     $limit : 5
// }
// {
//     $count:"totalProducts"
// }

// {
//     $match:{
//         stock:{
//             $gte:10
//         }
//     }
// }