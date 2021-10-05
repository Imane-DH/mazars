const mongoose = require("mongoose");
const path = require("path");
const FilePath = "uploads/investissementFiles";

const investissementSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  pays: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Pays",
  },
  secteur: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Secteur",
  },
  filiere: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Filiere",
  },
  typologie: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Typologie",
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fileName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

investissementSchema.virtual("FilePath").get(function () {
  if (this.UplodedfileName != null) {
    return path.join("/", FilePath, this.fileName);
  }
});

module.exports = mongoose.model("Investissement", investissementSchema);

module.exports.FilePath = FilePath;
