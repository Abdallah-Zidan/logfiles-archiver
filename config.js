module.exports = {
  baseDir: process.env.BASE_DIR || "./logs",
  numberOfSkipped: +process.env.NUMBER_OF_SKIPPED || 0,
  basePattern: process.env.BASE_PATTERN || "",
  suffix: process.env.SUFFIX || "00-00-00.log",
  compress: [true, "true"].includes(process.env.COMPRESS) ? true : false,
};
