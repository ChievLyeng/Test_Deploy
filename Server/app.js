const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoute = require("./src/routes/userRoute");
const AppError = require("./src/utils/appError")
const globalErrorHandler = require("./src/middlewares/globalErrorHandler")
const dotenv = require("dotenv");
dotenv.config({path: "./example.env"})
require("dotenv").config();

//app
const app = express();

// for sending cookie to frontend
const corsConfig = {
    origin: process.env.CLIENT_URL,
    methods: "GET, POST, PUT, PATCH, DELETE, HEAD",
    credentials: true,
  };

// middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))


// user route
app.use("/api/v1/users", userRoute);

// handle wrong route
app.all("*", (req,res,next) => {
  next( new AppError(`Can't find ${req.originalUrl} on this server!`,404));
})


app.use(globalErrorHandler)


module.exports = app;