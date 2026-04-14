const z = require("zod");

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.username || data.email, {
    message: "Username or email is required",
  });

module.exports = { registerSchema, loginSchema };
