const express = require("express");
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

// Cookie options for production and development
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.PORT !== '3000';
    return {
        sameSite: 'None',
        secure: isProduction, // Only use secure: true in production (HTTPS)
        httpOnly: true
    };
};

authRouter.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignUp(req);

        //Encrypt the password
        const { password, firstName, lastName, emailId } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await user.save();

        const token = await savedUser.getJWT();
        res.cookie("token", token, { 
            ...getCookieOptions(),
            expires: new Date(Date.now() + 1 * 3600000)
        });

        res.json({ message: "user added successfully", data: savedUser });
    } catch (err) {
        res.status(400).send("Error in saving user " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) throw new Error("invalid credentials");

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);

        // const token = await jwt.sign({_id : user._id} , "Uttam@detTinder" , {expiresIn : "7d"}) ;
        
        if (isPasswordValid) {
            const token = await user.getJWT();  
            res.cookie("token", token, { 
                ...getCookieOptions(),
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send(user)
        }
        else throw new Error("Invalid credentials");
    } catch (err) {
        res.status(400).send(err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { 
        ...getCookieOptions(),
        expires: new Date(Date.now())
    });
    res.send("logout successfull");
})

module.exports = authRouter;