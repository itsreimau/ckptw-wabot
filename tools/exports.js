// Ekspor modul atau fungsi yang diperlukan
const tools = {
    api: require("./api.js"),
    cmd: require("./cmd.js"),
    list: require("./list.js"),
    msg: require("./general.js")
};

module.exports = tools;