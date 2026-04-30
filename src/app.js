const express = require("express")
const connectDB = require("../config/db")
const User = require("../models/user")
const cookieParser = require("cookie-parser")

const authRouter = require("../routers/authRouter");
const profileRouter = require("../routers/profileRouter");
const requestRouter = require("../routers/requestRouter");
const userRouter = require("../routers/userRouter");
const chatRouter = require("../routers/chatRouter");
const cors = require("cors")
const http = require("http");
const initializeSocket = require("../utils/socket");

require("dotenv").config();

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://dev-tinder-web-nine-sand.vercel.app",
    process.env.VERCEL_FRONTEND_LINK
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB().then(() => {
    console.log("database connected successfully");
    server.listen(process.env.PORT, () => {
        console.log("Server is successfully listening on port 7777")
    });
}).catch((err) => {
    console.error("something went wrong " + err.message)
})