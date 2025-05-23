const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const senderMail = process.env.mail;
const senderPass = process.env.password;

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: senderMail,
    pass: senderPass,
  },
});

const mailSender = async (mailOptions) => {
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
          res
            .status(400)
            .json({
              success: false,
              message: error.message || "Error sending mail",
            });
        } else {
          resolve(info);
          res.status(200).json({ message: error.message });
        }
      });
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

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
