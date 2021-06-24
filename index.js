require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const controller = require("./userController");
const port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connect = (async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("DATABASE IS CONNECTED");
  } catch (error) {
    console.log(error);
  }
})();

app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});

app.post("/api/signup", controller.signup);

app.post("/api/login", controller.login);

app.get("/api/confirm/:confirmationCode", controller.verifyUser);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
