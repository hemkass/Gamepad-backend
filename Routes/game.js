const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/form", (req, res) => {
  console.log("hello");
});

// l'ensemble des jeux
router.get("/games", async (req, res) => {
  let dates = req.query.dates;
  //console.log(dates);
  let ordering = "added";
  if (req.query.ordering) {
    ordering = req.query.ordering;
  }

  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  let size = 30;
  if (req.query.size) {
    size = req.query.size;
  }
  let platform = "1,2,3,4";
  if (req.query.parent_platforms) {
    platform = req.query.parent_platforms;
  }

  let search = "";
  if (req.query.search) {
    search = req.query.search;
    // console.log(search);
  }

  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.API}&ordering=${ordering}&page_size=${size}&page=${page}&dates=${dates}&parent_platforms=${platform}`
    );
    //console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

// Détail d'un jeu par l'ID
router.get("/games/:id", async (req, res) => {
  if (req.params.id) {
    let id = req.params.id;
    try {
      const response = await axios.get(
        `https://api.rawg.io/api/games/${id}?key=${process.env.API}`
      );

      res.json(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
});

module.exports = router;
