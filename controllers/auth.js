const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");

const crypto = require("crypto");

const User = require("../models/user");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      process.env.BCRYPT_SALT_ROUNDS
    );

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send({ message: info.message });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).send({ token });
  })(req, res, next);
};

exports.googleLogin = (req, res, next) => {
  const token = jwt.sign({ sub: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).send({ token });
};

exports.resetPassword = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return next(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        user.token = token;
        user.tokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((user) => {
        /*
          Send Email with a link with the token
        */
        return sgMail.send({
          to: email,
          from: "zyad.enaba2000@gmail.com",
          subject: "Password Reset Request",
          html: `<p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`,
        });
      })
      .then(() => {
        res.status(200).json({ message: "Email sent." });
      })
      .catch((err) => {
        next(err);
      });
  });
};

exports.confirmReset = (req, res, next) => {
  const token = req.body.token;
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email,
    token: token,
    tokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      return bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS);
    })
    .then((hashedPass) => {
      user.password = hashedPass;
      user.token = undefined;
      user.tokenExpiration = undefined;
      return user.save();
    })
    .then(() => {
      return res.status(201).json({ message: "Password reset successfully" });
    })
    .catch((err) => {
      next(err);
    });
};
