require("dotenv").config();
const minify = require("./lib/json.minify");
const fs = require("fs");

/**
 * @param {string} path
 * @returns {{ baseDir?: string; rotate?: {rotatePattern?: string,minFileSize?: number},archive?: {basePattern?: string,suffix?:string, numberOfSkipped?: number, compress?: boolean}}}
 */
function parseConfigFile(path) {
  return JSON.parse(minify(fs.readFileSync(path, "utf8")));
}

if (fs.existsSync("./config.jsonc")) {
  const config = parseConfigFile("./config.jsonc");
  module.exports = {
    baseDir: config.baseDir || "./logs",
    numberOfSkipped: config.archive?.numberOfSkipped || 0,
    basePattern: config.archive?.basePattern || "",
    suffix: config.archive?.suffix || "00-00-00.log",
    compress: [true, "true"].includes(config.archive?.compress) ? true : false,
    rotatePattern: config.rotate?.rotatePattern || ".+.log",
    minFileSize: +config.rotate?.minFileSize || 104857600,
  };
} else
  module.exports = {
    baseDir: process.env.BASE_DIR || "./logs",
    numberOfSkipped: +process.env.NUMBER_OF_SKIPPED || 0,
    basePattern: process.env.ARCHIVE_BASE_PATTERN || "",
    suffix: process.env.ARCHIVE_SUFFIX || "00-00-00.log",
    compress: [true, "true"].includes(process.env.COMPRESS) ? true : false,
    rotatePattern: process.env.ROTATE_PATTERN || ".+.log",
    minFileSize: +process.env.MIN_ROTATE_SIZE || 104857600,
  };
