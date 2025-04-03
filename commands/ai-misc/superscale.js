const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "superscale",
    aliases: ["superscaler"],
    category: "ai-misc",
    permissions: {
        premium: true
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
                "-r <number>": "Atur faktor resize (tersedia: 2, 4, 8, 16 | default: 2)",
                "-a": "Jika itu gambar anime"
            }))
        );

        try {
            const flag = tools.general.parseFlag(input, {
                "-r": {
                    type: "value",
                    key: "resize",
                    validator: (val) => !isNaN(val) && /^[2|4|6|8|16]$/.test(val),
                    parser: (val) => parseInt(val, 10)
                },
                "-a": {
                    type: "boolean",
                    key: "anime"
                }
            });

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer, "image");
            const apiUrl = tools.api.createUrl("fast", "/aiimage/superscale", {
                imageUrl: uploadUrl,
                resize: flag?.resize || 2,
                anime: flag?.anime
            });
            const result = (await axios.get(apiUrl)).data.result;

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