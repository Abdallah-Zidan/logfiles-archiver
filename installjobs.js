const { exec } = require("child_process");

function startJobs() {
  return new Promise((resolve, reject) => {
    exec("pm2 start ecosystem.config.js", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
}
module.exports = startJobs;
