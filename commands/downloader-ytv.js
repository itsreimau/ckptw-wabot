const {
    monospace,
    SectionsBuilder,
    quote
} = require("@mengkodingan/ckptw");
const ytdl = require("ytdl-core");
const mime = require("mime-types");

module.exports = {
    name: "ytv",
    aliases: ["ytmp4", "ytvideo"],
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
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            const info = await ytdl.getInfo(url);
            const videoFormats = ytdl.filterFormats(info.formats, 'video');
            const qualityOptions = videoFormats.map(format => `${format.qualityLabel}`);
            const infoText = `${quote(`Judul: ${info.videoDetails.title}`)}\n` +
                `${quote(`URL: ${url}`)}\n`;

            if (global.system.useInteractiveMessage) {
                const section = new SectionsBuilder()
                    .setDisplayText("Choose Quality 🖼")
                    .addSection({
                        title: "Quality:",
                        rows: qualityOptions.map((q, i) => ({
                            title: `${q}`,
                            id: i + 1
                        }))
                    }).build();
                await ctx.replyInteractiveMessage({
                    body: infoText +
                        global.msg.footer,
                    footer: global.msg.watermark,
                    nativeFlowMessage: {
                        buttons: [section]
                    }
                });
            } else {
                await ctx.reply(
                    infoText +
                    `${quote(`Pilih kualitas:`)}\n` +
                    `${qualityOptions.map((quality, index) => `${index + 1}. ${quality}`).join("\n")}\n` +
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
                    const format = videoFormats[selected];
                    const dlStream = ytdl(url, {
                        format
                    });

                    await ctx.reply({
                        video: dlStream,
                        mimetype: mime.contentType("mp4"),
                        caption: `${quote(`Kualitas: ${qualityOptions[selected]}`)}\n` +
                            global.msg.footer,
                        gifPlayback: false
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