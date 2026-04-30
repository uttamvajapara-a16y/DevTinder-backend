const express = require("express") ;
const {userAuth} = require("../middlewares/auth") ;
const bcrypt = require("bcrypt") ;
const User = require("../models/user") ;

const profileRouter = express.Router() ;

profileRouter.get("/profile/view" , userAuth , async (req , res) => {
    try{
        const user = req.user ;
        res.send(user) ;
    } catch (err) {
        res.status(400).send("something went wrong : " + err.message) ;
    }
})

profileRouter.patch("/profile/edit" , userAuth , async (req , res) => {
    try{
        const allowedUpdate = ["firstName" , "lastName" , "age" , "gender" , "photoUrl" , "about" , "skills"] ;

        const isEditValid = Object.keys(req.body).every(field => allowedUpdate.includes(field)) ;

        if(!isEditValid){
            throw new Error ("update not valid") ;
        } else {
            if(req.body.skills?.length > 10) throw new Error ("skills can not be more than 10") ;
            if(req.body.about?.length > 150) throw new Error ("about can not be more than 150 character") ;
            const loggedinUser = req.user ;
            Object.keys(req.body).forEach(key => loggedinUser[key] = req.body[key]) ;
            await User.findByIdAndUpdate(req.user._id , req.body , {runValidators: true}) ;
            res.json({
                message : `${loggedinUser.firstName} , your profile updated successfully` ,
                data : loggedinUser
            })
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message) ;
    }
})

profileRouter.patch("/profile/changePassword" , userAuth , async (req , res) => {
    try{
        const oldPassword = req.body.oldPassword ; // $2b$10$5qwB9X.bBmJz80CLLzrj4ugZwpq9PSmLHjaacBqIWF4rZYwUIXQhe
        const newPassword = req.body.newPassword ; // Mahendra@123
        const user = req.user ;

        const isValidOldPassword = await bcrypt.compare(oldPassword , user.password)

        if(!isValidOldPassword){
            throw new Error ("invalid old password") ;
        }

        const passwordToSave = await bcrypt.hash(newPassword , 10) ;

        await User.findByIdAndUpdate(user._id , {password : passwordToSave} , {runValidators: true})
        res.send("password updated successfully")

    } catch (err) {
        res.status(400).send("Error : " + err.message) ;
    }
})

module.exports = profileRouter ;