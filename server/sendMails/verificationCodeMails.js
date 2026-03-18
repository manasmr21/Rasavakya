const nodemailer = require("nodemailer");
require("dotenv").config();

const senderMail = process.env.mail;
const senderPass = process.env.password;

const transporter = nodemailer.createTransport({
  service: "gmail", // simpler than host/port
  auth: {
    user: senderMail,
    pass: senderPass,
  },
});

// ✅ reusable mail sender (NO res here)
const mailSender = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      info,
    };
  } catch (error) {
    console.error("MAIL ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};



// ✅ SEND VERIFICATION CODE
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const mailOptions = {
      from: senderMail,
      to: email,
      subject: "Verify your email with OTP",
      text: `Your code for verification is: ${code}`,
    };

    const result = await mailSender(mailOptions);

    if (result.success) {
      return res.status(200).json({
        msg: "Email sent successfully",
        info: result.info,
      });
    } else {
      return res.status(400).json({
        error: "Email not sent",
        reason: result.error,
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};



// ✅ SEND RESET PASSWORD LINK
exports.sendResetPasswordLink = async (req, res) => {
  try {
    const { email, link } = req.body;

    const mailOptions = {
      from: senderMail,
      to: email,
      subject: "Reset your password",
      text: `Click on this link to reset your password: ${link}`,
    };

    const result = await mailSender(mailOptions);

    if (result.success) {
      return res.status(200).json({
        msg: "Email sent successfully",
        info: result.info,
      });
    } else {
      return res.status(400).json({
        error: "Email not sent",
        reason: result.error,
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};