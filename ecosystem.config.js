module.exports = {
    apps: [{
        name: "ckptw-wabot",
        script: "./index.js",
        watch: true,
        ignore_watch: ["database.json", "node_modules", "state"],
        cron_restart: "0 * * * *"
    }]
};