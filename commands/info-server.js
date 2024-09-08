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

        const apiUrl = global.tools.api.createUrl("http://ip-api.com", "/json", {});

        try {
            const {
                data
            } = await axios.get(apiUrl);
            const startTime = global.system.startTime;

            return ctx.reply(
                `${quote(`OS: ${os.type()} (${os.arch()} / ${os.release()})`)}\n` +
                `${quote(`RAM: ${global.tools.general.formatSize(process.memoryUsage().rss)} / ${global.tools.general.formatSize(os.totalmem())}`)}\n` +
                Object.entries(data).map(([key, value]) => `${quote(`${global.tools.general.ucword(key)}: ${value}`)}\n`).join("") +
                `${quote(await global.tools.msg.translate(`Waktu aktif: ${convertMsToDuration(Date.now() - global.system.startTime) || "kurang dari satu detik."}`, userLanguage))}\n` +
                `${quote(`${await global.tools.msg.translate("Prosesor", userLanguage)}: ${os.cpus()[0].model}`)}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};