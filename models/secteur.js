const mongoose = require("mongoose");
const Investissement = require("./investissement");
const secteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});

secteurSchema.pre("remove", function (next) {
  Investissement.find({ secteur: this.id }, (err, investissement) => {
    if (err) {
      next(err);
    } else if (investissement.length > 0) {
      next(new Error("Ce secteur a encore des investissements "));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Secteur", secteurSchema);
