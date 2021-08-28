const fs = require("fs/promises");
const { join } = require("path");

async function unlinkFilesGlob(pattern, baseDir) {
  const files = (await fs.readdir(baseDir)).filter((f) => f.match(pattern));
  const promises = files.map((file) => fs.unlink(join(baseDir, file)));
  await Promise.all(promises);
}

module.exports = unlinkFilesGlob;
