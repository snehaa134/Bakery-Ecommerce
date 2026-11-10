// const User = require("../models/User");
// const STATUS_CODE = require("../helpers/enum");
// const { hashPassword } = require("../helpers/bcrypt");

// const createUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(STATUS_CODE.BAD_REQUEST).json({
//                 message: "User already exists"
//             })
//         }
//         const hashedPassword = await hashPassword(password)

//         const user = await User.create({
//             name,
//             email,
//             password:hashedPassword
//         })

//         return res.status(STATUS_CODE.OK).json({
//             message: "User created successfully",
//             data: user
//         })

//     } catch (error) {
//         return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
//             message: error.message
//         })
//     }
// }

// const getUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id).select("-password");
//         if (!user) {
//             return res.status(STATUS_CODE.NOT_FOUND).json({
//                 message: "User not found"
//             })
//         }

//         return res.status(STATUS_CODE.OK).json({
//             message: "User fetched successfully",
//             data: user
//         })
//     } catch (error) {
//         return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
//             message: error.message
//         })
//     }
// }
// const getAllUsers = async (req, res) => {
//     try {
//         const user = await User.find().select("-password");
//         if (!user) {
//             return res.status(STATUS_CODE.NOT_FOUND).json({
//                 message: "Users not found"
//             })
//         }

//         return res.status(STATUS_CODE.OK).json({
//             message: "Users fetched successfully",
//             data: user
//         })
//     } catch (error) {
//         return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
//             message: error.message
//         })
//     }
// }

// const updateUser = async (req, res) => {

//     try {
//         const { name, email, password } = req.body;
//         const updateData = {
//             name,
//             email,
//             password
//         }

//         const user = await User.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { returnDocument: "after", runValidators: true }
//         )

//         if (!user) {
//             return res.status(STATUS_CODE.NOT_FOUND).json({
//                 message: "User not found"
//             })
//         }

//         return res.status(STATUS_CODE.NOT_FOUND).json({
//             message: "User updated successfully",
//             data: user
//         })


//     } catch (error) {
//         return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
//             message: error.message
//         })
//     }
// }

// const deleteUser = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id);
//         if (!user) {
//             return res.status(STATUS_CODE.NOT_FOUND).json({
//                 message: "User not found"
//             })
//         }

//         return res.status(STATUS_CODE.OK).json({
//             message: "User deleted successfully",
//             data: user
//         })

//     } catch (error) {
//         return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
//             message: error.message
//         })
//     }
// }




// module.exports = { createUser, getUser, getAllUsers, updateUser, deleteUser }



aggreagte dunctions