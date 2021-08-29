module.exports = {
  startRotater: require("./rotater"),
  startArchiver: require("./archiver"),
  createFiles: require("./create"),
  startJobs: require("./jobs/installjobs"),
  config: require("./config"),
};
