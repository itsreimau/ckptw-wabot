const {
    bold,
    monospace,
    quote
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
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const msgType = ctx.getMessageType();
        const quotedMessage = ctx.quoted;

        if (msgType !== MessageType.imageMessage && msgType !== MessageType.videoMessage && !quotedMessage) return ctx.reply(quote(`${bold("[ ! ]")} Berikan atau balas media berupa gambar!`));

        try {
            if (quotedMessage) {
                const type = quotedMessage ? ctx.getContentType(quotedMessage) : null;
                const object = type ? quotedMessage[type] : null;
                const stream = await ctx.downloadContentFromMessage(object, type.slice(0, -7));
                let quotedBuffer = Buffer.from([]);
                for await (const chunk of stream) {
                    quotedBuffer = Buffer.concat([quotedBuffer, chunk]);
                }
            }
            const buffer = type === "imageMessage" ? quotedBuffer : await ctx.getMediaMessage(ctx._msg, "buffer");
            let level = ctx._args[0] || "5";
            let img = await Jimp.read(buffer);
            img.blur(isNaN(level) ? 5 : parseInt(level));
            img.getBuffer(Jimp.MIME_JPEG, async (err, buffer) => {
                if (error) return ctx.reply(quote(`${bold("[ ! ]")} Tidak dapat mengaburkan gambar!`));

                return await ctx.reply({
                    image: buffer,
                    mimetype: mime.contentType("jpeg"),
                    caption: null
                });
            });
        } catch (error) {
            console.error("Error", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};