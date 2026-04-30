const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const initializeSocket = (server) => {

    const getRoomId = (userId, targetUserId) => {
        return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");

    }

    const io = socket(server, {
        cors: {
            origin:"http://localhost:5173" ,
            credentials: true
        }
    })

    const onlineUsers = new Set();

    io.on("connection", (socket) => {
        socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
            const roomId = getRoomId(userId, targetUserId);
            console.log(firstName + " " + lastName + " joined room : " + roomId);
            socket.join(roomId);
        })

        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
            try {
                const roomId = getRoomId(userId, targetUserId);

                let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text
                })

                await chat.save();

                io.to(roomId).emit("messageReceived", { firstName, lastName, text });

            } catch (err) {
                console.log("Error in getting chats :: " + err.message);
            }
        })

        socket.on("userOnline", (userId) => {
            onlineUsers.add(userId);
            socket.userId = userId;

            socket.emit("onlineUsers", Array.from(onlineUsers));

            socket.broadcast.emit("userJoined", userId);
        });

        socket.on("disconnect", () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                io.emit("userLeft", socket.userId);
            }
        });
    })
}

module.exports = initializeSocket;