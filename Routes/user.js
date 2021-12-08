const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../Models/User");

/* SignUp */
router.post("/signup", async (req, res) => {
  console.log("hello");
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      res.status(428).json({ message: "This email already has an account." });
    } else {
      if (req.fields.email && req.fields.password && req.fields.username) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);
        const user = new User({
          email: req.fields.email,
          username: req.fields.username,
          token: token,
          salt: salt,
          hash: hash,
        });

        await user.save();
        res.json({
          _id: user._id,
          token: user.token,
          username: user.username,
        });
      } else
        res
          .status(428)
          .json({ message: "Tous les champs doivent être remplis" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

/* login */
router.post("/login", async (req, res) => {
  try {
    const isUser = await User.findOne({ email: req.fields.email });
    if (isUser) {
      const newHash = SHA256(req.fields.password + isUser.salt).toString(
        encBase64
      );
      res.status(200).json({
        _id: isUser._id,
        token: isUser.token,
        account: {
          username: isUser.username,
          email: isUser.email,
        },
      });
      if (newHash === isUser.hash) {
      }
    } else {
      res.json({ message: "Invalid mail / password" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
