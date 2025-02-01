const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: "server",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        const apiUrl = tools.api.createUrl("http://ip-api.com", "/json");

        try {
            const {
                data
            } = await axios.get(apiUrl);
            const startTime = config.bot.readyAt;

            return await ctx.reply(
                `${quote(`OS: ${os.type()} (${os.arch()} / ${os.release()})`)}\n` +
                `${quote(`RAM: ${tools.general.formatSize(process.memoryUsage().rss)} / ${tools.general.formatSize(os.totalmem())}`)}\n` +
                Object.entries(data).map(([key, value]) => `${quote(`${tools.general.ucword(key)}: ${value}`)}\n`).join("") +
                `${quote(`Uptime: ${tools.general.convertMsToDuration(Date.now() - startTime)}`)}\n` +
                `${quote(`Prosesor: ${os.cpus()[0].model}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};