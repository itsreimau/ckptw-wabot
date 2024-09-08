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
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`)
        );


        try {
            const search = await ytdl.search(input);

            if (!search.status) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);

            const data = search.data[0];

            await ctx.reply(
                `${quote(`${await global.tools.msg.translate("Judul", userLanguage)}: ${data.title}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Artis", userLanguage)}: ${data.author.name}`)}\n` +
                `${quote(`URL: ${data.url}`)}\n` +
                "\n" +
                global.msg.footer
            );

            const mp3 = await ytdl.mp3(data.url);

            if (!mp3.status) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);

            return await ctx.reply({
                audio: {
                    url: mp3.media
                },
                mimetype: mime.contentType("mp3"),
                ptt: false
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};