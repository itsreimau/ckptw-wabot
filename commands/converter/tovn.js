const {
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "tovn",
    aliases: ["toptt"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["audio"])) return await ctx.reply(quote(tools.msg.generateInstruction(["reply"], ["audio"])));

        try {
            const result = await ctx.quoted.media.toBuffer()

            return await ctx.reply({
                audio: result,
                mimetype: mime.lookup("mp3"),
                ptt: true
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};