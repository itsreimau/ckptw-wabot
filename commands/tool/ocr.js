const {
    quote
} = require("@im-dims/baileys-library");
const axios = require("axios");

module.exports = {
    name: "ocr",
    aliases: ["image2text", "imagetotext", "img2text", "imgtotext"],
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
            const uploadUrl = await tools.general.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("https://api.ocr.space", "/parse/imageurl", {
                apikey: "helloworld",
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.ParsedResults[0].ParsedText;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};