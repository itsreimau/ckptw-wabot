const ezgif = require("ezgif-node");
const mime = require("mime-types");

module.exports = {
    name: "toimage",
    aliases: ["toimg", "topng"],
    category: "converter",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        if (!await tools.cmd.checkQuotedMedia(ctx.quoted, ["sticker"])) return await ctx.reply(formatter.quote(tools.msg.generateInstruction(["reply"], ["sticker"])));

        try {
            const buffer = await ctx.quoted?.media?.toBuffer()
            const result = await ezgif.convert({
                type: "webp-png",
                file: buffer,
                filename: "upload.webp"
            });

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