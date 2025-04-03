const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "blackbox",
    aliases: ["bb"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], [ "image","text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))}\n` +
            quote(tools.cmd.generateNotes(["AI ini dapat melihat media dan menjawab pertanyaan tentangnya. Kirim media dan tanyakan apa saja!"]))
        );

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        try {
            const model = "blackbox";

            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
                const uploadUrl = await tools.general.upload(buffer, "image");
                const apiUrl = tools.api.createUrl("fast", "/aillm/blackbox", {
                    ask: input,
                    model,
                    imageUrl: uploadUrl
                });
                const result = (await axios.get(apiUrl)).data.result;

                return await ctx.reply(result);
            } else {
                const apiUrl = tools.api.createUrl("fast", "/aillm/blackbox", {
                    ask: input,
                    model
                });
                const result = (await axios.get(apiUrl)).data.result;

                return await ctx.reply(result);
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};