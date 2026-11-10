
const Banner = require("../models/Banner");
const STATUS_CODE = require("../helpers/enum");

const addBanner = async (req, res) => {
    try {

        const { title, description ,isActive} = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                messgae: "Please upload at least one image"
            })
        }
        const images = req.files.map((file) => file.path) || []

        const banner = await Banner.create({
          title,
          description,
          images,
          isActive
        });

        return res.status(STATUS_CODE.CREATED).json({
            message: "Banner created successfully ",
            data: banner
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}

const getAllBanners = async (req, res) => {
    try {

        const banner = await Banner.find();

        return res.status(STATUS_CODE.OK).json({
            message: "Banners fetched successfully",
            data: banner
        })

    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}


const getBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "category not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "Banners fetched successfully",
            data: banner
        })



    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const updateBanner = async (req, res) => {
    try {
        const {title,description,isActive} = req.body;

        const updateData = {
            title,
            description,
            isActive
        }
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((file)=>file.path) || [];
        }
        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        )

        if (!banner) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Banner not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "Banner updated successfully",
            data: banner
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "Banner not found"
            })
        }
        return res.status(STATUS_CODE.OK).json({
            message: "Banner deleted successfully",
            data: banner
        })


    } catch (error) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}


module.exports = { addBanner, getAllBanners, getBanner, updateBanner, deleteBanner };