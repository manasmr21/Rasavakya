const jwt = require("jsonwebtoken");
const userDb = require("../Schemas/UserSchema")
const dotenv = require("dotenv");

dotenv.config();

const secreteKey = process.env.secrete_key;

const authenticate = async (req,res,next) => {
    try{

        const token = req.headers.authorization;

        const verifyUserToken = jwt.verify(token, secreteKey);

        const rootUser = await userDb.findOne({_id:verifyUserToken._id});
        
        if(!rootUser){
            throw new Error("User not found. Please log in.");
        }
        

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        
        next();
    } catch (error) {
       return res.status(401).json({status:401, error: "User not logged in."})
     }

}

module.exports = authenticate;