const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    quote
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
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`)
        );

        try {
            const apiUrl = await createAPIUrl("vyturex", "/lyrics", {
                query: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(
                `${quote(`Judul: ${data.title}`)}\n` +
                `${quote(`Artis: ${data.artist}`)}\n` +
                "-----\n" +
                `${data.lyrics}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};