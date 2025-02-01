const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime");
const path = require("path");

module.exports = {
    name: "sfiledl",
    category: "downloader",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("vapis", "/api/sfiledl", {
                url
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;
            const fileName = path.basename(data.dl.split("&")[0]);
            const fileExtension = path.extname(fileName).slice(1);

            return await ctx.reply({
                document: {
                    url: data.download
                },
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer,
                fileName,
                mimetype: mime.lookup(fileExtension) || "application/octet-stream"
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};