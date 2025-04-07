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
            const type = ctx.getMessageType();
            const msg = ctx.quoted[type];
            const buffer = await ctx.quoted.media.toBuffer();

            const options = {
                mimetype: msg.mimetype,
                caption: msg.caption || ""
            };

            if (type === MessageType.audioMessage) {
                await ctx.reply({
                    audio: buffer,
                    mimetype: msg.mimetype,
                    ptt: true
                });
            } else if (type === MessageType.imageMessage) {
                await ctx.reply({
                    image: buffer,
                    ...options
                });
            } else if (type === MessageType.videoMessage) {
                await ctx.reply({
                    video: buffer,
                    ...options
                });
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};