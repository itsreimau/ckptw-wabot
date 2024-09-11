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
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`
        );

        try {
            const apiUrl = await global.tools.createURL("ngodingaja", "/api/lirik", {
                search: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(
                `❖ ${bold("Lyrics")}\n` +
                "\n" +
                `➲ Judul: ${data.hasil.judul}\n` +
                `➲ Artis: ${data.hasil.artis}\n` +
                "-----\n" +
                `${data.hasil.lirik}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};