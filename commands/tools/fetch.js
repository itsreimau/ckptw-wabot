const axios = require("axios");
const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const {
    format
} = require("util");

module.exports = {
    name: "fetch",
    aliases: ["get"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
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

        const isValidUrl = tools.general.isValidUrl(url);
        if (!isValidUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer",
            });
            const contentType = response?.headers?.["content-type"];

            if (/image/.test(contentType)) {
                return await ctx.reply({
                    image: response?.data,
                    mimetype: mime.lookup(contentType)
                });
            }

            if (/video/.test(contentType)) {
                return await ctx.reply({
                    video: response?.data,
                    mimetype: mime.lookup(contentType)
                });
            }

            if (/audio/.test(contentType)) {
                return await ctx.reply({
                    audio: response?.data,
                    mimetype: mime.lookup(contentType)
                });
            }

            if (/webp/.test(contentType)) return await ctx.reply({
                sticker: response?.data
            });

            if (!/utf-8|json|html|plain/.test(contentType)) {
                let fileName = /filename/i.test(response?.headers?.["content-disposition"]) ? response?.headers?.["content-disposition"]?.match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";
                return await ctx.reply({
                    document: response?.data,
                    fileName,
                    mimetype: mime.lookup(contentType)
                });
            }

            let text = response?.data?.toString() || response?.data;
            text = format(text);
            try {
                await ctx.reply(text.slice(0, 65536) + "");
            } catch (e) {
                await ctx.reply(format(e));
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};