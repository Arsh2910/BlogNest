const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const tagRoutes = require("./routes/tag.routes");
const postRoutes = require("./routes/post.routes");
const errorMiddleware = require("./middleware/error.middleware");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/posts", postRoutes);
app.use(errorMiddleware);
module.exports = app;
