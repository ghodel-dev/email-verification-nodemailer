require("dotenv").config();
const nodemailer = require("./nodemailerService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./userModel");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      const token = await jwt.sign({ email }, process.env.SECRET_KEY);

      const hashedPassword = await bcrypt.hashSync(password, 10);

      const user = await new User({
        username,
        email,
        password: hashedPassword,
        confirmationCode: token,
      }).save();

      const sendEmail = await nodemailer.sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
      );

      res.status(200).send({
        message:
          "User was registered successfully. Please check your email to activate your account",
      });
    } else {
      res.status(400).send({
        message: "User already registered.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "Wrong email or username" });
    }

    var checkPassword = await bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      return res.status(400).send({ message: "Wrong email or username" });
    }

    const token = await jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        status: user.status,
      },
      process.env.SECRET_KEY
    );

    res.status(200).send({
      message: "Succesfully log in.",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
};
