const tagModel = require("../model/tag.model");
const AppError = require("../utils/AppError");
const slugify = require("slugify");

async function createTag(req, res, next) {
  try {
    const { name } = req.body;

    const slug = slugify(name, { lower: true });
    // slugify("Node JS") → "node-js"
    // lower: true makes it all lowercase

    const tagAlreadyExists = await tagModel.findOne({ slug });
    if (tagAlreadyExists) {
      throw new AppError("Tag already exists", 409);
    }

    const tag = await tagModel.create({ name, slug });
    res.status(201).json({
      success: true,
      message: "Tag created succesfully",
      tag,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllTags(req, res, next) {
  try {
    const tags = await tagModel.find();
    res.status(200).json({
      success: true,
      tags,
    });
  } catch (err) {
    next(err);
  }
}
async function deleteTag(req, res, next) {
  const { id } = req.params;

  try {
    const tag = await tagModel.findByIdAndDelete(id);
    if (!tag) {
      throw new AppError("Tag not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTag,
  getAllTags,
  deleteTag,
};
