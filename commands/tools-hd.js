const {
    createAPIUrl
} = require("../tools/api.js");
const {
    download
} = require("../tools/general.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const mime = require("mime-types");
const {
    uploadByBuffer
} = require("telegraph-uploader");

module.exports = {
    name: "hd",
    aliases: ["enhance", "enhancer", "hd", "hdr", "remini"],
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
        const quotedMessage = ctx._msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (msgType !== MessageType.imageMessage && !quotedMessage) return ctx.reply(`${bold("[ ! ]")} Berikan atau balas media berupa gambar!`);

        try {
            const type = quotedMessage ? ctx._self.getContentType(quotedMessage) : null;
            const object = type ? quotedMessage[type] : null;
            const buffer = type === "imageMessage" ? await download(object, type.slice(0, -7)) : await ctx.getMediaMessage(ctx._msg, "buffer");
            const uplRes = await uploadByBuffer(buffer, mime.contentType("png"));
            const apiUrl = createAPIUrl("nyxs", "/tools/hd", {
                url: uplRes.link
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.contentType("png"),
                caption: null
            });
        } catch (error) {
            console.error("Error", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};