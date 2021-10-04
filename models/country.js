const mongoose = require("mongoose");
const Investment = require("./investment");
const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

countrySchema.pre("remove", function (next) {
  Investment.find({ country: this.id }, (err, investments) => {
    if (err) {
      next(err);
    } else if (investments.length > 0) {
      next(new Error("This Country / Organization has an investments still "));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Country", countrySchema);
