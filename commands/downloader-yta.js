const {
    monospace,
    SectionsBuilder,
    quote
} = require("@mengkodingan/ckptw");
const ytdl = require("ytdl-core");
const mime = require("mime-types");

module.exports = {
    name: "yta",
    aliases: ["ytmp3", "ytaudio"],
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

        const url = ctx._args[0] || null;

        if (!url) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`)
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) ctx.reply(global.msg.urlInvalid);

        try {
            const apiUrl = createAPIUrl("widipe", "/download/ytdl", {
                url
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                audio: {
                    url: data.result.mp3
                },
                mimetype: mime.contentType("mp3"),
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};