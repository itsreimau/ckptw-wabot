const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tomostchreal",
    aliases: ["jadimosril", "jadimostchreal", "mosril", "tomosril"],
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

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(quote(tools.msg.generateInstruction(["send", "reply"], "image")));

        try {
            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.cmd.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("http://vid2aud.hofeda4501.serv00.net", "/api/tomostchreal", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply({
                image: {
                    url: result.url
                },
                mimetype: mime.lookup("jpeg"),
                caption: result.message
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};