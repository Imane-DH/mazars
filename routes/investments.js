const express = require("express");
const router = express.Router();
const Investment = require("../models/investment");

// All investments Route
router.get("/", async (req, res) => {
  res.send("all Investments");
});

// New investment Route
router.get("/new", (req, res) => {
  res.send("New Investment");
});

// Create investment Route
router.post("/", async (req, res) => {
  res.send("Create Investment");
});

module.exports = router;
