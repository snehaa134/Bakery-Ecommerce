
const mongoose= require("mongoose");
const userSchema = new mongoose.Schema(
    {
       name:{
        type: String,
        required: true
       },
       email:{
        type: String,
        required:true,
        unique:true
       },
       password:{
        type: String
       },
       role:{
       type:String,
       enum:["user","admin"],
       default:"user"
       },
       otp:{
        type: String
        // required:true
       },
       otpExpiresAt:{
        type: Date,
        default:null
       },
       isVerified:{
        type:Boolean,
        default:false
       } 
    },{
        timestamps:true
    }
)

module.exports= mongoose.model("User",userSchema);