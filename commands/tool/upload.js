const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "upload",
    aliases: ["tourl"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, ["audio", "document", "image", "video", "sticker"]),
            tools.cmd.checkQuotedMedia(ctx.quoted, ["audio", "document", "image", "video", "sticker"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.cmd.generateInstruction(["send", "reply"], ["audio", "document", "image", "video", "sticker"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const result = await tools.general.upload(buffer, "any");

            return await ctx.reply(
                `${quote(`URL: ${result}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};