const nodemailer = require("nodemailer");
const dotenv = require("dotenv");


dotenv.config({path: "../.env"});

senderMail = process.env.mail;
senderPass = process.env.password;


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: senderMail,
    pass: senderPass,
  },
})

const mailSender = (mailOptions)=>{
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).json({ error: "Email not sent" });
        } else {
          res.status(200).json({ msg: "Email sent successfully", info : info.response });
        }
      });
}

exports.sendVerificationCode = (email, code)=>{
    const mailOptions = {
        from: "manasmanthan123456@gmail.com",
        to: email,
        subject: "Sending email to verify through otp",
        text: `Your code for verification is ${code}`,
      };

      mailSender(mailOptions);
}

exports.sendResetPasswordLink = (email, link) => {
  const mailOptions = {
    from: "manasmanthan123456@gmail.com",
    to: email,
    subject: "Reset your password",
    text: `Click on this link to reset your password : ${link}`,
  };

  mailSender(mailOptions);
}
