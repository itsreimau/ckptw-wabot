const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const ytdl = require("node-yt-dl");

module.exports = {
    name: "ytv",
    aliases: ["ytmp3", "ytaudio"],
    category: "downloader",
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

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `⚠ ${quote(`${await global.tools.msg.translate(await global.tools.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`)
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            const data = await ytdl.mp3(url);

            if (!data.status) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);

            return await ctx.reply({
                audio: {
                    url: data.media
                },
                mimetype: mime.contentType("mp3"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    global.msg.footer,
                gifPlayback: false
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};