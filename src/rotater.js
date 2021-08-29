const fs = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");
const zlib = require("zlib");
const { join } = require("path");
const { pipeline } = require("stream");
const moment = require("moment");

const { listFilesByPattern } = require("./globber");

async function startRotater(baseDir, pattern, minSize) {
  const files = await listFilesByPattern(pattern, baseDir);
  const promises = files.map(fileProcessor(baseDir, minSize));
  return await Promise.all(promises);
}

function fileProcessor(baseDir, minSize) {
  return async function processFile(fileName) {
    const output = {
      fileName,
      rotated: { read: 0, written: 0 },
      truncated: false,
    };
    try {
      const check = await checkFileSize(fileName, baseDir, minSize);
      if (!check) return output;
      const data = await rotateFile(fileName, baseDir);
      output.rotated = data;
      await truncateFile(fileName, baseDir);
      output.truncated = true;
      return output;
    } catch (error) {
      console.log(error);
      return output;
    }
  };
}
async function checkFileSize(file, baseDir, minSize) {
  const size = (await fs.stat(join(baseDir, file))).size;
  return size > minSize;
}
async function truncateFile(fileName, baseDir) {
  await fs.truncate(join(baseDir, fileName));
}

function getRotatedName(fileName) {
  const time = moment().format("YYYY-MM-DD_HH-mm-ss");
  return fileName.substr(0, fileName.length - 4) + "__" + time + ".log.gz";
}

function rotateFile(fileName, baseDir) {
  return new Promise((resolve, reject) => {
    const roatedName = getRotatedName(fileName);
    const outputStream = createWriteStream(join(baseDir, roatedName));
    const inputStream = createReadStream(join(baseDir, fileName));

    const gzipStream = zlib.createGzip({
      level: zlib.constants.Z_BEST_COMPRESSION,
      memLevel: zlib.constants.Z_BEST_COMPRESSION,
    });

    pipeline(inputStream, gzipStream, outputStream, (err) => {
      if (err) {
        inputStream.destroy();
        outputStream.destroy();
        gzipStream.destroy();
        reject(err);
      } else
        resolve({
          written: outputStream.bytesWritten / 1024 / 1024 + "Mib",
          read: inputStream.bytesRead / 1024 / 1024 + "Mib",
        });
    });
  });
}
module.exports = startRotater;
