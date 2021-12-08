const mongoose = require("mongoose");

/* Ajouter une review */
const Review = mongoose.model("Review", {
  id_game: { type: String, required: true },
  name: {
    type: String,
    default: "",
  },
  rating: String,
  description: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created: String,
});

module.exports = Review;
