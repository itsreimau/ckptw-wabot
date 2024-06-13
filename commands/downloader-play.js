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

            if (!search) return ctx.reply(global.msg.notFound);

            const yt = search.videos[0];

            await ctx.reply(
                `❖ ${bold("Play")}\n` +
                "\n" +
                `➲ Judul: ${yt.title}\n` +
                `➲ Artis: ${yt.author.name}\n` +
                `➲ Durasi: ${yt.timestamp}\n` +
                `➲ URL: ${yt.url}\n` +
                "\n" +
                global.msg.footer
            );

            let ytdl;
            try {
                ytdl = await youtubedl(yt.url);
            } catch (error) {
                ytdl = await youtubedlv2(yt.url);
            }

            const audio = Object.values(ytdl.audio)[0];
            const audiodl = await audio.download();

            if (!audiodl) return ctx.reply(global.msg.notFound);

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