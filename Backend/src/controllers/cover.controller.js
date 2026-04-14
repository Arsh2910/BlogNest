const postModel = require("../model/post.model");
const AppError = require("../utils/AppError");
const { uploadFile } = require("../services/storage.service");

async function createCoverImage(req, res, next) {
  const file = req.file;
  const { postId } = req.params;
  try {
    const posts = await postModel.findById(postId);
    if (!posts) {
      throw new AppError("Post not found", 404);
    }

    console.log("hit");

    const result = await uploadFile(
      file.buffer.toString("base64"),
      file.originalname,
    );
    const post = await postModel.findByIdAndUpdate(
      postId,
      { coverImage: result.url },
      { returnDocument: "after" },
    );
    res.status(200).json({
      success: true,
      message: "Cover image uploaded successfully",
      coverImage: post.coverImage,
    });
  } catch (err) {
    next(err);
  }
}
module.exports = { createCoverImage };
