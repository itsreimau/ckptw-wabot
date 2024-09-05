const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "lyrics",
    aliases: ["lirik", "lyric"],
    category: "internet",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${await global.tools.msg.argument}\n` +
            `${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`
        );

        try {
            const apiUrl = await await global.tools.api.createUrl("ngodingaja", "/api/lirik", {
                search: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(
                `${quote(`${await global.tools.msg.translate("Judul", userLanguage)}: ${data.hasil.judul}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Artis", userLanguage)}: ${data.hasil.artis}`)}\n` +
                "─────\n" +
                `${data.hasil.lirik}\n` +
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