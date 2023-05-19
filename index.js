/* Third party libraries */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");

/* Node.js core libraries */
const path = require("path");

/* My own modules */
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const passportStrategies = require("./configuration/passport");

dotenv.config();

const PORT = process.env.PORT || 3000;

passportStrategies();

const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use(passport.initialize());

/* Authentication */
app.use("/", authRouter);

/* User routes */
app.use("/", userRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME,
  })
  .then(() => {
    app.listen(PORT);
  });
