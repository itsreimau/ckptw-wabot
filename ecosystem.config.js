module.exports = {
    apps: [{
        // General.
        name: "ckptw-wabot",
        script: "./index.js",

        // Advanced features.
        watch: true,
        ignore_watch: ["database.json", "node_modules", "state"],

        // Control flow.
        restart_delay: 5000,
        autorestart: true,
        cron_restart: "*/30 * * * *"
    }]
};