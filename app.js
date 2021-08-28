require("dotenv").config();
const config = require("./config");
const startArchiver = require("./archiver");
const startRotater = require("./rotater");

async function main() {
  const result = await startRotater(config.baseDir, "feo_[1-9]-out.log");
  console.log(result);
  await startArchiver(config);
}

main().catch(console.error);
