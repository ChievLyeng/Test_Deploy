const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: "./example.env"})
require("dotenv").config();

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database is connected!")
    })
};

module.exports = connectDB;
