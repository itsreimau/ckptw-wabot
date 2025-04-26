const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "tovn",
    aliases: ["toptt"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["audio"])) return await ctx.reply(quote(tools.cmd.generateInstruction(["reply"], ["audio"])));

        try {
            const result = await ctx.quoted.media.toBuffer()

            if (!result) return await ctx.reply(config.msg.notFound);

            return await ctx.reply({
                audio: result,
                mimetype: mime.lookup("ptt"),
                ptt: true
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};