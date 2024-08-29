module.exports = {
    apps: [{
        // General.
        name: "ckptw-wabot",
        script: "./index.js",

        // Advanced features.
        instances: "max",
        exec_mode: "cluster",
        watch: true,
        ignore_watch: ["database.json", "node_modules", "state"],
        max_memory_restart: "300M",

        // Log files.
        log_date_format: "YYYY-MM-DD HH:mm Z",

        // Control flow.
        restart_delay: 5000,
        autorestart: true,
        cron_restart: "*/30 * * * *"
    }]
};