const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const ytdl = require("node-yt-dl");

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "downloader",
    code: async (ctx) => {
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
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`)
        );


        try {
            const search = await ytdl.search(input);

            if (!search.status) return ctx.reply(global.msg.notFound);

            const data = search.data[0];

            await ctx.reply(
                `${quote(`Judul: ${data.title}`)}\n` +
                `${quote(`Artis: ${data.author.name}`)}\n` +
                `${quote(`URL: ${data.url}`)}\n` +
                "\n" +
                global.msg.footer
            );

            const mp3 = await ytdl.mp3(data.url);

            if (!mp3.status) return ctx.reply(global.msg.notFound);

            return await ctx.reply({
                audio: {
                    url: mp3.media
                },
                mimetype: mime.contentType("mp3"),
                ptt: false
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};