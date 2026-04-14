const { ImageKit } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
async function uploadFile(file, fileName) {
  const result = await imagekit.files.upload({
    file,
    fileName: fileName || "coverImage_" + Date.now(),
    folder: "blognest/covers",
  });
  return result;
}
module.exports = { uploadFile };
