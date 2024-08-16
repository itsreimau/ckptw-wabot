const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const mime = require("mime-types");
const {
    uploadByBuffer
} = require("telegraph-uploader");

module.exports = {
    name: "ocr",
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

        if (msgType !== MessageType.imageMessage && !quotedMessage) return ctx.reply(quote(`${bold("[ ! ]")} Berikan atau balas media berupa gambar!`));

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
            const uplRes = await uploadByBuffer(buffer, mime.contentType("png"));
            const apiUrl = createAPIUrl("nyxs", "/tools/ocr", {
                url: uplRes.link
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(data.result);
        } catch (error) {
            console.error("Error", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};