const STATUS_CODE = require("../helpers/enum");
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                message: "Authentication is required"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
            message: "invalid token  "
        })

    }
}
module.exports = authMiddleware;