const express = require("express");
const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");
var cors = require("cors");

const app = express();
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(formidableMiddleware());
app.use(cors());

const userRoutes = require("./Routes/user");
app.use(userRoutes);
const gameRoutes = require("./Routes/game");
app.use(gameRoutes);

const gameSearch = require("./Routes/search");
app.use(gameSearch);

const gamePlatforms = require("./Routes/platform");
app.use(gamePlatforms);

app.get("/", (req, res) => {
  res.json({ message: "Welcome on Marvel API" });
});

app.all("*", (req, res) => {
  res.json({ message: "this page does not exist" });
});

app.listen(process.env.PORT, () => console.log("Server started"));
