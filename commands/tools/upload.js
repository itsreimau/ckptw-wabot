const {
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "upload",
    aliases: ["tourl"],
    category: "tools",
    handler: {
        coin: [10, ["audio", "document", "image", "video", "sticker"], 3]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, ["audio", "document", "image", "video", "sticker"], ctx),
            tools.general.checkQuotedMedia(ctx.quoted, ["audio", "document", "image", "video", "sticker"])
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.msg.generateInstruction(["send", "reply"], ["audio", "document", "image", "video", "sticker"])));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer);

            return await ctx.reply(
                `${quote(`URL: ${uploadUrl}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};