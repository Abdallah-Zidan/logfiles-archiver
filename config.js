require("dotenv").config();
module.exports = {
  baseDir: process.env.BASE_DIR || "./logs",
  numberOfSkipped: +process.env.NUMBER_OF_SKIPPED || 0,
  basePattern: process.env.ARCHIVE_BASE_PATTERN || "",
  suffix: process.env.ARCHIVE_SUFFIX || "00-00-00.log",
  compress: [true, "true"].includes(process.env.COMPRESS) ? true : false,
  rotatePattern: process.env.ROTATE_PATTERN || ".+.log",
  minFileSize: +process.env.MIN_ROTATE_SIZE || 104857600,
};
