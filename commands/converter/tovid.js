const ezgif = require("ezgif-node");
const mime = require("mime-types");

module.exports = {
    name: "tovideo",
    aliases: ["tomp4", "tovid"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["sticker"])) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await ctx.quoted?.media?.toBuffer()
            const result = await ezgif.convert({
                type: "webp-mp4",
                file: buffer,
                filename: "upload.webp"
            });

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