const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const {
    youtubedl,
    youtubedlv2
} = require("@bochilteam/scraper");
const yts = require("yt-search");
const mime = require("mime-types");

module.exports = {
    name: "play",
    category: "downloader",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`
        );

        try {
            const search = await yts(input);

            if (!search) throw new Error(global.msg.notFound);

            const yt = search.videos[0];

            await ctx.sendMessage(
                ctx.id, {
                    text: `❖ ${bold("Play")}\n` +
                        "\n" +
                        `➲ Judul: ${yt.title}\n` +
                        `➲ Artis: ${yt.author.name}\n` +
                        `➲ Durasi: ${yt.timestamp}\n` +
                        "\n" +
                        global.msg.footer,
                    contextInfo: {
                        externalAdReply: {
                            title: "P L A Y",
                            body: null,
                            thumbnailUrl: yt.image,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: ctx._msg,
                }
            );

            let ytdl;
            try {
                ytdl = await youtubedl(yt.url);
            } catch (error) {
                ytdl = await youtubedlv2(yt.url);
            }

            const audio = Object.values(ytdl.audio)[0];
            const audiodl = await audio.download();

            if (!audiodl) throw new Error(global.msg.notFound);

            return await ctx.reply({
                audio: {
                    url: audiodl,
                },
                mimetype: mime.contentType("mp3"),
                ptt: false
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};