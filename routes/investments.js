const express = require("express");
const router = express.Router();
const Investment = require("../models/investment");

// All Investments Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const investments = await Investment.find(searchOptions);
    res.render("investments/index", {
      investments: investments,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Investment Route
router.get("/new", (req, res) => {
  res.render("investments/new", { investment: new Investment() });
});

// Create Investment Route
router.post("/", async (req, res) => {
  const investment = new Investment({
    name: req.body.name,
  });
  try {
    const newInvestment = await investment.save();

    res.redirect(`investments`);
  } catch {
    res.render("investments/new", {
      investment: investment,
      errorMessage: "Error creating investment",
    });
  }
});

module.exports = router;
