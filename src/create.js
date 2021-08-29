const fs = require("fs");
const { join } = require("path");
let data = "d   ta\n";
/**
 *
 * @param {string[]} names
 */
module.exports = async function (names, baseDir, word) {
  data = (word || data).repeat(10000000);
  if (Array.isArray(names) && names.length > 0)
    for (let name of names) {
      if (baseDir) name = join(baseDir, name);
      for (let i = 0; i < 30; i++) {
        try {
          await fs.promises.appendFile(name, data);
        } catch (error) {
          console.log(error);
        }
      }
    }
};
