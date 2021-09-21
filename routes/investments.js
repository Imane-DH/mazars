const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Investment = require("../models/investment");
const uploadPath = path.join("public", Investment.FilePath);
const fileMimeTypes = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const Country = require("../models/country");
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, fileMimeTypes.includes(file.mimetype));
  },
});

// All investments Route
router.get("/", async (req, res) => {
  res.send("all Investments");
});

// New investment Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Investment());
});

// Create investment Route
router.post("/", upload.single("file"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const investment = new Investment({
    title: req.body.title,
    country: req.body.country,
    company: req.body.company,
    UplodedfileName: fileName,
    description: req.body.description,
  });

  try {
    const newInvestment = await investment.save();
    res.redirect("investments");
  } catch {
    if (investment.UplodedfileName != null) {
      removeInvestmentFile(investment.UplodedfileName);
    }
    renderNewPage(res, investment, true);
  }
});

function removeInvestmentFile(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, investment, hasError = false) {
  try {
    const countries = await Country.find({});
    const params = {
      countries: countries,
      investment: investment,
    };
    if (hasError) params.errorMessage = "Error Creating Book";
    res.render("investments/new", params);
  } catch {
    res.redirect("/investments");
  }
}

module.exports = router;
