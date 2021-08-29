const startRotater = require("../rotater");
const config = require("../config");
async function main() {
  console.log(process.env);
  await startRotater(config.baseDir, config.rotatePattern);
}

main()
  .then(process.exit)
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
