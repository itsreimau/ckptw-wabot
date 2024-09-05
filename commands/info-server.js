const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: "server",
    category: "info",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const apiUrl = await global.tools.api.createUrl("http://ip-api.com", "/json", {});

        try {
            const {
                data
            } = await axios.get(apiUrl);
            const startTime = global.system.startTime;

            return ctx.reply(
                `${quote(`OS: ${os.type()} (${os.arch()} / ${os.release()})`)}\n` +
                `${quote(`RAM: ${global.tools.general.formatSize(process.memoryUsage().rss)} / ${global.tools.general.formatSize(os.totalmem())}`)}\n` +
                Object.entries(data).map(([key, value]) => `${quote(`${global.tools.general.ucword(key)}: ${value}`)}\n`).join("") +
                `${quote(`Runtime: ${global.tools.general.convertMsToDuration(Date.now() - startTime) || "kurang dari satu detik."}`)}\n` +
                `${quote(`Prosesor: ${os.cpus()[0].model}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};