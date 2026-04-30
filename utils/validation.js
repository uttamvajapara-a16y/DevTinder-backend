const validator = require("validator")

const validateSignUp = (req) => {
    const {firstName , lastName , emailId , password} = req.body ;
    if(!firstName || !lastName) 
        throw new Error("Name is not valid")
    else if(firstName.length < 4 || firstName.length > 50)
        throw new Error("firstname should be of 4-50 characters")
    else if(!validator.isEmail(emailId))
        throw new Error("Enter a valid emailId")
    else if(!validator.isStrongPassword(password))
        throw new Error("Enter a strong password")
}
module.exports = {validateSignUp}