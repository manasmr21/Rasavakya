const mongoose = require("mongoose");
const { Schema } = mongoose;

const poemSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    useremail:{
        type : String,
        required : true
    }
    ,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required : true
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type : String,
        required : true
    },
    author: {
        type: String,
        required : true
    },
    poem: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    edited:{
        type : Boolean,
        default : false
    },
    likes:{
        type : [Schema.Types.ObjectId],
        refs : "Users"
    },
    comments:[
       { 
        userId : {
            type : Schema.Types.ObjectId,
            refs : "Users",
        },
        username:{
            type : String,
            refs : String,
        },
        comment : {
            type : String
        },
        createdAt : {
            type : Date,
            default : Date.now()
        }
    }
    ]
}, 
{ timestamps: true });

const poemsDb = new mongoose.model("Poems", poemSchema);

module.exports = poemsDb ;
