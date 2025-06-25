const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "geminicanvas",
    aliases: ["gcanvas"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "make it evangelion art style"))
        );

        const messageType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(messageType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media?.toBuffer() || await ctx.quoted?.media?.toBuffer();
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("nekorinn", "/ai/gemini-canvas", {
                text: input,
                imageUrl: uploadUrl
            });
            const result = Buffer.from((await axios.get(apiUrl)).data.result.image.base64, "base64");

            return await ctx.reply({
                image: result,
                mimetype: mime.lookup("jpeg")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};