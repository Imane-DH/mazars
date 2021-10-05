const mongoose = require("mongoose");
const Investissement = require("./investissement");
const filiereSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});

filiereSchema.pre("remove", function (next) {
  Investissement.find({ filiere: this.id }, (err, investissement) => {
    if (err) {
      next(err);
    } else if (investissement.length > 0) {
      next(new Error("Cette filière a encore des investissements "));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Filiere", paysSchema);
