const mongoose = require("mongoose");
const validator = require("validator");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    //schemas
    username: {
      type: String,
      required: true,
      trime: true,
    },
    useremail: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isLoggedin: {
      type: Boolean,
      default: false,
    },
    likedPosts: {
      type: [Schema.Types.ObjectId],
      refs: "Poems",
    },
    commentedPost: {
      type: [Schema.Types.ObjectId],
      refs: "Poems",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },

  { timestamps: true }
);

const secreteKey = process.env.secrete_key;

//CAUTION: MUST BE PLACED BEFORE HASHING PASSWORD
//Generating Authentication token
userSchema.methods.generateAuthToken = async function () {
  try {
    let authToken = jwt.sign({ _id: this._id }, secreteKey, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: authToken });

    await this.save();
    return authToken;
  } catch (error) {
    res.status(422).json(error);
  }
};

//Hasing the password before saving it.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const userDb = new mongoose.model("Users", userSchema);

module.exports = userDb;
