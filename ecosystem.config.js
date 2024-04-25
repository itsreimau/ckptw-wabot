module.exports = {
    apps: [{
        name: "rei-ayanami",
        script: "./index.js",
        watch: true,
        ignore_watch: ["database.json", "node_modules", "state"]
    }]
};