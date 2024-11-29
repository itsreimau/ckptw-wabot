const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const mime = require("mime-resolutions");

module.exports = {
    name: "remini",
    category: "tools",
    handler: {
        coin: [10, "image", 3]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;
        const msgType = ctx.getMessageType();

        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image", ctx),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        if (!checkMedia && !checkQuotedMedia) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send", "reply"], "image"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-r <number>": "Resolusi pemrosesan gambar (2, 4, 6, 8, 16)."
            }))
        );

        try {
            const resolutions = [2, 4, 6, 8, 16];
            const flag = tools.general.parseFlag(input, {
                "-r": {
                    type: "value",
                    key: "resolution",
                    validator: (val) => !isNaN(val) && resolutions.includes(parseInt(val)),
                    parser: (val) => parseInt(val)
                }
            });

            const buffer = await ctx.msg?.media?.toBuffer() || await ctx.quoted?.media?.toBuffer();
            const uploadUrl = await tools.general.upload(buffer);
            const apiUrl = tools.api.createUrl("btch", "/remini", {
                url: uploadUrl,
                resolusi: flag.resolution || tools.general.getRandomElement(resolutions)
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                image: {
                    url: data.url
                },
                mimetype: mime.lookup("png")
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};