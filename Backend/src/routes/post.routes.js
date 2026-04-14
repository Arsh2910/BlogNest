const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});
const postController = require("../controllers/post.controller");
const commentController = require("../controllers/comment.controller");
const coverImageController = require("../controllers/cover.controller");
const validate = require("../middleware/validate.middleware");
const {
  createPostSchema,
  updatePostSchema,
} = require("../validators/post.validator");
const { authAdmin, authUser } = require("../middleware/auth.middleware");

router.post(
  "/",
  authAdmin,
  validate(createPostSchema),
  postController.createPost,
);
router.get("/", authUser, postController.getAllPosts);
router.get("/search", authUser, postController.searchPosts);
router.get("/:slug", authUser, postController.getPostBySlug);
router.patch(
  "/:slug",
  authAdmin,
  validate(updatePostSchema),
  postController.updatePost,
);
router.delete("/:slug", authAdmin, postController.deletePost);

router.post("/:postId/comments", authUser, commentController.createComment);
router.get("/:postId/comments", authUser, commentController.getAllComments);
router.delete(
  "/:postId/comments/:commentId",
  authUser,
  commentController.deleteComments,
);

router.post(
  "/:postId/cover",
  authAdmin,
  upload.single("coverImage"),
  coverImageController.createCoverImage,
);
module.exports = router;
