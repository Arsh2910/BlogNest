const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");
const { authAdmin } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createTagSchema } = require("../validators/tag.validator");

router.post("/", authAdmin, validate(createTagSchema), tagController.createTag);
router.get("/", tagController.getAllTags);
router.delete("/:id", authAdmin, tagController.deleteTag);

module.exports = router;
