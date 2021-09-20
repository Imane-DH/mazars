const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Investment", investmentSchema);
