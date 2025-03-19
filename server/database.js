const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbUrl = process.env.database_URL;

const connectToDb = async ()=>{
    await mongoose.connect(dbUrl);
    console.log("Connected to db");
}

module.exports = connectToDb;