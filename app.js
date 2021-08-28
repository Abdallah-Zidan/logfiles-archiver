require("dotenv").config();

const path = require("path");
const { create } = require("archiver");
const { createWriteStream } = require("fs");
const { pipeline } = require("stream");
const { createGzip } = require("zlib");

const getPatterns = require("./globber");
const unlinkGlob = require("./unlink");
const config = require("./config");

const baseDir = config.baseDir;
const numberOfSkipped = config.numberOfSkipped;
const basePattern = config.basePattern;
const suffix = config.suffix;

async function main() {
  const patterns = getPatterns({
    numberOfSkipped,
    basePattern,
    suffix,
    baseDir: baseDir,
  });
  for (const pattern of patterns) {
    try {
      await archivePerPattern(pattern);
      await unlinkGlob(pattern.pattern, baseDir);
    } catch (error) {
      console.error(error);
    }
  }
}

main().catch(console.error);

async function archivePerPattern({ name, pattern }) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(path.join(baseDir, `${name}.tar.gz`));

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

    pipeline(archive, createGzip(), output, (err) => {
      if (err) {
        console.log(`error happened : ${err.message}`);
        reject(err);
      } else {
        console.log("done");
        resolve(archive.pointer());
      }
    });

    archive.glob(pattern, { cwd: baseDir, nonull: true });

    archive.finalize();
  });
}
