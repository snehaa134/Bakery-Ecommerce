
const Category = require("../models/Category");
const STATUS_CODE = require("../helpers/enum");

const addCategory = async (req, res) => {
    try {

        const { categoryName, description } = req.body;
        const image = req.file ? req.file.filename : "";

        const category = await Category.create({
            categoryName,
            description,
            image

        });
        return res.status(STATUS_CODE.CREATED).json({
            message: "category created successfully ",
            data: category
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}

const getAllCategories = async (req, res) => {
    try {

        const category = await Category.find();

        return res.status(STATUS_CODE.OK).json({
            message: "Categories fetched successfully",
            data: category
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}


const getActiveCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        return res.status(STATUS_CODE.OK).json({
            message: "Active Categories fetched successfully",
            data: categories
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}


const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category || !category.isActive) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "category not found or inactive"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "category fetched successfully",
            data: category
        })



    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { categoryName, description,isActive } = req.body;

        const updateData = {
            categoryName,
            description,
        }
        if(isActive !== undefined){
            updateData.isActive=isActive
        }
        if (req.file) {
            updateData.image = req.file.filename;
        }
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        )

        if (!category) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "category not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "category updated successfully",
            data: category
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "category not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "category deleted successfully",
            data: category
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}


module.exports = { addCategory, getAllCategories, getCategory, getActiveCategories,updateCategory, deleteCategory };