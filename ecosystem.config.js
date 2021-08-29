module.exports = {
  apps: [
    {
      script: "src/jobs/archive-job.js",
      name: "archiver",
      instances: 1,
      exec_mode: "fork",
      cron_restart: "0,30 * * * *",
      watch: false,
      autorestart: false,
    },
    {
      script: "src/jobs/rotate-job.js",
      name: "rotate-logs",
      instances: 1,
      exec_mode: "fork",
      cron_restart: "0,30 * * * *",
      watch: false,
      autorestart: false,
    },
  ],
};
