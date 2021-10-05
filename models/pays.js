const mongoose = require("mongoose");
const Investissement = require("./investissement");
const paysSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
});

paysSchema.pre("remove", function (next) {
  Investissement.find({ pays: this.id }, (err, investissement) => {
    if (err) {
      next(err);
    } else if (investissement.length > 0) {
      next(new Error("Ce pays a encore des investissements "));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Pays", paysSchema);
