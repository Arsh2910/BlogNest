const commentModel = require("../model/comment.model");
const postModel = require("../model/post.model");

const AppError = require("../utils/AppError");
async function createComment(req, res, next) {
  const { content } = req.body;
  const { postId } = req.params;

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404);
    }
    const comment = await commentModel.create({
      content,
      author: req.user.id,
      post: postId,
    });
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllComments(req, res, next) {
  const { postId } = req.params;
  try {
    const post = await postModel.findById(postId);

    if (!post) {
      throw new AppError("Post not found", 404);
    }
    const comments = await commentModel
      .find({ post: postId })
      .populate("author", "username");
    if (comments.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No comments on this post",
        currentUserId: req.user.id,
        currentUserRole: req.user.role,
      });
    }
    res.status(200).json({
      success: true,
      message: "Comments Fetched succesfully",
      comments,
      currentUserId: req.user.id,
      currentUserRole: req.user.role,
    });
  } catch (err) {
    next(err);
  }
}
async function deleteComments(req, res, next) {
  const { commentId } = req.params;

  try {
    const comment = await commentModel.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      throw new AppError("You can't delete this comment", 403);
    }
    await commentModel.findByIdAndDelete(commentId);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
module.exports = { createComment, getAllComments, deleteComments };
