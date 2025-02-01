const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "superscale",
    aliases: ["superscaler"],
    category: "tool",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image"),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return ctx.reply(
            `${quote(tools.msg.generateInstruction(["send", "reply"], "image"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-r <number>": "Atur faktor resize (tersedia: 2, 4, 8, 16 | default: 2).",
                "-a": "Atur jika gambar anime."
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
            const uploadUrl = await tools.general.upload(buffer);
            const apiUrl = tools.api.createUrl("fasturl", "/aiimage/superscale", {
                imageUrl: uploadUrl,
                resize: flag.resize || 2,
                anime: flag.anime
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                image: {
                    url: data.result
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};