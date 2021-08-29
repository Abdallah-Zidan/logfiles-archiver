const startArchiver = require("../archiver");
const config = require("../../config");

async function main() {
  await startArchiver(config);
}

main()
  .then(process.exit)
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
