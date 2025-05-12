const {
    quote
} = require("@im-dims/baileys-library");
const mime = require("mime-types");

module.exports = {
    name: "upscale",
    aliases: ["upscaler"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.cmd.checkMedia(msgType, "image"),
            tools.cmd.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send", "reply"], "image"))}\n` +
            quote(tools.cmd.generatesFlagInformation({
                "-r <number>": "Atur faktor resize (tersedia: 2, 4, 8, 16 | default: 2)"
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
                "-r": {
                    type: "value",
                    key: "resize",
                    validator: (val) => !isNaN(val) && /^[2|4|6|8|16]$/.test(val),
                    parser: (val) => parseInt(val, 10)
                }
            });

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer, "image");
            const result = tools.api.createUrl("fasturl", "/aiimage/upscale", {
                imageUrl: uploadUrl,
                resize: flag.resize || 2
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpeg")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};