const {
    monospace,
    SectionsBuilder,
    quote
} = require("@mengkodingan/ckptw");
const {
    youtubedl,
    youtubedlv2
} = require("@bochilteam/scraper");
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
            let ytdl = await youtubedl(url).catch(() => youtubedlv2(url));
            const qualityOptions = Object.keys(ytdl.audio);

            if (global.system.useInteractiveMessage) {
                const section = new SectionsBuilder()
                    .setDisplayText("Select Quality 🖼")
                    .addSection({
                        title: "Quality:",
                        rows: qualityOptions.map((q, i) => ({
                            title: `${q}kbps`,
                            id: i + 1
                        }))
                    }).build();
                await ctx.replyInteractiveMessage({
                    body: replyText + global.msg.footer,
                    footer: global.msg.watermark,
                    nativeFlowMessage: {
                        buttons: [section]
                    }
                });
            } else {
                await ctx.reply(`${quote(`Judul: ${ytdl.title}`)}\n` +
                    `${quote(`URL: ${url}`)}\n` +
                    `${quote(`Pilih kualitas:`)}\n` +
                    `${qualityOptions.map((quality, index) => `${index + 1}. ${quality}kbps`).join("\n")}\n` +
                    "\n" +
                    global.msg.footer
                );
            }

            const col = ctx.MessageCollector({
                time: 60000
            });
            col.on("collect", async (m) => {
                const selected = parseInt(m.content.trim()) - 1;
                if (selected >= 0 && selected < qualityOptions.length) {
                    const dl = await ytdl.audio[qualityOptions[selected]].download();
                    await ctx.reply({
                        audio: {
                            url: dl
                        },
                        mimetype: mime.contentType("mp3"),
                        ptt: false
                    });
                    col.stop();
                }
            });

        } catch (error) {
            console.error("Error:", error);
            ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};