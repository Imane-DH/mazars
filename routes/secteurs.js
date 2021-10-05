const express = require("express");
const router = express.Router();
const Secteur = require("../models/secteur");
const Investissement = require("../models/investissement");

// All secteurs Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.nom != null && req.query.nom !== "") {
    searchOptions.nom = new RegExp(req.query.nom, "i");
  }
  try {
    const secteurs = await Secteur.find(searchOptions);
    res.render("secteurs/index", {
      secteurs: secteurs,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New secteur Route
router.get("/nouveau", (req, res) => {
  res.render("secteurs/nouveau", { secteur: new Secteur() });
});

// Create secteur Route
router.post("/", async (req, res) => {
  const secteur = new Secteur({
    nom: req.body.nom,
  });
  try {
    const nouveauSecteur = await secteur.save();
    res.redirect(`secteurs/${nouveauSecteur.id}`);
  } catch {
    res.render("secteurs/nouveau", {
      secteur: secteur,
      errorMessage: "Error creating ",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const secteur = await Secteur.findById(req.params.id);
    const investissements = await Investissement.find({ secteur: secteur.id })
      .limit(5)
      .exec();
    res.render("secteurs/show", {
      secteur: secteur,
      investissementParSecteur: investissements,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const secteur = await Secteur.findById(req.params.id);
    res.render("secteur/edit", { secteur: secteur });
  } catch {
    res.redirect("/secteurs");
  }
});

router.put("/:id", async (req, res) => {
  let secteur;
  try {
    secteur = await Secteur.findById(req.params.id);
    secteur.nom = req.body.nom;
    await secteur.save();
    res.redirect(`/secteurs/${secteur.id}`);
  } catch {
    if (secteur == null) {
      res.redirect("/");
    } else {
      res.render("secteurs/edit", {
        secteur: secteur,
        errorMessage: "Error updating ",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let secteur;
  try {
    secteur = await Secteur.findById(req.params.id);
    await secteur.remove();
    res.redirect(`/secteurs`);
  } catch {
    if (secteur == null) {
      res.redirect("/");
    } else {
      res.redirect(`secteurs/${secteur.id}`);
    }
  }
});

module.exports = router;
