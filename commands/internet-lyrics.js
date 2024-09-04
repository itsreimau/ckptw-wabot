const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const fetch = require("node-fetch");

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
            const apiUrl = await global.tools.api.createUrl("ngodingaja", "/api/lirik", {
                search: input
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

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
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};