const User = require("../models/User");
const STATUS_CODE = require("../helpers/enum");
const jwt = require("jsonwebtoken");
const auth = require("../config/firebaseAdmin");
const { comparePassword } = require("../helpers/bcrypt");
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "admin not found"
            })
        }
        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                message: "invalid password"
            })
        }

        const token = jwt.sign({
            id: admin._id,
            email: admin.email,
            role: admin.role
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d"
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        })


        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(STATUS_CODE.OK).json({
            message: "Admin login successfully",
            data: {
                id:adminResponse._id,
                name:adminResponse.name,
                email:adminResponse.email,
                role:adminResponse.role
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}

const logout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "admin logout successfully"
    })
}

const adminGoogleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Firebase idToken is required"
            })
        }

        const decodedToken = await auth.verifyIdToken(idToken);
        const { name, email } = decodedToken;

        let admin = await User.findOne({ email });

        if (!admin) {
            admin = await User.create({
                name,
                email,
                role: "admin",
                isVerified: true
            })
        }

        const token = jwt.sign({
            id: admin._id,
            email: admin.email,
            role: admin.role
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d"
            }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(STATUS_CODE.OK).json({
            message: "Google login Successfulyy",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role

            }
        })

    } catch (error) {
        console.log(error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}
module.exports = { adminLogin, logout, adminGoogleLogin };