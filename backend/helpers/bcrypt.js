const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

const hashOtp = async (otp) => {
    return await bcrypt.hash(otp, 10)
}

const compareOtp = async (otp, hashedOtp) => {
    return await bcrypt.compare(otp, hashedOtp)
}


module.exports = { hashPassword, comparePassword, hashOtp, compareOtp };


