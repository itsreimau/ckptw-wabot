const {
    MessageType,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "readviewonce",
    aliases: ["rvo"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["viewOnce"])) return await ctx.reply(quote(tools.cmd.generateInstruction(["reply"], ["viewOnce"])));

        try {
            const msgType = ctx.getMessageType();
            const buffer = await ctx.quoted.media.toBuffer();

            if (msgType === MessageType.audioMessage) {
                await ctx.reply({
                    audio: buffer
                });
            } else if (msgType === MessageType.imageMessage) {
                await ctx.reply({
                    image: buffer
                });
            } else if (msgType === MessageType.videoMessage) {
                await ctx.reply({
                    video: buffer
                });
            }
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
        }
    }
};