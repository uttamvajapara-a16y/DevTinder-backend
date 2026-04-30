const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user") ;

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUser = req.user;
        const fromUserId = fromUser._id;
        const status = req.params.status;
        const toUserId = req.params.toUserId;

        const ALLOWED_STATUS = ["interested" , "ignored"] ;
        if(!ALLOWED_STATUS.includes(status)){
            res.status(400).json({message : "Invalid status type " + status}) ;
        }

        if(fromUserId === toUserId) throw new Error ("You can not send request to your self") ;

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId , toUserId} ,
                {fromUserId : toUserId , toUserId : fromUserId}     
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send("connectin request already exists") ;
        }

        const toUser = await User.findById(toUserId) ;
        if(!toUser) {
            return res.status(400).json({message : "User not found"}) ;
        }

        const connectinRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        await connectinRequest.save();

        if(status === "interested"){
            res.send(fromUser.firstName + " interested in " + toUser.firstName);
        } else {
            res.send(fromUser.firstName + " ignored " + toUser.firstName) ;
        }

    } catch (err) {
        res.status(400).send("Error : " + err.message) ;
    }
})

requestRouter.post("/request/review/:status/:requestId" , userAuth , async (req , res) => {
    try{
        const loggedinUser = req.user ;
        const {status , requestId} = req.params

        const ALLOWED_STATUS = ["accepted" , "rejected"] ;
        if(!ALLOWED_STATUS.includes(status)){
            return res.json({message : "status is not allowed"}) ;
        }

        const connectinRequest = await ConnectionRequest.findOne({
            _id : requestId ,
            toUserId : loggedinUser._id ,
            status : "interested"                 
        })
        if(!connectinRequest){
            return res.status(404).json({message : "request not found"}) ;
        }

        connectinRequest.status = status ;
        const data = await connectinRequest.save() ;

        res.json({message : "Connection request " + status , data}) ;
    } catch (err) {
        res.status(400).send("Error : " + err.message) ;
    }
})

module.exports = requestRouter;