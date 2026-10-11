const User = require("../models/User");
const STATUS_CODE = require("../helpers/enum");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/mailer");
const { hashPassword, hashOtp, compareOtp } = require("../helpers/bcrypt");
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Email already exists"
            })
        }
        const hashedPassword = await hashPassword(password);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedOtp = await hashOtp(otp);
        console.log("Otp", hashedOtp);
        const otpExpiresAt = new Date(
            Date.now() + 2 * 60 * 1000
        )

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: hashedOtp,
            otpExpiresAt: otpExpiresAt,
            isVerified: false
        })

        await sendMail(email,
            "Bakery-bliss - Email Verification",
            `
            <h2>hello ${name}</h2>
            <h2>Welcome to Bakery-bliss</h2>
            <p>Your OTP is ${otp}</p>
            <p>this OTP is valid for 2 minutes</p>
            `

        )

        const userResponse = user.toObject()
        delete userResponse.password;
        delete userResponse.otp;

        res.status(STATUS_CODE.CREATED).json({
            message: "User SignUp successfully, OTP sent to your email",
            data: userResponse
        })

    } catch (error) {
        console.log(error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })

    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "user not found"
            })
        }


        if (!user.otp) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "OTP not available"
            });
        }
        if (Date.now() > user.otpExpiresAt) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "OTP has expired"
            })
        }


        const isOtpValid = await compareOtp(otp, user.otp);

        if (!isOtpValid) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "invalid OTP"
            })
        }



        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;

        await user.save()

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

        const message = user.role === "admin" ? "Admin Verified sccessfully" : "user Verified successfully"

        return res.status(STATUS_CODE.OK).json({
            message: message,
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

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "user not found"
            })
        }

        if (user.isVerified) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "user already verified"
            })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedOtp = await hashOtp(otp);
        const otpExpiresAt = new Date(
            Date.now() + 2 * 60 * 1000
        )

        user.otp = hashedOtp;
        user.otpExpiresAt = otpExpiresAt;

        await user.save();

        await sendMail(email,
            "Bakery-bliss - Email Verification",
            `
            <h2>hello ${user.name}</h2>
            <h2>Welcome to Bakery-bliss</h2>
            <p>Your New OTP is ${otp}</p>
            <p>this OTP is valid for 2 minutes</p>
            `

        )
        return res.status(STATUS_CODE.OK).json({
            message: "New OTP sent successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }


}

module.exports = { createUser, verifyOtp, resendOtp }