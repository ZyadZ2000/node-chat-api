import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import crypto from "crypto";
import util from "util";

import User from "../../models/user.js";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    const user = new User({
      email: email,
      password: hashedPassword,
      username: username,
    });

    await user.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = (req, res) => {
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).send({ token });
};

export const googleLogin = (req, res) => {
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).send({ token });
};

export const resetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "email not found" });

    const randomBytesAsync = util.promisify(crypto.randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    user.token = token;
    user.tokenExpiration = Date.now() + 3600000;
    await user.save();

    await sgMail.send({
      to: email,
      from: "zyad.enaba2000@gmail.com",
      subject: "Password Reset Request",
      html: `<p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`,
    });

    return res.status(200).json({ message: "Email sent." });
  } catch (error) {
    next(error);
  }
};

export const confirmReset = (req, res, next) => {
  const token = req.body.token;
  const email = req.body.email;
  const password = req.body.password;
  let foundUser = null;
  User.findOne({
    email: email,
    token: token,
    tokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      foundUser = user;
      return bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
    })
    .then((hashedPass) => {
      foundUser.password = hashedPass;
      foundUser.token = undefined;
      foundUser.tokenExpiration = undefined;
      return foundUser.save();
    })
    .then(() => {
      return res.status(201).json({ message: "Password reset successfully" });
    })
    .catch((err) => {
      next(err);
    });
};
