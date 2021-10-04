const express = require("express");
const router = express.Router();
const Country = require("../models/country");
const Investment = require("../models/investment");

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
    res.redirect(`countries/${newCountry.id}`);
  } catch {
    res.render("countries/new", {
      country: country,
      errorMessage: "Error creating country",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    const investments = await Investment.find({ country: country.id })
      .limit(5)
      .exec();
    res.render("countries/show", {
      country: country,
      investmentsByCountry: investments,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    res.render("countries/edit", { country: country });
  } catch {
    res.redirect("/countries");
  }
});

router.put("/:id", async (req, res) => {
  let country;
  try {
    country = await Country.findById(req.params.id);
    country.name = req.body.name;
    await country.save();
    res.redirect(`/countries/${country.id}`);
  } catch {
    if (country == null) {
      res.redirect("/");
    } else {
      res.render("countries/edit", {
        country: country,
        errorMessage: "Error updating country",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let country;
  try {
    country = await Country.findById(req.params.id);
    await country.remove();
    res.redirect(`/countries`);
  } catch {
    if (country == null) {
      res.redirect("/");
    } else {
      res.redirect(`countries/${country.id}`);
    }
  }
});

module.exports = router;
