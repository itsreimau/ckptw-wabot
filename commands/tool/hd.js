const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "hd",
    aliases: ["enhance", "enhancer", "hd", "hdr"],
    category: "tools",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image"),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const result = await upscale(buffer);

            return await ctx.reply({
                image: result,
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.response && error.response.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};

// Oleh Axel (https://github.com/AxellNetwork)
async function upscale(buffer) {
    try {
        const response = await axios.post("https://lexica.qewertyy.dev/upscale", {
            image_data: Buffer.from(buffer, "base64").toString("base64"),
            format: "binary"
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "arraybuffer"
        });
        return Buffer.from(response.data);
    } catch (error) {
        consolefy.error(`Error: ${error}`);
        return null;
    }
}