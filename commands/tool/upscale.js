const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "upscale",
    aliases: ["upscaler"],
    category: "tool",
    permissions: {
        coin: 10
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
                "-r <number>": "Atur faktor resize (tersedia: 2, 4, 8, 16 | default: 2)."
            }))
        );

        try {
            const flag = tools.general.parseFlag(input, {
                "-r": {
                    type: "value",
                    key: "resize",
                    validator: (val) => !isNaN(val) && /^[2|4|6|8|16]$/.test(val),
                    parser: (val) => parseInt(val, 10)
                }
            });

            const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
            const uploadUrl = await tools.general.upload(buffer);
            const apiUrl = tools.api.createUrl("fasturl", "/aiimage/upscale", {
                imageUrl: uploadUrl,
                resize: flag.resize || 2
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
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