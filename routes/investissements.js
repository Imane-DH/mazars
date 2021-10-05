const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Investissement = require("../models/investissement");
const Pays = require("../models/pays");
const uploadPath = path.join("public", Investissement.FilePath);
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
    const investissements = await Investissement.find({});
    res.render("investissements/index", {
      investissements: investissements,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New investment Route
router.get("/nouveau", async (req, res) => {
  renderNewPage(res, new Investissement());
});

// Create investment Route
router.post("/", upload.single("file"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const investissement = new Investissement({
    titre: req.body.titre,
    pays: req.body.pays,
    secteur: req.body.secteur,
    filière: req.body.filière,
    date: new Date(req.body.date),
    UplodedfileName: fileName,
    description: req.body.description,
  });
  try {
    const nouveauInvestissement = await Investissement.save();
    res.redirect("/investissements");
  } catch {
    if (investissement.UplodedfileName != null) {
      removeInvestmentFile(investissement.UplodedfileName);
    }
    renderNewPage(res, investissement, true);
  }
});
//STILL NOT WORKING !!!!!!!!!
function removeInvestmentFile(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    if (err) console.error(err);
  });
}

async function renderNewPage(res, investissement, hasError = false) {
  try {
    const pays = await Pays.find({});
    let params = {
      pays: pays,
      investissement: investissement,
    };
    ///STILL NOT WORKING !!!!!!!!!!!
    if (hasError) params = Error("Error Creating Investment");
    res.render("investissements/nouveau", params);
  } catch {
    res.redirect("/investissements");
  }
}

module.exports = router;
