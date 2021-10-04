const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Investment = require("../models/investment");
const Country = require("../models/country");
const uploadPath = path.join("public", Investment.FilePath);
const fileMimeTypes = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, fileMimeTypes.includes(file.mimetype));
  },
});

// All investments Route
router.get("/", async (req, res) => {
  try {
    const investments = await Investment.find({});
    res.render("investments/index", {
      investments: investments,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
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
    CreatedAt: new Date(req.body.CreatedAt),
    UplodedfileName: fileName,
    description: req.body.description,
  });
  try {
    const newInvestment = await Investment.save(); // changed I
    res.redirect("/investments");
  } catch {
    if (investment.UplodedfileName != null) {
      removeInvestmentFile(investment.UplodedfileName);
    }
    renderNewPage(res, investment, true);
  }
});
//STILL NOT WORKING !!!!!!!!!
function removeInvestmentFile(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, investment, hasError = false) {
  try {
    const countries = await Country.find({});
    let params = {
      countries: countries,
      investment: investment,
    };
    ///STILL NOT WORKING !!!!!!!!!!!
    if (hasError) params = Error("Error Creating Investment"); // j'ai changé ça
    res.render("investments/new", params);
  } catch {
    res.redirect("/investments");
  }
}

module.exports = router;
