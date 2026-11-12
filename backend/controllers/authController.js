
const User = require("../models/User");
const Cart = require("../models/Cart");
const STATUS_CODE = require("../helpers/enum");
const jwt = require("jsonwebtoken");
const auth = require("../config/firebaseAdmin");
const { comparePassword } = require("../helpers/bcrypt");

const mergeGuestCart = async (req, res, userId) => {
    const guestId = req.cookies?.guestId;

    if (!guestId) {
        return;
    }

    const guestCart = await Cart.findOne({
        guest: guestId
    }).populate("items.product");

    if (!guestCart) {
        return;
    }

    let userCart = await Cart.findOne({
        user: userId
    });

    if (!userCart) {
        userCart = new Cart({
            user: userId,
            items: []
        });
    }

    guestCart.items.forEach((guestItem) => {
        const product = guestItem.product;

        if (!product || !product.isAvailable || product.stock < 1) {
            return;
        }

        const existingItem = userCart.items.find(
            (item) =>
                item.product.toString() === product._id.toString()
        );

        if (existingItem) {
            existingItem.quantity = Math.min(
                existingItem.quantity + guestItem.quantity,
                product.stock
            );
        } else {
            userCart.items.push({
                product: product._id,
                quantity: Math.min(
                    guestItem.quantity,
                    product.stock
                )
            });
        }
    });

    await userCart.save();

    await Cart.findByIdAndDelete(guestCart._id);

    res.clearCookie("guestId", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "User not found"
            });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                message: "Invalid password"
            });
        }

        if (user.role !== "user") {
            return res.status(STATUS_CODE.FORBIDDEN).json({
                message: "Please login through the admin login page"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
            path: "/"
        });

        await mergeGuestCart(req, res, user._id);

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(STATUS_CODE.OK).json({
            message: "User login successfully",
            data: {
                id: userResponse._id,
                name: userResponse.name,
                email: userResponse.email,
                role: userResponse.role
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });

    return res.json({
        message: "User logout successfully"
    });
};

const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Firebase idToken is required"
            });
        }

        const decodedToken = await auth.verifyIdToken(idToken);
        const { name, email } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            path: "/"
        });

        await mergeGuestCart(req, res, user._id);

        return res.status(STATUS_CODE.OK).json({
            message: "Google login successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

module.exports = { login, logout, googleLogin };
