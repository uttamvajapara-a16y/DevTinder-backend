const express = require("express")
const connectDB = require("../config/db")
const User = require("../models/user")
const cookieParser = require("cookie-parser")

const authRouter = require("../routers/authRouter") ;
const profileRouter = require("../routers/profileRouter") ;
const requestRouter = require("../routers/requestRouter") ;
const userRouter = require("../routers/userRouter") ;
const chatRouter = require("../routers/chatRouter") ;
const cors = require("cors")
const http = require("http") ;
const initializeSocket = require("../utils/socket");

require("dotenv").config() ;

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173" ,
        "https://dev-tinder-web-nine-sand.vercel.app/"
    ],
    credentials: true
})) ;

app.use(express.json()) ;
app.use(cookieParser()) ;

app.use("/api" , authRouter) ;
app.use("/api" , profileRouter) ;
app.use("/api" , requestRouter) ;
app.use("/api" , userRouter) ;
app.use("/api" , chatRouter) ;

const server = http.createServer(app) ;
initializeSocket(server) ;

connectDB().then(() => {
    console.log("database connected successfully");
    server.listen(process.env.PORT , () => {
        console.log("Server is successfully listening on port 7777")
    });
}).catch((err) => {
    console.error("somthing went wrong " + err.message)
})