module.exports = {
    apps: [{
        // Umum
        name: "ckptw-wabot",
        script: "./index.js",

        // Fitur-fitur canggih
        watch: true,
        ignore_watch: ["node_modules", "state", "database.json"],

        // Aliran kontrol
        cron_restart: "*/30 * * * *"
    }]
};