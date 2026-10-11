const User = require("../models/User");
const STATUS_CODE = require("../helpers/enum");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/mailer");
const { hashPassword, hashOtp, compareOtp } = require("../helpers/bcrypt");
const createAdmin = async (req, res) => {
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

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            otp: hashedOtp,
            otpExpiresAt: otpExpiresAt,
            isVerified: false
        })

        await sendMail(email,
            "Bakery-bliss - Admin Verification",
            `
            <h2>hello ${name}</h2>
            <h2>Welcome to Bakery-bliss</h2>
            <p>Your OTP for Verifying your Bakery Bliss admin account is: ${otp}</p>
            <p>this OTP is valid for 2 minutes</p>
            <p>Regards,<br>Bakery Bliss Team</p>
            `
        )

        const adminResponse = admin.toObject()
        delete adminResponse.password;
        delete adminResponse.otp;

        res.status(STATUS_CODE.CREATED).json({
            message: "Admin SignUp successfully, OTP sent to your email",
            data: adminResponse
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

        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: "admin not found"
            })
        }
        if (Date.now() > admin.otpExpiresAt) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "OTP has expired"
            })
        }

        if (!admin.otp) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "OTP not available"
            });
        }


        const isOtpValid = await compareOtp(otp, admin.otp);

        if (!isOtpValid) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "invalid OTP"
            })
        }



        admin.isVerified = true;
        admin.otp = null;
        admin.otpExpiresAt = null;

        await admin.save()

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
            message: "admin verified successfully",
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



module.exports = { createAdmin, verifyOtp };