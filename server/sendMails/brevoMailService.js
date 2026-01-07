const brevo = require("./brevoClient")
const dotenv = require("dotenv")
const path = require("path")

dotenv.config({ path: path.join(__dirname, '../.env') })

async function sendTestEmail(useremail, verificationCode) {
  return await brevo.sendTransacEmail({
    sender: {
      email: process.env.mail, // MUST be verified
      name: "Citizen Portal",
    },
    to: [{ email: useremail }],
    subject: "Brevo Test Email",
    htmlContent: "  <h1>Your verification code is: " + verificationCode + "</h1>",
  })
}

module.exports = { sendTestEmail }