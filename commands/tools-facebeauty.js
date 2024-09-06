const {
    createAPIUrl,
    listAPIUrl
} = require("../tools/api.js");
const {
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
    name: "facebeauty",
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

        if (msgType !== MessageType.imageMessage && !ctx.quoted) return ctx.reply(quote(`📌 Berikan atau balas media berupa gambar!`));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uplRes = await uploadByBuffer(buffer, mime.contentType("png"));
            const apiUrl = createAPIUrl("fasturl", "/tool/facebeauty", {
                faceUrl: uplRes.link
            });
            const {
                data
            } = await axios.get(apiUrl, {
                headers: {
                    "User-Agent": global.system.userAgent,
                    "x-api-key": listAPIUrl().fasturl.APIKey
                },
                responseType: "arraybuffer"
            });

            return await ctx.reply({
                image: data,
                mimetype: mime.contentType("png")
            });
        } catch (error) {
            console.error("Error", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};