const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName : {
        type: String , 
        required: true ,
        minLength : 4 ,
        maxLength : 20
    } ,
    lastName: {
        type: String ,
        minLength : 4 ,
        maxLength : 20
    } ,
    emailId: {
        type: String ,
        unique : true ,
        required : true ,
        lowercase: true ,
        trim : true ,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("invalid email address") ;
        }
    } ,
    password: { 
        type: String ,
        required : true ,
        minLength : 8 ,
        validate(value){
            if(!validator.isStrongPassword(value)) throw new Error("enter a strong password")
        }
    } ,
    age: {
        type: Number ,
        min : 18
    } ,
    gender: {
        type: String ,
        validate(value){
            if(!["male" , "female" , "other"].includes(value))
                throw new Error("Gender not valid") ;
        }
    } ,
    photoUrl: {
        type: String ,
        // default : "https://geographyandyou.com/images/user-profile.png" ,
        default : "https://geographyandyou.com/images/user-profile.png" ,
        maxLength : 300 ,
        validate(value){
            if(!validator.isURL(value)) throw new Error("invalid photo URL")
        }
    } ,
    about: {
        type: String ,
        default: "this is a default about user" ,
        maxLength: 250
    } ,
    skills : {
        type : [String] 
    }
} , 
{
    timestamps : true
}) ;

userSchema.methods.getJWT = async function () {
    const user = this ;

    const token = await jwt.sign({_id : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : "7d"}) ;
    return token ;
}

userSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this ;
    const passwordHash = user.password ;
    
    const isPasswordValid = await bcrypt.compare(passwordByUser , passwordHash) ;

    return isPasswordValid ;
}

module.exports = mongoose.model("User", userSchema) ;