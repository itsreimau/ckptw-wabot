const {
    api,
    general
} = require("../tools/exports.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: "server",
    category: "info",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = api.createUrl("http://ip-api.com", "/json", {});

        try {
            const response = await axios.get(apiUrl);
            const data = await response.data;
            const startTime = global.system.startTime;

            return ctx.reply(
                `❖ ${bold("Server")}\n` +
                "\n" +
                `➲ OS: ${os.type()} (${os.arch()} / ${os.release()})\n` +
                `➲ RAM: ${general.formatSize(process.memoryUsage().rss)} / ${general.formatSize(os.totalmem())}\n` +
                Object.entries(data).map(([key, value]) => `➲ ${general.ucword(key)}: ${value}\n`).join("") +
                `➲ Waktu aktif: ${general.convertMsToDuration(Date.now() - startTime) || "kurang dari satu detik."}\n` +
                `➲ Prosesor: ${os.cpus()[0].model}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};