module.exports = {
    apps: [{
        // Umum.
        name: "ckptw-wabot",
        script: "./index.js",

        // Fitur-fitur canggih.
        watch: true,
        ignore_watch: ["database.json", "node_modules", "state"],

        // Aliran kontrol.
        cron_restart: "*/30 * * * *"
    }]
};