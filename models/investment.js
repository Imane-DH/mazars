const mongoose = require("mongoose");
const path = require("path");
const FilePath = "uploads/investmentFiles";

const investmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  company: {
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

investmentSchema.virtual("FilePath").get(function () {
  if (this.UplodedfileName != null) {
    return path.join("/", FilePath, this.fileName);
  }
});

module.exports = mongoose.model("Investment", investmentSchema);
module.exports.FilePath = FilePath;
