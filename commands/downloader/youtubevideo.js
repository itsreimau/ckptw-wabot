const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "youtubevideo",
    aliases: ["ytmp4", "ytv", "ytvideo"],
    category: "downloader",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/ytmp4", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;
            const availableQualities = data.availableQualities;
            const downloads = data.downloads;
            const parts = downloads[0].filename.split(" - ");

            await ctx.reply(
                `${quote(`Judul: ${parts.slice(0, parts.length - 1).join(" - ")}`)}\n` +
                `${quote(`Kanal: ${parts[parts.length - 1].split(" (")[0]}`)}\n` +
                `${quote(`URL: ${url}`)}\n` +
                `${quote(`Pilih kualitas:`)}\n` +
                availableQualities.map((quality, index) => `${index + 1}. ${quality}`).join("\n") +
                "\n" +
                global.msg.footer
            );

            const col = ctx.MessageCollector({
                time: 60000
            });

            col.on("collect", async (m) => {
                const selectedNumber = parseInt(m.content.trim());
                const selectedQualityIndex = selectedNumber - 1;

                if (!isNaN(selectedNumber) && selectedQualityIndex >= 0 && selectedQualityIndex < downloads.length) {
                    const selectedDownload = downloads[selectedQualityIndex];

                    await ctx.simulateTyping();
                    await ctx.reply({
                        video: {
                            url: selectedDownload.url
                        },
                        mimetype: mime.contentType("mp4"),
                        caption: `${quote(`Kualitas: ${selectedDownload.quality}`)}\n` +
                            "\n" +
                            global.msg.footer,
                        gifPlayback: false
                    });

                    return col.stop();
                }
            });

            col.on("end", async () => {
                await ctx.reply("⌛ Waktu habis. Silakan ulangi perintah jika ingin mencoba lagi.");
            });

        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};