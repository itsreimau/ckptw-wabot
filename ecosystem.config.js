module.exports = {
  apps : [{
    name   : "rei-ayanami",
    script : "./index.js",
    watch  : true,
    ignore_watch : ["node_modules", "state"],
    max_memory_restart: '1G'
  }]
};