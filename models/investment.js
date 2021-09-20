const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  Company: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Country",
  },
  fileName: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Investment", investmentSchema);
