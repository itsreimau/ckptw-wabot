const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "toimage",
    aliases: ["toimg", "topng"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["sticker"])) return await ctx.reply(quote(tools.msg.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await ctx.quoted.media.toBuffer()
            const uploadUrl = await tools.cmd.upload(buffer, "any");
            const apiUrl = tools.api.createUrl("bk9", "/converter/webptopng", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.BK9;

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