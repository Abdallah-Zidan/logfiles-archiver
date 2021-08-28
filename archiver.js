const path = require("path");
const { create } = require("archiver");
const { createWriteStream } = require("fs");
const { pipeline } = require("stream");
const { createGzip } = require("zlib");
const { getGlobByMonthObjects, listFilesByPattern } = require("./globber");
const unlinkGlob = require("./unlink");
/**
 *
 * @param {import("./types").IArchiverOpts} config
 */
async function startArchiver(config) {
  const patterns = getGlobByMonthObjects(config);
  for (const { pattern, name } of patterns) {
    try {
      const files = await listFilesByPattern(pattern, config.baseDir);
      if (files.length > 0) {
        await archiveFiles(files, config.baseDir, name, config.compress);
        await unlinkGlob(pattern, config.baseDir);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function archiveFiles(filesArray, baseDir, outputName, compress) {
  if (filesArray.length < 1) return;
  console.log(outputName);
  return new Promise((resolve, reject) => {
    outputName = compress ? `${outputName}.tar.gz` : `${outputName}.tar`;
    const output = createWriteStream(path.join(baseDir, outputName));
    const archive = create("tar");
    output.on("close", function () {
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });

    output.on("end", function () {
      console.log("Data has been drained");
    });

    archive.on("warning", function (err) {
      if (err.code === "ENOENT") {
        console.log(err);
      } else {
        throw err;
      }
    });

    archive.on("error", function (err) {
      throw err;
    });

    for (const file of filesArray) {
      console.log(file);
      archive.file(path.join(baseDir, file), { name: file });
    }

    if (compress)
      pipeline(archive, createGzip(), output, (err) => {
        if (err) {
          console.log(`error happened : ${err.message}`);
          reject(err);
        } else {
          console.log("done");
          resolve(archive.pointer());
        }
      });
    else
      pipeline(archive, output, (err) => {
        if (err) {
          console.log(`error happened : ${err.message}`);
          reject(err);
        } else {
          console.log("done");
          resolve(archive.pointer());
        }
      });
    archive.finalize();
  });
}

module.exports = startArchiver;
