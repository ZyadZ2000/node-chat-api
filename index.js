/* Third party libraries */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

/* Node.js core libraries */
const path = require("path");

/* My own modules */
const authRouter = require("./endpoints/express/auth");
const profileRouter = require("./endpoints/profile");
const userRouter = require("./endpoints/user");
const passportStrategies = require("./passport-config");
const { sanitize } = require("../middleware/validate-sanitize");

dotenv.config();

const PORT = process.env.PORT || 3000;

passportStrategies();

app.use(sanitize);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use(passport.initialize());

/* Authentication */
app.use("/auth", authRouter);

/* Profile routes */
app.use("/profile", profileRouter);

/* Users routes */
app.use("/user", userRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;

  // Use Passport.js to authenticate the JWT token
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return next(new Error("Authentication error"));
    }

    // Add user ID to socket object
    socket.user = user;
    next();
  })(socket.request, {}, next);
});

// Error handling middleware
io.use((error, socket, next) => {
  console.error("Socket.IO error:", error.message);
});

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME,
  })
  .then(() => {
    server.listen(PORT);
  });
