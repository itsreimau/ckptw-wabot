const {
    download
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const Jimp = require("jimp");
const mime = require("mime-types");

module.exports = {
    name: "blur",
    category: "tools",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(`${bold("[ ! ]")} Berikan atau balas media berupa gambar!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "imageMessage" ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, "buffer");
            let level = ctx._args[0] || "5";
            let img = await Jimp.read(buffer);
            img.blur(isNaN(level) ? 5 : parseInt(level));
            img.getBuffer(Jimp.MIME_JPEG, async (err, buffer) => {
                if (err) return ctx.reply(`${bold("[ ! ]")} Tidak dapat mengaburkan gambar!`);

                return await ctx.reply({
                    image: buffer,
                    mimetype: mime.contentType("jpeg"),
                    caption: null
                });
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};