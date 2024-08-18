const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

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

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`)
        );

        try {
            const searchApiUrl = createAPIUrl("agatz", "/api/ytsearch", {
                message: input
            });
            const searchResponse = await axios.get(searchApiUrl);
            const {
                data: searchData
            } = searchResponse.data;
            const selectedData = searchData[0];

            await ctx.reply(
                `${quote(`Judul: ${selectedData.title}`)}\n` +
                `${quote(`Artis: ${selectedData.author.name}`)}\n` +
                `${quote(`Durasi: ${selectedData.timestamp}`)}\n` +
                `${quote(`URL: ${selectedData.url}`)}\n` +
                "\n" +
                global.msg.footer
            );

            const downloadApiUrl = createAPIUrl("widipe", "/download/ytdl", {
                url: selectedData.url
            });
            const downloadResponse = await axios.get(downloadApiUrl);
            const {
                result
            } = downloadResponse.data;

            return await ctx.reply({
                audio: {
                    url: result.mp3
                },
                mimetype: mime.contentType("mp3"),
                ptt: false
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};