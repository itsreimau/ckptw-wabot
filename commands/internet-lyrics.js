const {
    createAPIUrl
} = require("../tools/api.js");
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
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const apiUrl = await createAPIUrl("ngodingaja", "/api/lirik", {
                search: input
            });
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = await response.data;

            return ctx.sendMessage(
                ctx.id, {
                    text: `❖ ${bold("Lyrics")}\n` +
                        "\n" +
                        `➲ Judul: ${data.hasil.judul}\n` +
                        `➲ Artis: ${data.hasil.artis}\n` +
                        "-----\n" +
                        `${data.hasil.lirik}\n` +
                        "\n" +
                        global.msg.footer,
                    contextInfo: {
                        externalAdReply: {
                            title: "L Y R I C S",
                            body: null,
                            thumbnailUrl: data.hasil.gambar,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: ctx._msg,
                }
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};