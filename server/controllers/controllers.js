const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userDb = require("../Schemas/UserSchema");
const userVerificationCodes = require("../Schemas/codeSchema");
const CryptoJS = require("crypto-js");

const {
  sendVerificationCode,
  sendResetPasswordLink,
} = require("../sendMails/verificationCodeMails");

//Create a user ------ Sign up API
exports.signup = async (req, res) => {
  try {
    const { encryptedUserData } = req.body;

    if (!encryptedUserData) {
      var { codedUserData } = req.body;

      var bytes = CryptoJS.AES.decrypt(
        codedUserData,
        "@encryptTheUserData@5969#$%"
      );

      var decodedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      const preuser = await userDb.findOne({ useremail: decodedUserData });

      if (preuser) {
        verifyTheUser(decodedUserData);
        return res
          .status(201)
          .json({ success: true, message: "OTP sent successfully" });
      }
    }

    var bytes = CryptoJS.AES.decrypt(
      encryptedUserData,
      "@encryptTheUserData@5969#$%"
    );
    var decodedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { username, useremail, password, cpassword } = decodedUserData;

    

    if (!username || !useremail || !password || !cpassword) {
      throw new Error("Please fill all the fields");
    }

    const preuser = await userDb.findOne({ useremail });

    if (preuser && !preuser.verified) {
      verifyTheUser(useremail);
      res
        .status(201)
        .json({ message: "User already exists. Please verify the user" });
    } else if (preuser && preuser.verified) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    } else {

      var newUser = await new userDb({
        username,
        useremail,
        password
      });

      verifyTheUser(useremail);

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User Created Successfully",
        newUser: {
          ...newUser._doc,
          password: undefined,
        },
      });
    }


    async function verifyTheUser(useremail) {

      if(!useremail){
        throw new Error("Please give an email");
      }

      const codeExists = await userVerificationCodes.findOne({ useremail });


      var verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      if (codeExists) {
        await userVerificationCodes.findByIdAndUpdate(
          { _id: codeExists._id },
          {
            verificationCode,
            verificationCodeExpiresAt: Date.now() + 60 * 1000,
          },
          { new: true }
        );

      } else {
        const newVerificationCode = new userVerificationCodes({
          useremail,
          verificationCode,
          verificationCodeExpiresAt: Date.now() + 60 * 1000,
        });
        await newVerificationCode.save();
      }


      sendVerificationCode(useremail, verificationCode);
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Verify the user via OTP
exports.verifyUser = async (req, res) => {
  try {
    const { useremail, verificationCode } = req.body;

    if (!useremail || !verificationCode) {
      throw new Error("Invalid user or OTP");
    }

    const userExist = await userVerificationCodes.findOne({
      useremail,
      verificationCode,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });

    const user = await userDb.findOne({ useremail });

    if (!userExist) {
      throw new Error("Invalid OTP");
    }
    user.verified = true;

    await user.save();
    await userVerificationCodes.deleteOne({ _id: userExist._id });

    res
      .status(201)
      .json({ success: true, message: "User verification successfull" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//Log in the user
exports.loginUser = async (req, res) => {
  try {
    const { data } = req.body;

    var bytes = CryptoJS.AES.decrypt(data, "@encryptTheUserData@5969#$%");
    var decodedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { useremail, password } = decodedUserData;

    if (!useremail || !password) {
      throw new Error("Invalid credentials");
    }

    const user = await userDb.findOne({ useremail });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throw new Error("Invalid credentials");
    }

    const token = await user.generateAuthToken();

    user.isLoggedin = true;
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      loggedIn: user.isLoggedin,
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, loggedIn: false, error: error.message });
  }
};

//Validate user
exports.validateUser = async (req, res) => {
  try {
    const validateUserOne = await userDb.findOne({ _id: req.userID });
    if (!validateUserOne) {
      return res
        .status(400)
        .json({ message: "Unauthorized access. Please log in first" });
    }

    if (!validateUserOne.isLoggedin) {
      throw new Error("User not logged in");
    }

    res
      .status(201)
      .json({
        success: true,
        message: "User is logged in",
        userData: {
          ...validateUserOne._doc,
          password: undefined
        },
      });
  } catch (error) {
    return res.status(401).json({ status: 401, error: error.message });
  }
};

//User logout
exports.logoutUser = async (req, res) => {
  try {
    req.rootUser.tokens = await req.rootUser.tokens.filter((currentElement) => {
      return currentElement.token !== req.token;
    });

    await req.rootUser.save();

    res
      .status(201)
      .json({ success: true, message: "User logged out", loggedIn: false });
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
};

// forgot password / send email to reset password

exports.forgotPassword = async (req, res) => {
  try {
    const { useremail } = req.body;

    if (!useremail) {
      throw new Error("Please enter your email.");
    }

    const user = await userDb.findOne({ useremail });

    if (!user) {
      throw new Error("User not found");
    }

    const resetPasswordCode = crypto.randomBytes(20).toString("hex");
    const resetPasswordCodeExpiresAt = Date.now() + 5 * 60 * 1000;

    const codeExists = await userVerificationCodes.findOne({ useremail });

    if (codeExists) {
      await userVerificationCodes.findByIdAndUpdate(
        { _id: codeExists._id },
        {
          resetPasswordCode,
          resetPasswordCodeExpiresAt: Date.now() + 5 * 60 * 1000,
        },

        { new: true }
      );
    } else {
      var userResetPassword = await new userVerificationCodes({
        useremail,
        resetPasswordCode,
        resetPasswordCodeExpiresAt,
      });

      await userResetPassword.save();
    }

    const link = `http://localhost:5173/reset-password/${resetPasswordCode}`;

    sendResetPasswordLink(useremail, link);

    res.status(200).json({
      success: true,
      message: "Link to reset password sent to your email",
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//reset the password now

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, cpassword } = req.body.passwords;

    if (!token || !password) {
      throw new Error("Invalid token or password");
    }

    if (password != cpassword) {
      throw new Error("Passwords does not match");
    }

    const userCodes = await userVerificationCodes.findOne({
      resetPasswordCode: token,
      resetPasswordCodeExpiresAt: { $gt: Date.now() },
    });

    if (!userCodes) {
      throw new Error("Invalid token");
    }

    const user = await userDb.findOne({ useremail: userCodes.useremail });

    user.password = password;

    await user.save();

    await userCodes.deleteOne({ _id: userCodes._id });

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//fetch a single user
exports.fetchUser = async(req, res)=>{
  try {
    const userId = req.query.userId

    if(!userId){
      return res.status(404).json({success : false, error : " User not found. "});
    }

    const userData = await userDb.findOne({_id : userId});

    if(!userData){
      throw new Error("User not found");
    }

    res.status(200).json({success : true, message : "User fetched successfully", userData :{
      ...userData._doc,
      password : undefined
    }})

  } catch (error) {
    return res.status(400).json({success : false, error : error.message});
  }
}
