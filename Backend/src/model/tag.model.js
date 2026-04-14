const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
});

const tagModel = mongoose.model("tag", tagSchema);

module.exports = tagModel;
