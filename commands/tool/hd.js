const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");
const {
    Buffer
} = require("node:buffer");
const util = require("node:util");

module.exports = {
    name: "hd",
    aliases: ["hd", "hdr"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.cmd.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const result = await upscale(buffer);

            if (!result) return await ctx.reply(config.msg.notFound);

            return await ctx.reply({
                image: result,
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
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
        consolefy.error(`Error: ${util.format(error)}`);
        return null;
    }
}