const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tovideo",
    aliases: ["tomp4", "tovid"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["sticker"])) return await ctx.reply(quote(tools.msg.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await ctx.quoted.media.toBuffer()
            const uploadUrl = await tools.cmd.upload(buffer, "any");
            const apiUrl = tools.api.createUrl("bk9", "/converter/webptomp4", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.BK9;

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.lookup("mp4")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};