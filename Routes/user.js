const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../Models/User");
const Review = require("../Models/Review");

const auth = require("../auth");

/* SignUp */
router.post("/signup", async (req, res) => {
  /*  console.log("hello"); */
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      res.status(428).json({ message: "This email already has an account." });
    } else {
      console.log("Etape1");
      if (req.fields.email && req.fields.password && req.fields.username) {
        console.log("Etape2");
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
        console.log("Etape3");
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

/* Creer une review lorsque l'on est connecté */

router.post("/review/add", auth, async (req, res) => {
  /*  console.log("hello"); */
  try {
    if (req.user) {
      const review = new Review({
        id_game: req.fields.id,
        name: req.fields.name,
        rating: req.fields.rating,
        description: req.fields.description,
        created: req.fields.created,
        owner: req.user,
      });

      await review.save();
      res.json({
        _id: review._id,
        rating: review.rating,
        description: review.description,
        owner: review.owner,
      });
    } else {
      res.status(428).json({ message: "Veuillez vous connecter" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

/* Afficher les reviews par date les plus récentes */

router.get("/reviews/:id", async (req, res) => {
  try {
    let page = 1;
    if (req.query.page) {
      page = Number(req.query.page);
    }

    let limit = 9;
    if (req.query.limit) {
      limit = Number(req.query.limit);
    }

    const reviews = await Review.find({ id_game: req.params.id })
      .populate({
        path: "owner",
        select: "username email",
      })
      .sort({ created: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments();

    res.json({ count: count, reviews: reviews });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
});

module.exports = router;
