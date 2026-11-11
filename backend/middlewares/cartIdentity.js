const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const STATUS_CODE = require("../helpers/enum");

const cartIdentity = (req, res, next) => {

    const token = req.cookies?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token,
                process.env.JWT_SECRET_KEY
            )
            req.user = decoded;
            return next();
        } catch (error) {
            console.log(error);
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                message: "invalid token  "
            })
        }
    }

    let guestId = req.cookies?.guestId;
    if (!guestId) {
        guestId = crypto.randomUUID();

        res.cookie("guestId", guestId, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }
    req.cartGuestId = guestId;
    next();

}

module.exports = cartIdentity