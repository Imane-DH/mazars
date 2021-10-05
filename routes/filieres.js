const express = require("express");
const router = express.Router();
const Filiere = require("../models/filiere ");
const Investissement = require("../models/investissement");

// All filiere Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.nom != null && req.query.nom !== "") {
    searchOptions.nom = new RegExp(req.query.nom, "i");
  }
  try {
    const filieres = await Filiere.find(searchOptions);
    res.render("filieres/index", {
      filieres: filieres,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New country Route
router.get("/nouveau", (req, res) => {
  res.render("filieres/nouveau", { filiere: new Filiere() });
});

// Create country Route
router.post("/", async (req, res) => {
  const filiere = new Filiere({
    nom: req.body.nom,
  });
  try {
    const nouvelleFiliere = await filiere.save();
    res.redirect(`filieres/${nouvelleFiliere.id}`);
  } catch {
    res.render("filieres/nouveau", {
      filieres: filieres,
      errorMessage: "Error creating ",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const filiere = await Filiere.findById(req.params.id);
    const investissements = await Investissement.find({ filiere: filiere.id })
      .limit(5)
      .exec();
    res.render("filieres/show", {
      filiere: filiere,
      investissementParFiliere: investissements,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const filiere = await Filiere.findById(req.params.id);
    res.render("filiere/edit", { filiere: filiere });
  } catch {
    res.redirect("/filieres");
  }
});

router.put("/:id", async (req, res) => {
  let filiere;
  try {
    filiere = await Filiere.findById(req.params.id);
    filiere.nom = req.body.nom;
    await filiere.save();
    res.redirect(`/filieres/${filiere.id}`);
  } catch {
    if (filiere == null) {
      res.redirect("/");
    } else {
      res.render("filieres/edit", {
        filiere: filiere,
        errorMessage: "Error updating ",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let filiere;
  try {
    filiere = await Filiere.findById(req.params.id);
    await filiere.remove();
    res.redirect(`/filieres`);
  } catch {
    if (filiere == null) {
      res.redirect("/");
    } else {
      res.redirect(`filieres/${filiere.id}`);
    }
  }
});

module.exports = router;
