const {
    webp2png
} = require("../tools/scraper.js");
const {
    download
} = require("../tools/simple.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "toimg",
    aliases: ["topng", "toimage"],
    category: "converter",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage) return ctx.reply(`${bold("[ ! ]")} Berikan atau balas media berupa sticker!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "stickerMessage" ? await download(object, type.slice(0, -7)) : null;
            const imageUrl = await webp2png(buffer);
            const response = await axios.get(imageUrl, {
                responseType: "arraybuffer"
            });
            const imgBuffer = Buffer.from(response.data, "binary");

            return await ctx.reply({
                image: buffer,
                mimetype: mime.contentType("png"),
                caption: null
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};