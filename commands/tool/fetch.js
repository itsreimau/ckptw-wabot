const axios = require("axios");
const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "fetch",
    aliases: ["get"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer"
            });
            const contentType = response?.headers?.["content-type"];

            if (/image/.test(contentType)) {
                return await ctx.reply({
                    image: response?.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/video/.test(contentType)) {
                return await ctx.reply({
                    video: response?.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/audio/.test(contentType)) {
                return await ctx.reply({
                    audio: response?.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/webp/.test(contentType)) {
                const sticker = new Sticker(response?.data, {
                    pack: config.sticker.packname,
                    author: config.sticker.author,
                    type: StickerTypes.FULL,
                    categories: ["🌕"],
                    id: ctx.id,
                    quality: 50
                });

                return await ctx.reply(await sticker.toMessage());
            }

            if (!/utf-8|json|html|plain/.test(contentType)) {
                const fileName = /filename/i.test(response?.headers?.["content-disposition"]) ? response?.headers?.["content-disposition"]?.match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";

                return await ctx.reply({
                    document: response?.data,
                    fileName,
                    mimetype: mime.contentType(contentType)
                });
            }

            let text = response?.data;
            let json;

            try {
                json = JSON.parse(text);
            } catch (error) {
                json = null;
            }

            return await ctx.reply(json ? walkJSON(json) : text);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};

function walkJSON(json, depth = 0, array = []) {
    for (const key in json) {
        array.push(`${"┊".repeat(depth)}${depth > 0 ? " " : ""}${bold(key)}:`);
        if (typeof json[key] === "object" && json[key] !== null) {
            walkJSON(json[key], depth + 1, array);
        } else {
            array[array.length - 1] += ` ${json[key]}`;
        }
    }
    return array.join("\n");
}