const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "togif",
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["sticker"])) return await ctx.reply(quote(tools.cmd.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await ctx.quoted.media.toBuffer()
            const uploadUrl = await tools.general.upload(buffer, "any");
            const apiUrl = tools.api.createUrl("bk9", "/converter/webpToGif", {
                url: uploadUrl
            });
            const result = (await axios.get(apiUrl)).data.BK9;

            return await ctx.reply({
                video: {
                    url: result
                },
                mimetype: mime.lookup("gif"),
                gifPlayback: true
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};