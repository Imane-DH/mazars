const express = require("express");
const router = express.Router();
const Pays = require("../models/pays");
const Investissement = require("../models/investissement");

// All countries Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.nom != null && req.query.nom !== "") {
    searchOptions.nom = new RegExp(req.query.nom, "i");
  }
  try {
    const payss = await Pays.find(searchOptions);
    res.render("payss/index", {
      payss: payss,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New country Route
router.get("/nouveau", (req, res) => {
  res.render("payss/nouveau", { pays: new Pays() });
});

// Create country Route
router.post("/", async (req, res) => {
  const pays = new Pays({
    nom: req.body.nom,
  });
  try {
    const nouveauPays = await pays.save();
    res.redirect(`payss/${nouveauPays.id}`);
  } catch {
    res.render("payss/nouveau", {
      payss: payss,
      errorMessage: "Error creating ",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pays = await Pays.findById(req.params.id);
    const investissements = await Investissement.find({ pays: pays.id })
      .limit(5)
      .exec();
    res.render("payss/show", {
      pays: pays,
      investissementParPays: investissements,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const pays = await Pays.findById(req.params.id);
    res.render("pays/edit", { pays: pays });
  } catch {
    res.redirect("/payss");
  }
});

router.put("/:id", async (req, res) => {
  let pays;
  try {
    pays = await Pays.findById(req.params.id);
    pays.nom = req.body.nom;
    await pays.save();
    res.redirect(`/payss/${pays.id}`);
  } catch {
    if (pays == null) {
      res.redirect("/");
    } else {
      res.render("payss/edit", {
        pays: pays,
        errorMessage: "Error updating country",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let pays;
  try {
    pays = await Pays.findById(req.params.id);
    await pays.remove();
    res.redirect(`/payss`);
  } catch {
    if (pays == null) {
      res.redirect("/");
    } else {
      res.redirect(`payss/${pays.id}`);
    }
  }
});

module.exports = router;
