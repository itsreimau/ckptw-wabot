const {
    createAPIUrl
} = require("../tools/api.js");
const {
    convertMsToDuration,
    formatSize,
    ucword
} = require("../tools/general.js");
const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: "server",
    category: "info",
    code: async (ctx) => {
        const apiUrl = createAPIUrl("http://ip-api.com", "/json", {});

        try {
            const {
                data
            } = await axios.get(apiUrl);
            const startTime = global.system.startTime;

            return ctx.reply(
                `${quote(`OS: ${os.type()} (${os.arch()} / ${os.release()})`)}\n` +
                `${quote(`RAM: ${formatSize(process.memoryUsage().rss)} / ${formatSize(os.totalmem())}`)}\n` +
                Object.entries(data).map(([key, value]) => `${quote(`${ucword(key)}: ${value}`)}\n`).join("") +
                `${quote(`Waktu aktif: ${convertMsToDuration(Date.now() - startTime) || "kurang dari satu detik."}`)}\n` +
                `${quote(`Prosesor: ${os.cpus()[0].model}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};