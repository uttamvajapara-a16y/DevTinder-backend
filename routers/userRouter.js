const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");


const userRouter = new express.Router();

const USER_SAFE_DATA = "firstName lastName about age gender skills photoUrl"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;
        const connectinRequests = await ConnectionRequest.find({
            toUserId: loggedinUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({ message: "connection requests : ", data: connectinRequests });
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedinUser._id, status: "accepted" },
                { fromUserId: loggedinUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connections.map((row) => {
            console.log(row);
            if (row.fromUserId._id.toString() === loggedinUser._id.toString()) {
                const dataToSend = { data: row.toUserId, _id: row._id }
                console.log(dataToSend)
                return dataToSend;
            } else {
                const dataToSend = { data: row.fromUserId, _id: row._id }
                console.log(dataToSend)
                return dataToSend;
            }
        });
        res.json({ data });
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})

userRouter.delete("/user/removeConnection/:connectionId", userAuth, async (req, res) => {
    try {
        let { connectionId } = req.params;
        connectionId = new mongoose.Types.ObjectId(connectionId);
        const request = await ConnectionRequest.findOneAndDelete({
            $or: [
                { _id: connectionId, fromUserId: req.user._id, status: "accepted" },
                { _id: connectionId, toUserId: req.user._id, status: "accepted" }
            ]
        });
        if (!request) throw new Error("Connection not found");
        res.json({ message: "connection removed successfully", data: request });
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedinUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectinRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedinUser._id }, { toUserId: loggedinUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        connectinRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedinUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(users);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})

module.exports = userRouter;