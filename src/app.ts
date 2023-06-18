/* Importing Types */
import type { SocketWithUserId } from "./types-extensions.js";

/* Third party libraries */
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
/* Initializing the express server */
const app = express();
/* Creating an http server and registering the express server to handle endpoints */
import { createServer } from "http";
const server = createServer(app);
/* Creation of the socket.io server */
import { Socket, Server as SocketIOServer } from "socket.io";
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});
/* Express routers */
import authRouter from "./endpoints/express/auth.js";
import profileRouter from "./endpoints/express/profile.js";
/* Socket.io handlers */
import registerUserEvents from "./endpoints/socket.io/user.js";
import registerChatEvents from "./endpoints/socket.io/chat.js";
/* A function that creates passport strategies */
import passportStrategies from "./passport-config.js";
/* A function that implements a cache for JWT */
import verifyAndCacheToken from "./jwt-cache.js";
import * as JoiSchemas from "./joi-schemas.js";

dotenv.config({ path: "../.env" });

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

io.use(async (socket: SocketWithUserId, next) => {
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
  next();
});

io.on("connection", (socket: SocketWithUserId) => {
  socket.join(socket.userId);

  socket.use(async (_, next) => {
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

  registerUserEvents(io, socket);

  registerChatEvents(io, socket);

  socket.on("error", (err) => {
    io.to(socket.id).emit("error", err.message);
    if (err.message.startsWith("Not authenticated")) socket.disconnect();
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
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
