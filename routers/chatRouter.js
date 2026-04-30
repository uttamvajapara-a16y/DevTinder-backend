const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId" , userAuth , async (req , res) => {
    const userId = req.user._id ;
    const {targetUserId} = req.params ;
    try{
        
        let chats = await Chat.findOne({
            participants: {$all : [userId , targetUserId]}
        }).populate("messages.senderId" , "firstName lastName") ;

        if(!chats){
            const chat = new Chat({
                participants : [userId , targetUserId],
                messages: [] 
            }) ;

            await chat.save() ;
        }
        res.json(chats) ;
    } catch (err) {
        console.log("Error in fetching chats :: " + err.message) ;
    }
})

module.exports = chatRouter ;