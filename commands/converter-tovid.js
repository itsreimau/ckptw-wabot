const {
    webp2mp4
} = require("../tools/scraper.js");
const {
    download
} = require("../tools/simple.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "tovid",
    aliases: ["tomp4", "togif"],
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
            const vidUrl = await webp2mp4(buffer);
            const vidRes = await axios.get(vidUrl, {
                responseType: "arraybuffer"
            });
            const vidBuffer = Buffer.from(vidRes.data, "binary");

            return await ctx.reply({
                video: vidBuffer,
                mimetype: ctx._used.command === "togif" ? mime.contentType("gif") : mime.contentType("mp4"),
                caption: null,
                gifPlayback: ctx._used.command === "togif" ? true : false
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};