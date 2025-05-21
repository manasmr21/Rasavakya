const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Make sure .env is loaded correctly in production
dotenv.config({path: "../.env"}); // <-- No path needed if .env is in root

const senderMail = process.env.mail;
const senderPass = process.env.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderMail,
    pass: senderPass,
  },
});

const mailSender = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return { success: true, info: info.response };
  } catch (error) {
    console.error("Email sending error: ", error);
    return { success: false, error: error.message };
  }
};

// This should be inside an Express route handler so you have access to `res`
exports.sendVerificationCode = async (req, res) => {
  const { email, code } = req.body;

  const mailOptions = {
    from: senderMail,
    to: email,
    subject: "Verify your email with OTP",
    text: `Your code for verification is: ${code}`,
  };

  const result = await mailSender(mailOptions);
  if (result.success) {
    res.status(200).json({ msg: "Email sent successfully", info: result.info });
  } else {
    res.status(400).json({ error: "Email not sent", reason: result.error });
  }
};

exports.sendResetPasswordLink = async (req, res) => {
  const { email, link } = req.body;

  const mailOptions = {
    from: senderMail,
    to: email,
    subject: "Reset your password",
    text: `Click on this link to reset your password: ${link}`,
  };

  const result = await mailSender(mailOptions);
  if (result.success) {
    res.status(200).json({ msg: "Email sent successfully", info: result.info });
  } else {
    res.status(400).json({ error: "Email not sent", reason: result.error });
  }
};
