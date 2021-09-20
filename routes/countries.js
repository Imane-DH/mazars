const express = require("express");
const router = express.Router();
const Country = require("../models/country");

// All countries Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const countries = await Country.find(searchOptions);
    res.render("countries/index", {
      countries: countries,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New country Route
router.get("/new", (req, res) => {
  res.render("countries/new", { country: new Country() });
});

// Create country Route
router.post("/", async (req, res) => {
  const country = new Country({
    name: req.body.name,
  });
  try {
    const newCountry = await country.save();

    res.redirect(`countries`);
  } catch {
    res.render("countries/new", {
      country: country,
      errorMessage: "Error creating country",
    });
  }
});

module.exports = router;
