const postModel = require("../model/post.model");
const slugify = require("slugify");
const AppError = require("../utils/AppError");

async function createPost(req, res, next) {
  const { title, content, status, tags } = req.body;
  try {
    const slug = slugify(title, { lower: true });

    const postAlreadyExists = await postModel.findOne({ slug });

    if (postAlreadyExists) {
      throw new AppError("Post Already Exists with the same title", 409);
    }
    const post = await postModel.create({
      title,
      content,
      slug,
      status,
      tags,
      author: req.user.id,
    });
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllPosts(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter =
      req.user.role === "admin"
        ? {} // admin sees all posts
        : { status: "published" }; // user sees only published

    const posts = await postModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
}
async function getPostBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const post = await postModel.findOne({ slug });
    if (!post) {
      throw new AppError("Post does not exists", 404);
    }
    if (post.status === "draft" && req.user.role !== "admin") {
      throw new AppError("Post not found", 404);
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const { slug } = req.params;
    const { title, content, status, tags } = req.body;

    const updateData = { content, status, tags };

    if (title) {
      updateData.title = title;
      updateData.slug = slugify(title, { lower: true });
    }

    const post = await postModel.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const { slug } = req.params;
    const post = await postModel.findOneAndDelete({ slug });
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function searchPosts(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      throw new AppError("Search query is required", 400);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await postModel
      .find({
        $text: { $search: q },
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  searchPosts,
};
