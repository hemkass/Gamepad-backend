const express = require("express");
const router = express.Router();
const axios = require("axios");

// l'ensemble des jeux
router.get("/search", async (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  let size = 10;
  if (req.query.size) {
    size = req.query.size;
  }

  let search = "";
  if (req.query.search) {
    search = req.query.search;
    //console.log(search);
  }

  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.API}&page_size=${size}&page=${page}&search=${search}`
    );
    //console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});
module.exports = router;
