const User = require("../models/User");
const STATUS_CODE = require("../helpers/enum");
const jwt = require("jsonwebtoken");
const auth = require("../config/firebaseAdmin");
const { comparePassword } = require("../helpers/bcrypt");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "user not found"
            })
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(STATUS_CODE.UNAUTHORIZED).json({
                message: "invalid password"
            })
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
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


        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(STATUS_CODE.OK).json({
            message: "User login successfully",
            data: {
                id: userResponse._id,
                name: userResponse.name,
                email: userResponse.email,
                role: userResponse.role
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
        message: "user logout successfully"
    })
}

const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
      

        if (!idToken) {
            res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Firebase idToken is required"
            })
        }
           
          const decodedToken = await auth.verifyIdToken(idToken);
        const { name, email } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email
            })
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
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
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}
module.exports = { login, logout, googleLogin };