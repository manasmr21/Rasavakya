const mongoose = require("mongoose");
const validator = require("validator");

const codeSchema = new mongoose.Schema({
    useremail: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email format",
        },
    },
    verificationCode: String,
    verificationCodeExpiresAt: Date,
    resetPasswordCode: String,
    resetPasswordCodeExpiresAt: Date,
}, { timestamps: true });

const userVerificationCodes = mongoose.model("userVerificationCodes", codeSchema);

module.exports = userVerificationCodes;
