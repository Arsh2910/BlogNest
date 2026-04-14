const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED TO DB");
  } catch (err) {
    console.log("error connecting to DB", err);
  }
}
module.exports = connectDB;
