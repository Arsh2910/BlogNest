const z = require("zod");

const createTagSchema = z.object({
  name: z.string().min(2, "Tags should be minimum 2 characters"),
});

module.exports = { createTagSchema };
