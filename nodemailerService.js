require("dotenv").config();
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.USER_EMAIL, pass: process.env.USER_PASSWORD },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Please activate your account",
      html: `<h1>Email Confirmation</h1>
    <h2>Hello ${name}</h2>
    <p>Thank you for signing up!! To activate your account, please confirm your email by clicking on the following link</p>
    <a href=http://localhost:3000/api/confirm/${confirmationCode}> Click here</a>`,
    })
    .catch((err) => console.log(err));
};
