const {
    SectionsBuilder,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "youtubeaudio",
    aliases: ["yta", "ytaudio", "ytmp3"],
    category: "downloader",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return await ctx.reply(global.config.msg.urlInvalid);

        try {
            const apiUrl = global.tools.api.createUrl("ryzendesu", "/api/downloader/ytdl", {
                url
            });
            const {
                data
            } = await axios.get(apiUrl);

            const qualityOptions = data.resultUrl.audio.map(item => `${item.quality} (${item.size || "-"})`);

            if (global.config.system.useInteractiveMessage) {
                const section1 = new SectionsBuilder()
                    .setDisplayText("Select Quality 📌")
                    .addSection({
                        title: "Kualitas",
                        rows: qualityOptions.map((quality, index) => ({
                            title: quality,
                            id: index + 1
                        }))
                    })
                    .build();

                ctx.replyInteractiveMessage({
                    body: `${quote(`Judul: ${data.result.title}`)}\n` +
                        `${quote(`URL: ${url}`)}\n` +
                        "\n" +
                        global.config.msg.footer,
                    footer: global.config.msg.watermark,
                    nativeFlowMessage: {
                        buttons: [section1]
                    }
                });
            } else {
                ctx.reply(
                    `${quote(`Judul: ${data.result.title}`)}\n` +
                    `${quote(`URL: ${url}`)}\n` +
                    `${quote(`Pilih kualitas:`)}\n` +
                    qualityOptions.map((quality, index) => `${index + 1}. ${quality}`).join("\n") +
                    "\n" +
                    global.config.msg.footer
                );
            }

            const col = ctx.MessageCollector({
                time: 60000
            });

            col.on("collect", async (m) => {
                const selectedNumber = parseInt(m.content.trim());
                const selectedQualityIndex = selectedNumber - 1;

                if (!isNaN(selectedNumber) && selectedQualityIndex >= 0 && selectedQualityIndex < qualityOptions.length) {
                    const selectedQuality = data.resultUrl.audio[selectedQualityIndex];
                    const downloadUrl = selectedQuality.download;

                    if (global.config.system.autoTypingOnCmd) ctx.simulateTyping();

                    await ctx.reply({
                        audio: {
                            url: downloadUrl
                        },
                        mimetype: mime.lookup("mp3"),
                        ptt: false
                    });

                    return col.stop();
                }
            });

            col.on("end", async () => {});
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};