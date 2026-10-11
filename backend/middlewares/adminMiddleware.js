const STATUS_CODE = require("../helpers/enum");

const adminMiddleware = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(STATUS_CODE.FORBIDDEN).json({
            message: "Access denied. Admin only"
        })
    }
    next();


}
module.exports = adminMiddleware;