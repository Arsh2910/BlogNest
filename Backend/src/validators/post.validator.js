const z = require("zod");

const createPostSchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters long"),
  content: z.string().min(20, "Content should be at least 20 characters"),
  status: z.enum(["draft", "published"]).optional(),
  tags: z.array(z.string()).optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(20).optional(),
  status: z.enum(["draft", "published"]).optional(),
  tags: z.array(z.string()).optional(),
});
module.exports = { createPostSchema, updatePostSchema };
