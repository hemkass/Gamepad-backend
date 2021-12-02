const express = require("express");
const router = express.Router();
const axios = require("axios");

// Route pour trouver la bonne plateform
router.get("/platform", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/platforms?key=${process.env.API}`
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

// Route pour trouver la plateform parent
router.get("/platform/list", async (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  let size = 10;
  if (req.query.size) {
    size = req.query.size;
  }
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/platforms/lists/parents?key=${process.env.API}&page_size=${size}&page=${page}`
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
