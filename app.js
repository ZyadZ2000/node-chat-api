/* Third party libraries */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");

/* Initializing the express server */
const app = express();

/* Creating an http server and registering the express server to handle endpoints */
const server = require("http").createServer(app);

/* Creation of the socket.io server */
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

/* Express routers */
const authRouter = require("./endpoints/express/auth");
const profileRouter = require("./endpoints/express/profile");

/* Socket.io handlers */
const registerUserHandlers = require("./endpoints/socket.io/user");

/* A function that creates passport strategies */
const passportStrategies = require("./passport-config");

/* A function that implements a cache for JWT */
const verifyAndCacheToken = require("./jwt-cache");

const JoiSchemas = require("./joi-schemas");

dotenv.config();

const PORT = process.env.PORT || 3000;

passportStrategies();

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

app.use((req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Not authenticated"));

  const { error } = JoiSchemas.jwtSchema.validate(token);
  if (error) {
    return next(new Error("Not authenticated"));
  }

  let decodedToken;
  try {
    decodedToken = await verifyAndCacheToken(token);
  } catch (error) {
    return next(new Error("Not authenticated"));
  }
  socket.userId = decodedToken.userId;
  socket.join(socket.userId);
  next();
});

io.on("connection", (socket) => {
  /* You can also sanitize here */
  socket.join(socket.userId);

  socket.use(async ([event, ...args], next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Not authenticated"));

    const { error } = JoiSchemas.jwtSchema.validate(token);
    if (error) {
      return next(new Error("Not authenticated"));
    }

    try {
      await verifyAndCacheToken(token);
    } catch (error) {
      return next(new Error("Not authenticated"));
    }

    next();
  });

  registerUserHandlers(io, socket);

  socket.on("error", (err) => {
    io.to(socket.id).emit("error", err.message);
    if (err.message === "Not authenticated") socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DATABASE_NAME,
  })
  .then(() => {
    server.listen(PORT);
  });
