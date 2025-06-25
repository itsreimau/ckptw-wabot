const mime = require("mime-types");

module.exports = {
    name: "toanime",
    aliases: ["jadianime"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media?.toBuffer() || await ctx.quoted?.media?.toBuffer();
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const result = tools.api.createUrl("nekorinn", "/tools/img2anime", {
                imageUrl: uploadUrl
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};